import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';

const Logo = () => (
  <Link to="/" className="flex items-center gap-3">
    <div className="w-10 h-10 bg-[#1F1B16] rounded-lg flex items-center justify-center">
      <span className="font-serif text-xl font-bold text-white">S</span>
    </div>
    <div className="flex flex-col">
      <span className="font-serif text-xl font-bold text-[#1F1B16] tracking-widest leading-none">SLIN PRIME</span>
      <span className="text-[7px] font-bold tracking-[0.3em] text-[#C89B4F] uppercase">Gestão de Clínica</span>
    </div>
  </Link>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex items-center gap-12">
          <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F1B16]">Início</Link>
          <button 
            onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F1B16]/60 hover:text-[#C89B4F] transition-colors"
          >
            Planos
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F1B16]/60 hover:text-[#C89B4F] transition-colors">
            Entrar
          </Link>
          <Link 
            to="/signup" 
            className="bg-[#C89B4F] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1F1B16] transition-all"
          >
            Assinar agora
          </Link>
        </div>

        <button className="md:hidden text-[#1F1B16]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-[#EAE5D9] md:hidden"
          >
            <div className="flex flex-col p-8 gap-6 text-center">
              <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em]">Início</Link>
              <button onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-[0.2em]">Planos</button>
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em]">Entrar</Link>
              <Link to="/signup" className="bg-[#C89B4F] text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]">Assinar agora</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
