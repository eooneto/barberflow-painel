import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import DashboardHome from './pages/DashboardHome.tsx'
import DashboardServices from './pages/DashboardServices.tsx' // <--- IMPORTANTE
import DashboardTeam from './pages/DashboardTeam.tsx'         // <--- IMPORTANTE
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Login) */}
        <Route path="/" element={<App />} />
        
        {/* Rotas Privadas (Painel) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
           {/* Rota Index: O que aparece quando acessa /dashboard direto */}
           <Route index element={<DashboardHome />} />
           
           {/* Novas Rotas */}
           <Route path="servicos" element={<DashboardServices />} />
           <Route path="equipe" element={<DashboardTeam />} />
           
           {/* Rotas Placeholder (para botões que ainda não criamos as páginas) */}
           <Route path="agenda" element={<div className="p-8 text-white">Em desenvolvimento...</div>} />
           <Route path="clientes" element={<div className="p-8 text-white">Em desenvolvimento...</div>} />
           <Route path="config" element={<div className="p-8 text-white">Em desenvolvimento...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)