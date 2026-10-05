import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ============================================================
// ROTEIRO DO TOUR
// ============================================================
const ROTEIRO = [
  // DASHBOARD
  { path: '/dashboard', target: 'header-logo',     title: 'Portal do Analista', text: 'Este é o painel do sistema. O logotipo sempre traz você de volta ao início.', duration: 3500 },
  { path: '/dashboard', target: 'header-nav',      title: 'Menu principal',      text: 'Aqui você navega entre as seis áreas do portal.', duration: 3500 },
  { path: '/dashboard', target: 'user-info',       title: 'Seu contexto',        text: 'Usuário, filial e módulo ativos. O botão Sair fica ao lado.', duration: 3500 },
  { path: '/dashboard', target: 'kpis',            title: 'Indicadores em tempo real', text: 'Relatórios disponíveis, chamados abertos, concluídos e o ambiente ativo.', duration: 4000 },
  { path: '/dashboard', target: 'activities',      title: 'Atividades recentes', text: 'Últimos chamados recebidos, ordenados por data.', duration: 3500 },
  
  // RELATÓRIOS
  { path: '/relatorios', target: 'rel-wrap',       title: 'Central de relatórios', text: 'Quatro rotinas HTML geradas em ADVPL. Cada botão abre o relatório em nova aba.', duration: 4500 },
  
  // CHAMADOS
  { path: '/tickets', target: 'tk-sidebar',        title: 'Chamados de TI',      text: 'Pastas de organização: caixa de entrada, lidos, concluídos e lixeira.', duration: 4000 },
  { path: '/tickets', target: 'tk-list',           title: 'Lista de mensagens',  text: 'Cada chamado tem categoria visual e status clicável.', duration: 4000 },
  
  // CÓDIGO
  { path: '/codigo', target: 'dev-tabs',           title: 'SQL & ADVPL',         text: 'Exemplos reais de queries e rotinas que escrevo no dia a dia.', duration: 4000 },
  { path: '/codigo', target: 'dev-code',           title: 'Editor de código',    text: 'Cada trecho é comentado explicando as decisões técnicas.', duration: 4500 },
  
  // CADASTROS
  { path: '/cadastros', target: 'cad-explorer',    title: 'Dicionário Protheus', text: 'Explore as tabelas SA1, SA3, SC5 e SC6 com todos os campos mapeados.', duration: 4500 },
  { path: '/cadastros', target: 'cad-timeline',    title: 'Ciclo de vida de um campo', text: 'As cinco etapas obrigatórias: SX2, SX3, SIX, SX7 e reindexação.', duration: 4000 },
  
  // CONFIGURAÇÕES
  { path: '/configuracoes', target: 'cfg-actions', title: 'Ações com permissões', text: 'Cada ação abre uma tela específica — visualização somente leitura, alteração editável, exclusão com confirmação.', duration: 4500 },
  { path: '/configuracoes', target: 'cfg-list',    title: 'Lista de usuários',   text: 'Gestão completa de usuários. Clique em uma linha para selecionar e escolha uma ação.', duration: 4000 },
  
  // VOLTA AO DASHBOARD
  { path: '/dashboard', target: 'header-logo',     title: 'Fim do tour',         text: 'Este foi o Portal do Analista. Explore as telas e conheça o trabalho.', duration: 4000 },
];

const TOOLTIP_W = 380;
const TOOLTIP_H = 220; // altura estimada
const PADDING = 16;

export default function Tour({ active, onFinish }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [visible, setVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const step = ROTEIRO[stepIndex];
  const timerRef = useRef(null);

  // Reset ao iniciar
  useEffect(() => {
    if (active) {
      setStepIndex(0);
      setRect(null);
      setVisible(false);
    }
  }, [active]);

  // Navega para o path do passo
  useEffect(() => {
    if (!active || !step) return;
    if (location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [active, stepIndex, step, location.pathname, navigate]);

  // Localiza o elemento-alvo e agenda o próximo passo
  useEffect(() => {
    if (!active || !step) return;
    if (location.pathname !== step.path) return;

    let cancelled = false;
    let elapsed = 0;
    const interval = 80;
    const maxWait = 3000;

    const tryFind = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          if (cancelled) return;
          const r = el.getBoundingClientRect();
          setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
          setVisible(true);

          timerRef.current = setTimeout(() => {
            setVisible(false);
            setRect(null);
            setTimeout(() => setStepIndex(i => i + 1), 300);
          }, step.duration);
        }, 500);
      } else if (elapsed < maxWait) {
        elapsed += interval;
        timerRef.current = setTimeout(tryFind, interval);
      } else {
        setStepIndex(i => i + 1);
      }
    };

    tryFind();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, stepIndex, step, location.pathname]);

  // Calcula posição do tooltip sempre que o rect mudar
  useEffect(() => {
    if (!rect) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBelow = vh - (rect.top + rect.height);
    const spaceAbove = rect.top;
    const spaceRight = vw - (rect.left + rect.width);

    let top, left, useTransform = false;

    // Prioridade: abaixo → acima → direita → esquerda
    if (spaceBelow >= TOOLTIP_H + PADDING * 2) {
      // Coloca abaixo
      top = rect.top + rect.height + PADDING;
      left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    } else if (spaceAbove >= TOOLTIP_H + PADDING * 2) {
      // Coloca acima (usa transform para subir)
      top = rect.top - PADDING;
      left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
      useTransform = true;
    } else if (spaceRight >= TOOLTIP_W + PADDING * 2) {
      // Coloca à direita
      top = rect.top + rect.height / 2 - TOOLTIP_H / 2;
      left = rect.left + rect.width + PADDING;
    } else {
      // Coloca à esquerda
      top = rect.top + rect.height / 2 - TOOLTIP_H / 2;
      left = rect.left - TOOLTIP_W - PADDING;
    }

    // Trava horizontal (não deixar sair da tela)
    left = Math.max(PADDING, Math.min(left, vw - TOOLTIP_W - PADDING));

    // Trava vertical (não deixar sair da tela)
    if (top < PADDING) top = PADDING;
    if (top + TOOLTIP_H > vh - PADDING) {
      top = vh - TOOLTIP_H - PADDING;
    }

    setTooltipPos({ top, left, useTransform });
  }, [rect]);

  // Fim do tour
  useEffect(() => {
    if (active && stepIndex >= ROTEIRO.length) {
      onFinish();
    }
  }, [stepIndex, active, onFinish]);

  if (!active) return null;
  if (!step) return null;
  if (!visible || !rect) return null;

  const progress = ((stepIndex + 1) / ROTEIRO.length) * 100;

  return (
    <div className="tour-layer">
      <div className="tour-progressbar">
        <div className="tour-progressbar-fill" style={{ width: `${progress}%` }} />
      </div>

      <button className="tour-exit" onClick={onFinish} title="Sair do tour">
        Sair do tour
      </button>

      <div
        className="tour-spotlight"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        }}
      />

      <div
        className="tour-tooltip"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          transform: tooltipPos.useTransform ? 'translateY(-100%)' : 'none',
        }}
      >
        <div className="tour-step-num">
          Passo {stepIndex + 1} de {ROTEIRO.length}
        </div>
        <h3 className="tour-title">{step.title}</h3>
        <p className="tour-text">{step.text}</p>
        <div className="tour-auto">
          <span className="tour-auto-dot" />
          Avançando automaticamente…
        </div>
      </div>
    </div>
  );
}