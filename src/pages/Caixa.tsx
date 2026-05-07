import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Banknote, 
  CreditCard, 
  Smartphone,
  Plus,
  Minus,
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  payment_method: string;
}

export default function Caixa() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    payment_method: 'money'
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', user?.id).single();
      
      const { error } = await supabase.from('transactions').insert([{
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: modalType,
        payment_method: formData.payment_method,
        clinic_id: profile?.clinic_id,
        category: modalType === 'income' ? 'Manual' : 'Despesa'
      }]);

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ amount: '', description: '', payment_method: 'money' });
      fetchTransactions();
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Banknote className="text-accent" size={32} />
            Caixa do Dia
          </h1>
          <p className="text-slate-500 mt-1">Controle de entradas e saídas em tempo real</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setModalType('income'); setIsModalOpen(true); }}
            className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center gap-2 hover:bg-emerald-600 transition-all"
          >
            <Plus size={20} /> Suprimento
          </button>
          <button 
            onClick={() => { setModalType('expense'); setIsModalOpen(true); }}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-200 flex items-center gap-2 hover:bg-red-600 transition-all"
          >
            <Minus size={20} /> Sangria
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResumoCard title="Total Entradas" value={totalIncome} icon={<ArrowUpCircle className="text-emerald-500" />} color="emerald" />
        <ResumoCard title="Total Saídas" value={totalExpense} icon={<ArrowDownCircle className="text-red-500" />} color="red" />
        <ResumoCard title="Saldo em Caixa" value={balance} icon={<Wallet className="text-accent" />} color="accent" isBalance />
      </div>

      {/* Lista de Movimentações */}
      <div className="bg-white rounded-[32px] border border-outline-variant/10 shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-accent" />
            Movimentações de Hoje
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{transactions.length} registros</span>
        </div>
        <div className="divide-y divide-outline-variant/5">
          {loading ? (
             <div className="p-20 text-center text-slate-400">Carregando movimentações...</div>
          ) : transactions.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-400">
              <Banknote size={48} className="opacity-10" />
              <p className="font-medium">Nenhuma movimentação registrada hoje.</p>
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                    {t.payment_method === 'pix' ? <Smartphone size={20} /> : t.payment_method === 'card' ? <CreditCard size={20} /> : <Banknote size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.description}</p>
                    <p className="text-xs text-slate-400 font-medium">{new Date(t.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {t.payment_method.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-display text-lg font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Suprimento/Sangria */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                <h2 className="text-xl font-bold">{modalType === 'income' ? 'Novo Suprimento' : 'Nova Sangria'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddTransaction} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Valor (R$)</label>
                  <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent text-2xl font-bold" placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Descrição</label>
                  <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent font-medium" placeholder="Ex: Pagamento Motoboy" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    <PaymentOption active={formData.payment_method === 'pix'} onClick={() => setFormData({...formData, payment_method: 'pix'})} icon={<Smartphone size={18} />} label="PIX" />
                    <PaymentOption active={formData.payment_method === 'card'} onClick={() => setFormData({...formData, payment_method: 'card'})} icon={<CreditCard size={18} />} label="Cartão" />
                    <PaymentOption active={formData.payment_method === 'money'} onClick={() => setFormData({...formData, payment_method: 'money'})} icon={<Banknote size={18} />} label="Dinheiro" />
                  </div>
                </div>
                <button className={`w-full py-5 rounded-2xl font-bold text-white shadow-lg transition-all ${modalType === 'income' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-red-500 hover:bg-red-600 shadow-red-100'}`}>
                  Confirmar {modalType === 'income' ? 'Suprimento' : 'Sangria'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResumoCard({ title, value, icon, color, isBalance = false }: any) {
  return (
    <div className={`bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm ${isBalance ? 'ring-2 ring-accent/20 bg-accent/5' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900">R$ {value.toFixed(2)}</h3>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, label }: any) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1 ${active ? 'bg-accent text-white border-accent' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-accent/30'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
