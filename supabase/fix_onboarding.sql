-- 1. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Insert Default Plans if they don't exist
INSERT INTO public.plans (name, slug, price, features)
VALUES 
    ('Starter', 'starter', 197.00, ARRAY['Até 2 profissionais', 'Agenda básica', 'Prontuário simples']),
    ('PRO', 'pro', 397.00, ARRAY['Até 5 profissionais', 'Agenda avançada', 'Financeiro completo', 'WhatsApp Concierge']),
    ('Premium', 'premium', 797.00, ARRAY['Profissionais ilimitados', 'Suporte VIP 24h', 'Gestão de estoque', 'Marketing automatizado'])
ON CONFLICT (slug) DO NOTHING;

-- 3. Ensure Clinics table has plan_id
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clinics' AND column_name='plan_id') THEN
        ALTER TABLE public.clinics ADD COLUMN plan_id UUID REFERENCES public.plans(id);
    END IF;
END $$;

-- 4. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id),
    status TEXT NOT NULL DEFAULT 'trialing',
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. RECREATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_clinic_id uuid;
  default_plan_id uuid;
BEGIN
  -- Get default plan
  SELECT id INTO default_plan_id FROM public.plans WHERE slug = 'starter' LIMIT 1;

  -- Create clinic
  INSERT INTO public.clinics (name, owner_id, plan_id)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'clinic_name', 'Minha Clínica'),
    new.id,
    default_plan_id
  )
  RETURNING id INTO new_clinic_id;

  -- Create profile
  INSERT INTO public.profiles (id, full_name, clinic_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new_clinic_id
  );

  -- Create initial subscription (7 days trial)
  INSERT INTO public.subscriptions (clinic_id, plan_id, status, current_period_end)
  VALUES (
    new_clinic_id,
    default_plan_id,
    'trialing',
    now() + interval '7 days'
  );

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Fallback to log the error but allow user creation (though without clinic/profile)
  RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN new;
END;
$$;

-- 6. RECREATE TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Grant permissions
GRANT ALL ON public.plans TO postgres, service_role;
GRANT ALL ON public.subscriptions TO postgres, service_role;
