import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  TrendingDown, 
  CheckCircle2, 
  Star,
  ShieldCheck,
  Zap,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  ClipboardList,
  Target,
  LineChart,
  Activity
} from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-[#F7F4EE] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-[180px] pb-[100px] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="z-10"
          >
            <span className="inline-block py-1 px-4 rounded bg-[#C89B4F]/10 text-[#C89B4F] text-[9px] font-bold tracking-[0.2em] uppercase mb-8 border border-[#C89B4F]/20">
              A SISTEMA COMPLETO PARA SUA CLÍNICA
            </span>
            <h1 className="text-5xl md:text-[64px] text-[#1F1B16] leading-[1.1] mb-8">
              Você está perdendo <br/>
              <span className="italic font-serif text-[#C89B4F]">dinheiro</span> todos os dias.
            </h1>
            <div className="bg-[#EAE5D9]/50 p-4 rounded-lg inline-block mb-8 border-l-4 border-[#C89B4F]">
              <p className="text-[#1F1B16] font-medium italic">E o pior: você nem percebe.</p>
            </div>
            <p className="text-lg text-[#1F1B16]/60 mb-12 max-w-lg font-light leading-relaxed">
              Organize sua clínica, controle seus pacientes e aumente seu faturamento com um único sistema simples e inteligente.
            </p>

            <div className="grid grid-cols-4 gap-6 mb-12 max-w-md">
              <HeroIcon icon={<Calendar size={20} />} label="Agenda bagunçada" />
              <HeroIcon icon={<DollarSign size={20} />} label="Ausência Financeira" />
              <HeroIcon icon={<Users size={20} />} label="Prontuários na clínica" />
              <HeroIcon icon={<BarChart3 size={20} />} label="Relatórios Inteligentes" />
            </div>

            <div className="space-y-6">
              <Link 
                to="/signup" 
                className="bg-[#C89B4F] text-white px-10 py-5 rounded text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1F1B16] transition-all inline-flex items-center gap-4 group shadow-xl shadow-[#C89B4F]/20"
              >
                COMEÇAR TESTE GRÁTIS AGORA <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-[#1F1B16]/40">
                <span className="flex items-center gap-2 text-[#C89B4F]"><CheckCircle2 size={12} /> 7 dias grátis</span>
                <span className="flex items-center gap-2 text-[#C89B4F]"><CheckCircle2 size={12} /> Sem cartão de crédito</span>
                <span className="flex items-center gap-2 text-[#C89B4F]"><CheckCircle2 size={12} /> Cancelamento fácil</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/50 aspect-[4/3] relative">
              <img 
                src="/assets/hero_v2.png" 
                alt="Clinic Professional" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diagnosis Section */}
      <section className="py-[120px] px-6 bg-white border-y border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl text-[#1F1B16] mb-20 leading-tight">
            Você trabalha muito. Mas <span className="italic font-serif text-[#C89B4F]">não cresce.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 max-w-6xl mx-auto mb-20">
            <DiagnosisItem icon={<Calendar />} title="Agenda bagunçada" desc="Tempo perdido entre salas vazias." />
            <DiagnosisItem icon={<Target />} title="Pacientes esquecidos" desc="Falta de retorno em oportunidades perdidas." />
            <DiagnosisItem icon={<DollarSign />} title="Financeiro desorganizado" desc="Você não sabe quem quanto faturou." />
            <DiagnosisItem icon={<ShieldCheck />} title="Falta de controle" desc="Processos manuais e retrabalho constante." />
            <DiagnosisItem icon={<TrendingDown />} title="Lucro invisível" desc="Você trabalha, mas não vê para onde o dinheiro vai." />
          </div>

          <p className="text-xl text-[#1F1B16]/40 font-light">
            O problema não é esforço. <span className="text-[#C89B4F] italic">É falta de sistema.</span>
          </p>
        </div>
      </section>

      {/* Pain Points Comparison */}
      <section className="py-[120px] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl text-[#1F1B16] mb-6 leading-tight">
                Quantos pacientes <br/> <span className="italic font-serif text-[#C89B4F]">você perdeu hoje?</span>
              </h2>
              <div className="bg-[#EAE5D9]/50 p-4 rounded-lg inline-block mb-10 border-l-4 border-[#C89B4F]">
                <p className="text-[#1F1B16] font-medium italic">E o pior: você nem percebe.</p>
              </div>
              <p className="text-lg text-[#1F1B16]/60 mb-12 font-light leading-relaxed">
                E o pior: você nem percebe. O pior: você nem percebe. O pior: você nem percebe. O pior: você nem percebe. O pior: você nem percebe.
              </p>

              {/* Red Chart Placeholder */}
              <div className="bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-xl">
                <div className="flex items-end gap-3 h-48 mb-6">
                  {[100, 85, 90, 70, 75, 50, 60, 40, 30].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-red-400 rounded-t-md opacity-80" />
                  ))}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-center text-red-500">Faturamento Sem Controle</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/50 aspect-video relative">
                <img src="/assets/planner_v2.png" alt="Messy Planner" className="w-full h-full object-cover" />
              </div>
              <div className="pl-8">
                <h3 className="text-3xl text-[#1F1B16] mb-8 leading-tight">
                  Cada dia sem sistema <br/> é <span className="italic font-serif text-[#C89B4F]">dinheiro perdido.</span>
                </h3>
                <div className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-[#1F1B16]/60">
                  <div className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#C89B4F]" /> Menos organização = mais problemas</div>
                  <div className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#C89B4F]" /> Menos faturamento = menos lucro</div>
                  <div className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#C89B4F]" /> Menos controle = menos lazer</div>
                  <div className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#C89B4F] text-red-400" /> Mais caos hoje = menos crescimento amanhã</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Growth Section */}
      <section className="py-[120px] px-6 bg-white border-y border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[#C89B4F] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">A SOLUÇÃO PARA CLÍNICAS QUE QUEREM</span>
              <h2 className="text-5xl text-[#1F1B16] mb-8 leading-tight">
                Crescer de <span className="italic font-serif text-[#C89B4F]">verdade.</span>
              </h2>
              <p className="text-[#1F1B16]/80 text-sm font-medium mb-10 leading-relaxed uppercase tracking-wider">
                O SLIN PRIME é o sistema completo seus pacientes e aumente seu faturamento com um único sistema simples e inteligente.
              </p>
              
              <ul className="space-y-4 mb-12">
                {["Agenda clínica inteligente", "Gestão de pacientes e Prontuários", "Controle financeiro completo", "Dashboards e indicadores em tempo real", "Relatórios e indicadores de tempo real", "Acesse de qualquer lugar, 24 horas por dia"].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#1F1B16]/60">
                    <CheckCircle2 size={16} className="text-[#C89B4F]" /> {f}
                  </li>
                ))}
              </ul>

              <Link 
                to="/signup" 
                className="bg-[#C89B4F] text-white px-10 py-5 rounded text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1F1B16] transition-all inline-block shadow-xl shadow-[#C89B4F]/20 mb-12"
              >
                TESTAR GRÁTIS POR 7 DIAS
              </Link>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-[#EAE5D9]">
                <StatItem val="+500" label="VÁRIAS CLÍNICAS" />
                <StatItem val="+5.000" label="PACIENTES ATENDIDOS" />
                <StatItem val="+32%" label="AUMENTO DE FATURAMENTO" />
                <StatItem val="-40%" label="MENOS FALTAS E ESQUECIMENTOS" />
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#F7F4EE] p-6 rounded-[32px] shadow-2xl border border-[#EAE5D9]">
                <img src="/assets/dashboard_v2.png" alt="Dashboard Preview" className="w-full rounded-2xl border border-[#EAE5D9]" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#C89B4F]/5 rounded-full blur-[80px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-[100px] px-6 bg-white border-y border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-[#1F1B16] leading-tight font-serif">
              Quem usa, <span className="italic text-[#C89B4F]">recomenda.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialSmall 
              name="Dra. Juliana Martins"
              role="Clínica Dermatologia"
              text="O Slin Prime resolveu a forma como eu gerencio minha clínica. Ganho tempo, organização e fonte de verdade."
              image="/assets/doctor1.png"
            />
            <TestimonialSmall 
              name="Dra. Camila Souza"
              role="Cardiologia"
              text="Antes era tudo no papel e na cabeça. Hoje tenho tudo na palma da mão em poucos cliques."
              image="/assets/doctor2.png"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section - Separated and Updated */}
      <section id="pricing" className="py-[120px] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#C89B4F] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">PLANOS E ASSINATURAS</span>
            <h2 className="text-5xl text-[#1F1B16] leading-tight font-serif">Escolha o seu nível de <span className="italic text-[#C89B4F]">sucesso.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-20">
            <PricingCardSmall 
              title="STARTER"
              price="49,90"
              desc="Ideal para iniciantes e solo-practice."
              features={["Agenda básica", "Cadastro de pacientes", "Controle financeiro simples", "Prontuários básicos"]}
            />
            <PricingCardSmall 
              title="PRO"
              price="99,97"
              desc="Para clínicas em crescimento."
              features={["Todas funções Starter", "Relatórios gerenciais", "Gestão de estoque", "Indicadores de faturamento", "Acesso multifuncional"]}
              highlighted
            />
            <PricingCardSmall 
              title="PREMIUM"
              price="149,99"
              desc="O nível máximo de controle e inteligência."
              features={["Todas funções PRO", "WhatsApp Concierge", "Metas e Comissões", "Suporte Prioritário", "Auditoria de logs"]}
            />
          </div>

          {/* Guarantee - Now below pricing for better flow */}
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-[40px] border border-[#EAE5D9] shadow-soft text-center">
            <h3 className="text-[10px] font-bold text-[#C89B4F] uppercase tracking-[0.4em] mb-10 italic">COMPROMISSO SLIN PRIME — SEM RISCO PARA VOCÊ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center gap-4">
                <ShieldCheck size={24} className="text-[#C89B4F]" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#1F1B16]/60 leading-tight">7 DIAS DE TESTE GRÁTIS SEM COMPROMISSO.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 size={24} className="text-[#C89B4F]" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#1F1B16]/60 leading-tight">SUPORTE VIA WHATSAPP E CHAMADOS EXCLUSIVOS.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <LineChart size={24} className="text-[#C89B4F]" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#1F1B16]/60 leading-tight">DADOS 100% SEGUROS E CRIPTOGRAFADOS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee CTA */}
      <section className="py-[120px] px-6 bg-white border-t border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 relative">
            <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-[#F7F4EE] aspect-square">
              <img src="/assets/cta_v2.png" alt="Relaxed Professional" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <h2 className="text-5xl text-[#1F1B16] leading-tight mb-6">
              Chega de trabalhar no escuro. <br/>
              <span className="italic font-serif text-[#C89B4F]">É hora de ter controle, <br/> tempo e lucro.</span>
            </h2>
            <p className="text-xl text-[#1F1B16]/60 mb-10 font-light max-w-2xl leading-relaxed">
              Comece agora a transforma sua clínica com o Slin Prime.
            </p>
            <Link 
              to="/signup" 
              className="bg-[#C89B4F] text-white px-10 py-5 rounded text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1F1B16] transition-all inline-block shadow-xl shadow-[#C89B4F]/20"
            >
              TESTAR GRÁTIS POR 7 DIAS
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="bg-[#1F1B16] py-20 px-6 text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 grayscale brightness-200 opacity-50">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#1F1B16] font-bold">S</span>
            </div>
            <span className="font-serif text-lg font-bold tracking-widest">SLIN PRIME</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">© 2024 SLIN PRIME - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function HeroIcon({ icon, label }: any) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 bg-white rounded-xl border border-[#EAE5D9] flex items-center justify-center text-[#C89B4F] shadow-sm">
        {icon}
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest text-[#1F1B16]/60">{label}</p>
    </div>
  );
}

function DiagnosisItem({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-16 h-16 rounded-full border border-[#EAE5D9] flex items-center justify-center text-[#C89B4F] mb-6 group-hover:bg-[#C89B4F] group-hover:text-white transition-all">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h4 className="text-[11px] font-bold text-[#1F1B16] uppercase tracking-[0.2em] mb-2">{title}</h4>
      <p className="text-[9px] text-[#1F1B16]/40 uppercase tracking-widest leading-tight px-4">{desc}</p>
    </div>
  );
}

function StatItem({ val, label }: any) {
  return (
    <div className="text-center">
      <p className="text-4xl font-serif text-[#C89B4F] mb-2">{val}</p>
      <p className="text-[8px] font-bold text-[#1F1B16]/40 uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
}

function TestimonialSmall({ name, role, text, image }: any) {
  return (
    <div className="bg-white p-8 rounded-[24px] border border-[#EAE5D9] shadow-sm">
      <p className="text-xs text-[#1F1B16]/80 italic mb-8 leading-relaxed font-light">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C89B4F]/20">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#1F1B16] uppercase tracking-wide">{name}</p>
          <p className="text-[9px] text-[#C89B4F] font-bold uppercase tracking-widest">{role}</p>
        </div>
        <div className="ml-auto flex gap-0.5 text-[#C89B4F]">
          {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="currentColor" />)}
        </div>
      </div>
    </div>
  );
}

function PricingCardSmall({ title, price, desc, features, highlighted = false }: any) {
  return (
    <div className={`bg-white p-8 rounded-[32px] border flex flex-col h-full relative ${highlighted ? 'border-[#C89B4F] border-2 shadow-2xl scale-105 z-10' : 'border-[#EAE5D9]'}`}>
      {highlighted && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C89B4F] text-white px-4 py-1 rounded-full text-[8px] font-bold uppercase tracking-[0.2em]">MAIS VENDIDO</span>
      )}
      <div className="text-center mb-8">
        <h3 className="text-[11px] font-bold text-[#C89B4F] uppercase tracking-[0.4em] mb-2">{title}</h3>
        <p className="text-[9px] text-[#1F1B16]/40 uppercase tracking-widest leading-tight">{desc}</p>
      </div>
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold text-[#1F1B16]/40 align-top mr-1">R$</span>
        <span className="text-5xl font-serif text-[#1F1B16]">{price}</span>
        <span className="text-[9px] font-bold text-[#1F1B16]/40 ml-1">/mês</span>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[#1F1B16]/60 leading-tight">
            <CheckCircle2 size={12} className="text-[#C89B4F] shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Link 
        to={`/signup?plan=${title.toLowerCase()}`}
        className={`w-full py-4 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] transition-all text-center ${highlighted ? 'bg-[#C89B4F] text-white hover:bg-[#1F1B16]' : 'border border-[#C89B4F] text-[#C89B4F] hover:bg-[#C89B4F] hover:text-white'}`}
      >
        ASSINAR AGORA
      </Link>
    </div>
  );
}
