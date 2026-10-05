import React from 'react';
import { PlusCircle, Search, Eye, Edit, Trash2, X } from 'lucide-react'; 
import { INITIAL_CATEGORIES, getCategoryIcon } from '../../constants/solicitacoesData';

export default function MinhasSolicitacoesPage({
  filteredSolicitacoes, filterText, setFilterText, filterCategoria, setFilterCategoria,
  filterStatus, setFilterStatus, filterDataInicio, setFilterDataInicio, filterDataFim,
  setFilterDataFim, todayStr, setCurrentTab, setEditingSolicitacao, setFormData,
  handleViewDetails, handleEditClick, handleDeleteClick, isLoading
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
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Minhas Solicitações</h2>
          <p className="text-xs text-slate-500 mt-0.5">Acompanhe o andamento das suas demandas e solicitações registradas.</p>
        </div>
        <button
          onClick={() => {
            setEditingSolicitacao(null);
            setFormData({ titulo: '', categoria: 'TI', descricao: '' });
            setCurrentTab('nova_solicitacao');
          }}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow transition gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nova Solicitação</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 space-y-3">
          {/* filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por ID ou título..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              />
            </div>
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
              <option value="">Todos os Status</option>
              <option value="Aberto">Aberto</option>
              <option value="Em Atendimento">Em Atendimento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          {/* filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Data Início:</label>
              <input
                type="date"
                max={todayStr}
                value={filterDataInicio}
                onChange={(e) => setFilterDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Data Fim:</label>
              <input
                type="date"
                max={todayStr}
                value={filterDataFim}
                onChange={(e) => setFilterDataFim(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
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
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Título da Solicitação</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {(!filteredSolicitacoes || filteredSolicitacoes.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    {isLoading ? "Carregando solicitações..." : "Nenhuma solicitação encontrada."}
                  </td>
                </tr>
              ) : (
                filteredSolicitacoes.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">#{item.id}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 font-medium text-xs">
                        {getCategoryIcon(item.categoria)} {item.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{item.titulo}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(item.dataCriacao).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{renderStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleViewDetails(item.id)} className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                      {item.status === 'Aberto' && (
                        <>
                          <button onClick={() => handleEditClick(item)} className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteClick(item.id)} className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
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