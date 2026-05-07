import { Bell, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardHeader() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || 'Usuário';
  const clinicName = user?.user_metadata?.clinic_name || 'Unidade Jardins';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="h-20 bg-surface border-b border-outline-variant/20 px-10 flex items-center justify-between shrink-0">
      <div>
        <h1 className="font-display text-xl font-bold text-on-surface">{getGreeting()}, {userName}.</h1>
        <p className="text-sm text-on-surface-variant font-medium">Você está gerenciando a <span className="text-accent font-bold">{clinicName}</span>.</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-accent relative">
          <Bell size={20} />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <button className="bg-accent text-white px-6 py-2.5 rounded-full font-bold shadow-sm hover:shadow-md active:scale-95 transition-all text-sm flex items-center gap-2 hover:bg-accent-gold-hover">
          <PlusCircle size={18} />
          Novo Agendamento
        </button>
      </div>
    </header>
  );
}
