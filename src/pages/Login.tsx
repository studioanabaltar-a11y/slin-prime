import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const successMessage = searchParams.get('message');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      alert('Bem-vindo de volta.');
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
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
            src="/assets/cta.png" 
            alt="Elite Environment" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black via-luxury-black/80 to-transparent" />
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
              Assuma o comando <br/>
              <span className="italic text-luxury-gold">da sua clínica.</span>
            </h1>
            <p className="text-white/60 text-lg font-light leading-relaxed max-w-md">
              Acesse seu terminal de inteligência operacional e acompanhe cada indicador do seu sucesso em tempo real.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-luxury-black overflow-hidden shadow-lg">
                  <img src={`/assets/doctor${i}.png`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Aprovado pela Elite Médica</p>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-auth p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[40px] shadow-2xl"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl text-white font-serif font-bold mb-3 tracking-tight">Entrar</h2>
              <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-[10px]">Identificação de Acesso Elite</p>
            </div>

            {successMessage && (
              <div className="mb-8 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm flex items-center gap-3 rounded-r-xl animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 size={20} className="shrink-0" />
                {successMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold ml-1">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10"
                    placeholder="contato@suaclinica.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold">Senha Secreta</label>
                    <Link to="#" className="text-[10px] font-bold text-white/40 hover:text-luxury-gold transition-colors">Esqueceu a senha?</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-luxury-gold transition-all text-white placeholder:text-white/10 pr-14"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-luxury-gold transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
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
                  <>Acessar Terminal <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <p className="text-[13px] text-white/40">
                Novo na elite? <Link to="/signup" className="text-luxury-gold font-semibold hover:underline">Solicitar Acesso</Link>
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
