import { useNavigate } from 'react-router-dom';

export default function Apresentacao() {
  const navigate = useNavigate();

  return (
    <div className="ap-wrap">

      {/* NAV MINIMALISTA */}
      <nav className="ap-topbar">
        <div className="ap-brand">
          <span className="ap-brand-dot"></span>
          <span>Portal do Analista</span>
        </div>
        <div className="ap-topbar-links">
          <a href="#projeto">Projeto</a>
          <a href="#telas">Telas</a>
          <a href="#sobre">Autora</a>
        </div>
        <button className="ap-topbar-cta" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </nav>

      {/* HERO EDITORIAL */}
      <header className="ap-hero">
        <div className="ap-hero-meta">
          <span>Portfólio Técnico</span>
          <span className="ap-hero-meta-sep">/</span>
          <span>2025</span>
        </div>
        <h1 className="ap-hero-h1">
          Uma demonstração<br />
          de sistemas corporativos<br />
          <em>para o ecossistema Protheus.</em>
        </h1>
        <p className="ap-hero-lead">
          Ambiente interativo que reproduz o cotidiano de um analista de sistemas:
          geração de relatórios HTML via ADVPL, gerenciamento de chamados de TI e
          painel de indicadores operacionais.
        </p>
        <div className="ap-hero-cta">
          <button className="ap-btn-solid" onClick={() => navigate('/login')}>
            Acessar o sistema
          </button>
          <a href="#sobre" className="ap-btn-link">Conhecer a autora →</a>
        </div>
      </header>

      {/* FAIXA DE STATS */}
      <section className="ap-stats">
        <div className="ap-stat">
          <span className="ap-stat-num">04</span>
          <span className="ap-stat-lbl">Rotinas ADVPL<br />disponíveis</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">03</span>
          <span className="ap-stat-lbl">Módulos<br />do sistema</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">100%</span>
          <span className="ap-stat-lbl">Dados<br />fictícios</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">REST</span>
          <span className="ap-stat-lbl">Integração<br />simulada</span>
        </div>
      </section>

      {/* PROJETO — texto editorial */}
      <section className="ap-section" id="projeto">
        <div className="ap-sec-label">
          <span>01</span>
          <span className="ap-sec-line"></span>
          <span>O Projeto</span>
        </div>
        <div className="ap-two-col">
          <h2 className="ap-section-title">
            Uma vitrine técnica construída do zero, com foco em <em>clareza</em> e <em>profundidade</em>.
          </h2>
          <div className="ap-section-body">
            <p>
              Este portal foi idealizado para demonstrar, na prática, o tipo de solução
              que desenvolvo no ambiente corporativo. Não é um mockup estático: cada tela
              executa lógica real de estado, navegação e persistência de dados no navegador.
            </p>
            <p>
              O projeto simula as rotinas mais frequentes de um analista — emitir
              relatórios parametrizados, atender chamados de suporte, controlar acessos e
              monitorar indicadores — dentro de uma interface que respeita padrões
              corporativos de usabilidade e design.
            </p>
            <p className="ap-section-note">
              Todos os dados exibidos são fictícios. Nenhuma informação real de empresa
              ou cliente é utilizada.
            </p>
          </div>
        </div>
      </section>

      {/* TELAS — lista numerada, sem cards */}
      <section className="ap-section" id="telas">
        <div className="ap-sec-label">
          <span>02</span>
          <span className="ap-sec-line"></span>
          <span>Telas</span>
        </div>

        <div className="ap-modules">

          <article className="ap-module">
            <div className="ap-module-idx">01</div>
            <div className="ap-module-content">
              <h3>Autenticação</h3>
              <p>
                Simulação de login com seleção de filial e módulo de trabalho — o contexto
                é mantido durante toda a sessão e reiniciado a cada saída.
              </p>
              <ul className="ap-module-list">
                <li>Contexto Protheus (filial + módulo)</li>
                <li>Sessão persistente em sessionStorage</li>
                <li>Reset automático ao sair</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">02</div>
            <div className="ap-module-content">
              <h3>Painel de Controle</h3>
              <p>
                Visão consolidada do dia: indicadores calculados em tempo real a partir do
                estado interno do sistema, atalhos operacionais e histórico recente.
              </p>
              <ul className="ap-module-list">
                <li>KPIs dinâmicos</li>
                <li>Atividades recentes</li>
                <li>Ações rápidas</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">03</div>
            <div className="ap-module-content">
              <h3>Relatórios HTML</h3>
              <p>
                Central que simula a execução de rotinas ADVPL com geração de relatórios
                formatados em HTML — com agrupamentos, totalizadores, impressão e exportação.
              </p>
              <ul className="ap-module-list">
                <li>Agrupamentos com subtotais</li>
                <li>Impressão nativa via navegador</li>
                <li>Exportação para CSV/Excel</li>
                <li>Marca d'água de demonstração</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">04</div>
            <div className="ap-module-content">
              <h3>Chamados de TI</h3>
              <p>
                Cliente de e-mail corporativo para gestão de solicitações de acesso,
                desbloqueio e suporte — com organização por pastas e categorização visual.
              </p>
              <ul className="ap-module-list">
                <li>Pastas: entrada, lidos, concluídos, lixeira</li>
                <li>Categorização por cor</li>
                <li>Histórico de respostas</li>
                <li>Encaminhamento e conclusão</li>
              </ul>
            </div>
          </article>

        </div>
      </section>

      {/* STACK */}
      <section className="ap-section ap-section-stack">
        <div className="ap-sec-label">
          <span>03</span>
          <span className="ap-sec-line"></span>
          <span>Tecnologias</span>
        </div>

        <div className="ap-stack-list">
          <div className="ap-stack-row">
            <span className="ap-stack-key">Front-end</span>
            <span className="ap-stack-val">React · Vite · JavaScript · CSS3</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Back-end</span>
            <span className="ap-stack-val">ADVPL · TOTVS Protheus</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Relatórios</span>
            <span className="ap-stack-val">HTML Reports · Impressão nativa · CSV Export</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Integrações</span>
            <span className="ap-stack-val">REST API · WSRESTFUL · JSON</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Dados</span>
            <span className="ap-stack-val">SQL · TOTVS SX · Consultas parametrizadas</span>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="ap-section" id="sobre">
        <div className="ap-sec-label">
          <span>04</span>
          <span className="ap-sec-line"></span>
          <span>A Autora</span>
        </div>

        <div className="ap-about">
          <div className="ap-about-left">
            <div className="ap-about-avatar">MC</div>
            <div className="ap-about-meta">
              <span>Disponível para</span>
              <strong>Projetos & Oportunidades</strong>
            </div>
          </div>

          <div className="ap-about-right">
            <h2 className="ap-about-name">[Seu Nome Completo]</h2>
            <p className="ap-about-role">Analista de Sistemas · Desenvolvedora ADVPL</p>

            <p className="ap-about-bio">
              Profissional com atuação no ecossistema TOTVS Protheus. Desenvolvo rotinas
              customizadas, relatórios HTML, integrações REST e automações que resolvem
              problemas reais do dia a dia corporativo.
            </p>
            <p className="ap-about-bio">
              Este projeto foi construído para apresentar, de forma objetiva e visual, as
              competências técnicas que aplico profissionalmente.
            </p>

            <div className="ap-about-contact">
              <a href="mailto:seuemail@exemplo.com">E-mail</a>
              <a href="https://www.linkedin.com/in/seu-perfil" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/seu-usuario" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="ap-final">
        <div className="ap-final-inner">
          <h2>Explore o sistema em funcionamento.</h2>
          <p>Todas as funcionalidades estão ativas e disponíveis para teste.</p>
          <button className="ap-btn-solid" onClick={() => navigate('/login')}>
            Acessar o portal
          </button>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="ap-foot">
        <span>© {new Date().getFullYear()} · Portal do Analista</span>
        <span>Projeto de portfólio · Dados fictícios</span>
      </footer>

    </div>
  );
}