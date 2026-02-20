import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, RefreshCcw, LogOut, Smartphone } from 'lucide-react';
import api from '../services/api';

type ConnState = 'open' | 'close' | 'connecting' | string;

export default function DashboardConfig() {
  const [phone, setPhone] = useState('55');
  const [loading, setLoading] = useState(false);

  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [state, setState] = useState<ConnState | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    if (!state) return 'desconhecido';
    if (state === 'open') return 'conectado';
    if (state === 'connecting') return 'conectando…';
    if (state === 'close') return 'desconectado';
    return state;
  }, [state]);

  async function fetchStatus() {
    setErrorMsg(null);
    try {
      const { data } = await api.get('/integrations/whatsapp/status');
      setInstanceName(data.instanceName || data?.instance?.instanceName || null);
      setState(data?.instance?.state || null);
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || 'Não foi possível buscar o status do WhatsApp.');
      setInstanceName(null);
      setState(null);
    }
  }

  async function connectWhatsApp() {
    setLoading(true);
    setErrorMsg(null);
    setPairingCode(null);

    try {
      const { data } = await api.post('/integrations/whatsapp/connect', { number: phone });
      setInstanceName(data.instanceName || null);
      setPairingCode(data.pairingCode || null);
      await fetchStatus();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || 'Falha ao conectar WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  async function logoutWhatsApp() {
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.delete('/integrations/whatsapp/logout');
      setPairingCode(null);
      await fetchStatus();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || 'Falha ao desconectar WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-slate-400">Conecte o WhatsApp da barbearia para habilitar o bot (n8n vem depois).</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
              <Smartphone className="text-green-400" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">WhatsApp</h2>
              <p className="text-xs text-slate-400">
                Instância: <span className="text-slate-200">{instanceName || '—'}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">Status</p>
            <p className={`text-sm font-semibold ${state === 'open' ? 'text-green-400' : 'text-yellow-300'}`}>
              {statusLabel}
            </p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Número (com DDI) — ex: 5511999999999
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="55..."
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectWhatsApp}
                disabled={loading}
                className="bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-center gap-2 transition-all disabled:opacity-60"
              >
                <Link2 size={16} />
                {loading ? 'Conectando…' : 'Conectar'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchStatus}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-60"
              >
                <RefreshCcw size={16} />
                Atualizar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logoutWhatsApp}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-200 font-bold flex items-center gap-2 transition-all disabled:opacity-60"
              >
                <LogOut size={16} />
                Desconectar
              </motion.button>
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
            <p className="text-sm font-semibold mb-2">Pareamento</p>

            {pairingCode ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400">Código</p>
                  <p className="text-2xl font-bold tracking-widest">{pairingCode}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  No WhatsApp: <b>Aparelhos conectados</b> → <b>Conectar um aparelho</b> → <b>Vincular com código</b>.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Clique em <b>Conectar</b> para gerar o <b>pairingCode</b>.
              </p>
            )}

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}