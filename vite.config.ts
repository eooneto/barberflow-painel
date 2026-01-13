import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // Permite acesso externo (0.0.0.0)
    port: 3000, // Garante a porta 3000
    allowedHosts: [
      'barberflow-barberflow-painel.uymawk.easypanel.host', // O domínio do seu EasyPanel
      'localhost'
    ]
  }
})