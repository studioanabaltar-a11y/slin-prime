import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, CheckCircle2, Lock, ShieldCheck, XCircle, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    clinicName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planSlug = searchParams.get('plan') || 'starter';


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validações básicas de senha
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('As senhas não conferem.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando processo de cadastro para o plano:', planSlug);

      // Chamada para o backend que centraliza a criação do usuário e da sessão de pagamento
      // Garantimos que o backend receba o planSlug correto (padrão starter)
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          clinicName: formData.clinicName,
          email: formData.email,
          password: formData.password,
          planSlug: planSlug || 'starter' // Garante que sempre vá um plano, preferencialmente o selecionado
        }),
      });

      // Tentativa de ler o JSON da resposta
      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error('O servidor retornou uma resposta inválida. Tente novamente em instantes.');
      }

      if (!response.ok) {
        // Se o erro vier do Supabase ou da nossa lógica de negócio no backend
        throw new Error(result.error || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
      }

      if (result.paymentUrl) {
        console.log('Cadastro realizado com sucesso. Redirecionando para checkout:', result.paymentUrl);
        // Redireciona imediatamente para o Checkout (Stripe/Pix/Cartão)
        window.location.href = result.paymentUrl;
      } else {
        // Fallback caso não haja URL de pagamento (não deveria acontecer no fluxo atual)
        console.warn('Sem URL de pagamento, redirecionando para dashboard');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no fluxo de SignUp:', error);
      setErrorMsg(error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.');
      setLoading(false); // Garante que o loading pare em caso de erro
    }
  };


  return (
    <div className="min-h-screen bg-luxury-black flex flex-col lg:flex-row relative overflow-hidden text-white">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-dots-discreet opacity-10 pointer-events-none" />

      {/* Brand Sidebar */}
      <div className="hidden lg:flex w-[45%] relative bg-luxury-black p-20 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/assets/hero.png" 
            alt="Clinic Interior" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-black/80 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-4 group mb-24">
            <div className="w-10 h-10 border border-luxury-gold rotate-45 flex items-center justify-center transition-transform duration-700 group-hover:rotate-90">
              <span className="font-serif text-xl font-bold text-white -rotate-45">S</span>
            </div>
            <span className="font-serif text-2xl font-bold text-white tracking-widest uppercase">Slin Prime</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-6xl text-white leading-tight mb-8">
              Sua jornada para o <br/>
              <span className="italic text-luxury-gold">sucesso começa aqui.</span>
            </h1>
            <p className="text-white/60 text-lg font-light leading-relaxed max-w-md">
              Crie sua conta em segundos e desbloqueie o poder da gestão de alta performance.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4 text-white/40">
            <ShieldCheck size={18} className="text-luxury-gold" />
            <p className="text-xs font-bold uppercase tracking-widest">Segurança de Dados Military-Grade</p>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <CheckCircle2 size={18} className="text-luxury-gold" />
            <p className="text-xs font-bold uppercase tracking-widest">Ativação Instantânea após Cadastro</p>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-auth p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[40px] shadow-2xl"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl text-white font-serif font-bold mb-3 tracking-tight">Começar Agora</h2>
              <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-[10px]">Inicie sua Jornada na Elite</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-r-xl animate-in fade-in slide-in-from-top-4">
                <XCircle size={20} className="shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold ml-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10"
                    placeholder="Dr. Nome Exemplo"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold ml-1">Nome da Sua Clínica</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10"
                    placeholder="Clínica Elite"
                    value={formData.clinicName}
                    onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold ml-1">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10"
                    placeholder="contato@suaclinica.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold ml-1">Senha</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-luxury-gold transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold ml-1">Confirmar</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <motion.button
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-luxury-gold text-luxury-black py-5 mt-6 shadow-2xl shadow-luxury-gold/10 hover:brightness-110 transition-all duration-300 gap-3 flex items-center justify-center rounded-2xl font-bold uppercase tracking-[0.2em] text-xs"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>Criar Minha Conta <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <p className="text-[13px] text-white/40">
                Já faz parte da elite? <Link to="/login" className="text-luxury-gold font-semibold hover:underline">Acesse sua conta</Link>
              </p>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center text-luxury-muted/40 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2024 Slin Prime — High Performance Management
          </div>
        </div>
      </div>
    </div>
  );
}
