import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const [stats, setStats] = useState({
    relatorios: 4,
    chamadosAbertos: 0,
    chamadosConcluidos: 0,
    ultimosChamados: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('@mock_emails');
    let emails = [];
    if (saved) {
      emails = JSON.parse(saved);
    } else {
      emails = [
        { id: 1, remetente: 'joao.silva@empresa.com', assunto: 'Desbloqueio de Usuário', status: 'nao_lido', categoria: 'Acesso', data: '10/10/2024 09:30' },
        { id: 2, remetente: 'maria.souza@empresa.com', assunto: 'Criação de Usuário', status: 'nao_lido', categoria: 'Acesso', data: '10/10/2024 08:15' },
        { id: 3, remetente: 'carlos.mendes@empresa.com', assunto: 'Acesso a Relatório', status: 'nao_lido', categoria: 'Suporte', data: '09/10/2024 16:45' },
      ];
    }

    const abertos = emails.filter(e => e.status !== 'concluido' && e.status !== 'excluido');
    const concluidos = emails.filter(e => e.status === 'concluido');
    const recentes = emails
      .filter(e => e.status !== 'excluido')
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);

    setStats({
      relatorios: 4,
      chamadosAbertos: abertos.length,
      chamadosConcluidos: concluidos.length,
      ultimosChamados: recentes
    });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };

  const getCorCategoria = (cat) => {
    switch (cat) {
      case 'Urgente': return '#dc2626';
      case 'Acesso': return '#5b21b6';
      case 'Erro': return '#d97706';
      case 'Suporte': return '#16a34a';
      default: return '#6b6b78';
    }
  };

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

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

      <main className="dash-wrap">
        <div className="dash-head">
          <div className="dash-eyebrow">{hoje}</div>
          <h1 className="dash-title">
            Bem-vinda de volta,<br />
            <em>{authData.user || 'analista'}.</em>
          </h1>
          <p className="dash-subtitle">
            Visão consolidada do sistema. Os números abaixo são atualizados
            conforme você interage com os chamados e relatórios.
          </p>
        </div>

        <div className="dash-kpis" data-tour="kpis">
          <div className="dash-kpi">
            <div className="dash-kpi-label">Relatórios</div>
            <div className="dash-kpi-value accent">{stats.relatorios}</div>
            <div className="dash-kpi-note">Rotinas ADVPL disponíveis</div>
          </div>
          <div className="dash-kpi">
            <div className="dash-kpi-label">Chamados em aberto</div>
            <div className="dash-kpi-value warn">{stats.chamadosAbertos}</div>
            <div className="dash-kpi-note">Aguardando sua resposta</div>
          </div>
          <div className="dash-kpi">
            <div className="dash-kpi-label">Concluídos</div>
            <div className="dash-kpi-value ok">{stats.chamadosConcluidos}</div>
            <div className="dash-kpi-note">Resolvidos com sucesso</div>
          </div>
          <div className="dash-kpi">
            <div className="dash-kpi-label">Ambiente</div>
            <div className="dash-kpi-value" style={{ fontSize: '1.6rem', paddingTop: '10px' }}>
              {authData.filial || '01'}–{authData.modulo || 'Geral'}
            </div>
            <div className="dash-kpi-note">Conexão ativa</div>
          </div>
        </div>

        <div className="dash-cols">
          <div data-tour="activities">
            <div className="dash-col-head">
              <h3>Atividades Recentes</h3>
              <Link to="/tickets">Ver todas</Link>
            </div>

            {stats.ultimosChamados.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', padding: '20px 0' }}>
                Nenhuma atividade recente.
              </p>
            ) : (
              <div>
                {stats.ultimosChamados.map(chamado => (
                  <div
                    key={chamado.id}
                    className="dash-activity-item"
                    onClick={() => navigate('/tickets')}
                  >
                    <div
                      className="dash-dot"
                      style={{ backgroundColor: getCorCategoria(chamado.categoria) }}
                    ></div>
                    <div className="dash-activity-body">
                      <strong>{chamado.assunto}</strong>
                      <span>{chamado.remetente}</span>
                    </div>
                    <div className="dash-activity-date">
                      {chamado.data.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div data-tour="quick-actions">
            <div className="dash-col-head">
              <h3>Ações Rápidas</h3>
            </div>
            <div className="dash-actions">
              <button className="dash-action" onClick={() => navigate('/relatorios')}>
                <div className="dash-action-body">
                  <strong>Emitir relatórios</strong>
                  <span>Rotinas HTML ADVPL</span>
                </div>
                <span className="dash-action-arrow">→</span>
              </button>

              <button className="dash-action" onClick={() => navigate('/tickets')}>
                <div className="dash-action-body">
                  <strong>Gerenciar chamados</strong>
                  <span>Acessos, suporte, desbloqueios</span>
                </div>
                <span className="dash-action-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}