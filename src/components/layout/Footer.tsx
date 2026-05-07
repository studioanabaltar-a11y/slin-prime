import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-luxury-outline py-24 px-6">
      <div className="container-luxury flex flex-col md:flex-row justify-between items-start gap-20 md:gap-16">
        <div className="flex flex-col items-start max-w-sm">
          <div className="flex items-center gap-4 mb-8 group">
            <div className="w-12 h-12 border-2 border-luxury-gold rotate-45 flex items-center justify-center transition-transform duration-700 group-hover:rotate-90">
              <span className="font-serif text-2xl font-bold text-luxury-black -rotate-45 select-none">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-luxury-black tracking-[0.2em] uppercase">SLIN PRIME</span>
              <span className="text-[7px] font-bold tracking-[0.5em] text-luxury-gold uppercase -mt-1 opacity-80 italic">High Performance Management</span>
            </div>
          </div>
          <p className="text-sm text-luxury-black/40 font-light leading-relaxed mb-8">
            Elevando o padrão da gestão clínica brasileira através de tecnologia invisível e inteligência operacional de alta performance.
          </p>
          <p className="text-[10px] text-luxury-black/30 font-bold uppercase tracking-[0.2em]">© 2024 Slin Prime — Todos os direitos reservados.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-black/60">
          <div className="flex flex-col gap-6">
            <p className="text-luxury-black tracking-[0.5em] mb-2 opacity-100">Sistema</p>
            <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <Link to="/features" className="hover:text-luxury-gold transition-colors">Estratégia</Link>
            <Link 
              to="/" 
              onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-luxury-gold transition-colors"
            >
              Assinar Plano
            </Link>
          </div>
          
          <div className="flex flex-col gap-6">
            <p className="text-luxury-black tracking-[0.5em] mb-2 opacity-100">Legal</p>
            <Link to="#" className="hover:text-luxury-gold transition-colors">Privacidade</Link>
            <Link to="#" className="hover:text-luxury-gold transition-colors">Termos</Link>
            <Link to="/signup" className="text-luxury-gold">Fazer Teste Grátis</Link>
          </div>

          <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
            <p className="text-luxury-black tracking-[0.5em] mb-2 opacity-100">Concierge</p>
            <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-black transition-colors">WhatsApp Suporte</a>
            <p className="text-luxury-black/40 normal-case font-light tracking-normal text-xs">Atendimento exclusivo para membros da elite.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
