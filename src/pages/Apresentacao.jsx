import { useNavigate } from 'react-router-dom';
import Galeria from '../components/Galeria';

export default function Apresentacao() {
  const navigate = useNavigate();
  const anoAtual = new Date().getFullYear();

  return (
    <div className="ap-wrap">

      {/* NAV MINIMALISTA */}
      <nav className="ap-topbar">
        <div className="ap-brand">
          <span className="ap-brand-dot"></span>
          <span>Protheus Workspace</span>
        </div>
        <div className="ap-topbar-links">
          <a href="#projeto">Projeto</a>
          <a href="#telas">Telas</a>
          <a href="#galeria">Galeria</a>
          <a href="#sobre">Autora</a>
        </div>
        <button className="ap-topbar-cta" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </nav>

      {/* HERO */}
      <header className="ap-hero">
        <div className="ap-hero-meta">
          <span>Portfólio Técnico</span>
          <span className="ap-hero-meta-sep">/</span>
          <span>{anoAtual}</span>
        </div>
        <h1 className="ap-hero-h1">
          Meu dia a dia como desenvolvedora,<br />
          transformado<br />
          <em>em sistema.</em>
        </h1>
        <p className="ap-hero-lead">
          Uma simulação de sistema empresarial com geração de relatórios,
          atendimento de chamados internos e painel de indicadores.
          Tudo funciona de verdade, com dados inventados.
        </p>
        <div className="ap-hero-cta">
          <button className="ap-btn-solid" onClick={() => navigate('/login')}>
            Acessar o sistema
          </button>
          <a href="#sobre" className="ap-btn-link">Sobre mim →</a>
        </div>
      </header>

      {/* STATS */}
      <section className="ap-stats">
        <div className="ap-stat">
          <span className="ap-stat-num">04</span>
          <span className="ap-stat-lbl">Relatórios<br />disponíveis</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">07</span>
          <span className="ap-stat-lbl">Telas<br />funcionais</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">100%</span>
          <span className="ap-stat-lbl">Dados<br />inventados</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">2</span>
          <span className="ap-stat-lbl">Temas<br />claro e escuro</span>
        </div>
      </section>

      {/* PROJETO */}
      <section className="ap-section" id="projeto">
        <div className="ap-sec-label">
          <span>01</span>
          <span className="ap-sec-line"></span>
          <span>O Projeto</span>
        </div>
        <div className="ap-two-col">
          <h2 className="ap-section-title">
            Não é imagem estática. É um sistema que funciona de verdade.
          </h2>
          <div className="ap-section-body">
            <p>
              Cada tela tem comportamento real. Você entra, navega, gera relatório,
              responde chamado, muda o tema, e o sistema reage. Nada é só uma
              foto de layout.
            </p>
            <p>
              Simulei as tarefas mais comuns do meu trabalho: emitir relatórios,
              atender pedidos de suporte, controlar acesso de usuários e acompanhar
              indicadores do dia. Tudo isso numa interface que parece sistema
              corporativo de verdade.
            </p>
            <p>
              Também é parte do meu caminho para segurança. Entender como um sistema
              é construído por dentro é o primeiro passo para aprender a proteger ele.
              Meu próximo projeto é a <strong>Torre de Controle</strong>, uma simulação de
              central de monitoramento de segurança.
            </p>
            <p className="ap-section-note">
              Nenhum dado é real. Nenhuma informação de empresa ou cliente foi usada.
            </p>
          </div>
        </div>
      </section>

      {/* TELAS */}
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
              <h3>Login</h3>
              <p>
                Entrada simplificada só com o nome. Não existe banco de dados nem
                senha para adivinhar. A sessão dura enquanto você navega e é
                encerrada quando você sai.
              </p>
              <ul className="ap-module-list">
                <li>Sessão enquanto você navega</li>
                <li>Bloqueio contra excesso de tentativas</li>
                <li>Limpeza automática ao sair</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">02</div>
            <div className="ap-module-content">
              <h3>Painel de Controle</h3>
              <p>
                Tela inicial com os números do dia, atalhos para o que você mais usa,
                gráficos de chamados por urgência e uma visão rápida de como o
                sistema está se comportando.
              </p>
              <ul className="ap-module-list">
                <li>Indicadores que se atualizam sozinhos</li>
                <li>Últimas atividades recebidas</li>
                <li>Gráficos por urgência e assunto</li>
                <li>Status do ambiente</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">03</div>
            <div className="ap-module-content">
              <h3>Relatórios</h3>
              <p>
                Quatro relatórios que abrem em nova aba, formatados como documento
                de empresa, prontos para imprimir ou baixar em formato de planilha.
              </p>
              <ul className="ap-module-list">
                <li>Agrupamento com subtotais</li>
                <li>Impressão pelo navegador</li>
                <li>Download em planilha</li>
                <li>Marca d'água avisando que é demonstração</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">04</div>
            <div className="ap-module-content">
              <h3>Chamados de TI</h3>
              <p>
                Uma caixa de entrada parecida com e-mail corporativo para gerenciar
                pedidos de acesso, suporte e desbloqueio. Cada pedido tem urgência,
                prazo de atendimento e histórico.
              </p>
              <ul className="ap-module-list">
                <li>Pastas: entrada, lidos, concluídos, lixeira</li>
                <li>Urgência e assunto com cores diferentes</li>
                <li>Histórico do que já aconteceu</li>
                <li>Resposta e encaminhamento</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">05</div>
            <div className="ap-module-content">
              <h3>Código e Estrutura de Dados</h3>
              <p>
                Trechos do código que escrevo no dia a dia, além das tabelas de
                cadastro que uso para guardar clientes, vendedores e pedidos.
              </p>
              <ul className="ap-module-list">
                <li>Exemplos de consulta ao banco</li>
                <li>Funções com explicação comentada</li>
                <li>Como os cadastros se conectam</li>
                <li>Passo a passo para criar um campo novo</li>
              </ul>
            </div>
          </article>

          <article className="ap-module">
            <div className="ap-module-idx">06</div>
            <div className="ap-module-content">
              <h3>Gestão de Usuários</h3>
              <p>
                Cadastrar, editar e excluir usuários, com validação de dados e
                controle de quem está ativo ou bloqueado. Mesma lógica que uso
                nos sistemas reais.
              </p>
              <ul className="ap-module-list">
                <li>Validação de e-mail e senha</li>
                <li>Ativo ou bloqueado</li>
                <li>Data limite de acesso</li>
                <li>Confirmação antes de excluir</li>
              </ul>
            </div>
          </article>

        </div>
      </section>

      {/* GALERIA */}
      <section className="ap-section" id="galeria">
        <div className="ap-sec-label">
          <span>03</span>
          <span className="ap-sec-line"></span>
          <span>Galeria</span>
        </div>

        <Galeria />
      </section>

      {/* STACK */}
      <section className="ap-section ap-section-stack">
        <div className="ap-sec-label">
          <span>04</span>
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
            <span className="ap-stack-val">HTML Reports · Impressão · CSV Export</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Integrações</span>
            <span className="ap-stack-val">REST API · WSRESTFUL · JSON</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Dados</span>
            <span className="ap-stack-val">SQL · TOTVS SX · Consultas parametrizadas</span>
          </div>
          <div className="ap-stack-row">
            <span className="ap-stack-key">Interface</span>
            <span className="ap-stack-val">Tema claro/escuro com persistência local</span>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="ap-section" id="sobre">
        <div className="ap-sec-label">
          <span>05</span>
          <span className="ap-sec-line"></span>
          <span>A Autora</span>
        </div>

        <div className="ap-about">
          <div className="ap-about-left">
            <img
              src="/avatar.jpg"
              alt="Maria Costa"
              className="ap-about-avatar ap-about-avatar-foto"
            />
            <div className="ap-about-meta">
              <span>Disponível para</span>
              <strong>Estágio e oportunidades</strong>
            </div>
          </div>

          <div className="ap-about-right">
            <h2 className="ap-about-name">Maria Costa</h2>
            <p className="ap-about-role">Desenvolvedora ADVPL e estudante de Cibersegurança</p>

            <p className="ap-about-bio">
              Sou estagiária de desenvolvimento e trabalho com o sistema Protheus,
              criando telas, relatórios e automatizações que resolvem problema do
              dia a dia de uma empresa. Gosto quando o código é simples e outra
              pessoa consegue entender.
            </p>
            <p className="ap-about-bio">
              Esse projeto é uma forma de mostrar isso na prática. Também é o
              começo da minha transição para segurança, porque entender como um
              sistema é feito é a base para aprender a proteger ele.
            </p>

            <div className="ap-about-contact">
              <a href="mailto:mmaria.costa@outlook.com">E-mail</a>
              <a
                href="https://www.linkedin.com/in/mmariacosta"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/mmariacosta"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="ap-final">
        <div className="ap-final-inner">
          <h2>Dá uma olhada funcionando.</h2>
          <p>Está tudo ativo e disponível pra teste. Sem cadastro e sem pegadinha.</p>
          <button className="ap-btn-solid" onClick={() => navigate('/login')}>
            Acessar o sistema
          </button>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="ap-foot">
        <span>© {anoAtual} · Protheus Workspace</span>
        <span>Projeto de portfólio · Dados inventados</span>
      </footer>

    </div>
  );
}