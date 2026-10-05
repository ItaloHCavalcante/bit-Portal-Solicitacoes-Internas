import axios from 'axios';

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL, // <- Aqui fica o IP do Servidor
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiSolicitacoes = axios.create({
  baseURL: import.meta.env.VITE_SOLICITACAO_API_URL, // <- Aqui fica o IP do Servidor
  headers: {
    'Content-Type': 'application/json',
  }
});

apiSolicitacoes.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@PortalBits:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);