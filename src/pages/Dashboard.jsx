import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

export default function Dashboard() {
  const navigate = useNavigate();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const [stats, setStats] = useState({
    relatorios: 4,
    chamadosAbertos: 0,
    chamadosConcluidos: 0,
    ultimosChamados: [],
    porPrioridade: { P1: 0, P2: 0, P3: 0 },
    porCategoria: { Acesso: 0, Suporte: 0, Erro: 0, Urgente: 0 },
  });

  useEffect(() => {
    const saved = localStorage.getItem('@mock_emails');
    let emails = [];
    if (saved) {
      emails = JSON.parse(saved);
    } else {
      emails = [
        { id: 1, remetente: 'joao.silva@empresa.com', assunto: 'Desbloqueio de Usuário', status: 'nao_lido', categoria: 'Acesso', prioridade: 'P2', data: '10/10/2024 09:30' },
        { id: 2, remetente: 'maria.souza@empresa.com', assunto: 'Criação de Usuário', status: 'nao_lido', categoria: 'Acesso', prioridade: 'P3', data: '10/10/2024 08:15' },
        { id: 3, remetente: 'carlos.mendes@empresa.com', assunto: 'Acesso a Relatório', status: 'nao_lido', categoria: 'Suporte', prioridade: 'P3', data: '09/10/2024 16:45' },
      ];
    }

    const abertos = emails.filter(e => e.status !== 'concluido' && e.status !== 'excluido');
    const concluidos = emails.filter(e => e.status === 'concluido');
    const recentes = emails
      .filter(e => e.status !== 'excluido')
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);

    const porPrioridade = { P1: 0, P2: 0, P3: 0 };
    const porCategoria = { Acesso: 0, Suporte: 0, Erro: 0, Urgente: 0 };

    abertos.forEach(e => {
      const prio = e.prioridade || 'P3';
      if (porPrioridade[prio] !== undefined) porPrioridade[prio]++;

      const cat = e.categoria || 'Acesso';
      if (porCategoria[cat] !== undefined) porCategoria[cat]++;
    });

    setStats({
      relatorios: 4,
      chamadosAbertos: abertos.length,
      chamadosConcluidos: concluidos.length,
      ultimosChamados: recentes,
      porPrioridade,
      porCategoria,
    });
  }, []);

  const getCorCategoria = (cat) => {
    switch (cat) {
      case 'Urgente': return '#dc2626';
      case 'Acesso': return '#5b21b6';
      case 'Erro': return '#d97706';
      case 'Suporte': return '#16a34a';
      default: return '#6b6b78';
    }
  };

  const getCorPrioridade = (prio) => {
    switch (prio) {
      case 'P1': return 'var(--danger)';
      case 'P2': return 'var(--warning)';
      case 'P3': return '#2563eb';
      default: return 'var(--text-dim)';
    }
  };

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const totalAbertos = stats.chamadosAbertos || 1;

  return (
    <div className="app-container">
      <AppHeader user={authData} />

      <main className="dash-wrap">
        {/* HEAD */}
        <div className="dash-head">
          <div className="dash-eyebrow">{hoje}</div>
          <h1 className="dash-title">
            Bem-vindo de volta,<br />
            <em>{authData.nome || 'visitante'}.</em>
          </h1>
          <p className="dash-subtitle">
            Visão consolidada do sistema. Os números abaixo são atualizados
            conforme você interage com os chamados e relatórios.
          </p>
        </div>

        {/* KPIs */}
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
              Demo
            </div>
            <div className="dash-kpi-note">Conexão ativa</div>
          </div>
        </div>

        {/* LINHA 1: Atividades + Ações */}
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

              <button className="dash-action" onClick={() => navigate('/cadastros')}>
                <div className="dash-action-body">
                  <strong>Consultar dicionário</strong>
                  <span>Tabelas e campos Protheus</span>
                </div>
                <span className="dash-action-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* LINHA 2: Analytics */}
        <div className="dash-analytics" data-tour="dash-analytics">

          {/* Painel 1 — Prioridade */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>Chamados por prioridade</h3>
              <span className="dash-panel-sub">{stats.chamadosAbertos} em aberto</span>
            </div>
            <div className="dash-bars">
              {['P1', 'P2', 'P3'].map(prio => {
                const valor = stats.porPrioridade[prio] || 0;
                const pct = Math.round((valor / totalAbertos) * 100);
                return (
                  <div key={prio} className="dash-bar-row">
                    <div className="dash-bar-label">
                      <span className="dash-bar-badge" style={{ background: getCorPrioridade(prio) }}>
                        {prio}
                      </span>
                      <span className="dash-bar-name">
                        {prio === 'P1' ? 'Crítico' : prio === 'P2' ? 'Alto' : 'Normal'}
                      </span>
                    </div>
                    <div className="dash-bar-track">
                      <div
                        className="dash-bar-fill"
                        style={{ width: `${pct}%`, background: getCorPrioridade(prio) }}
                      />
                    </div>
                    <div className="dash-bar-value">{valor}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Painel 2 — Categoria */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>Chamados por categoria</h3>
              <span className="dash-panel-sub">Distribuição atual</span>
            </div>
            <div className="dash-bars">
              {['Acesso', 'Suporte', 'Erro', 'Urgente'].map(cat => {
                const valor = stats.porCategoria[cat] || 0;
                const pct = Math.round((valor / totalAbertos) * 100);
                return (
                  <div key={cat} className="dash-bar-row">
                    <div className="dash-bar-label">
                      <span
                        className="dash-bar-dot"
                        style={{ background: getCorCategoria(cat) }}
                      ></span>
                      <span className="dash-bar-name">{cat}</span>
                    </div>
                    <div className="dash-bar-track">
                      <div
                        className="dash-bar-fill"
                        style={{ width: `${pct}%`, background: getCorCategoria(cat) }}
                      />
                    </div>
                    <div className="dash-bar-value">{valor}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Painel 3 — Ambiente */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h3>Saúde do ambiente</h3>
              <span className="dash-panel-sub">Últimas 24h</span>
            </div>

            <div className="dash-env">
              <div className="dash-env-row">
                <div className="dash-env-label">Uptime</div>
                <div className="dash-env-value ok">99.98%</div>
              </div>

              <div className="dash-env-row">
                <div className="dash-env-label">Última reindexação</div>
                <div className="dash-env-value">02/10 às 23:15</div>
              </div>

              <div className="dash-env-row">
                <div className="dash-env-label">Backup automático</div>
                <div className="dash-env-value">há 2 horas</div>
              </div>

              <div className="dash-env-row">
                <div className="dash-env-label">Fila de processos</div>
                <div className="dash-env-value">0 pendentes</div>
              </div>

              <div className="dash-env-row">
                <div className="dash-env-label">Usuários ativos</div>
                <div className="dash-env-value">3 conectados</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}