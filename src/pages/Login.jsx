import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sanitizeInput,
  checkRateLimit,
  registerFailedAttempt,
  resetRateLimit,
  generateToken,
} from '../utils/security';

export default function Login() {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleEntrar = (e) => {
    e.preventDefault();
    setErro('');

    // Rate limit — evita spam de tentativas
    const rl = checkRateLimit();
    if (rl.blocked) {
      setErro(`Muitas tentativas. Aguarde ${rl.remaining}s.`);
      return;
    }

    // Sanitização
    const nomeLimpo = sanitizeInput(nome, 50).trim();

    if (nomeLimpo.length < 2) {
      setErro('Digite pelo menos 2 caracteres.');
      registerFailedAttempt();
      return;
    }

    setCarregando(true);

    // Sessão local — só o nome, nenhum dado enviado para fora
    const authData = {
      nome: nomeLimpo,
      token: generateToken(),
      loginAt: Date.now(),
    };
    sessionStorage.setItem('zauth', JSON.stringify(authData));

    // Limpa rastros de demos anteriores
    resetRateLimit();
    localStorage.removeItem('@mock_emails');
    sessionStorage.removeItem('@demo_notified');
    sessionStorage.removeItem('@demo_timer_started');
    sessionStorage.removeItem('@tour_seen');

    setCarregando(false);
    window.dispatchEvent(new CustomEvent('user-logged-in'));
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      <aside className="login-aside">
        <div className="login-aside-brand">Protheus Workspace</div>
        <div className="login-aside-content">
          <h2>Sistemas corporativos<br /><em>para o ecossistema Protheus.</em></h2>
          <p>Acesse o ambiente de demonstração e explore relatórios HTML, gerenciamento de chamados e indicadores operacionais.</p>
        </div>
        <div className="login-aside-footer">Projeto de portfólio · Dados fictícios</div>
      </aside>

      <div className="login-form-side">
        <div className="login-card">
          <div className="login-header">
            <h2>Acessar</h2>
            <p>
              Este é um ambiente de demonstração — não há banco de dados
              nem credenciais reais. Digite apenas seu nome para entrar.
            </p>
          </div>

          <form onSubmit={handleEntrar} autoComplete="off">
            <div className="form-group">
              <label htmlFor="nome">Seu nome</label>
              <input
                id="nome"
                type="text"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
                maxLength={50}
                required
                autoFocus
              />
            </div>

            {erro && (
              <div className="usr-error" style={{ marginBottom: '16px' }} role="alert">
                {erro}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Entrando…' : 'Entrar no workspace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
