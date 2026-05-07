import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-[#f5f5f7]">
      {/* Background Orbs for Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-primary-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center flex flex-col items-center mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            O sistema completo para sua clínica
          </motion.div>

          {/* Main Titles */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-on-background font-extrabold tracking-tight mb-4 max-w-5xl leading-[1.05]"
          >
            Sua clínica sob controle.<br />
            <span className="text-primary">Resultados reais.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed"
          >
            Organize sua clínica, controle seus pacientes e aumente seu faturamento — em um único sistema simples, premium e inteligente.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          >
            <Link
              to="/signup"
              className="group flex items-center gap-2 bg-primary text-white font-display text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              Começar Agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="flex items-center gap-2 bg-white text-on-background border border-outline-variant/50 font-display text-lg px-8 py-4 rounded-2xl shadow-sm hover:bg-surface-container-lowest hover:border-outline-variant transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Play size={20} className="fill-on-background/10" />
              Ver Demonstração
            </button>
          </motion.div>

          {/* Trust Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 text-on-surface-variant/70 font-medium text-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#f5f5f7] bg-surface-container flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <span className="flex items-center gap-1.5">
              <Users size={16} className="text-primary" />
              +120 clínicas utilizando o sistema
            </span>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-ambient-high border border-white/40 glass p-2 md:p-4">
            <img
              src="file:///C:/Users/giova/.gemini/antigravity/brain/09944956-4e78-44f0-aecf-e8ac184b83b3/modern_clinic_dashboard_mockup_1778120187848.png"
              alt="Slin Prime Dashboard Mockup"
              className="w-full rounded-[1.5rem] md:rounded-[2rem] shadow-lg"
            />
          </div>
          
          {/* Float Card Stats Placeholder */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -right-8 hidden xl:flex bg-white/90 backdrop-blur shadow-ambient border border-outline-variant/20 p-6 rounded-3xl gap-4 items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
              <ArrowRight size={24} className="-rotate-45" />
            </div>
            <div>
              <div className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Faturamento</div>
              <div className="text-xl font-bold text-on-background">+R$ 42.800</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -left-12 hidden xl:flex bg-white/90 backdrop-blur shadow-ambient border border-outline-variant/20 p-6 rounded-3xl gap-4 items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <div>
              <div className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Novos Pacientes</div>
              <div className="text-xl font-bold text-on-background">128 este mês</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
