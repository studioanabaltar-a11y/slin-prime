import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import React from 'react';
import { 
  Calendar, 
  Users, 
  Wallet, 
  TrendingDown, 
  Hourglass, 
  Star, 
  Bolt, 
  BarChart2, 
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function Solution() {
  return (
    <div className="bg-[#FCF9F1] min-h-screen">
      {/* Hero / Agitation */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#C5A059]/5 blur-[150px] rounded-full -z-0" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <header className="max-w-3xl mb-24">
            <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Diagnóstico de Performance</span>
            <h1 className="font-serif text-5xl md:text-7xl text-[#1A1A1A] mb-10 leading-tight">
              Sintomas de uma operação <br/><span className="italic text-[#C5A059]">sub-otimizada</span>
            </h1>
            <p className="text-xl text-[#4A4A4A] mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Se sua clínica apresenta estes sinais, você não tem um negócio, você tem um gargalo drenando seu tempo, seu lucro e sua autoridade.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <ProblemCard 
              icon={<Calendar size={24} />}
              title="Agenda sem Estratégia"
              description="Buracos invisíveis que custam caro e falta de priorização de pacientes de alto ticket."
              color="bg-[#C5A059]/5"
            />
            <ProblemCard 
              icon={<Users size={24} />}
              title="Abandono Silencioso"
              description="Pacientes que não retornam por falta de um fluxo de retenção automatizado e elegante."
              color="bg-[#1A1A1A]/5"
            />
            <ProblemCard 
              icon={<Wallet size={24} />}
              title="Caixa Cego"
              description="Dificuldade em prever o faturamento real e identificar onde o lucro está escorrendo."
              color="bg-[#C5A059]/5"
            />
            <ProblemCard 
              icon={<TrendingDown size={24} />}
              title="Margem em Risco"
              description="Custos operacionais descontrolados que consomem sua rentabilidade sem você perceber."
              color="bg-[#1A1A1A]/5"
            />
            <ProblemCard 
              icon={<Hourglass size={24} />}
              title="Escravidão Operacional"
              description="Você preso em burocracias que um sistema inteligente deveria resolver em segundos."
              color="bg-[#C5A059]/5"
            />
            <div className="bg-[#1A1A1A] p-10 rounded-[3rem] text-white flex flex-col justify-center items-center text-center border border-white/10 shadow-2xl">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-4">Próximo Nível</h3>
               <p className="text-lg font-serif italic mb-8">Pronto para a transformação?</p>
                <Link to="/signup" className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-[#C5A059] pb-2 hover:text-[#C5A059] transition-colors">Fazer Teste Grátis</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6 bg-white border-y border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-serif text-4xl text-[#1A1A1A] mb-4">Dominando o Mercado</h2>
            <div className="w-16 h-[1px] bg-[#C5A059]/30 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <TestimonialCard 
              name="Dra. Juliana Martins"
              role="Dermatologia Avançada"
              text="O Slin Prime trouxe a ordem que eu precisava para focar na minha arte. A gestão agora é invisível e impecável."
              image="/assets/doctor1.png"
            />
            <TestimonialCard 
              name="Dr. Ricardo Abreu"
              role="Performance Humana"
              text="A automação de retenção recuperou 30% dos pacientes inativos. Investimento que se paga no primeiro mês de uso."
              image="/assets/doctor2.png"
            />
            <TestimonialCard 
              name="Dra. Fernanda Lima"
              role="Estética Boutique"
              text="O sistema é tão elegante quanto minha clínica. Meus pacientes sentem o nível de profissionalismo em cada interação."
              image="/assets/doctor3.png"
            />
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="py-40 px-6 bg-[#FCF9F1]">
        <div className="max-w-7xl mx-auto flex flex-col gap-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
              <div className="bg-[#C5A059]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-[#C5A059] shadow-inner">
                <Bolt size={32} />
              </div>
              <h2 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] mb-10 leading-tight">Inteligência Operacional <br/><span className="italic text-[#C5A059]">Invisível.</span></h2>
              <p className="text-xl text-[#4A4A4A] mb-12 leading-relaxed font-light">
                O Slin Prime não é apenas um software, é o seu braço direito digital. Ele antecipa problemas, automatiza a burocracia e libera você para o que realmente importa: a medicina de ponta.
              </p>
              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] mb-2">Retenção de Alto Ticket</h4>
                    <p className="text-base text-[#4A4A4A] font-light">Algoritmos que identificam o momento exato de reativar cada paciente com elegância.</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] mb-2">Gestão de Escassez Otimizada</h4>
                    <p className="text-base text-[#4A4A4A] font-light">Otimização máxima de horários para garantir que sua infraestrutura nunca fique ociosa.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              <div className="absolute -inset-10 bg-[#C5A059]/5 rounded-full blur-[100px] -z-10" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 aspect-square">
                <img 
                  src="/assets/doctors.png" 
                  alt="Elite Medical Team"
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Synchronized with Home */}
      <section id="pricing" className="py-32 px-6 bg-white border-t border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Escolha seu <span className="italic text-[#C5A059]">Nível.</span></h2>
          <div className="w-16 h-[1px] bg-[#C5A059]/30 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          <PricingCard 
            title="STARTER"
            price="47"
            description="Profissionalização imediata da sua marca pessoal."
            features={["Agenda Inteligente", "Prontuário Digital", "Gestão Básica"]}
          />
          <PricingCard 
            title="PRO"
            price="97"
            description="Automação real para clínicas de alta performance."
            features={["Tudo do Starter", "WhatsApp Inteligente", "Relatórios VIP", "Gestão de Comandas"]}
            highlighted
          />
          <PricingCard 
            title="PREMIUM"
            price="197"
            description="Controle total para operações complexas."
            features={["Tudo do PRO", "Multiclínicas", "Suporte Concierge", "Análise de Desempenho"]}
          />
        </div>
      </section>

      {/* Final Agitation */}
      <section className="py-40 px-6 bg-[#1A1A1A] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-5xl md:text-7xl mb-12 leading-tight">Sua clínica merece o <br/><span className="italic text-[#C5A059]">topo.</span></h2>
          <p className="text-xl text-white/60 mb-16 font-light leading-relaxed max-w-2xl mx-auto">
            Não permita que a desorganização limite seu potencial. O Slin Prime é a ferramenta definitiva para quem busca a maestria na gestão clínica.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/signup" 
              className="btn-luxury bg-white text-[#1A1A1A] px-12 py-6 rounded-full text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-[#C5A059] hover:text-white shadow-2xl transition-all inline-flex items-center gap-4"
            >
              Fazer Teste Grátis <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ProblemCard({ icon, title, description, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[3rem] border border-[#E5E0D5] shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500 text-left"
    >
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-[#C5A059] mb-8 shadow-inner`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest mb-4">{title}</h3>
      <p className="text-[11px] text-[#4A4A4A] leading-relaxed font-light uppercase tracking-wider">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ name, role, text, image }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white p-12 rounded-[3rem] border border-[#E5E0D5] flex flex-col gap-8 text-left relative overflow-hidden shadow-sm"
    >
      <div className="flex gap-1 text-[#C5A059]">
        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
      </div>
      <p className="text-lg text-[#4A4A4A] italic font-light leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-5 mt-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059]/10 shadow-lg">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-[#1A1A1A] text-sm tracking-wide">{name}</p>
          <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-1">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function PricingCard({ title, price, description, features, highlighted = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: highlighted ? -5 : -10 }}
      className={`p-10 rounded-[3rem] flex flex-col gap-8 transition-all duration-500 relative ${highlighted ? 'bg-white border-2 border-[#C5A059] shadow-2xl scale-105 z-10' : 'bg-white border border-[#E5E0D5] shadow-sm'}`}
    >
      {highlighted && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C5A059] text-white px-8 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] shadow-xl">
          Elite Choice
        </div>
      )}
      <div className="text-center space-y-4">
        <h3 className="text-[11px] font-bold text-[#C5A059] tracking-[0.4em] uppercase">{title}</h3>
        <p className="text-[10px] text-[#4A4A4A] font-light uppercase tracking-widest px-4">{description}</p>
      </div>
      <div className="text-center py-4">
        <span className="text-lg font-light text-[#4A4A4A] mr-2">R$</span>
        <span className="text-6xl font-serif text-[#1A1A1A]">{price}</span>
        <span className="text-sm font-light text-[#4A4A4A] ml-2">/ mês</span>
      </div>
      <ul className="space-y-5 flex-grow">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
            <CheckCircle2 size={14} className="text-[#C5A059] shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link 
        to="/signup" 
        className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] text-center transition-all block ${highlighted ? 'bg-[#1A1A1A] text-white shadow-xl hover:bg-[#C5A059]' : 'border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'}`}
      >
        Assinar Plano
      </Link>
    </motion.div>
  );
}
