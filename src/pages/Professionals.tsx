import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  X,
  CheckCircle2,
  Award,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Professional {
  id: string;
  full_name: string;
  specialty: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function Professionals() {
  const { user, profile } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    specialty: '',
    email: '',
    phone: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProfessionals();
    }
  }, [user?.id, profile?.clinic_id]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      
      // Use clinic_id from AuthContext instead of re-fetching
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('clinic_id', user?.user_metadata?.clinic_id || profile?.clinic_id)
        .order('full_name', { ascending: true });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessional = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('clinic_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.clinic_id) throw new Error('Clinic not found');

      const { error } = await supabase.from('professionals').insert([
        { ...formData, clinic_id: profile.clinic_id }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ full_name: '', specialty: '', email: '', phone: '' });
      fetchProfessionals();
    } catch (error) {
      console.error('Error adding professional:', error);
      alert('Erro ao adicionar profissional');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest/30 p-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2 text-primary font-bold text-sm uppercase tracking-widest">
            <Stethoscope size={16} />
            Equipe Médica
          </div>
          <h1 className="font-display text-4xl font-bold text-on-surface">Profissionais</h1>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center gap-3"
        >
          <Plus size={20} />
          Novo Profissional
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">Carregando profissionais...</p>
          </div>
        ) : professionals.length === 0 ? (
          <div className="col-span-full py-20 text-center text-on-surface-variant font-medium">
            Nenhum profissional cadastrado.
          </div>
        ) : (
          professionals.map((prof) => (
            <motion.div 
              key={prof.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] shadow-ambient border border-outline-variant/20 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[24px] bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                  {prof.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <button className="p-2 text-outline hover:text-primary transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3 className="font-display text-xl font-bold text-on-surface mb-1">{prof.full_name}</h3>
              <p className="text-primary font-bold text-sm mb-6 flex items-center gap-2">
                <Award size={14} />
                {prof.specialty || 'Clínico Geral'}
              </p>

              <div className="space-y-3 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Phone size={16} className="text-outline" />
                  {prof.phone || 'Não informado'}
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Mail size={16} className="text-outline" />
                  <span className="truncate">{prof.email || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Clock size={16} className="text-outline" />
                  Agenda: Disponível
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="w-full mt-8 py-3 rounded-xl border border-accent text-accent font-bold text-sm hover:bg-accent hover:text-white transition-all"
              >
                Ver Agenda
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-surface rounded-[32px] shadow-2xl overflow-hidden">
              <div className="px-10 py-8 border-b border-outline-variant/20 flex justify-between items-center bg-surface">
                <h2 className="font-display text-2xl font-bold">Novo Profissional</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-full"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddProfessional} className="p-10 space-y-6">
                <Input label="Nome Completo" value={formData.full_name} onChange={v => setFormData({...formData, full_name: v})} placeholder="Dr. André Luiz" />
                <Input label="Especialidade" value={formData.specialty} onChange={v => setFormData({...formData, specialty: v})} placeholder="Ex: Nutrologia" />
                <Input label="E-mail" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} placeholder="andre@clinica.com" />
                <Input label="Telefone" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} placeholder="(11) 99999-9999" />
                <button disabled={formLoading} className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex justify-center items-center gap-3 disabled:opacity-50 mt-4 shadow-lg">
                  {formLoading ? 'Salvando...' : 'Cadastrar Profissional'}
                  {!formLoading && <CheckCircle2 size={20} />}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-sm font-bold text-on-surface-variant">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all" />
    </div>
  );
}
