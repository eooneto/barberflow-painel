import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // O GPS que faltava
import { User, Lock, ArrowRight, Instagram, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from './services/api'; 

// PARTICULAS (Efeito de fundo vivo)
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary/30 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.8 + 0.5,
            opacity: 0.2
          }}
          animate={{
            y: [null, Math.random() * -150], // Sobem devagar
            opacity: [0.2, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: Math.random() * 15 + 10 + 'px',
            height: Math.random() * 15 + 10 + 'px',
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hook de navegação (O GPS)
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Chamada Real para a API
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      // 2. Se deu certo, a API devolve o token e os dados do usuário
      const { token, user, organization } = response.data;

      // 3. Salvar no navegador (LocalStorage) para não deslogar ao atualizar a página
      localStorage.setItem('barberflow_token', token);
      localStorage.setItem('barberflow_user', JSON.stringify(user));
      localStorage.setItem('barberflow_org', JSON.stringify(organization));

      // 4. Redirecionar
      // alert(`Bem-vindo, ${user.name}!`); // Opcional
      navigate('/dashboard');

    } catch (error: any) {
      console.error(error);
      // Tratamento de Erro Bonito
      if (error.response) {
        // Erro que a API devolveu (ex: Senha incorreta, Empresa inativa)
        alert(`Erro: ${error.response.data.error}`);
      } else {
        // Erro de conexão (Internet ou API fora do ar)
        alert("Erro de conexão com o servidor. Verifique sua internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505] text-white font-sans selection:bg-primary/30">
      
      {/* 1. BACKGROUND DINÂMICO (Breathing Effect) */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d6d4e84?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(150%)'
        }}
      />
      
      {/* Vignette (Escurecer bordas) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/90 to-black/60" />
      
      {/* Partículas Flutuantes */}
      <FloatingParticles />

      {/* Luzes de Fundo (Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />

      {/* 2. CARD PRINCIPAL */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[450px] mx-4 flex flex-col items-center"
      >
        
        {/* STATUS DO SISTEMA (Pulsando) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/60 border border-green-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            
            {/* O ponto verde que pisca forte */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-700"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
            </span>
            
            <span className="text-[12px] font-bold text-green-400 tracking-wide uppercase shadow-green-500 drop-shadow-sm">
              Sistema BarberFlow: Conectado
            </span>
          </div>
        </motion.div>

        {/* O Card de Vidro */}
        <div className="w-full bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          
          {/* Borda Gradient Sutil */}
          <div className="absolute inset-0 rounded-3xl opacity-20 bg-gradient-to-br from-primary/0 via-primary/20 to-primary/0 pointer-events-none" />

          {/* CABEÇALHO DA LOGO (Fundo Branco) */}
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 mx-auto mb-5 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden"
            >
              {/* Brilho passando no fundo branco */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-20 h-20 object-contain relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('fallback-icon');
                }}
              />
              
              <div className="hidden fallback-icon">
                 <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Z"/><circle cx="12" cy="5" r="3"/><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white tracking-tight">Barberflow</h1>
            <p className="text-slate-400 text-sm mt-1">Acesse o Painel Administrativo</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Email Corporativo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@barberflow.space"
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Botão com Brilho e Animação */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary to-red-700 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 mt-4 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'ACESSANDO...' : 'ENTRAR NO SISTEMA'}
                {!isLoading && <ArrowRight size={18} />}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.button>
          </form>

          {/* Links Sociais (Bios + Barberflow) */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
             <p className="text-xs text-slate-500">Suporte Oficial & Redes</p>
             <div className="flex gap-4">
                
                {/* Instagram */}
                <a 
                  href="https://instagram.com/barberflowofc" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-pink-500/50 hover:text-pink-500 transition-all"
                  title="@barberflowofc"
                >
                  <Instagram size={20} />
                </a>

                {/* WhatsApp (Bios) */}
                <a 
                  href="https://wa.me/5513996028599" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-green-500/50 hover:text-green-500 transition-all relative"
                  title="Suporte Bios (WhatsApp)"
                >
                  <MessageCircle size={20} />
                  {/* Status Online */}
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </a>

                {/* Email */}
                <a 
                  href="mailto:contato@barberflow.space" 
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/50 hover:text-blue-500 transition-all"
                  title="contato@barberflow.space"
                >
                  <Mail size={20} />
                </a>

             </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center space-y-1"
        >
           <p className="text-xs text-slate-500">
             &copy; 2026 <strong>Barberflow SaaS</strong>. Todos os direitos reservados.
           </p>
           <p className="text-[10px] text-slate-600 uppercase tracking-widest opacity-70">
             Developed by <span className="text-primary font-bold">Bios</span>
           </p>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default App;