import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Mail, Lock, Clock, Calendar, Shield, Check, Save, Loader2 } from 'lucide-react';
import GlassModal from '../components/GlassModal';
import api from '../services/api';

// Tipos
interface Professional {
  id?: string;
  name: string;
  phone: string;
  role?: string;
}

interface ServiceLink {
  id: string;
  name: string;
  default_duration: number;
  custom_duration?: number;
  enabled: boolean;
}

export default function DashboardTeam() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'services'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Dados
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [currentPro, setCurrentPro] = useState<Professional>({ name: '', phone: '' });
  
  // Estados do Modal
  const [schedule, setSchedule] = useState<any[]>([]);
  const [proServices, setProServices] = useState<ServiceLink[]>([]);

  // 1. Carregar Lista Inicial
  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get('/professionals');
      setProfessionals(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipe", error);
    }
  };

  // 2. Abrir Modal (Novo ou Editar)
  const handleOpenModal = async (pro?: Professional) => {
    setIsModalOpen(true);
    setActiveTab('profile');
    
    if (pro) {
        // Editando
        setCurrentPro(pro);
        if (pro.id) {
            await fetchProDetails(pro.id);
        }
    } else {
        // Novo
        setCurrentPro({ name: '', phone: '' });
        // Resetar estados auxiliares se necessário
        setProServices([]);
        setSchedule([]); 
    }
  };

  const fetchProDetails = async (id: string) => {
      setIsLoading(true);
      try {
          // Carrega Horários
          const resSchedule = await api.get(`/professionals/${id}/schedule`);
          // Se não tiver horário salvo, cria padrão
          const dbSchedule = resSchedule.data;
          const fullSchedule = [1,2,3,4,5,6,0].map(day => {
              const savedDay = dbSchedule.find((d: any) => d.day_of_week === day);
              return savedDay ? { ...savedDay, active: true } : { 
                  day_of_week: day, 
                  start_time: '09:00', 
                  end_time: '18:00', 
                  active: day !== 0 // Domingo folga por padrão
              };
          });
          setSchedule(fullSchedule);

          // Carrega Serviços
          const resServices = await api.get(`/professionals/${id}/services`);
          setProServices(resServices.data);

      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  };

  // 3. Salvar Tudo
  const handleSave = async () => {
      setIsSaving(true);
      try {
          // 1. Salva Perfil
          const resPro = await api.post('/professionals', currentPro);
          const newId = resPro.data.id;

          // 2. Se for edição ou criação, salva os detalhes vinculados
          if (newId) {
              // Salva Horários
              await api.post(`/professionals/${newId}/schedule`, { schedule });
              
              // Salva Serviços Vinculados
              await api.post(`/professionals/${newId}/services`, { services: proServices });
          }

          alert("Salvo com sucesso!");
          setIsModalOpen(false);
          fetchTeam();
      } catch (error) {
          alert("Erro ao salvar");
      } finally {
          setIsSaving(false);
      }
  };

  // Helpers para Renderização
  const getDayName = (num: number) => ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][num];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Minha Equipe</h1>
          <p className="text-slate-400">Gerencie barbeiros que aparecerão no Bot.</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          className="bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Adicionar Membro
        </motion.button>
      </div>

      {/* Lista de Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professionals.map((member) => (
          <motion.div 
            key={member.id}
            whileHover={{ y: -5 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-5 cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => handleOpenModal(member)}
          >
             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-800 to-black border border-white/10 flex items-center justify-center text-xl font-bold relative text-white">
                {member.name.substring(0,2).toUpperCase()}
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a] bg-green-500`} />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm text-slate-400">Barbeiro</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                   <Mail size={12} /> {member.phone}
                </div>
             </div>
             <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <User size={20} />
             </div>
          </motion.div>
        ))}
      </div>

      {/* --- MODAL --- */}
      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentPro.id ? "Editar Profissional" : "Novo Profissional"}
      >
        {/* TABS */}
        <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
          {[
            { id: 'profile', label: 'Perfil', icon: User },
            { id: 'schedule', label: 'Jornada', icon: Calendar },
            { id: 'services', label: 'Serviços', icon: Clock },
          ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                // Desabilita tabs se for usuario novo (tem que salvar perfil primeiro para gerar ID)
                disabled={!currentPro.id && tab.id !== 'profile'}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
             >
                <tab.icon size={16} /> {tab.label}
             </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          
          {/* TAB 1: PERFIL */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                 <input 
                    type="text" 
                    value={currentPro.name}
                    onChange={e => setCurrentPro({...currentPro, name: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" 
                    placeholder="Ex: João da Silva" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase">Telefone (WhatsApp)</label>
                 <input 
                    type="text" 
                    value={currentPro.phone}
                    onChange={e => setCurrentPro({...currentPro, phone: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" 
                    placeholder="5511999999999" 
                 />
               </div>
               {!currentPro.id && <p className="text-xs text-yellow-500 mt-4">* Salve o perfil primeiro para configurar horários e serviços.</p>}
            </motion.div>
          )}

          {/* TAB 2: HORÁRIOS */}
          {activeTab === 'schedule' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
               {isLoading ? <div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-primary"/></div> : 
               schedule.map((day, index) => (
                 <div key={day.day_of_week} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${day.active ? 'bg-white/5 border-white/10' : 'bg-black/20 border-transparent opacity-50'}`}>
                    <div className="w-24 font-bold text-sm text-white">{getDayName(day.day_of_week)}</div>
                    
                    {day.active && (
                        <div className="flex-1 flex items-center gap-2">
                            <input 
                                type="time" 
                                value={day.start_time.slice(0,5)} 
                                onChange={e => {
                                    const newSched = [...schedule];
                                    newSched[index].start_time = e.target.value;
                                    setSchedule(newSched);
                                }}
                                className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-primary outline-none" 
                            />
                            <span className="text-slate-500">até</span>
                            <input 
                                type="time" 
                                value={day.end_time.slice(0,5)} 
                                onChange={e => {
                                    const newSched = [...schedule];
                                    newSched[index].end_time = e.target.value;
                                    setSchedule(newSched);
                                }}
                                className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-primary outline-none" 
                            />
                        </div>
                    )}
                    
                    <label className="flex items-center cursor-pointer ml-auto">
                      <input 
                        type="checkbox" 
                        checked={day.active} 
                        onChange={e => {
                            const newSched = [...schedule];
                            newSched[index].active = e.target.checked;
                            setSchedule(newSched);
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 relative flex items-center"></div>
                    </label>
                 </div>
               ))}
            </motion.div>
          )}

          {/* TAB 3: SERVIÇOS */}
          {activeTab === 'services' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                   <p className="text-xs text-blue-200">
                      💡 Marque os serviços que este barbeiro realiza. Personalize o tempo se necessário.
                   </p>
                </div>

                <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {isLoading ? <div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-primary"/></div> :
                   proServices.map((service, index) => (
                      <div key={service.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${service.enabled ? 'bg-[#050505] border-primary/30' : 'bg-transparent border-white/5 opacity-60'}`}>
                         <div className="flex items-center gap-4">
                            <div className="relative flex items-center">
                              <input 
                                type="checkbox" 
                                checked={service.enabled}
                                onChange={e => {
                                    const newServices = [...proServices];
                                    newServices[index].enabled = e.target.checked;
                                    setProServices(newServices);
                                }}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-500 checked:bg-primary checked:border-primary transition-all" 
                              />
                              <Check size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white select-none">{service.name}</p>
                               <p className="text-xs text-slate-500">Padrão: {service.default_duration} min</p>
                            </div>
                         </div>

                         {service.enabled && (
                             <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-lg border border-white/5 focus-within:border-primary/50 transition-colors">
                                <Clock size={14} className="text-slate-400" />
                                <input 
                                  type="number" 
                                  value={service.custom_duration || service.default_duration}
                                  onChange={e => {
                                      const newServices = [...proServices];
                                      newServices[index].custom_duration = parseInt(e.target.value);
                                      setProServices(newServices);
                                  }}
                                  className="w-12 bg-transparent text-right text-sm text-white focus:outline-none font-mono"
                                />
                                <span className="text-xs text-slate-500 pr-1">min</span>
                             </div>
                         )}
                      </div>
                   ))}
                </div>
             </motion.div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-3">
           <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl hover:bg-white/5 text-slate-300 font-medium transition-colors">Cancelar</button>
           <button 
             onClick={handleSave} 
             disabled={isSaving}
             className="px-8 py-3 rounded-xl bg-primary hover:bg-red-600 text-white font-bold shadow-[0_4px_20px_rgba(239,68,68,0.2)] transition-all flex items-center gap-2 disabled:opacity-50"
           >
             {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
             Salvar Alterações
           </button>
        </div>

      </GlassModal>
    </div>
  );
}