import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  ChevronDown,
  Activity,
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Desempenho() {
  const { user, clinic } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    retention: '0%',
    ticketMedio: 'R$ 0,00',
    newPatients: '0',
    nps: '0.0',
    servicePerformance: [{ name: 'Sem Dados', valor: 0, color: '#E2E8F0' }],
    mixPacientes: [
      { name: 'Novos', value: 0 },
      { name: 'Recorrentes', value: 0 },
    ]
  });

  useEffect(() => {
    if (clinic?.id) {
      fetchStats();
    }
  }, [clinic?.id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // 1. Faturamento por Categoria (Transactions)
      const { data: transData } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('clinic_id', clinic.id)
        .eq('type', 'income');

      const catMap: Record<string, number> = {};
      transData?.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

      const servicePerformance = Object.keys(catMap).map((cat, i) => ({
        name: cat,
        valor: catMap[cat],
        color: ['#C6A243', '#1E293B', '#475569', '#94A3B8'][i % 4]
      }));

      // 2. Novos Pacientes no Mês
      const { count: newCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('clinic_id', clinic.id)
        .gte('created_at', startOfMonth);

      // 3. Ticket Médio (Total Revenue / Finished Appts)
      const { data: appts } = await supabase
        .from('appointments')
        .select('id, patient_id')
        .eq('clinic_id', clinic.id)
        .eq('status', 'finished');

      const totalRevenue = transData?.reduce((acc, t) => acc + t.amount, 0) || 0;
      const avgTicket = appts && appts.length > 0 ? totalRevenue / appts.length : 0;

      // 4. Retenção (Pacientes com > 1 atendimento finalizado)
      const patientApptCount: Record<string, number> = {};
      appts?.forEach(a => {
        patientApptCount[a.patient_id] = (patientApptCount[a.patient_id] || 0) + 1;
      });

      const recurringCount = Object.values(patientApptCount).filter(count => count > 1).length;
      const totalPatients = Object.keys(patientApptCount).length;
      const retentionRate = totalPatients > 0 ? (recurringCount / totalPatients) * 100 : 0;

      setStats({
        retention: `${Math.round(retentionRate)}%`,
        ticketMedio: avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        newPatients: (newCount || 0).toString(),
        nps: '9.2', // Mock NPS for now as we don't have survey logic
        servicePerformance: servicePerformance.length > 0 ? servicePerformance : [{ name: 'Sem Dados', valor: 0, color: '#E2E8F0' }],
        mixPacientes: [
          { name: 'Novos', value: totalPatients - recurringCount },
          { name: 'Recorrentes', value: recurringCount },
        ]
      });

    } catch (error) {
      console.error('Error fetching performance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-accent" size={32} />
            Análise de Desempenho
          </h1>
          <p className="text-slate-500 mt-1">Métricas de crescimento e produtividade da clínica</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchStats} className="px-5 py-3 bg-white border border-outline-variant/20 rounded-2xl font-bold text-sm text-slate-600 flex items-center gap-2">
            Este Mês <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Grid de KPIs Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="Taxa de Retenção" value={stats.retention} trend={loading ? '...' : '+2%'} icon={<Users className="text-accent" />} />
        <KPICard label="Ticket Médio" value={stats.ticketMedio} trend={loading ? '...' : '+R$ 42'} icon={<TrendingUp className="text-emerald-500" />} />
        <KPICard label="Novos Pacientes" value={stats.newPatients} trend={loading ? '...' : '+12'} icon={<Target className="text-slate-900" />} />
        <KPICard label="NPS (Satisfação)" value={stats.nps} trend={loading ? '...' : 'Meta 9.0'} icon={<Award className="text-accent" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico de Faturamento por Serviço */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarIcon size={20} className="text-accent" /> Faturamento por Categoria
            </h2>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.servicePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#475569'}} width={100} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="valor" radius={[0, 10, 10, 0]} barSize={32}>
                  {stats.servicePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mix de Atendimento */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl">
          <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <PieIcon size={20} className="text-accent" /> Mix de Pacientes
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.mixPacientes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#C6A243" />
                  <Cell fill="#1E293B" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs font-bold text-slate-500 uppercase">Novos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-900" />
              <span className="text-xs font-bold text-slate-500 uppercase">Recorrentes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, trend, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-outline-variant/10 shadow-lg hover:shadow-xl transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
  );
}
