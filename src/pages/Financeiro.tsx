import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar as CalendarIcon,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import MetricCard from '../components/ui/MetricCard';

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
}

export default function Financeiro() {
  const { clinic } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ balance: 0, monthlyIncome: 0, monthlyExpense: 0 });

  useEffect(() => {
    if (clinic?.id) {
      fetchFinancialData();
    }
  }, [clinic?.id]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('clinic_id', clinic?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const trans = data || [];
      setTransactions(trans);

      // Calcular estatísticas
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const income = trans.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc, 0);
      const expense = trans.reduce((acc, t) => t.type === 'expense' ? acc + t.amount : acc, 0);
      
      const mIncome = trans
        .filter(t => {
          const d = new Date(t.created_at);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.type === 'income';
        })
        .reduce((acc, t) => acc + t.amount, 0);

      const mExpense = trans
        .filter(t => {
          const d = new Date(t.created_at);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.type === 'expense';
        })
        .reduce((acc, t) => acc + t.amount, 0);

      setStats({
        balance: income - expense,
        monthlyIncome: mIncome,
        monthlyExpense: mExpense
      });

    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Preparar dados para o gráfico (agrupar por dia nos últimos 15 dias)
  const chartData = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (14 - i));
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const dayIncome = transactions
      .filter(t => new Date(t.created_at).toDateString() === date.toDateString() && t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    return { name: dateStr, valor: dayIncome };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <TrendingUp className="text-accent" size={32} />
            Gestão Financeira
          </h1>
          <p className="text-slate-500 mt-1">Visão estratégica do faturamento e lucratividade</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-white border border-outline-variant/20 rounded-2xl font-bold text-sm text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Saldo Total" value={`R$ ${stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<Wallet size={18} />} />
        <MetricCard label="Receita (Mês)" value={`R$ ${stats.monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<TrendingUp size={18} />} />
        <MetricCard label="Despesas (Mês)" value={`R$ ${stats.monthlyExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<TrendingDown size={18} />} negative={stats.monthlyExpense > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Evolução */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Evolução de Receita</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
              <CalendarIcon size={12} /> ÚLTIMOS 15 DIAS
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A243" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C6A243" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#C6A243', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="valor" stroke="#C6A243" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Atividades */}
        <div className="bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recentes</h2>
            <Filter size={18} className="text-slate-400" />
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-10 text-slate-400">Carregando...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest italic">Nenhuma movimentação</div>
            ) : transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                    {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{t.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(t.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all">
            Ver Extrato Completo
          </button>
        </div>
      </div>
    </div>
  );
}
