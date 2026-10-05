import { solicitacaoApi } from './api';

export const solicitacaoService = {
  async listarTodas(params = {}) {
    const response = await solicitacaoApi.get('/solicitacoes', { params });
    return response.data;
  },

  async buscarPorId(id) {
    const response = await solicitacaoApi.get(`/solicitacoes/${id}`);
    return response.data;
  },

  async criar(dados) {
    const response = await solicitacaoApi.post('/solicitacoes', dados);
    return response.data;
  },

  async atualizar(id, dados) {
    const response = await solicitacaoApi.put(`/solicitacoes/${id}`, dados);
    return response.data;
  },

  async deletar(id) {
    const response = await solicitacaoApi.delete(`/solicitacoes/${id}`);
    return response.data;
  }
};
