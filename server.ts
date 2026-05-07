import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import Stripe from 'stripe';

dotenv.config();

const app = express();
app.use(cors());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24-preview',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Map plan slugs to Stripe Price IDs (Placeholders - User needs to create these in Stripe Dashboard)
const PLAN_PRICE_MAP: Record<string, string> = {
  'starter': process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
  'pro': process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
  'premium': process.env.STRIPE_PRICE_PREMIUM || 'price_premium_placeholder',
};

const createStripeSession = async (userId: string, planSlug: string, userEmail: string) => {
  const priceId = PLAN_PRICE_MAP[planSlug] || PLAN_PRICE_MAP['starter'];
  
  console.log(`[Stripe] Creating session for user ${userId} on plan ${planSlug} with price ${priceId}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Add 'pix' if configured in Stripe Dashboard
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer_email: userEmail,
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?plan=${planSlug}`,
    metadata: {
      userId: userId,
      planSlug: planSlug,
    },
  });

  return { url: session.url };
};

// Middleware para Webhook (precisa do corpo bruto)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`[Webhook Error] ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lidar com o evento de sucesso no pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planSlug } = session.metadata || {};

    if (userId && planSlug) {
      console.log(`[Webhook] Payment confirmed for user ${userId}. Activating plan ${planSlug}.`);
      
      try {
        // 1. Buscar o ID do plano no Supabase
        const { data: planData } = await supabase
          .from('plans')
          .select('id')
          .eq('slug', planSlug)
          .single();

        if (planData) {
          // 2. Buscar clinic_id do profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('clinic_id')
            .eq('id', userId)
            .single();

          if (profileData?.clinic_id) {
            const clinicId = profileData.clinic_id;

            // 3. Ativar Plano na Clínica
            await supabase
              .from('clinics')
              .update({ plan_id: planData.id })
              .eq('id', clinicId);

            // 4. Criar Assinatura Ativa
            await supabase
              .from('subscriptions')
              .upsert({
                clinic_id: clinicId,
                plan_id: planData.id,
                status: 'active',
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date().toISOString()
              }, { onConflict: 'clinic_id' });
          }
        }
      } catch (dbError) {
        console.error('[Webhook DB Error]', dbError);
      }
    }
  }

  res.json({ received: true });
});

// JSON middleware para outras rotas
app.use(express.json());

app.post('/api/auth/signup', async (req, res) => {
  const { name, clinicName, email, password, planSlug } = req.body;

  try {
    if (!name || !clinicName || !email || !password || !planSlug) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // 1. Criar Usuário no Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        clinic_name: clinicName,
        plan_slug: planSlug
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // 2. Criar Clínica
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .insert({ name: clinicName, plan_id: null })
      .select('id')
      .single();

    if (clinicError) {
      return res.status(500).json({ error: 'Erro ao criar registro da clínica.' });
    }

    const clinicId = clinicData.id;

    // 3. Criar Perfil
    await supabase.from('profiles').insert({
      id: userId,
      clinic_id: clinicId,
      full_name: name,
      role: 'owner'
    });

    // 4. Criar Sessão Real do Stripe
    const stripeSession = await createStripeSession(userId, planSlug, email);

    return res.status(200).json({ paymentUrl: stripeSession.url });

  } catch (error: any) {
    console.error('[API Error]', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.post('/api/checkout/upgrade', async (req, res) => {
  const { userId, planSlug, email } = req.body;

  try {
    if (!userId || !planSlug) {
      return res.status(400).json({ error: 'userId e planSlug são obrigatórios.' });
    }

    // Criar sessão de checkout para upgrade
    const stripeSession = await createStripeSession(userId, planSlug, email);

    return res.status(200).json({ paymentUrl: stripeSession.url });
  } catch (error: any) {
    console.error('[Upgrade Error]', error);
    return res.status(500).json({ error: 'Erro ao criar sessão de upgrade.' });
  }
});

// DEV ONLY: Manual Activation Bypass
app.post('/api/dev/activate-plan', async (req, res) => {
  const { userId, planSlug } = req.body;

  try {
    console.log(`[DEV] Manual activation for user ${userId} to plan ${planSlug}`);

    // 1. Get plan ID
    const { data: planData } = await supabase
      .from('plans')
      .select('id')
      .eq('slug', planSlug)
      .single();

    if (!planData) return res.status(404).json({ error: 'Plan not found' });

    // 2. Get clinic_id
    const { data: profileData } = await supabase
      .from('profiles')
      .select('clinic_id')
      .eq('id', userId)
      .single();

    if (!profileData?.clinic_id) return res.status(404).json({ error: 'Clinic not found' });

    const clinicId = profileData.clinic_id;

    // 3. Update Clinic
    await supabase.from('clinics').update({ plan_id: planData.id }).eq('id', clinicId);

    // 4. Create/Update Subscription
    await supabase.from('subscriptions').upsert({
      clinic_id: clinicId,
      plan_id: planData.id,
      status: 'active',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year for dev
      updated_at: new Date().toISOString()
    }, { onConflict: 'clinic_id' });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[DEV Error]', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

