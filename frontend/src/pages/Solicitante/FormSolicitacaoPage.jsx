import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { INITIAL_CATEGORIES, getCategoryIcon } from '../../constants/solicitacoesData';
export default function FormSolicitacaoPage({
  formData, setFormData, handleSaveSolicitacao, editingSolicitacao, setCurrentTab, isLoading
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {editingSolicitacao ? `Editar Solicitação #${editingSolicitacao.id}` : 'Formulário de Nova Solicitação'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Preencha os detalhes abaixo para que nossa equipe interna possa lhe atender.</p>
        </div>

        <form onSubmit={handleSaveSolicitacao} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Título da Solicitação *</label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="Ex: Troca de monitor com defeito..."
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Categoria *</label>
            <select
              value={formData.categoria}
              disabled={isLoading}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
            >
              {INITIAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Descrição Detalhada *</label>
            <textarea
              rows="5"
              required
              disabled={isLoading}
              placeholder="Descreva com detalhes a sua necessidade..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setCurrentTab('historico')}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{editingSolicitacao ? 'Salvar Alterações' : 'Enviar Solicitação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}