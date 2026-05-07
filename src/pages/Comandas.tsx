import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  User,
  ArrowUpDown,
  MessageCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Appointment {
  id: string;
  start_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'finished';
  notes: string;
  patients: { full_name: string, phone: string };
  professionals: { full_name: string };
  services: { name: string, price: number };
}

export default function Comandas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'finished' | 'scheduled' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComandas();
  }, []);

  const fetchComandas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, clinic_id, patient_id, start_time, status, notes,
          patients (full_name, phone),
          professionals (full_name),
          services (name, price)
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setAppointments(data as any || []);
    } catch (error) {
      console.error('Error fetching comandas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (phone: string, name: string, service: string, startTime: string) => {
    const time = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const day = new Date(startTime).toLocaleDateString('pt-BR');
    const message = `Olá ${name}, referente ao seu atendimento de *${service}* em ${day} às ${time}. Teria um momento? ✨`;
    const url = `https://web.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredComandas = appointments.filter(appt => {
    const matchesFilter = filter === 'all' || appt.status === filter;
    const matchesSearch = appt.patients?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appt.services?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finished':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12} /> Finalizado</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5"><XCircle size={12} /> Cancelado</span>;
      case 'scheduled':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Agendado</span>;
      default:
        return <span className="px-3 py-1 bg-slate-500/10 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Receipt className="text-accent" size={32} />
            Comandas de Atendimento
          </h1>
          <p className="text-slate-500 mt-1">Gerencie e visualize o histórico de procedimentos da clínica</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-[24px] border border-outline-variant/10 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por paciente ou procedimento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>TODAS</button>
          <button onClick={() => setFilter('finished')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'finished' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>FINALIZADAS</button>
          <button onClick={() => setFilter('scheduled')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'scheduled' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>AGENDADAS</button>
          <button onClick={() => setFilter('cancelled')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'cancelled' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>CANCELADAS</button>
        </div>
      </div>

      {/* Tabela de Comandas */}
      <div className="bg-white rounded-[32px] border border-outline-variant/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-outline-variant/10">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedimento</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data / Hora</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/20"></td>
                  </tr>
                ))
              ) : filteredComandas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Receipt size={48} className="opacity-20" />
                      <p className="font-medium">Nenhuma comanda encontrada</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComandas.map((appt) => (
                  <tr key={appt.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                          {appt.patients?.full_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{appt.patients?.full_name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-500 font-medium">{appt.patients?.phone}</p>
                            <button 
                              onClick={() => handleWhatsApp(appt.patients?.phone, appt.patients?.full_name, appt.services?.name, appt.start_time)}
                              className="text-emerald-500 hover:text-emerald-600 transition-colors"
                              title="Enviar WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-sm">{appt.services?.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{appt.professionals?.full_name}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-accent" />
                        <span className="text-sm font-medium">{new Date(appt.start_time).toLocaleDateString('pt-BR')}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-sm font-medium">{new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-900">R$ {appt.services?.price?.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        {getStatusBadge(appt.status)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {appt.status === 'scheduled' && (
                          <button 
                            onClick={async () => {
                              if (confirm('Deseja finalizar este atendimento e gerar a cobrança?')) {
                                try {
                                  // 1. Atualizar agendamento
                                  const { error: apptError } = await supabase
                                    .from('appointments')
                                    .update({ status: 'finished' })
                                    .eq('id', appt.id);
                                  
                                  if (apptError) throw apptError;

                                  // 2. Criar Transação no Financeiro
                                  const { error: transError } = await supabase
                                    .from('transactions')
                                    .insert({
                                      clinic_id: appt.clinic_id,
                                      amount: appt.services?.price || 0,
                                      description: `Atendimento: ${appt.services?.name} - ${appt.patients?.full_name}`,
                                      type: 'income',
                                      category: 'Procedimentos',
                                      appointment_id: appt.id,
                                      patient_id: appt.patient_id
                                    });

                                  if (transError) throw transError;

                                  alert('Atendimento finalizado e registrado no financeiro!');
                                  fetchComandas();
                                } catch (err: any) {
                                  alert('Erro ao finalizar: ' + err.message);
                                }
                              }
                            }}
                            className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-bold rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                          >
                            Finalizar
                          </button>
                        )}
                        <button className="p-2 hover:bg-accent/10 text-slate-400 hover:text-accent rounded-xl transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
