import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  TrendingDown, 
  ArrowUpRight,
  Clock,
  DollarSign,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { supabase } from '../lib/supabase';

// UI Components
import MetricCard from '../components/ui/MetricCard';

export default function Dashboard() {
  const { user, clinic } = useAuth();
  const [metrics, setMetrics] = useState({
    today: 0,
    month: 0,
    openComandas: 0,
    occupancy: 0
  });
  const [loading, setLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(0);

  useEffect(() => {
    if (clinic?.monthly_goal) {
      setTempGoal(clinic.monthly_goal);
    }
  }, [clinic]);

  const updateGoal = async () => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ monthly_goal: tempGoal })
        .eq('id', clinic?.id);
      
      if (error) throw error;
      setIsEditingGoal(false);
      // The auth context should ideally refresh clinic data or we can manually update local state if needed
      window.location.reload(); // Simple way to refresh all data for now
    } catch (err) {
      console.error('Error updating goal:', err);
      alert('Erro ao atualizar meta');
    }
  };

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchWeeklyData();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchWeeklyData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        return d;
      });

      const dataPromises = last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        const { data } = await supabase
          .from('appointments')
          .select('services(price)')
          .eq('status', 'finished')
          .gte('start_time', date.toISOString())
          .lt('start_time', nextDay.toISOString());

        const total = data?.reduce((acc, curr: any) => acc + (curr.services?.price || 0), 0) || 0;
        return {
          name: i === 6 ? 'Hoje' : days[date.getDay()],
          valor: total
        };
      });

      const results = await Promise.all(dataPromises);
      setChartData(results);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch Today's Finalized Revenue
      const { data: todayData } = await supabase
        .from('appointments')
        .select('services(price)')
        .eq('status', 'finished')
        .gte('start_time', startOfDay);

      // Fetch Month's Finalized Revenue
      const { data: monthData } = await supabase
        .from('appointments')
        .select('services(price)')
        .eq('status', 'finished')
        .gte('start_time', startOfMonth);

      // Fetch Open Comandas (Status not finished and time has passed)
      const { data: openData } = await supabase
        .from('appointments')
        .select('id')
        .neq('status', 'finished')
        .lt('start_time', now.toISOString());

      // Fetch Today's Appointments for Occupancy
      const { data: todayAppts } = await supabase
        .from('appointments')
        .select('id')
        .gte('start_time', startOfDay)
        .lt('start_time', new Date(now.getTime() + 86400000).toISOString());

      const todayTotal = todayData?.reduce((acc, curr: any) => acc + (curr.services?.price || 0), 0) || 0;
      const monthTotal = monthData?.reduce((acc, curr: any) => acc + (curr.services?.price || 0), 0) || 0;
      
      // Occupancy logic: (Actual Appts / Total Slots)
      // Assuming 10 slots per day per professional (hardcoded for now)
      const occupancy = Math.min(Math.round(((todayAppts?.length || 0) / 10) * 100), 100);

      setMetrics({
        today: todayTotal,
        month: monthTotal,
        openComandas: openData?.length || 0,
        occupancy: occupancy
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 20-min Alert Banner */}
      {metrics.openComandas > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-error/10 border border-error/30 rounded-[24px] p-6 flex items-center justify-between text-error shadow-2xl shadow-error/10"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-error flex items-center justify-center text-white shadow-lg shadow-error/20 animate-pulse">
              <AlertCircle size={28} />
            </div>
            <div>
              <p className="font-bold text-lg">Atenção: {metrics.openComandas} comandas em aberto</p>
              <p className="text-sm opacity-80 font-medium text-white/60">Existem atendimentos finalizados que ainda não foram baixados no sistema.</p>
            </div>
          </div>
          <button className="bg-error text-white font-bold px-8 py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest">Resolver Agora</button>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <MetricCard 
              label="Faturamento HOJE" 
              value={`R$ ${metrics.today.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
              icon={<DollarSign size={18} className="text-accent" />} 
            />
            <MetricCard 
              label="Faturamento MÊS" 
              value={`R$ ${metrics.month.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
              icon={<TrendingUp size={18} className="text-accent" />} 
            />
            <MetricCard 
              label="Comandas Abertas" 
              value={metrics.openComandas.toString()} 
              negative={metrics.openComandas > 0}
              icon={<Clock size={18} />} 
            />
          </div>

          {/* Monthly Goal */}
          <div className="bg-luxury-black rounded-[32px] p-8 border border-luxury-gold/10 shadow-2xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">Meta Mensal</h3>
                <div className="flex items-center gap-3">
                  {isEditingGoal ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-luxury-gold">R$</span>
                      <input 
                        autoFocus
                        type="number"
                        className="w-32 px-3 py-1 bg-white/5 rounded-lg border-b-2 border-luxury-gold outline-none font-bold text-white"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(Number(e.target.value))}
                        onBlur={updateGoal}
                        onKeyDown={(e) => e.key === 'Enter' && updateGoal()}
                      />
                    </div>
                  ) : (
                    <p 
                      onClick={() => setIsEditingGoal(true)}
                      className="text-xs font-bold text-white/40 uppercase tracking-widest cursor-pointer hover:text-luxury-gold transition-colors flex items-center gap-2 group"
                    >
                      R$ {metrics.month.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {clinic?.monthly_goal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '50.000,00'}
                      <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  )}
                </div>
              </div>
              <span className="text-3xl font-serif font-bold text-luxury-gold">
                {Math.round((metrics.month / (clinic?.monthly_goal || 50000)) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((metrics.month / (clinic?.monthly_goal || 50000)) * 100, 100)}%` }}
                className="h-full bg-luxury-gold rounded-full shadow-[0_0_20px_rgba(198,162,67,0.4)]"
              />
            </div>
          </div>

          {/* Chart */}
          <div className="bg-luxury-black rounded-[32px] p-10 border border-luxury-gold/10 shadow-2xl">
            <h3 className="font-bold text-[10px] uppercase tracking-[0.3em] text-white/40 mb-10">Desempenho Semanal</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '16px', border: '1px solid rgba(198,162,67,0.2)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? '#C6A243' : 'rgba(198,162,67,0.2)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-4 space-y-8">
          <div className="bg-luxury-black rounded-[32px] p-8 border border-luxury-gold/10 shadow-2xl">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-luxury-gold mb-8">Status da Clínica</h4>
            <div className="space-y-6">
              <StatusItem label="Taxa de Ocupação" value={`${metrics.occupancy}%`} color="bg-white/5" />
              <StatusItem label="Retenção de Clientes" value="0%" color="bg-white/5" />
              <StatusItem label="Ticket Médio" value="R$ 0" color="bg-white/5" />
            </div>
          </div>

          <div className="bg-luxury-black rounded-[32px] p-8 border border-luxury-gold/10 shadow-2xl">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-error mb-8">Alertas Críticos</h4>
            <div className="space-y-4">
              {metrics.openComandas > 0 && <AlertItem text="Finalizar comandas pendentes" type="error" />}
              {metrics.openComandas === 0 && <p className="text-[10px] text-white/20 italic font-bold uppercase tracking-widest text-center py-4">Sem alertas no momento</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center group cursor-default">
      <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{label}</span>
      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/10 ${color}`}>{value}</span>
    </div>
  );
}

function AlertItem({ text, type }: { text: string, type: 'error' | 'warning' | 'info' }) {
  const colors = { error: 'text-error bg-error/10', warning: 'text-accent bg-accent/10', info: 'text-slate-500 bg-slate-100' };
  return (
    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${colors[type]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${type === 'error' ? 'bg-error' : type === 'warning' ? 'bg-accent' : 'bg-slate-400'}`} />
      {text}
    </div>
  );
}
