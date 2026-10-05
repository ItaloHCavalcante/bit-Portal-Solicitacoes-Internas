import React from 'react';
import { Search, ChevronRight, X } from 'lucide-react'; 
import { INITIAL_CATEGORIES, getCategoryIcon } from '../../constants/solicitacoesData';

export default function AndamentoPage({
  andamentoList = [], filterText = '', setFilterText, filterCategoria = '', setFilterCategoria,
  filterStatus = '', setFilterStatus, filterDataInicio = '', setFilterDataInicio, filterDataFim = '',
  setFilterDataFim, todayStr, handleViewDetails, isLoading = false
}) {
  
  const handleClearFilters = () => {
    setFilterText('');
    setFilterCategoria('');
    setFilterStatus('');
    setFilterDataInicio('');
    setFilterDataFim('');
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Aberto': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Aberto</span>;
      case 'Em Atendimento': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Em Atendimento</span>;
      case 'Concluído': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Concluído</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Solicitações em Andamento</h2>
          <p className="text-xs text-slate-500 mt-0.5">Demandas abertas ou em atendimento aguardando resolução.</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-lg border border-blue-200">
          Total em fila: {andamentoList.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Buscar solicitante, título..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            />
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="">Todas as Categorias</option>
              {INITIAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="">Aberto ou Em Atendimento</option>
              <option value="Aberto">Aberto</option>
              <option value="Em Atendimento">Em Atendimento</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Data Início:</label>
              <input
                type="date"
                max={todayStr}
                onKeyDown={(e) => e.preventDefault()}
                value={filterDataInicio}
                onChange={(e) => setFilterDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Data Fim:</label>
              <input
                type="date"
                max={todayStr}
                onKeyDown={(e) => e.preventDefault()}
                value={filterDataFim}
                onChange={(e) => setFilterDataFim(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white cursor-pointer"
              />
            </div>
            
            {/* Botão de Limpar Filtros */}
            <div className="flex justify-end md:justify-start">
              <button 
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Solicitante</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {andamentoList.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-500">Nenhuma solicitação em andamento.</td></tr>
              ) : (
                andamentoList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">#{item.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.solicitanteNome || 'Não informado'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-xs font-medium">
                        {getCategoryIcon(item.categoria)} {item.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{item.titulo}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="px-4 py-3">{renderStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleViewDetails(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                        <span>Atender</span> <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}