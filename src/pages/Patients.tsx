import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar,
  Filter,
  ArrowUpDown,
  UserPlus,
  X,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Patient Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    birth_date: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPatients();
    }
  }, [user?.id]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // Get clinic_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('clinic_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.clinic_id) {
        setPatients([]);
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('full_name', { ascending: true });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Get clinic_id from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('clinic_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.clinic_id) throw new Error('Clinic not found');

      const { error } = await supabase.from('patients').insert([
        { 
          ...formData, 
          clinic_id: profile.clinic_id 
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ full_name: '', email: '', phone: '', birth_date: '' });
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Erro ao adicionar paciente');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest/30">
      {/* Header Section */}
      <div className="px-10 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 text-primary font-bold text-sm uppercase tracking-widest">
              <Users size={16} />
              Gestão de Pessoas
            </div>
            <h1 className="font-display text-4xl font-bold text-on-surface">Pacientes</h1>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3"
          >
            <UserPlus size={20} />
            Novo Paciente
          </motion.button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total de Pacientes" value={patients.length.toString()} trend="0% este mês" />
          <StatCard label="Ativos" value={patients.filter(p => p.status === 'active').length.toString()} color="text-primary" />
          <StatCard label="Novos (7 dias)" value="0" color="text-primary-600" />
          <StatCard label="Aguardando Retorno" value="0" color="text-tertiary" />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-6 rounded-3xl shadow-ambient border border-outline-variant/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <FilterButton icon={<Filter size={18} />} label="Filtros" />
            <FilterButton icon={<ArrowUpDown size={18} />} label="Ordenar" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 px-10 pb-10">
        <div className="bg-white rounded-3xl shadow-ambient border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Paciente</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Contato</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Nascimento</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Última Consulta</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex justify-center flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-on-surface-variant font-medium">Carregando pacientes...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-on-surface-variant font-medium">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {patient.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{patient.full_name}</p>
                          <p className="text-xs text-outline font-medium">ID: #{patient.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone size={14} className="text-slate-400" />
                          {patient.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail size={14} className="text-slate-400" />
                          {patient.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-outline" />
                        {patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        patient.status === 'active' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-outline-variant/20 text-outline'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${patient.status === 'active' ? 'bg-primary' : 'bg-outline'}`} />
                        {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                      12 Mar, 2024
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Patient Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="px-10 py-8 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Novo Paciente</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Ex: Maria Oliveira"
                    className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Telefone</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Data de Nascimento</label>
                    <input 
                      type="date" 
                      value={formData.birth_date}
                      onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                      className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="maria@exemplo.com"
                    className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                  >
                    {formLoading ? 'Salvando...' : 'Cadastrar Paciente'}
                    {!formLoading && <CheckCircle2 size={20} />}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, trend, color = 'text-on-surface' }: { label: string, value: string, trend?: string, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-ambient border border-outline-variant/20">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-baseline gap-3">
        <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
        {trend && <span className="text-[10px] font-bold text-primary/70">{trend}</span>}
      </div>
    </div>
  );
}

function FilterButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-bold text-on-surface-variant">
      {icon}
      {label}
    </button>
  );
}
