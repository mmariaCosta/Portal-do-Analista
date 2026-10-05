import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sanitizeInput,
  isValidEmail,
  checkRateLimit,
  registerFailedAttempt,
  resetRateLimit,
  generateToken,
} from '../utils/security';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [filial, setFilial] = useState('01');
  const [modulo, setModulo] = useState('Faturamento');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    // 1. Rate limit — bloqueia após 5 tentativas
    const rl = checkRateLimit();
    if (rl.blocked) {
      setErro(`Muitas tentativas. Aguarde ${rl.remaining}s.`);
      return;
    }

    // 2. Sanitização de input
    const userSanitized = sanitizeInput(user, 50);
    const passSanitized = sanitizeInput(pass, 128);

    // 3. Validações
    if (userSanitized.length < 3) {
      setErro('Usuário deve ter ao menos 3 caracteres.');
      registerFailedAttempt();
      return;
    }
    if (passSanitized.length < 8) {
      setErro('Senha deve ter ao menos 8 caracteres.');
      registerFailedAttempt();
      return;
    }

    setCarregando(true);

    // Simula latência de rede
    setTimeout(() => {
      // 4. NÃO armazenar a senha. Guarda apenas um token opaco.
      const authData = {
        user: userSanitized,
        filial,
        modulo,
        token: generateToken(),   // substitui o "mock-token-123"
        loginAt: Date.now(),
      };
      sessionStorage.setItem('zauth', JSON.stringify(authData));

      // 5. Limpar rastros de tentativa
      resetRateLimit();
      localStorage.removeItem('@mock_emails');
      sessionStorage.removeItem('@demo_notified');
      sessionStorage.removeItem('@demo_timer_started');
      sessionStorage.removeItem('@tour_seen');

      setCarregando(false);
      window.dispatchEvent(new CustomEvent('user-logged-in'));
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="login-wrapper">
      <aside className="login-aside">
        <div className="login-aside-brand">Portal do Analista</div>
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
            <p>Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="form-group">
              <label htmlFor="user">Usuário</label>
              <input
                id="user"
                type="text"
                placeholder="Digite seu usuário"
                value={user}
                onChange={e => setUser(e.target.value)}
                autoComplete="username"
                maxLength={50}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pass">Senha</label>
              <input
                id="pass"
                type="password"
                placeholder="Digite sua senha"
                value={pass}
                onChange={e => setPass(e.target.value)}
                autoComplete="current-password"
                maxLength={128}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="filial">Filial</label>
                <select id="filial" value={filial} onChange={e => setFilial(e.target.value)}>
                  <option value="01">01 - Matriz</option>
                  <option value="02">02 - Filial SP</option>
                  <option value="99">99 - Treinamento</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="modulo">Módulo</label>
                <select id="modulo" value={modulo} onChange={e => setModulo(e.target.value)}>
                  <option value="Faturamento">Faturamento</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Estoque">Estoque</option>
                </select>
              </div>
            </div>

            {erro && (
              <div className="usr-error" style={{ marginBottom: '16px' }} role="alert">
                {erro}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Autenticando…' : 'Entrar no sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}