import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Mail, Lock, Clock, Calendar, Shield, Check } from 'lucide-react';
import GlassModal from '../components/GlassModal';

export default function DashboardTeam() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'services'>('profile');

  // MOCK DE BARBEIROS
  const teamMembers = [
    { id: 1, name: "Neto Souza", role: "Dono / Barbeiro", email: "neto@barber.com", status: "online" },
    { id: 2, name: "João Silva", role: "Barbeiro", email: "joao@barber.com", status: "offline" },
  ];

  // MOCK DE SERVIÇOS DO SISTEMA (Para vincular)
  const systemServices = [
    { id: 1, name: "Corte Degradê", defaultDuration: 45 },
    { id: 2, name: "Barba Terapia", defaultDuration: 30 },
    { id: 3, name: "Sobrancelha", defaultDuration: 15 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
       {/* Header */}
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Minha Equipe</h1>
          <p className="text-slate-400">Gerencie barbeiros, acessos e horários.</p>
        </div>
        <motion.button 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          className="bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Adicionar Membro
        </motion.button>
      </div>

      {/* Lista de Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <motion.div 
            key={member.id}
            whileHover={{ y: -5 }}
            className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-5 cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => setIsModalOpen(true)} // Na prática, abriria editando este ID
          >
             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-800 to-black border border-white/10 flex items-center justify-center text-xl font-bold relative">
                {member.name.substring(0,2).toUpperCase()}
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${member.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`} />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm text-slate-400">{member.role}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                   <Mail size={12} /> {member.email}
                </div>
             </div>
             <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <User size={20} />
             </div>
          </motion.div>
        ))}
      </div>

      {/* --- O GRANDE MODAL DE CONFIGURAÇÃO DO BARBEIRO --- */}
      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Gerenciar Profissional"
      >
        {/* TABS DE NAVEGAÇÃO NO MODAL */}
        <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
          {[
            { id: 'profile', label: 'Perfil & Acesso', icon: Shield },
            { id: 'schedule', label: 'Jornada de Trabalho', icon: Calendar },
            { id: 'services', label: 'Serviços & Tempos', icon: Clock },
          ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
             >
                <tab.icon size={16} /> {tab.label}
             </button>
          ))}
        </div>

        {/* CONTEÚDO DAS TABS */}
        <div className="min-h-[300px]">
          
          {/* TAB 1: PERFIL */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                    <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" placeholder="Ex: João da Silva" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Cargo / Função</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none [&>option]:bg-black">
                       <option>Barbeiro</option>
                       <option>Gerente</option>
                       <option>Recepcionista</option>
                    </select>
                  </div>
               </div>

               <div className="pt-4 border-t border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2"><Lock size={16} className="text-primary"/> Credenciais de Acesso</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">E-mail de Login</label>
                    <input type="email" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Definir Senha</label>
                    <input type="password" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" placeholder="••••••••" />
                  </div>
               </div>
            </motion.div>
          )}

          {/* TAB 2: HORÁRIOS */}
          {activeTab === 'schedule' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
               <p className="text-sm text-slate-400 mb-4">Defina os dias e horários que este profissional atende.</p>
               {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => (
                 <div key={day} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-24 font-bold text-sm text-white">{day}</div>
                    <div className="flex-1 flex items-center gap-2">
                       <input type="time" defaultValue="09:00" className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-primary focus:outline-none" />
                       <span className="text-slate-500">até</span>
                       <input type="time" defaultValue="19:00" className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-primary focus:outline-none" />
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 relative flex items-center"></div>
                    </label>
                 </div>
               ))}
            </motion.div>
          )}

          {/* TAB 3: SERVIÇOS & TEMPOS (O PULO DO GATO) */}
          {activeTab === 'services' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                   <p className="text-xs text-blue-200">
                      💡 Marque os serviços que este barbeiro realiza. Se ele for mais lento ou mais rápido que o padrão, altere o campo "Tempo Real".
                   </p>
                </div>

                <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {systemServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-white/20 transition-all">
                         <div className="flex items-center gap-4">
                            {/* Checkbox Customizado */}
                            <div className="relative flex items-center">
                              <input type="checkbox" id={`srv-${service.id}`} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-500 checked:bg-primary checked:border-primary transition-all" />
                              <Check size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            
                            <div>
                               <label htmlFor={`srv-${service.id}`} className="text-sm font-bold text-white cursor-pointer select-none">{service.name}</label>
                               <p className="text-xs text-slate-500">Padrão: {service.defaultDuration} min</p>
                            </div>
                         </div>

                         {/* Input de Tempo Personalizado */}
                         <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-lg border border-white/5 focus-within:border-primary/50 transition-colors">
                            <Clock size={14} className="text-slate-400" />
                            <input 
                              type="number" 
                              defaultValue={service.defaultDuration} 
                              className="w-12 bg-transparent text-right text-sm text-white focus:outline-none font-mono"
                            />
                            <span className="text-xs text-slate-500 pr-1">min</span>
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>
          )}

        </div>

        {/* Footer do Modal */}
        <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-3">
           <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl hover:bg-white/5 text-slate-300 font-medium transition-colors">Cancelar</button>
           <button className="px-8 py-3 rounded-xl bg-primary hover:bg-red-600 text-white font-bold shadow-[0_4px_20px_rgba(239,68,68,0.2)] transition-all">Salvar Alterações</button>
        </div>

      </GlassModal>
    </div>
  );
}