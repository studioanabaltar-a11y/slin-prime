import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, CreditCard, ShieldCheck, Loader2, ArrowRight, Zap, Trophy, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  
  const planSlug = searchParams.get('plan') || 'starter';
  const userId = searchParams.get('user_id');

  const plans = {
    starter: {
      name: 'Plano STARTER',
      price: 'R$ 49,90',
      period: '/mês',
      features: ['Agenda Básica', 'Cadastro de Pacientes', 'Controle Financeiro Simples', 'Prontuários Básicos'],
      icon: <Zap className="text-luxury-gold" size={24} />
    },
    pro: {
      name: 'Plano PRO',
      price: 'R$ 497',
      period: '/mês',
      features: ['Pacientes Ilimitados', 'IA de Diagnóstico', 'Relatórios Avançados'],
      icon: <Trophy className="text-luxury-gold" size={24} />
    },
    elite: {
      name: 'Plano ELITE',
      price: 'R$ 997',
      period: '/mês',
      features: ['Gestão de Multi-clínicas', 'Consultoria VIP', 'API Aberta'],
      icon: <Crown className="text-luxury-gold" size={24} />
    }
  };

  const selectedPlan = plans[planSlug as keyof typeof plans] || plans.starter;

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planSlug })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Falha ao confirmar pagamento');

      setLoading(false);
      navigate('/login?message=Pagamento confirmado! Bem-vindo à elite.');
    } catch (error: any) {
      console.error('Erro no processamento do pagamento:', error);
      alert('Erro ao processar pagamento: ' + error.message);
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center p-6">
        <div className="card-auth p-12 text-center max-w-md">
          <h2 className="text-2xl font-serif mb-4">Sessão Inválida</h2>
          <p className="text-luxury-muted mb-8">Não conseguimos identificar seu usuário para o pagamento. Por favor, tente o cadastro novamente.</p>
          <button onClick={() => navigate('/signup')} className="btn-luxury w-full bg-luxury-black text-white py-3">Voltar ao Cadastro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card-auth p-8 md:p-10 bg-white border border-luxury-outline shadow-xl rounded-[32px]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-luxury-black rounded-xl flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-luxury-gold">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-luxury-black">Slin Prime</h1>
                <p className="text-xs text-luxury-muted uppercase tracking-widest font-bold">Checkout Seguro</p>
              </div>
            </div>

            <div className="bg-luxury-cream/50 rounded-2xl p-6 border border-luxury-outline mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {selectedPlan.icon}
                  <span className="font-semibold text-lg">{selectedPlan.name}</span>
                </div>
                <span className="text-luxury-gold font-bold">{selectedPlan.price}</span>
              </div>
              <ul className="space-y-3">
                {selectedPlan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-luxury-muted">
                    <CheckCircle2 size={16} className="text-luxury-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-luxury-outline">
              <div className="flex justify-between text-sm">
                <span className="text-luxury-muted">Subtotal</span>
                <span>{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-luxury-muted">Taxas</span>
                <span>R$ 0,00</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total Hoje</span>
                <span className="text-luxury-black">{selectedPlan.price}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center text-luxury-muted/60 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} />
            Pagamento Processado por Stripe & Slin Bank
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-auth p-8 md:p-10 bg-luxury-black text-white shadow-2xl rounded-[32px] flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-serif font-bold mb-8 italic text-luxury-gold">Escolha como deseja pagar</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'card' ? 'border-luxury-gold bg-luxury-gold/10' : 'border-white/10 hover:border-white/30'}`}
              >
                <CreditCard size={28} />
                <span className="text-sm font-bold uppercase tracking-wider">Cartão</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('pix')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'pix' ? 'border-luxury-gold bg-luxury-gold/10' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className="text-2xl font-bold">PIX</div>
                <span className="text-sm font-bold uppercase tracking-wider">Instantâneo</span>
              </button>
            </div>

            <div className="space-y-6">
              {paymentMethod === 'card' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-luxury-gold transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Validade</label>
                      <input type="text" placeholder="MM/AA" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-luxury-gold transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">CVC</label>
                      <input type="text" placeholder="123" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-luxury-gold transition-all" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-32 h-32 bg-white mx-auto rounded-xl flex items-center justify-center p-2">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SlinPrimePayment" alt="QR Code Pix" className="w-full h-full" />
                  </div>
                  <p className="text-xs text-white/60">Escaneie o QR Code acima ou use o código Copia e Cola para pagar instantaneamente via PIX.</p>
                  <button className="text-luxury-gold text-xs font-bold uppercase tracking-widest hover:underline">Copiar Código PIX</button>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={loading}
            className="btn-luxury w-full bg-luxury-gold text-luxury-black py-4 mt-10 shadow-lg hover:brightness-110 transition-all gap-2 flex items-center justify-center rounded-2xl font-bold text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>Finalizar Assinatura <ArrowRight size={20} /></>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
