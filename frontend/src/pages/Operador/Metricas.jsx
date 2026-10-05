import React from 'react';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { INITIAL_CATEGORIES, getCategoryIcon } from '../../constants/solicitacoesData';

export default function Metricas({ metrics }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Métricas das Solicitações</h2>
        <p className="text-xs text-slate-500 mt-0.5">Indicadores operacionais e volume por setor.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Geral</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total}</div>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-xl shadow-sm border border-amber-200">
          <span className="text-xs font-bold text-amber-700 uppercase">Abertas</span>
          <div className="text-2xl font-black text-amber-800 mt-1">{metrics.abertas}</div>
        </div>
        <div className="bg-blue-50/50 p-4 rounded-xl shadow-sm border border-blue-200">
          <span className="text-xs font-bold text-blue-700 uppercase">Em Atendimento</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{metrics.emAtendimento}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl shadow-sm border border-emerald-200">
          <span className="text-xs font-bold text-emerald-700 uppercase">Concluídas</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{metrics.concluidas}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-600" /> Distribuição por Categoria
          </h3>
          <div className="space-y-3 pt-2">
            {INITIAL_CATEGORIES.map(cat => {
              const count = metrics.byCategory[cat] || 0;
              const percent = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">{getCategoryIcon(cat)} {cat}</span>
                    <span className="font-mono">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" /> Progresso de Resolução
          </h3>
          <p className="text-xs text-slate-500 pt-1">
            Taxa de resolução atual: <strong className="text-emerald-600">{metrics.total > 0 ? Math.round((metrics.concluidas / metrics.total) * 100) : 0}%</strong>
          </p>
        </div>
      </div>
    </div>
  );
}