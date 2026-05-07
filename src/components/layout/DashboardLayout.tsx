import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import GridBackground from '../ui/GridBackground';
import { useAuth } from '../../contexts/AuthContext';
import { Crown } from 'lucide-react';
import Subscription from '../../pages/dashboard/Subscription';

export default function DashboardLayout() {
  const { subscription, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If subscription is not active (pending payment, expired, etc.)
  // We show the subscription page as an overlay/gate
  const isPaid = subscription?.status === 'active';
  
  return (
    <div className="flex h-screen bg-transparent text-on-background relative">
      <GridBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-10 space-y-8 bg-surface-container-low/30 backdrop-blur-[2px]">
          {!isPaid ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12 p-8 md:p-16 bg-luxury-black border border-luxury-gold/20 rounded-[48px] shadow-[0_0_50px_rgba(198,162,67,0.1)] relative overflow-hidden">
              {/* Premium Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -ml-32 -mb-32" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-luxury-gold/10 rounded-3xl flex items-center justify-center text-luxury-gold mb-4 mx-auto border border-luxury-gold/20 rotate-12">
                  <Crown size={48} className="-rotate-12" />
                </div>
                <h2 className="font-serif text-5xl font-bold text-white leading-tight">
                  Eleve seu <span className="text-luxury-gold italic">padrão de gestão.</span>
                </h2>
                <p className="text-white/60 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                  Para liberar o acesso ao terminal Slin Prime e começar a gerir sua clínica com inteligência operacional, finalize sua ativação abaixo.
                </p>
              </div>

              <div className="w-full relative z-10">
                <Subscription />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
