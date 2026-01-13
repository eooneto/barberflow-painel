import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scissors, Clock, DollarSign, Edit2, Trash2, Loader2, Save } from 'lucide-react';
import GlassModal from '../components/GlassModal';
import api from '../services/api'; // Certifique-se que o caminho do seu axios está correto

// Tipagem dos dados (Atualizada para ID string/UUID)
interface Service {
  id?: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

export default function DashboardServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Carregamento da página
  const [isSaving, setIsSaving] = useState(false);  // Carregamento do botão salvar
  const [services, setServices] = useState<Service[]>([]);
  
  // Estado do Formulário
  const [formData, setFormData] = useState<Service>({
    name: '',
    price: 0,
    duration: 30,
    category: 'Cabelo'
  });

  // 1. Carregar Serviços ao abrir a página
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços", error);
      // Opcional: Adicionar um toast de erro aqui
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Abrir Modal para CRIAR
  const handleOpenCreate = () => {
    setFormData({ name: '', price: 0, duration: 30, category: 'Cabelo' }); // Limpa form
    setIsModalOpen(true);
  };

  // 3. Abrir Modal para EDITAR
  const handleOpenEdit = (service: Service) => {
    setFormData(service); // Preenche form com dados do item clicado
    setIsModalOpen(true);
  };

  // 4. Salvar (Create ou Update)
  const handleSave = async () => {
    // Validação básica
    if (!formData.name || formData.price <= 0) {
      alert("Por favor, preencha o nome e um preço válido.");
      return;
    }

    try {
      setIsSaving(true);
      
      if (formData.id) {
        // EDIÇÃO (PUT) - Se tem ID, é edição
        const response = await api.put(`/services/${formData.id}`, formData);
        
        // Atualiza a lista localmente (mais rápido que buscar tudo de novo)
        setServices(prev => prev.map(item => item.id === formData.id ? response.data : item));
      } else {
        // CRIAÇÃO (POST) - Se não tem ID, é novo
        const response = await api.post('/services', formData);
        setServices(prev => [...prev, response.data]);
      }

      setIsModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar serviço. Verifique a conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Excluir
  const handleDelete = async (id: string) => {
    if(!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
        await api.delete(`/services/${id}`);
        // Remove da lista visualmente
        setServices(prev => prev.filter(item => item.id !== id));
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Serviços</h1>
          <p className="text-slate-400">Gerencie o catálogo de serviços da sua barbearia.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Novo Serviço
        </motion.button>
      </div>

      {/* Loading State ou Lista */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
            <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-primary/30 transition-all relative overflow-hidden"
            >
                {/* Efeito Hover Fundo */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-white/5 rounded-xl text-primary border border-white/5">
                        <Scissors size={24} />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleOpenEdit(service)}
                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Editar"
                        >
                            <Edit2 size={16}/>
                        </button>
                        <button 
                            onClick={() => service.id && handleDelete(service.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                            title="Excluir"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 relative z-10">{service.name}</h3>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-6 relative z-10">{service.category}</p>

                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Clock size={16} className="text-primary" />
                        <span className="font-mono text-sm">{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-white font-bold text-lg">
                        <span className="text-xs text-slate-500 font-normal mr-1">R$</span>
                        {Number(service.price).toFixed(2)}
                    </div>
                </div>
            </motion.div>
            ))}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Editar Serviço" : "Adicionar Novo Serviço"}
      >
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Nome do Serviço</label>
            <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Corte Degradê" 
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Categoria</label>
            <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none [&>option]:bg-black"
            >
                <option value="Cabelo">Cabelo</option>
                <option value="Barba">Barba</option>
                <option value="Combo">Combo (Cabelo + Barba)</option>
                <option value="Outros">Outros (Sobrancelha, Produtos)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Preço (R$)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    placeholder="50.00" 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Duração (Min)</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="number" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                    placeholder="45" 
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
             </div>
          </div>

          <button 
            type="button" 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
                <> <Loader2 className="animate-spin" size={20} /> Salvando... </>
            ) : (
                <> <Save size={20} /> Salvar Serviço </>
            )}
          </button>
        </form>
      </GlassModal>

    </div>
  );
}