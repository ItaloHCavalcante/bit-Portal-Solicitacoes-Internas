import React from 'react';
import { Eye } from 'lucide-react';
import { INITIAL_CATEGORIES, getCategoryIcon } from '../../constants/solicitacoesData';

export default function ConcluidasPage({ concluidasList, handleViewDetails }) {
  
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
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Histórico de Solicitações Concluídas</h2>
        <p className="text-xs text-slate-500 mt-0.5">Registro de todas as solicitações finalizadas.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Solicitante</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {concluidasList.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-500">Nenhuma solicitação concluída.</td></tr>
              ) : (
                concluidasList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">#{item.id}</td>
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
                      <button onClick={() => handleViewDetails(item.id)} className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg">
                        <Eye className="w-4 h-4" />
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