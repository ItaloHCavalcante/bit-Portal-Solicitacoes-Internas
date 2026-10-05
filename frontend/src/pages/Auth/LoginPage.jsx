import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiAuth } from '../../services/api';

export default function LoginPage({ setCurrentUser, setIsLoggedIn, showToast }) {
  const [authView, setAuthView] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('ROLE_SOLICITANTE');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiAuth.post('/api/auth/login', { 
        email: loginEmail, 
        senha: loginPassword 
      });
      
      const { token, nome, email, role } = response.data;
      
      localStorage.setItem('@PortalBits:token', token);
      
      let perfilFormatado = role || 'SOLICITANTE';
      if (perfilFormatado === 'ROLE_OPERADOR') perfilFormatado = 'OPERADOR';
      if (perfilFormatado === 'ROLE_SOLICITANTE') perfilFormatado = 'SOLICITANTE';

      setCurrentUser({
        name: nome || 'Usuário',
        email: email || loginEmail,
        role: perfilFormatado
      }); 

      setIsLoggedIn(true);
      showToast('Login realizado com sucesso!'); 
      
    } catch (error) {
      console.error("Erro completo no login:", error);
      console.log("Resposta do servidor:", error.response?.data);

      if (error.response?.data?.erro) {
        alert(error.response.data.erro); 
      } 
      else if (error.response?.data?.message) {
        alert('E-mail ou senha incorretos.');
      }
      else if (error.message === 'Network Error') {
        alert('E-mail ou senha incorretos.');
      } 
      else {
        alert('Erro ao tentar fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiAuth.post('/api/auth/cadastro', {
        nome: regName,
        email: regEmail,
        senha: regPassword,
        role: regRole
      });

      showToast('Conta criada com sucesso! Faça o login para acessar.');
      setRegPassword('');
      setAuthView('login');
    } catch (error) {
      console.error("Erro completo no cadastro:", error);
      console.log("Resposta do servidor:", error.response?.data);

      if (error.response?.data?.erro) {
        alert(error.response.data.erro); 
      } 
      else if (error.response?.data?.message) {
        alert('Este e-mail já está cadastrado ou dados inválidos.');
      }
      else if (error.message === 'Network Error') {
        alert('Este e-mail já está cadastrado.');
      } 
      else {
        alert('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <span className="text-2xl font-black text-blue-300">PSI</span>
          </div>
          <h1 className="text-xl font-bold">Portal de Solicitações Internas</h1>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setAuthView('login')}
            className={`flex-1 py-3 text-sm font-semibold ${authView === 'login' ? 'text-blue-600 border-b-2 border-blue-600 bg-slate-50' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthView('register')}
            className={`flex-1 py-3 text-sm font-semibold ${authView === 'register' ? 'text-blue-600 border-b-2 border-blue-600 bg-slate-50' : 'text-slate-500'}`}
          >
            Cadastre-se
          </button>
        </div>

        <div className="p-6">
          {authView === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="exemplo@bitsolucoes.info"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Senha</label>
                <input 
                  type="password" 
                  required 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar no Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Senha</label>
                <input 
                  type="password" 
                  required 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Tipo de Perfil</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
                >
                  <option value="ROLE_SOLICITANTE">Solicitante</option>
                  <option value="ROLE_OPERADOR">Operador</option>
                </select>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Minha Conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}