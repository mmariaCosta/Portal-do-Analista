import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const usuariosIniciais = [
  { id: 1, codigo: 'USR001', nome: 'Ana Paula Silva',   email: 'ana.silva@empresa.com',    senha: '12345678',  cargo: 'Analista de Sistemas',      setor: 'TI',          status: 'ativo',     dataFimAcesso: '2026-12-31' },
  { id: 2, codigo: 'USR002', nome: 'Bruno Costa',        email: 'bruno.costa@empresa.com',  senha: '87654321',  cargo: 'Analista de Faturamento',   setor: 'Faturamento', status: 'ativo',     dataFimAcesso: '2025-06-30' },
  { id: 3, codigo: 'USR003', nome: 'Carla Mendes',       email: 'carla.mendes@empresa.com', senha: 'abcdefgh',  cargo: 'Coordenadora Financeira',   setor: 'Financeiro',  status: 'ativo',     dataFimAcesso: '2027-03-15' },
  { id: 4, codigo: 'USR004', nome: 'Diego Rocha',        email: 'diego.rocha@empresa.com',  senha: 'senha123',  cargo: 'Analista de Estoque',       setor: 'Estoque',     status: 'bloqueado', dataFimAcesso: '2025-01-20' },
  { id: 5, codigo: 'USR005', nome: 'Elisa Ferraz',       email: 'elisa.ferraz@empresa.com', senha: 'qwerty99',  cargo: 'Gerente de Vendas',         setor: 'Comercial',   status: 'ativo',     dataFimAcesso: '2027-09-10' },
];

export default function Configuracoes() {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const [usuarios, setUsuarios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('@mock_users');
    if (saved) {
      setUsuarios(JSON.parse(saved));
    } else {
      setUsuarios(usuariosIniciais);
      localStorage.setItem('@mock_users', JSON.stringify(usuariosIniciais));
    }
    setSelecionado(null);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };

  const irParaAcao = (acao) => {
    if (!selecionado) {
      setFeedback('Selecione um usuário primeiro.');
      setTimeout(() => setFeedback(''), 2500);
      return;
    }
    navigate(`/configuracoes/usuario/${selecionado.id}/${acao}`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-logo" data-tour="header-logo">Portal do Analista</div>
        <nav className="header-nav" data-tour="header-nav">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Início</Link>
          <Link to="/relatorios" className={location.pathname === '/relatorios' ? 'active' : ''}>Relatórios</Link>
          <Link to="/tickets" className={location.pathname === '/tickets' ? 'active' : ''}>Chamados</Link>
          <Link to="/codigo" className={location.pathname === '/codigo' ? 'active' : ''}>Código</Link>
          <Link to="/cadastros" className={location.pathname === '/cadastros' ? 'active' : ''}>Cadastros</Link>
          <Link to="/configuracoes" className={location.pathname.startsWith('/configuracoes') ? 'active' : ''}>Configurações</Link>
        </nav>
        <div className="header-user" data-tour="user-info">
          <div className="user-info">
            <strong>{authData.user || 'Usuário'}</strong>
            <span>Filial {authData.filial || '01'} · {authData.modulo || 'Geral'}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="cfg-wrap">
        <div className="cfg-head">
          <div>
            <h1 className="cfg-title">Configurações</h1>
            <p className="cfg-subtitle">
              Gerencie os usuários do sistema. Selecione um registro para visualizar,
              alterar ou excluir.
            </p>
          </div>
          <button className="cfg-new" onClick={() => navigate('/configuracoes/usuario/novo/edit')}>
            + Novo usuário
          </button>
        </div>

        <div className="cfg-actions" data-tour="cfg-actions">
          <span className="cfg-actions-label">Ações para o registro selecionado</span>
          <div className="cfg-actions-group">
            <button className="cfg-action-btn" onClick={() => irParaAcao('view')} disabled={!selecionado}>
              Visualizar
            </button>
            <button className="cfg-action-btn" onClick={() => irParaAcao('edit')} disabled={!selecionado}>
              Alterar
            </button>
            <button className="cfg-action-btn danger" onClick={() => irParaAcao('delete')} disabled={!selecionado}>
              Excluir
            </button>
          </div>
        </div>

        <div className="cfg-list" data-tour="cfg-list">
          <div className="cfg-list-header">
            <div className="cfg-col-select"></div>
            <div className="cfg-col">Código</div>
            <div className="cfg-col">Nome</div>
            <div className="cfg-col">E-mail</div>
            <div className="cfg-col">Cargo</div>
            <div className="cfg-col">Setor</div>
            <div className="cfg-col">Status</div>
          </div>

          {usuarios.length === 0 ? (
            <div className="cfg-empty">Nenhum usuário cadastrado.</div>
          ) : usuarios.map(u => (
            <div
              key={u.id}
              className={`cfg-row ${selecionado?.id === u.id ? 'selected' : ''}`}
              onClick={() => setSelecionado(u)}
            >
              <div className="cfg-col-select">
                <span className={`cfg-radio ${selecionado?.id === u.id ? 'checked' : ''}`}></span>
              </div>
              <div className="cfg-col mono">{u.codigo}</div>
              <div className="cfg-col strong">{u.nome}</div>
              <div className="cfg-col muted">{u.email}</div>
              <div className="cfg-col">{u.cargo}</div>
              <div className="cfg-col">{u.setor}</div>
              <div className="cfg-col">
                <span className={`cfg-status ${u.status}`}>{u.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {feedback && <div className="tk-toast">{feedback}</div>}
    </div>
  );
}