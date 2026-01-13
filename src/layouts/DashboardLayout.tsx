import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, LayoutDashboard, Calendar, Users, Settings, LogOut, Bell, Menu, X, Search, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente do Item do Menu
const SidebarItem = ({ icon: Icon, label, path, active = false, onClick }: any) => (
  <motion.div 
    onClick={onClick}
    whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all border border-transparent ${
      active 
        ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
        : 'text-slate-400 hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? "animate-pulse" : ""} />
    <span className="font-medium text-sm tracking-wide">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill" 
        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#ef4444]" 
      />
    )}
  </motion.div>
);

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('barberflow_token');
    navigate('/');
  };

  // ATUALIZADO: Adicionei o item "Equipe" aqui
  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", path: "/dashboard" },
    { icon: Calendar, label: "Agenda", path: "/dashboard/agenda" },
    { icon: Users, label: "Clientes", path: "/dashboard/clientes" },
    { icon: Briefcase, label: "Equipe", path: "/dashboard/equipe" }, // <--- NOVO ITEM
    { icon: Scissors, label: "Serviços", path: "/dashboard/servicos" },
    { icon: Settings, label: "Configurações", path: "/dashboard/config" },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-primary/30">
      
      {/* BACKGROUND GLOW (Fixo no fundo) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="w-72 border-r border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl hidden md:flex flex-col z-30 h-screen sticky top-0">
        <div className="p-8 pb-6 flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                 <img src="/logo.png" alt="B" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display='none'}/>
            </motion.div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Barberflow</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Painel Pro</p>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.path} 
                icon={item.icon} 
                label={item.label} 
                path={item.path}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
        </nav>

        <div className="p-4 border-t border-white/5">
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="p-3 rounded-xl flex items-center gap-3 border border-white/5 cursor-pointer"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-xs shadow-lg">NS</div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">Neto Souza</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                    </p>
                </div>
                <LogOut size={18} onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors" />
            </motion.div>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-[#0a0a0a] border-r border-white/10 z-50 md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-2">
                    <img src="/logo.png" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-lg">Barberflow</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-lg text-slate-400"><X size={20}/></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <SidebarItem 
                    key={item.path} 
                    icon={item.icon} 
                    label={item.label} 
                    path={item.path}
                    active={location.pathname === item.path}
                    onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <Menu size={24} />
                </button>
                
                {/* Barra de Busca (Só desktop) */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 focus-within:border-primary/50 transition-colors">
                  <Search size={16} className="text-slate-500" />
                  <input type="text" placeholder="Buscar cliente..." className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-600" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition relative border border-white/5"
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border border-black"></span>
                </motion.button>
            </div>
        </header>

        {/* ÁREA DE SCROLL DO CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth custom-scrollbar">
            <Outlet />
        </div>

      </main>
    </div>
  );
}