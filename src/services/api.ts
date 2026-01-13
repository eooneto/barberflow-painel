import axios from 'axios';

// O Vite usa import.meta.env para ler variáveis
// Se não tiver variável definida (local), usa localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptadores (opcional, se já tiver mantenha)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('barberflow_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;