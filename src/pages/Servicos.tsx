import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Plus, 
  MoreHorizontal, 
  DollarSign, 
  Clock, 
  X,
  CheckCircle2,
  Tag,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  created_at: string;
}

export default function Servicos() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '60',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchServices();
    }
  }, [user?.id]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Use clinic_id from AuthContext or profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('clinic_id')
        .eq('id', user?.id)
        .single();

      if (!profileData?.clinic_id) {
        setServices([]);
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('clinic_id', profileData.clinic_id)
        .order('name', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('clinic_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.clinic_id) throw new Error('Clinic not found');

      const { error } = await supabase.from('services').insert([
        { 
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          clinic_id: profile.clinic_id 
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ name: '', description: '', price: '', duration: '60' });
      fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Erro ao adicionar serviço');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest/30 p-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2 text-accent font-bold text-sm uppercase tracking-widest">
            <Zap size={16} />
            Catálogo de Serviços
          </div>
          <h1 className="font-display text-4xl font-bold text-on-surface">Serviços</h1>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center gap-3"
        >
          <Plus size={20} />
          Novo Serviço
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">Carregando serviços...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-20 text-center text-on-surface-variant font-medium">
            Nenhum serviço cadastrado.
          </div>
        ) : (
          services.map((service) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] shadow-ambient border border-outline-variant/20 relative group overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[24px] bg-accent/10 flex items-center justify-center text-accent">
                  <Scissors size={28} />
                </div>
                <button className="p-2 text-outline hover:text-accent transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3 className="font-display text-xl font-bold text-on-surface mb-2">{service.name}</h3>
              <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
                {service.description || 'Nenhuma descrição informada.'}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20 mt-auto">
                <div className="flex items-center gap-2 text-accent font-bold">
                  <DollarSign size={16} />
                  <span>R$ {service.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                  <Clock size={16} />
                  <span>{service.duration} min</span>
                </div>
              </div>
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
                <h2 className="font-display text-2xl font-bold">Novo Serviço</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-full"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddService} className="p-10 space-y-6">
                <Input label="Nome do Serviço" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="Ex: Limpeza de Pele Profunda" />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Descrição</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Detalhes do que está incluso..." 
                    className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-accent focus:bg-white outline-none transition-all min-h-[100px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Preço (R$)" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} placeholder="150.00" />
                  <Input label="Duração (min)" type="number" value={formData.duration} onChange={v => setFormData({...formData, duration: v})} placeholder="60" />
                </div>
                <button disabled={formLoading} className="w-full bg-accent text-white py-5 rounded-2xl font-bold flex justify-center items-center gap-3 disabled:opacity-50 mt-4 shadow-lg shadow-accent/20">
                  {formLoading ? 'Salvando...' : 'Cadastrar Serviço'}
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
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-accent focus:bg-white outline-none transition-all" />
    </div>
  );
}
