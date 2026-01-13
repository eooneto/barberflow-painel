import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import DashboardHome from './pages/DashboardHome.tsx'
import DashboardServices from './pages/DashboardServices.tsx'
import DashboardTeam from './pages/DashboardTeam.tsx'
import DashboardClients from './pages/DashboardClients.tsx'; // <--- Importando a tela nova

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
           
           {/* Novas Rotas Funcionais */}
           <Route path="servicos" element={<DashboardServices />} />
           <Route path="equipe" element={<DashboardTeam />} />
           <Route path="clientes" element={<DashboardClients />} /> {/* <--- AQUI ESTÁ A ROTA CERTA */}
           
           {/* Rotas Placeholder (Ainda a fazer) */}
           <Route path="agenda" element={<div className="p-8 text-white">Em desenvolvimento...</div>} />
           <Route path="config" element={<div className="p-8 text-white">Em desenvolvimento...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)