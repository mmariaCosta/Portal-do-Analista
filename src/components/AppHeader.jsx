import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Início', match: p => p === '/dashboard' },
  { to: '/relatorios', label: 'Relatórios', match: p => p === '/relatorios' },
  { to: '/tickets', label: 'Chamados', match: p => p === '/tickets' },
  { to: '/codigo', label: 'Código', match: p => p === '/codigo' },
  { to: '/cadastros', label: 'Cadastros', match: p => p === '/cadastros' },
  { to: '/configuracoes', label: 'Configurações', match: p => p.startsWith('/configuracoes') },
];

export default function AppHeader({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };

  const irParaApresentacao = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <button
        type="button"
        className="header-logo header-logo-btn"
        onClick={irParaApresentacao}
        title="Voltar para a apresentação"
      >
        Protheus Workspace
      </button>

      <nav className="header-nav" data-tour="header-nav">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={item.match(location.pathname) ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-user" data-tour="user-info">
        <div className="user-info">
          <strong>{user?.nome || 'Visitante'}</strong>
        </div>

        <button
          type="button"
          className="btn-header-ghost"
          onClick={irParaApresentacao}
          title="Ir para a página de apresentação"
        >
          Apresentação
        </button>

        <button
          className="btn-theme-toggle"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          type="button"
        >
          <span className="btn-theme-icon" data-theme-icon={theme}></span>
        </button>

        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </div>
    </header>
  );
}