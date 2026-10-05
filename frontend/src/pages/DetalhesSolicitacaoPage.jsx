import React from 'react';
import { CheckCircle2, Wrench, Send } from 'lucide-react';
import { INITIAL_CATEGORIES, getCategoryIcon } from '../constants/solicitacoesData';

export default function DetalhesSolicitacaoPage({
  selectedSolicitacao, currentUser, setCurrentTab, respostaTexto, setRespostaTexto,
  novoStatusOperador, setNovoStatusOperador, setShowConfirmModal, isLoading
}) {
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Aberto': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Aberto</span>;
      case 'Em Atendimento': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Em Atendimento</span>;
      case 'Concluído': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Concluído</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => setCurrentTab(currentUser.role === 'OPERADOR' ? 'andamento' : 'historico')}
        className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
      >
        ← Voltar para a listagem
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-bold text-blue-600">#{selectedSolicitacao.id}</span>
              {renderStatusBadge(selectedSolicitacao.status)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedSolicitacao.titulo}</h2>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Data de abertura:</div>
            <div className="font-semibold text-slate-700">{new Date(selectedSolicitacao.dataCriacao).toLocaleString('pt-BR')}</div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Solicitante:</span>
              {/* Ajustado para solicitanteNome (conforme o DTO do Java) */}
              <span className="font-bold text-slate-800 text-sm">{selectedSolicitacao.solicitanteNome || 'Não informado'}</span>
              <span className="text-slate-500 block">{selectedSolicitacao.emailSolicitante}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Categoria:</span>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded bg-white font-semibold border">
                {getCategoryIcon(selectedSolicitacao.categoria)} {selectedSolicitacao.categoria}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição da Demanda:</h3>
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-800 border">{selectedSolicitacao.descricao}</div>
          </div>

          {selectedSolicitacao.respostaOperador && (
            <div className="border-t pt-5">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resposta do Operador:
              </h3>
              <div className="p-4 bg-emerald-50 rounded-lg text-sm text-slate-800 border border-emerald-200">{selectedSolicitacao.respostaOperador}</div>
            </div>
          )}

          {currentUser.role === 'OPERADOR' && selectedSolicitacao.status !== 'Concluído' && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-600" /> Painel de Atendimento
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }} className="space-y-4 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Definir Novo Status:</label>
                  <select value={novoStatusOperador} onChange={(e) => setNovoStatusOperador(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg bg-white">
                    <option value="Aberto">Aberto</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Resposta / Parecer Técnico:</label>
                  <textarea rows="4" value={respostaTexto} onChange={(e) => setRespostaTexto(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg bg-white" placeholder="Descreva a solução..."></textarea>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Atualizar Solicitação
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}