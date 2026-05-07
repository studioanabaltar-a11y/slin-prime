import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Send,
  Calendar,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MessageTarget {
  id: string;
  patient_name: string;
  phone: string;
  appointment_time: string;
  service_name: string;
  status: string;
}

export default function Mensagens() {
  const [targets, setTargets] = useState<MessageTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          status,
          patients (full_name, phone),
          services (name)
        `)
        .gte('start_time', today.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formatted = data?.map((item: any) => ({
        id: item.id,
        patient_name: item.patients?.full_name,
        phone: item.patients?.phone,
        appointment_time: new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        service_name: item.services?.name,
        status: item.status
      })) || [];

      setTargets(formatted);
    } catch (error) {
      console.error('Error fetching message targets:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = (target: MessageTarget, type: 'confirm' | 'reminder') => {
    const message = type === 'confirm' 
      ? `Olá ${target.patient_name}, tudo bem? Aqui é da clínica Slin Prime. Confirmamos seu horário para ${target.service_name} hoje às ${target.appointment_time}?`
      : `Olá ${target.patient_name}, passando para lembrar do seu procedimento de ${target.service_name} hoje às ${target.appointment_time}. Até logo!`;
    
    const cleanPhone = target.phone.replace(/\D/g, '');
    const url = `https://web.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredTargets = targets.filter(t => 
    t.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <MessageSquare className="text-accent" size={32} />
            Central de Confirmações
          </h1>
          <p className="text-slate-500 mt-1">Gerencie a comunicação e reduza faltas na clínica</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-6 rounded-[32px] shadow-sm border border-outline-variant/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-sm font-bold text-slate-600">
            <Calendar size={18} /> Hoje
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-sm font-bold text-slate-600">
            <Filter size={18} /> Filtros
          </button>
        </div>
      </div>

      {/* Lista de Contatos */}
      <div className="bg-white rounded-[40px] border border-outline-variant/10 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/10">
          {loading ? (
            <div className="col-span-full p-20 text-center text-slate-400">Carregando pacientes...</div>
          ) : filteredTargets.length === 0 ? (
            <div className="col-span-full p-20 text-center flex flex-col items-center gap-4 text-slate-400">
              <MessageCircle size={48} className="opacity-10" />
              <p className="font-medium">Nenhum paciente para confirmar hoje.</p>
            </div>
          ) : (
            filteredTargets.map((target) => (
              <div key={target.id} className="p-8 hover:bg-slate-50 transition-all group border-b border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-bold">
                      {target.patient_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{target.patient_name}</p>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <Clock size={12} /> {target.appointment_time} • {target.service_name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                    target.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {target.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => sendWhatsApp(target, 'confirm')}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all"
                  >
                    <CheckCircle2 size={18} /> Confirmar Horário
                  </button>
                  <button 
                    onClick={() => sendWhatsApp(target, 'reminder')}
                    className="w-full py-4 bg-white border border-emerald-100 text-emerald-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
                  >
                    <Send size={18} /> Enviar Lembrete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-slate-900 p-8 rounded-[40px] text-white flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center text-accent">
            <MessageSquare size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Reduza faltas em até 40%</h3>
            <p className="text-slate-400 text-sm">Confirmar agendamentos via WhatsApp é a forma mais eficaz de garantir o faturamento do dia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
