import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle, XCircle, Plus, ChevronLeft, ChevronRight, Loader2, Filter } from 'lucide-react';
import GlassModal from '../components/GlassModal';
import api from '../services/api';

// Tipos
interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  professional_name?: string; // Novo
  date_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: string;
}

interface Professional {
    id: string;
    name: string;
}

export default function DashboardAgenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Listas para o Select do Modal
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]); // Novo

  // Formulário
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    professional_id: '', // Novo
    time: '09:00'
  });

  // Carregar dados ao iniciar ou mudar a data
  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  useEffect(() => {
    if (isModalOpen) {
        // Carrega dados auxiliares ao abrir modal
        api.get('/customers').then(res => setCustomers(res.data));
        api.get('/services').then(res => setServices(res.data));
        api.get('/professionals').then(res => setProfessionals(res.data));
    }
  }, [isModalOpen]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      // Agora a API deve retornar appointments com o nome do barbeiro também
      const response = await api.get(`/appointments?date=${dateStr}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar agenda", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if(!formData.customer_id || !formData.service_id || !formData.professional_id) {
        return alert("Selecione Cliente, Serviço e Profissional");
    }
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const fullDateTime = `${dateStr} ${formData.time}:00`;

    try {
        await api.post('/appointments', {
            customer_id: formData.customer_id,
            service_id: formData.service_id,
            professional_id: formData.professional_id, // Enviando Barbeiro
            date_time: fullDateTime
        });
        setIsModalOpen(false);
        fetchAppointments(); 
    } catch (error) {
        alert("Erro ao agendar");
    }
  };

  const changeStatus = async (id: string, status: string) => {
      try {
          await api.patch(`/appointments/${id}/status`, { status });
          fetchAppointments();
      } catch (error) { alert("Erro ao atualizar"); }
  };

  // Funções de Data
  const handlePrevDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(newDate);
  };
  const handleNextDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(newDate);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0a0a0a]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="text-primary" /> Agenda
            </h1>
            <p className="text-slate-400 text-sm">Gerencie os cortes do dia.</p>
        </div>

        {/* Navegação Data */}
        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
            <button onClick={handlePrevDay} className="p-2 hover:text-primary transition-colors text-white"><ChevronLeft/></button>
            <span className="text-white font-mono font-bold w-32 text-center">
                {selectedDate.toLocaleDateString('pt-BR')}
            </span>
            <button onClick={handleNextDay} className="p-2 hover:text-primary transition-colors text-white"><ChevronRight/></button>
        </div>

        <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
            <Plus size={20}/> Novo Agendamento
        </motion.button>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-3">
        {isLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" size={40}/></div>
        ) : appointments.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p>Nenhum agendamento para este dia.</p>
            </div>
        ) : (
            <AnimatePresence>
                {appointments.map((apt, i) => (
                    <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative flex items-center gap-4 p-5 rounded-xl border ${
                            apt.status === 'cancelled' ? 'bg-red-900/10 border-red-900/30 opacity-60' : 
                            apt.status === 'completed' ? 'bg-green-900/10 border-green-900/30' : 
                            'bg-[#1a1a1a] border-white/10 hover:border-primary/40'
                        } transition-all group`}
                    >
                        {/* Horário */}
                        <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-white/10 pr-4">
                            <Clock size={16} className="text-slate-400 mb-1"/>
                            <span className="text-xl font-bold text-white">
                                {new Date(apt.date_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>

                        {/* Detalhes */}
                        <div className="flex-1 pl-2">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {apt.customer_name}
                                {apt.status === 'completed' && <CheckCircle size={14} className="text-green-500"/>}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1">
                                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-primary font-bold">
                                    <Scissors size={12}/> {apt.service_name}
                                </span>
                                {apt.professional_name && (
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-slate-300">
                                        <User size={12}/> {apt.professional_name}
                                    </span>
                                )}
                                {apt.price && <span className="text-green-400 font-mono ml-auto md:ml-0">R$ {apt.price}</span>}
                            </div>
                        </div>

                        {/* Ações */}
                        {apt.status !== 'cancelled' && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {apt.status !== 'completed' && (
                                    <button 
                                        onClick={() => changeStatus(apt.id, 'completed')}
                                        title="Concluir"
                                        className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500 hover:text-white"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => { if(confirm("Cancelar?")) changeStatus(apt.id, 'cancelled'); }}
                                    title="Cancelar"
                                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        )}
      </div>

      {/* Modal Novo */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Agendamento">
         <div className="space-y-4">
            
            {/* Profissional (NOVO CAMPO) */}
            <div className="space-y-1">
               <label className="text-xs text-slate-400 font-bold uppercase">Profissional</label>
               <select 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary"
                  value={formData.professional_id}
                  onChange={e => setFormData({...formData, professional_id: e.target.value})}
               >
                   <option value="">Selecione o barbeiro...</option>
                   {professionals.map(p => (
                       <option key={p.id} value={p.id}>{p.name}</option>
                   ))}
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="space-y-1">
                   <label className="text-xs text-slate-400 font-bold uppercase">Cliente</label>
                   <select 
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary"
                      value={formData.customer_id}
                      onChange={e => setFormData({...formData, customer_id: e.target.value})}
                   >
                       <option value="">Cliente...</option>
                       {customers.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                   </select>
                </div>

                {/* Serviço */}
                <div className="space-y-1">
                   <label className="text-xs text-slate-400 font-bold uppercase">Serviço</label>
                   <select 
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary"
                      value={formData.service_id}
                      onChange={e => setFormData({...formData, service_id: e.target.value})}
                   >
                       <option value="">Serviço...</option>
                       {services.map(s => (
                           <option key={s.id} value={s.id}>{s.name}</option>
                       ))}
                   </select>
                </div>
            </div>

            {/* Horário */}
            <div className="space-y-1">
               <label className="text-xs text-slate-400 font-bold uppercase">Horário</label>
               <input 
                  type="time"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
               />
               <p className="text-xs text-slate-500 text-right">Data: {selectedDate.toLocaleDateString()}</p>
            </div>

            <button 
                onClick={handleSave}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl mt-2 shadow-lg"
            >
                Confirmar Agendamento
            </button>
         </div>
      </GlassModal>

    </div>
  );
}