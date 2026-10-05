import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Clock, CheckCircle2, BarChart2, LogOut, User, X, AlertCircle, Loader2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from './constants/solicitacoesData';
import LoginPage from './pages/Auth/LoginPage';
import MinhasSolicitacoesPage from './pages/Solicitante/MinhasSolicitacoesPage';
import FormSolicitacaoPage from './pages/Solicitante/FormSolicitacaoPage';
import AndamentoPage from './pages/Operador/AndamentoPage.jsx';
import ConcluidasPage from './pages/Operador/ConcluidasPage';
import Metricas from './pages/Operador/Metricas';
import DetalhesSolicitacaoPage from './pages/DetalhesSolicitacaoPage';
import { apiSolicitacoes } from './services/api'; 

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('psi_user');
    return saved ? JSON.parse(saved) : { name: 'Laura Barros', email: 'laura.barros@bitsolucoes.info', role: 'SOLICITANTE' };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('psi_auth') === 'true');
  
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [currentTab, setCurrentTab] = useState('historico');
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState(null);
  const [editingSolicitacao, setEditingSolicitacao] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', categoria: 'TI', descricao: '' });

  const [filterText, setFilterText] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

  const [respostaTexto, setRespostaTexto] = useState('');
  const [novoStatusOperador, setNovoStatusOperador] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  useEffect(() => { if (currentUser) localStorage.setItem('psi_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('psi_auth', isLoggedIn ? 'true' : 'false'); }, [isLoggedIn]);

  const formatarSolicitacao = (sol) => {
    let statusFormatado = sol.status;
    if (sol.status === 'ABERTO') statusFormatado = 'Aberto';
    if (sol.status === 'EM_ATENDIMENTO') statusFormatado = 'Em Atendimento';
    if (sol.status === 'CONCLUIDO') statusFormatado = 'Concluído';

    return { ...sol, status: statusFormatado };
  };

  const carregarSolicitacoes = async () => {
    if (!isLoggedIn) return;
    try {
      setIsLoading(true);
      const endpoint = currentUser.role === 'OPERADOR' ? '/api/solicitacoes' : '/api/solicitacoes/minhas';
      
      const response = await apiSolicitacoes.get(endpoint);
      
      const dadosFormatados = response.data.map(formatarSolicitacao);
      setSolicitacoes(dadosFormatados);
    } catch (error) {
      console.error("Erro ao buscar solicitações", error);
      showToast('Erro ao carregar os dados do servidor.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, [isLoggedIn, currentUser]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Você saiu do sistema.', 'info');
  };

  const handleSaveSolicitacao = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      showToast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }
    if (editingSolicitacao) { setShowEditConfirmModal(true); return; }

    setIsLoading(true);
    try {
      const response = await apiSolicitacoes.post('/api/solicitacoes', {
        titulo: formData.titulo,
        categoria: formData.categoria,
        descricao: formData.descricao
      });
      
      const novaSolicitacao = formatarSolicitacao(response.data);
      setSolicitacoes(prev => [novaSolicitacao, ...prev]);
      
      showToast(`Solicitação #${novaSolicitacao.id} registrada!`);
      setFormData({ titulo: '', categoria: 'TI', descricao: '' });
      setCurrentTab('historico');
    } catch (error) {
      console.error(error);
      showToast('Erro ao registrar a solicitação.', 'error');
    } finally { 
      setIsLoading(false); 
    }
  };

  const confirmSaveEdit = async () => {
    setIsLoading(true);
    try {
      const response = await apiSolicitacoes.put(`/api/solicitacoes/${editingSolicitacao.id}`, {
        titulo: formData.titulo,
        categoria: formData.categoria,
        descricao: formData.descricao
      });

      const solicAtualizada = formatarSolicitacao(response.data);
      setSolicitacoes(prev => prev.map(item => item.id === editingSolicitacao.id ? solicAtualizada : item));
      
      showToast('Solicitação atualizada!');
      setEditingSolicitacao(null);
      setShowEditConfirmModal(false);
      setCurrentTab('historico');
    } catch (error) {
      console.error(error);
      showToast('Erro ao atualizar a solicitação.', 'error');
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleEditClick = (solicitacao) => {
    setEditingSolicitacao(solicitacao);
    setFormData({ titulo: solicitacao.titulo, categoria: solicitacao.categoria, descricao: solicitacao.descricao });
    setCurrentTab('nova_solicitacao');
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm(`Excluir solicitação #${id}?`)) return;
    
    try {
      await apiSolicitacoes.delete(`/api/solicitacoes/${id}`);
      setSolicitacoes(prev => prev.filter(item => item.id !== id));
      showToast(`Solicitação #${id} excluída.`);
    } catch (error) {
      console.error(error);
      showToast('Erro ao excluir solicitação.', 'error');
    }
  };

  const handleViewDetails = (id) => {
    const sol = solicitacoes.find(s => s.id === id);
    if (sol) {
      setSelectedSolicitacaoId(id);
      setRespostaTexto(sol.respostaOperador || '');
      setNovoStatusOperador(sol.status);
      setCurrentTab('detalhes');
    }
  };

  const handleUpdateAtendimento = async () => {
    setIsLoading(true);
    try {
      let statusBackend = 'ABERTO';
      if (novoStatusOperador === 'Em Atendimento') statusBackend = 'EM_ATENDIMENTO';
      if (novoStatusOperador === 'Concluído') statusBackend = 'CONCLUIDO';

      const response = await apiSolicitacoes.patch(`/api/solicitacoes/${selectedSolicitacaoId}/status`, null, {
        params: { 
          novoStatus: statusBackend,
          resposta: respostaTexto 
        }
      });

      const solicAtualizada = formatarSolicitacao(response.data);
      setSolicitacoes(prev => prev.map(sol => sol.id === selectedSolicitacaoId ? solicAtualizada : sol));
      
      showToast('Status e atendimento atualizados com sucesso!');
      setShowConfirmModal(false);
    } catch (error) {
      console.error(error);
      showToast('Erro ao atualizar atendimento.', 'error');
    } finally { 
      setIsLoading(false); 
    }
  };

  const filteredSolicitacoes = useMemo(() => {
    return solicitacoes.filter(item => {
      const matchText = item.titulo.toLowerCase().includes(filterText.toLowerCase()) || item.id.toString().includes(filterText);
      const matchCat = filterCategoria ? item.categoria === filterCategoria : true;
      const matchStatus = filterStatus ? item.status === filterStatus : true;
      const itemDateOnly = item.dataCriacao ? item.dataCriacao.split('T')[0] : '';
      const matchDataInicio = filterDataInicio ? itemDateOnly >= filterDataInicio : true;
      const matchDataFim = filterDataFim ? itemDateOnly <= filterDataFim : true;

      return matchText && matchCat && matchStatus && matchDataInicio && matchDataFim;
    });
  }, [solicitacoes, filterText, filterCategoria, filterStatus, filterDataInicio, filterDataFim]);

  const andamentoList = useMemo(() => filteredSolicitacoes.filter(s => s.status !== 'Concluído'), [filteredSolicitacoes]);
  const concluidasList = useMemo(() => filteredSolicitacoes.filter(s => s.status === 'Concluído'), [filteredSolicitacoes]);

  const metrics = useMemo(() => {
    const total = solicitacoes.length;
    const abertas = solicitacoes.filter(s => s.status === 'Aberto').length;
    const emAtendimento = solicitacoes.filter(s => s.status === 'Em Atendimento').length;
    const concluidas = solicitacoes.filter(s => s.status === 'Concluído').length;
    const byCategory = INITIAL_CATEGORIES.reduce((acc, cat) => { acc[cat] = solicitacoes.filter(s => s.categoria === cat).length; return acc; }, {});
    return { total, abertas, emAtendimento, concluidas, byCategory };
  }, [solicitacoes]);

  const selectedSolicitacao = useMemo(() => solicitacoes.find(s => s.id === selectedSolicitacaoId) || null, [solicitacoes, selectedSolicitacaoId]);

  if (!isLoggedIn) {
    return <LoginPage currentUser={currentUser} setCurrentUser={setCurrentUser} setIsLoggedIn={setIsLoggedIn} showToast={showToast} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toastMessage.msg}
        </div>
      )}

      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black">PSI</div>
            <span className="font-bold text-lg">Portal de Solicitações Internas</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">{currentUser.name}</span>
            <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="bg-slate-800 border-t border-slate-700 px-4">
          <div className="max-w-7xl mx-auto flex space-x-2 py-2">
            {currentUser.role === 'OPERADOR' ? (
              <>
                <button onClick={() => setCurrentTab('andamento')} className={`px-3 py-1.5 text-sm rounded-lg ${currentTab === 'andamento' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}><Clock className="w-4 h-4 inline mr-1" /> Andamento</button>
                <button onClick={() => setCurrentTab('concluidas')} className={`px-3 py-1.5 text-sm rounded-lg ${currentTab === 'concluidas' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}><CheckCircle2 className="w-4 h-4 inline mr-1" /> Concluídas</button>
                <button onClick={() => setCurrentTab('metricas')} className={`px-3 py-1.5 text-sm rounded-lg ${currentTab === 'metricas' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}><BarChart2 className="w-4 h-4 inline mr-1" /> Métricas</button>
              </>
            ) : (
              <button onClick={() => setCurrentTab('historico')} className="px-3 py-1.5 text-sm text-slate-300 flex items-center gap-1"><FileText className="w-4 h-4 text-blue-400" /> Painel do Solicitante</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentUser.role === 'SOLICITANTE' && currentTab === 'historico' && (
          <MinhasSolicitacoesPage {...{ filteredSolicitacoes, filterText, setFilterText, filterCategoria, setFilterCategoria, filterStatus, setFilterStatus, filterDataInicio, setFilterDataInicio, filterDataFim, setFilterDataFim, todayStr, setCurrentTab, setEditingSolicitacao, setFormData, handleViewDetails, handleEditClick, handleDeleteClick, isLoading }} />
        )}
        {currentUser.role === 'SOLICITANTE' && currentTab === 'nova_solicitacao' && (
          <FormSolicitacaoPage {...{ formData, setFormData, handleSaveSolicitacao, editingSolicitacao, setCurrentTab, isLoading }} />
        )}
        {currentUser.role === 'OPERADOR' && currentTab === 'andamento' && (
          <AndamentoPage {...{ andamentoList, filterText, setFilterText, filterCategoria, setFilterCategoria, filterStatus, setFilterStatus, filterDataInicio, setFilterDataInicio, filterDataFim, setFilterDataFim, todayStr, handleViewDetails, isLoading }} />
        )}
        {currentUser.role === 'OPERADOR' && currentTab === 'concluidas' && (
          <ConcluidasPage {...{ concluidasList, handleViewDetails }} />
        )}
        {currentUser.role === 'OPERADOR' && currentTab === 'metricas' && (
          <Metricas {...{ metrics }} />
        )}
        {currentTab === 'detalhes' && selectedSolicitacao && (
          <DetalhesSolicitacaoPage {...{ selectedSolicitacao, currentUser, setCurrentTab, respostaTexto, setRespostaTexto, novoStatusOperador, setNovoStatusOperador, setShowConfirmModal, isLoading }} />
        )}
      </main>

      {showEditConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500" /> Confirmar Edição</h3>
            <p className="text-sm text-slate-600">Deseja realmente salvar as alterações na solicitação <strong>#{editingSolicitacao?.id}</strong>?</p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button onClick={() => setShowEditConfirmModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
              <button onClick={confirmSaveEdit} disabled={isLoading} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-indigo-600" /> Confirmar Alteração</h3>
            <p className="text-sm text-slate-600">Deseja atualizar para o status <strong>{novoStatusOperador}</strong>?</p>
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
              <button onClick={handleUpdateAtendimento} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}