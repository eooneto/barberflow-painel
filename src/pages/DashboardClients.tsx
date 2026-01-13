import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, User, Phone, Mail, Edit2, Trash2, MessageCircle, Loader2, Save } from 'lucide-react';
import GlassModal from '../components/GlassModal';
import api from '../services/api';

interface Customer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  total_visits?: number;
}

export default function DashboardClients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Customer>({
    name: '', phone: '', email: '', notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      alert("Nome e Telefone são obrigatórios.");
      return;
    }
    try {
      setIsSaving(true);
      if (formData.id) {
        const response = await api.put(`/customers/${formData.id}`, formData);
        setCustomers(prev => prev.map(c => c.id === formData.id ? response.data : c));
      } else {
        const response = await api.post('/customers', formData);
        setCustomers(prev => [...prev, response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Excluir este cliente?")) return;
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  // Filtro de busca
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400">Gerencie seus leads e histórico de fidelidade.</p>
        </div>
        <motion.button 
          onClick={() => { setFormData({name:'', phone:'', email:'', notes:''}); setIsModalOpen(true); }}
          whileHover={{ scale: 1.05 }}
          className="bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Novo Cliente
        </motion.button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3">
        <Search className="text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou telefone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600"
        />
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" size={40}/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-primary/30 transition-all group relative overflow-hidden"
            >
               {/* Ações Rápidas */}
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setFormData(customer); setIsModalOpen(true); }} className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Edit2 size={14}/></button>
                  <button onClick={() => customer.id && handleDelete(customer.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"><Trash2 size={14}/></button>
               </div>

               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center font-bold text-lg">
                    {customer.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{customer.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                       <MessageCircle size={10} className="text-green-500" /> Lead Ativo
                    </p>
                  </div>
               </div>

               <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                     <Phone size={14} className="text-primary"/> 
                     {customer.phone}
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                       <Mail size={14} className="text-primary"/> 
                       {customer.email}
                    </div>
                  )}
               </div>

               {/* Botão WhatsApp */}
               <a 
                 href={`https://wa.me/${customer.phone.replace(/\D/g,'')}`}
                 target="_blank"
                 className="mt-4 w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/50 py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm"
               >
                 <MessageCircle size={16} /> Chamar no WhatsApp
               </a>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dados do Cliente">
         <div className="space-y-4">
            <div className="space-y-1">
               <label className="text-xs text-slate-400 uppercase font-bold">Nome Completo</label>
               <input 
                 value={formData.name} 
                 onChange={e => setFormData({...formData, name: e.target.value})}
                 className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
               />
            </div>
            <div className="space-y-1">
               <label className="text-xs text-slate-400 uppercase font-bold">WhatsApp (com DDD)</label>
               <input 
                 value={formData.phone} 
                 onChange={e => setFormData({...formData, phone: e.target.value})}
                 placeholder="5511999999999"
                 className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
               />
            </div>
            <div className="space-y-1">
               <label className="text-xs text-slate-400 uppercase font-bold">Email (Opcional)</label>
               <input 
                 value={formData.email} 
                 onChange={e => setFormData({...formData, email: e.target.value})}
                 className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
               />
            </div>
            
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl mt-4 flex justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin"/> : <Save size={20} />} Salvar Cliente
            </button>
         </div>
      </GlassModal>
    </div>
  );
}