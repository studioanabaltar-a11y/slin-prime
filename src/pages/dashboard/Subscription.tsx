import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../components/auth/FeatureGuard';
import { Check, Crown, ShieldCheck, Zap, ArrowRight, X, CreditCard, QrCode, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

const plans = [
  {
    name: 'Starter',
    slug: 'starter',
    price: '49,90',
    icon: <Zap className="text-luxury-gold" />,
    description: 'Ideal para iniciantes e solo-practice.',
    features: ['Agenda básica', 'Cadastro de pacientes', 'Controle financeiro simples', 'Prontuários básicos']
  },
  {
    name: 'PRÓ',
    slug: 'pro',
    price: '497,00',
    icon: <ShieldCheck className="text-luxury-gold" />,
    description: 'Para clínicas que buscam crescimento.',
    popular: true,
    features: ['Tudo do Iniciante', 'Financeiro Completo', 'Calculadora de Precificação', 'Relatórios de Desempenho', 'Controle de Estoque']
  },
  {
    name: 'Premium',
    slug: 'premium',
    price: '997,00',
    icon: <Crown className="text-luxury-gold" />,
    description: 'A experiência definitiva de gestão.',
    features: ['Tudo do PRÓ', 'WhatsApp Concierge', 'Auditoria Completa', 'Suporte VIP 24h', 'IA Preditiva de Faturamento']
  }
];

export default function Subscription() {
  const { user, subscription, clinic, refreshAuthData } = useAuth();
  const { planName } = usePlan();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [paymentStep, setPaymentStep] = useState<'options' | 'processing' | 'success'>('options');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | null>(null);

  const handleUpgrade = async () => {
    if (!selectedPlan || !clinic || !subscription) return;
    
    setPaymentStep('processing');

    try {
      // Em um fluxo real de upgrade, chamamos o backend para criar uma sessão de checkout do Stripe
      // para o novo plano, passando o customer_id existente se houver.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: subscription.clinic_id, // Usando clinic_id como referência
          planSlug: selectedPlan.slug,
          email: clinic.email // Precisaríamos garantir que o e-mail esteja disponível aqui
        })
      });

      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Falha ao gerar link de upgrade');
      }
    } catch (error) {
      console.error('Error during Stripe upgrade:', error);
      alert('Erro ao processar upgrade. Tente novamente.');
      setPaymentStep('options');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
          Sua Assinatura
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Gerencie seu plano e desbloqueie novas ferramentas para levar sua clínica ao próximo nível.
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-primary/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Crown className="text-accent w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em] mb-1">Status da Sua Conta</p>
            <h2 className="text-3xl font-serif font-bold text-white">{planName}</h2>
            <p className="text-sm text-white/40 mt-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${subscription?.status === 'active' ? 'bg-emerald-500' : 'bg-luxury-gold animate-pulse'}`} />
              {subscription?.status === 'trialing' ? 'Período de avaliação gratuito (7 dias)' : 
               subscription?.status === 'active' ? 'Assinatura Ativa & Protegida' : 'Aguardando Ativação de Pagamento'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <p className="text-sm text-slate-400">Próxima renovação</p>
          <p className="text-lg font-bold text-white">
            {subscription?.current_period_end 
              ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') 
              : 'N/A'}
          </p>
          {/* Development Bypass Section */}
          {window.location.hostname === 'localhost' && (
            <div className="mt-6 p-6 border border-dashed border-luxury-gold/30 rounded-[20px] bg-luxury-gold/5">
              <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em] mb-4 text-center">Modo Desenvolvedor (Bypass Stripe)</p>
              <div className="flex justify-center gap-2">
                {['starter', 'pro', 'premium'].map(slug => (
                  <button
                    key={slug}
                    onClick={async () => {
                      if (confirm(`Ativar plano ${slug.toUpperCase()} manualmente?`)) {
                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dev/activate-plan`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user?.id, planSlug: slug })
                          });
                          if (response.ok) {
                            alert('Plano ativado! Recarregando...');
                            window.location.reload();
                          }
                        } catch (err) {
                          alert('Erro ao ativar plano dev');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all"
                  >
                    Ativar {slug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.slug}
            className={`relative p-8 rounded-3xl border transition-all duration-500 group ${
              plan.popular 
                ? 'bg-accent/5 border-accent/30 shadow-2xl shadow-accent/10' 
                : 'bg-primary/20 border-white/5 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-black text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                Mais Escolhido
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-500">
                  {plan.icon}
                </div>
                {plan.slug === planName.toLowerCase() && (
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Ativo</span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold text-white">R$ {plan.price}</span>
                <span className="text-sm text-slate-500">/mês</span>
              </div>

              <ul className="space-y-4 pt-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                disabled={plan.slug === planName.toLowerCase()}
                onClick={() => {
                  setSelectedPlan(plan);
                  setPaymentStep('options');
                  setPaymentMethod(null);
                }}
                className={`w-full mt-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.slug === planName.toLowerCase()
                    ? 'bg-white/5 text-slate-500 cursor-default'
                    : plan.popular
                      ? 'bg-accent text-white hover:bg-accent/80 hover:scale-[1.02] shadow-lg shadow-accent/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.slug === planName.toLowerCase() ? 'Plano Atual' : 'Assinar Agora'}
                {plan.slug !== planName.toLowerCase() && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => paymentStep !== 'processing' && setSelectedPlan(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-luxury-black border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              {paymentStep !== 'processing' && (
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}

              <div className="p-8 md:p-10">
                {paymentStep === 'options' && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2">Finalizar Upgrade</p>
                      <h3 className="text-2xl font-display font-bold text-white">Assinar {selectedPlan.name}</h3>
                      <p className="text-slate-400 mt-2">Valor total: <span className="text-white font-bold">R$ {selectedPlan.price}</span></p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                          paymentMethod === 'pix' ? 'border-accent bg-accent/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <QrCode className={paymentMethod === 'pix' ? 'text-accent' : 'text-slate-400'} size={32} />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Pagar via PIX</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                          paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <CreditCard className={paymentMethod === 'card' ? 'text-accent' : 'text-slate-400'} size={32} />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Cartão de Crédito</span>
                      </button>
                    </div>

                    <button 
                      disabled={!paymentMethod}
                      onClick={handleUpgrade}
                      className="w-full bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Confirmar Pagamento
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center text-center space-y-6">
                    <Loader2 className="text-accent animate-spin w-16 h-16" />
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">Processando Pagamento</h3>
                      <p className="text-slate-400 mt-2">Aguarde um momento enquanto validamos com sua operadora.</p>
                    </div>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="py-12 flex flex-col items-center text-center space-y-8">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Check className="text-green-500 w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white">Parabéns!</h3>
                      <p className="text-slate-400 mt-2">Sua clínica agora é {selectedPlan.name}. Aproveite todas as novas funcionalidades.</p>
                    </div>
                    <button 
                      onClick={() => setSelectedPlan(null)}
                      className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Acessar Novo Painel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
