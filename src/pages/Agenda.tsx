import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  MessageCircle,
  CheckCircle,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  Trash2,
  CheckCircle2,
  User,
  UserPlus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Appointment {
  id: string;
  start_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'finished';
  notes: string;
  patient_id: string;
  professional_id: string;
  service_id: string;
  patients: { full_name: string, phone: string };
  professionals: { full_name: string };
  services: { name: string, price: number };
}

interface Patient { id: string; full_name: string; phone: string; email?: string; address?: string; emergency_phone?: string; }
interface Professional { id: string; full_name: string; }
interface Service { id: string; name: string; price: number; duration: number; }

export default function Agenda() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComandaModalOpen, setIsComandaModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Form State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    new_patient_name: '',
    new_patient_phone: '',
    new_patient_email: '',
    new_patient_address: '',
    new_patient_emergency: '',
    professional_id: '',
    service_id: '',
    time: '',
    date: '',
    payment_method: 'pix',
    anamnese: '',
    notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchBaseData();
      fetchAppointments();
    }
  }, [user?.id, selectedDate]);

  const fetchBaseData = async () => {
    try {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', user?.id).single();
      if (!profile?.clinic_id) return;

      const [pats, profs, servs] = await Promise.all([
        supabase.from('patients').select('*').eq('clinic_id', profile.clinic_id),
        supabase.from('professionals').select('*').eq('clinic_id', profile.clinic_id),
        supabase.from('services').select('*').eq('clinic_id', profile.clinic_id)
      ]);

      setPatients(pats.data || []);
      setProfessionals(profs.data || []);
      setServices(servs.data || []);
    } catch (error) {
      console.error('Error fetching base data:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', user?.id).single();
      if (!profile?.clinic_id) {
        setLoading(false);
        return;
      }

      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, start_time, status, notes, patient_id, professional_id, service_id,
          patients (full_name, phone),
          professionals (full_name),
          services (name, price)
        `)
        .eq('clinic_id', profile.clinic_id)
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data as any || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAppointment = async (id: string) => {
    try {
      // 1. Buscar dados do perfil para pegar o clinic_id
      const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', user?.id).single();
      if (!profile?.clinic_id) throw new Error('Clinic not found');

      // 2. Atualizar status do agendamento
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'finished' })
        .eq('id', id);

      if (updateError) throw updateError;

      // 3. Criar transação financeira automática
      const { error: transError } = await supabase.from('transactions').insert([{
        amount: selectedAppointment.services.price,
        description: `Atendimento: ${selectedAppointment.services.name}`,
        type: 'income',
        category: 'Serviços',
        payment_method: 'A definir', // Poderia ser dinâmico vindo de um select no modal
        clinic_id: profile.clinic_id,
        patient_id: selectedAppointment.patient_id,
        appointment_id: id
      }]);

      if (transError) console.error('Erro ao gerar financeiro:', transError);
      
      // Envio de e-mail de notificação (Simulação de log de segurança)
      console.log(`📧 Notificação: Atendimento de ${selectedAppointment?.patients?.full_name} FINALIZADO. Valor R$ ${selectedAppointment?.services?.price} registrado no financeiro.`);
      
      alert('✅ Atendimento finalizado e valor registrado no caixa!');
      setIsComandaModalOpen(false);
      fetchAppointments();
    } catch (error: any) {
      alert('Erro ao finalizar: ' + error.message);
    }
  };

  const handleCancelWithAuth = async () => {
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });

      if (authError) {
        alert('❌ Falha na autenticação: E-mail ou senha incorretos.');
        return;
      }

      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', selectedAppointment.id);

      if (deleteError) throw deleteError;

      // Envio de e-mail de segurança (Simulação de log de segurança)
      console.log(`⚠️ ALERTA DE SEGURANÇA: Agendamento de ${selectedAppointment?.patients?.full_name} CANCELADO por ${authForm.email}. Notificação enviada ao dono da clínica.`);

      alert('🗑️ Agendamento cancelado com sucesso!');
      setIsComandaModalOpen(false);
      setIsCanceling(false);
      setAuthForm({ email: '', password: '' });
      fetchAppointments();
    } catch (error: any) {
      alert('Erro ao cancelar: ' + error.message);
    }
  };

  const handleWhatsApp = (phone: string, name: string, service: string, startTime: string) => {
    const time = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const message = `Olá ${name}, confirmamos seu atendimento de *${service}* hoje às *${time}* na Clinic Slin. Aguardamos você! ✨`;
    const url = `https://web.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', user?.id).single();
      if (!profile?.clinic_id) throw new Error('Clinic not found');
      const clinic_id = profile.clinic_id;

      let finalPatientId = formData.patient_id;

      if (isNewPatient) {
        const { data: newPat, error: patErr } = await supabase.from('patients').insert([{
          full_name: formData.new_patient_name,
          phone: formData.new_patient_phone,
          email: formData.new_patient_email,
          address: formData.new_patient_address,
          emergency_phone: formData.new_patient_emergency,
          clinic_id: clinic_id
        }]).select().single();

        if (patErr) throw patErr;
        finalPatientId = newPat.id;
      }

      const appointmentDate = new Date(`${formData.date}T${formData.time}:00`);
      const serviceDuration = selectedService?.duration || 60;
      const endTime = new Date(appointmentDate.getTime() + serviceDuration * 60000);

      const { error: apptErr } = await supabase.from('appointments').insert([{
        patient_id: finalPatientId,
        professional_id: formData.professional_id,
        service_id: formData.service_id,
        clinic_id: clinic_id,
        start_time: appointmentDate.toISOString(),
        end_time: endTime.toISOString(),
        status: 'scheduled',
        notes: `${formData.notes}\nAnamnese: ${formData.anamnese}`
      }]);

      if (apptErr) throw apptErr;
      
      alert('✅ Agendamento realizado com sucesso!');
      setIsModalOpen(false);
      setFormData({...formData, time: '', date: '', notes: '', anamnese: ''});
      fetchAppointments();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  const getAppointmentForSlot = (time: string) => {
    return appointments.find(a => {
      const apptDate = new Date(a.start_time);
      const apptTime = `${apptDate.getHours().toString().padStart(2, '0')}:${apptDate.getMinutes().toString().padStart(2, '0')}`;
      return apptTime === time;
    });
  };

  const selectedService = services.find(s => s.id === formData.service_id);

  const applyAnamneseTemplate = () => {
    setFormData({
      ...formData,
      anamnese: `HISTÓRICO DE SAÚDE:\n- Alergias:\n- Medicamentos em uso:\n- Doenças preexistentes:\n- Histórico cirúrgico:\n\nHÁBITOS:\n- Atividade física:\n- Alimentação:\n- Sono:\n\nQUEIXA PRINCIPAL:`
    });
  };

  return (
    <div className="flex h-full bg-surface-container-lowest/30 overflow-hidden">
      {/* Calendar Sidebar */}
      <div className="w-80 border-r border-outline-variant/20 bg-white p-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-lg font-bold">Calendário</h2>
          <div className="flex gap-1">
            <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
            <p className="text-xs font-bold text-accent uppercase mb-1">Hoje</p>
            <p className="text-xl font-bold text-on-surface">
              {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </p>
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-outline-variant/20">
          <button 
            onClick={() => {
              setFormData({ ...formData, time: '08:00', date: selectedDate.toISOString().split('T')[0] });
              setIsModalOpen(true);
            }}
            className="w-full bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent/20 flex justify-center items-center gap-2"
          >
            <Plus size={20} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Main Agenda View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 px-10 border-b border-outline-variant/20 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <CalendarIcon className="text-accent" size={24} />
            <h1 className="font-display text-xl font-bold text-on-surface">
              {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-on-surface-variant">{appointments.length} atendimentos</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto space-y-2">
            {timeSlots.map((time) => {
              const appt = getAppointmentForSlot(time);
              return (
                <div key={time} className="flex gap-6 group">
                  <div className="w-16 pt-2 text-sm font-extrabold text-slate-500 group-hover:text-accent transition-colors">
                    {time}
                  </div>
                  <div className="flex-1">
                    {appt ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setIsComandaModalOpen(true);
                        }}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          appt.status === 'finished' 
                          ? 'bg-emerald-50 border-emerald-100 opacity-80' 
                          : 'bg-white border-outline-variant/30 shadow-sm hover:shadow-md hover:border-accent/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${appt.status === 'finished' ? 'bg-emerald-500 text-white' : 'bg-accent/10 text-accent'}`}>
                            {appt.patients.full_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{appt.patients.full_name}</p>
                            <p className="text-xs text-on-surface-variant font-medium">
                              {appt.services.name} • {appt.professionals.full_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {appt.status !== 'finished' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsApp(appt.patients.phone, appt.patients.full_name, appt.services.name, appt.start_time);
                              }}
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Confirmar via WhatsApp"
                            >
                              <MessageCircle size={20} />
                            </button>
                          )}
                          {appt.status === 'finished' ? (
                            <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Finalizado</span>
                          ) : (
                            <ChevronRight className="text-slate-300" />
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <button 
                        onClick={() => {
                          setFormData({ ...formData, time, date: selectedDate.toISOString().split('T')[0] });
                          setIsModalOpen(true);
                        }}
                        className="w-full h-12 border border-dashed border-slate-200 rounded-2xl hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center px-6 text-slate-400 group-hover:text-accent/60 text-xs font-bold uppercase tracking-widest"
                      >
                        <Plus size={14} className="mr-2" /> Disponível
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: COMANDA DE ATENDIMENTO */}
      <AnimatePresence>
        {isComandaModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsComandaModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-outline-variant/10 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Comanda Clínica</h2>
                  <p className="text-slate-500 text-sm mt-1">Gerencie o procedimento</p>
                </div>
                <button onClick={() => { setIsComandaModalOpen(false); setIsCanceling(false); }} className="w-10 h-10 rounded-full hover:bg-white hover:shadow-md flex items-center justify-center text-slate-400"><X /></button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-outline-variant/10">
                  <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-lg">
                    {selectedAppointment.patients?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{selectedAppointment.patients?.full_name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-500">{selectedAppointment.patients?.phone}</p>
                      <button 
                        onClick={() => handleWhatsApp(selectedAppointment.patients?.phone, selectedAppointment.patients?.full_name, selectedAppointment.services?.name, selectedAppointment.start_time)}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Procedimento</p>
                    <p className="font-bold text-slate-900">{selectedAppointment.services?.name}</p>
                  </div>
                </div>

                {isCanceling ? (
                  <div className="p-6 rounded-2xl bg-red-50 border border-red-100 space-y-4">
                    <p className="text-sm font-bold text-red-600 text-center">🔐 Confirmação de Segurança</p>
                    <div className="space-y-3">
                      <input 
                        type="email" 
                        placeholder="E-mail de Confirmação" 
                        autoComplete="off"
                        value={authForm.email} 
                        onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                        className="w-full px-4 py-3 rounded-xl border border-red-200 text-sm focus:ring-2 focus:ring-red-100 outline-none" 
                      />
                      <input 
                        type="password" 
                        placeholder="Senha de Segurança" 
                        autoComplete="new-password"
                        value={authForm.password} 
                        onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                        className="w-full px-4 py-3 rounded-xl border border-red-200 text-sm focus:ring-2 focus:ring-red-100 outline-none" 
                      />
                      <div className="flex gap-2">
                        <button onClick={handleCancelWithAuth} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">CANCELAR</button>
                        <button onClick={() => setIsCanceling(false)} className="px-4 py-3 bg-white text-slate-500 rounded-xl border">VOLTAR</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Banner de Valor em Destaque */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor a Receber</p>
                        <p className="text-3xl font-black text-slate-900">R$ {selectedAppointment.services?.price?.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                        <Banknote size={24} />
                      </div>
                    </div>

                    {selectedAppointment.status !== 'finished' && (
                      <button 
                        onClick={() => handleFinishAppointment(selectedAppointment.id)}
                        className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
                      >
                        <CheckCircle2 size={20} /> FINALIZAR ATENDIMENTO
                      </button>
                    )}
                    <button onClick={() => setIsCanceling(true)} className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 size={18} /> CANCELAR AGENDAMENTO
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NOVO AGENDAMENTO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-10 py-8 border-b border-outline-variant/20 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-bold">Novo Agendamento</h2>
                  <p className="text-sm text-accent font-bold uppercase tracking-widest mt-1">Horário: {formData.time}</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setIsNewPatient(false); }} className="p-2 hover:bg-slate-50 rounded-full"><X size={24} /></button>
              </div>

              <form onSubmit={handleBooking} className="flex-1 overflow-y-auto p-10 space-y-8">
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2"><User className="text-accent" /> Dados do Paciente</h3>
                    <button type="button" onClick={() => setIsNewPatient(!isNewPatient)} className="text-xs font-bold bg-accent/10 text-accent px-4 py-2 rounded-xl">
                      {isNewPatient ? 'Selecionar Existente' : 'Novo Cadastro'}
                    </button>
                  </div>

                  {isNewPatient ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nome" value={formData.new_patient_name} onChange={v => setFormData({...formData, new_patient_name: v})} placeholder="Nome" />
                      <Input label="WhatsApp" value={formData.new_patient_phone} onChange={v => setFormData({...formData, new_patient_phone: v})} placeholder="WhatsApp" />
                      <Input label="E-mail" value={formData.new_patient_email} onChange={v => setFormData({...formData, new_patient_email: v})} placeholder="E-mail" />
                      <Input label="Recado" value={formData.new_patient_emergency} onChange={v => setFormData({...formData, new_patient_emergency: v})} placeholder="Telefone" />
                      <div className="col-span-2"><Input label="Endereço" value={formData.new_patient_address} onChange={v => setFormData({...formData, new_patient_address: v})} placeholder="Endereço completo" /></div>
                    </div>
                  ) : (
                    <Select label="Paciente" value={formData.patient_id} onChange={v => setFormData({...formData, patient_id: v})} options={patients.map(p => ({ value: p.id, label: p.full_name }))} />
                  )}
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="text-accent" /> Procedimento</h3>
                    <Select label="Serviço" value={formData.service_id} onChange={v => setFormData({...formData, service_id: v})} options={services.map(s => ({ value: s.id, label: s.name }))} />
                    <Select label="Profissional" value={formData.professional_id} onChange={v => setFormData({...formData, professional_id: v})} options={professionals.map(p => ({ value: p.id, label: p.full_name }))} />
                  </section>
                  <section className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard className="text-accent" /> Pagamento</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <PaymentBtn icon={<Smartphone />} label="PIX" active={formData.payment_method === 'pix'} onClick={() => setFormData({...formData, payment_method: 'pix'})} />
                      <PaymentBtn icon={<CreditCard />} label="CARTÃO" active={formData.payment_method === 'card'} onClick={() => setFormData({...formData, payment_method: 'card'})} />
                      <PaymentBtn icon={<Banknote />} label="DINHEIRO" active={formData.payment_method === 'cash'} onClick={() => setFormData({...formData, payment_method: 'cash'})} />
                    </div>
                  </section>
                </div>

                <button disabled={formLoading} className="w-full bg-accent text-white py-6 rounded-2xl font-bold shadow-xl hover:bg-accent/90 transition-all text-lg">
                  {formLoading ? 'Salvando...' : 'Confirmar Agendamento'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-500">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent transition-all font-medium">
        <option value="">Selecionar...</option>
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-500">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent transition-all font-medium" />
    </div>
  );
}

function PaymentBtn({ icon, label, active, onClick }: any) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 ${active ? 'bg-accent text-white border-accent shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-accent/30'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
