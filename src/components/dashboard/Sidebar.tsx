import { 
  LayoutDashboard, 
  Calendar, 
  Receipt, 
  Wallet, 
  Users, 
  Pill, 
  LogOut,
  Scissors,
  BarChart3,
  Calculator,
  MessageSquare,
  Crown,
  ShieldCheck,
  Zap
} from 'lucide-react';
import NavItem from '../ui/NavItem';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../auth/FeatureGuard';
import { supabase } from '../../lib/supabase';
import React, { useState, useEffect } from 'react';

export default function Sidebar() {
  const { signOut, user, profile, clinic, subscription } = useAuth();
  const { hasFeature, planName } = usePlan();
  
  const userName = profile?.full_name || user?.user_metadata?.full_name || 'Usuário';
  const clinicName = clinic?.name || user?.user_metadata?.clinic_name || 'Minha Clínica';
  const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  
  const [openComandas, setOpenComandas] = useState(0);

  useEffect(() => {
    if (profile?.clinic_id) {
      fetchComandaCount();
      const interval = setInterval(fetchComandaCount, 30000);
      return () => clearInterval(interval);
    }
  }, [profile?.clinic_id]);

  const fetchComandaCount = async () => {
    try {
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('clinic_id', profile?.clinic_id)
        .not('status', 'in', '("finished","cancelled")');
      
      if (!error) setOpenComandas(count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const getPlanIcon = () => {
    switch (planName.toLowerCase()) {
      case 'premium': return <Crown size={12} className="text-accent" />;
      case 'pro': return <ShieldCheck size={12} className="text-accent" />;
      default: return <Zap size={12} className="text-slate-400" />;
    }
  };

  return (
    <aside className="w-72 bg-primary border-r border-white/5 flex flex-col shrink-0">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <span className="font-display text-2xl font-bold text-white tracking-tighter">
          Slin <span className="text-accent">Prime</span>
        </span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <NavItem variant="dark" icon={<LayoutDashboard size={20} />} label="Dashboard" to="/dashboard" />
        
        <NavItem variant="dark" icon={<Calendar size={20} />} label="Agenda" to="/dashboard/agenda" />
        
        {hasFeature('whatsapp_concierge') && (
          <NavItem variant="dark" icon={<MessageSquare size={20} />} label="WhatsApp" to="/dashboard/mensagens" />
        )}
        
        {hasFeature('financeiro_simples') && (
          <>
            <NavItem variant="dark" icon={<Receipt size={20} />} label="Comandas" badge={openComandas > 0 ? openComandas.toString() : undefined} to="/dashboard/comandas" />
            <NavItem variant="dark" icon={<Wallet size={20} />} label="Caixa do dia" to="/dashboard/caixa" />
          </>
        )}
        
        <div className="pt-8 pb-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Gestão</div>
        
        {hasFeature('financeiro_completo') && (
          <>
            <NavItem variant="dark" icon={<Wallet size={20} />} label="Financeiro" to="/dashboard/financeiro" />
            <NavItem variant="dark" icon={<Calculator size={20} />} label="Precificação" to="/dashboard/precificacao" />
          </>
        )}
        
        {hasFeature('relatorios') && (
          <NavItem variant="dark" icon={<BarChart3 size={20} />} label="Desempenho" to="/dashboard/desempenho" />
        )}
        
        <NavItem variant="dark" icon={<Scissors size={20} />} label="Serviços" to="/dashboard/servicos" />
        
        <div className="pt-8 pb-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Pessoas</div>
        
        <NavItem variant="dark" icon={<Users size={20} />} label="Pacientes" to="/dashboard/pacientes" />
        
        <NavItem variant="dark" icon={<Pill size={20} />} label="Profissionais" to="/dashboard/profissionais" />

        <div className="pt-8 pb-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sessão</div>
        <NavItem variant="dark" icon={<Crown size={20} />} label="Assinatura" to="/dashboard/assinatura" />
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-medium text-error hover:bg-error/10"
        >
          <LogOut size={20} />
          <span className="text-sm">Sair</span>
        </button>
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold truncate text-white">{userName}</p>
              {getPlanIcon()}
            </div>
            <p className="text-xs text-slate-400 truncate">{clinicName}</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-bold uppercase tracking-wider">
                {planName}
              </span>
              {subscription?.status === 'trialing' && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                  Trial
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
