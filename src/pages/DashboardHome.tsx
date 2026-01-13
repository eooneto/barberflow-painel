import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Scissors, ArrowRight, Clock } from 'lucide-react';

// Componente de Card Animado
const StatCard = ({ title, value, subtext, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
    className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group"
  >
    {/* Glow de fundo */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity ${color}`} />
    
    <div className="flex justify-between items-start mb-4">
       <div>
         <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
         <h3 className="text-3xl font-bold text-white">{value}</h3>
       </div>
       <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${color.replace('bg-', 'text-')}`}>
         <Icon size={22} />
       </div>
    </div>
    
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="text-green-400 flex items-center gap-1 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
        <TrendingUp size={12} /> +12%
      </span>
      {subtext}
    </div>
  </motion.div>
);

const AppointmentItem = ({ name, service, time, status, img }: any) => (
  <motion.div 
    whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
    className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-white/5 transition-all cursor-pointer"
  >
     <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
     <div className="flex-1">
        <h4 className="font-semibold text-sm text-white">{name}</h4>
        <p className="text-xs text-slate-400">{service}</p>
     </div>
     <div className="text-right">
        <div className="flex items-center gap-1 text-xs font-mono text-slate-300 bg-white/5 px-2 py-1 rounded-md mb-1">
            <Clock size={10} /> {time}
        </div>
        <span className={`text-[10px] uppercase font-bold ${status === 'Confirmado' ? 'text-green-500' : 'text-orange-500'}`}>
            {status}
        </span>
     </div>
  </motion.div>
);

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* 1. Header com Saudação */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, Neto 👋</h1>
          <p className="text-slate-400">Aqui está o resumo da sua barbearia hoje.</p>
        </div>
        <button className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-red-900/20 transition-all flex items-center gap-2 text-sm">
           <Calendar size={18} /> Novo Agendamento
        </button>
      </motion.div>

      {/* 2. Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Faturamento" value="R$ 1.250" subtext="vs ontem" icon={TrendingUp} color="bg-green-500" delay={0.1} />
         <StatCard title="Agendamentos" value="24" subtext="4 pendentes" icon={Calendar} color="bg-blue-500" delay={0.2} />
         <StatCard title="Novos Clientes" value="8" subtext="via WhatsApp" icon={Users} color="bg-purple-500" delay={0.3} />
         <StatCard title="Serviços" value="32" subtext="Cortes e Barba" icon={Scissors} color="bg-orange-500" delay={0.4} />
      </div>

      {/* 3. Seções Inferiores (Agenda e Ações) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Lista de Próximos Clientes */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
           className="lg:col-span-2 bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
         >
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Próximos Clientes</h3>
                <button className="text-xs text-primary hover:text-white transition-colors flex items-center gap-1">
                    Ver Agenda Completa <ArrowRight size={12} />
                </button>
            </div>
            
            <div className="space-y-1">
                <AppointmentItem name="Carlos Oliveira" service="Corte Degradê + Barba" time="14:00" status="Confirmado" img="https://i.pravatar.cc/150?u=1" />
                <AppointmentItem name="João Silva" service="Corte Social" time="14:45" status="Pendente" img="https://i.pravatar.cc/150?u=2" />
                <AppointmentItem name="Pedro Santos" service="Barba Terapia" time="15:30" status="Confirmado" img="https://i.pravatar.cc/150?u=3" />
                <AppointmentItem name="Lucas Mendes" service="Pezinho + Sobrancelha" time="16:00" status="Confirmado" img="https://i.pravatar.cc/150?u=4" />
            </div>
         </motion.div>

         {/* Card de Marketing / Status do Bot */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
           className="space-y-6"
         >
             {/* Status do Bot */}
             <div className="bg-gradient-to-br from-green-500/10 to-green-900/10 border border-green-500/20 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-2 right-2 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <h3 className="font-bold text-green-400 mb-1 flex items-center gap-2">Bot WhatsApp Online</h3>
                <p className="text-xs text-green-200/60 mb-4">Respondendo automaticamente seus clientes.</p>
                <div className="flex gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-white">142</p>
                        <p className="text-[10px] text-slate-400 uppercase">Msgs Hoje</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">8</p>
                        <p className="text-[10px] text-slate-400 uppercase">Agendados</p>
                    </div>
                </div>
             </div>

             {/* Banner Promo */}
             <div className="bg-gradient-to-br from-primary to-purple-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group cursor-pointer">
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                 <h3 className="font-bold text-lg relative z-10">Campanha Ativa 🚀</h3>
                 <p className="text-sm text-white/80 mt-1 relative z-10">Disparo de mensagens para inativos.</p>
                 <button className="mt-4 bg-white text-primary text-xs font-bold px-3 py-2 rounded-lg relative z-10">Ver Relatório</button>
             </div>

         </motion.div>

      </div>
    </div>
  );
}