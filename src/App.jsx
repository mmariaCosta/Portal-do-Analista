import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Apresentacao from './pages/Apresentacao';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Relatorios from './pages/Relatorios';
import Tickets from './pages/Tickets';
import Codigo from './pages/Codigo';
import Cadastros from './pages/Cadastros';
import Configuracoes from './pages/Configuracoes';
import UsuarioDetalhe from './pages/UsuarioDetalhe';
import Tour from './components/Tour';

// ============================================================
// SESSÃO — timeout por inatividade (30 minutos)
// ============================================================
const SESSION_IDLE_MS = 30 * 60 * 1000;

// ============================================================
// LISTA COMPLETA DE E-MAILS (usada como estado inicial)
// ============================================================
const emailsFallback = [
  { id: 1, remetente: 'joao.silva@empresa.com', destinatario: 'Você', assunto: 'Desbloqueio de Usuário', corpo: 'Olá TI, meu usuário bloqueou após 3 tentativas erradas. Podem desbloquear?', data: '10/10/2024 09:30', status: 'nao_lido', categoria: 'Acesso', respostas: [] },
  { id: 2, remetente: 'maria.souza@empresa.com', destinatario: 'Você', assunto: 'Criação de Usuário', corpo: 'Preciso de acesso ao módulo Financeiro para o novo estagiário, Pedro.', data: '10/10/2024 08:15', status: 'nao_lido', categoria: 'Acesso', respostas: [] },
  { id: 3, remetente: 'carlos.mendes@empresa.com', destinatario: 'Você', assunto: 'Acesso a Relatório', corpo: 'Não consigo acessar o relatório U_RELVEND no menu de Faturamento.', data: '09/10/2024 16:45', status: 'nao_lido', categoria: 'Suporte', respostas: [] },
  { id: 4, remetente: 'ana.paula@empresa.com', destinatario: 'Você', assunto: 'Alteração de Permissão', corpo: 'Preciso de permissão de aprovação de pedidos de compra.', data: '09/10/2024 14:20', status: 'nao_lido', categoria: 'Acesso', respostas: [] },
  { id: 5, remetente: 'roberto.alves@empresa.com', destinatario: 'Você', assunto: 'Desbloqueio de Usuário', corpo: 'Usuário travado no Protheus, favor desbloquear.', data: '09/10/2024 11:10', status: 'nao_lido', categoria: 'Urgente', respostas: [] },
  { id: 6, remetente: 'fernanda.lima@empresa.com', destinatario: 'Você', assunto: 'Criação de Usuário', corpo: 'Novo usuário para o setor de Compras. Nome: Lucas Rocha.', data: '08/10/2024 10:05', status: 'lido', categoria: 'Acesso', respostas: [] },
  { id: 7, remetente: 'lucas.rocha@empresa.com', destinatario: 'Você', assunto: 'Erro em Relatório', corpo: 'Erro ao gerar relatório de estoque, apresenta divergência.', data: '08/10/2024 09:40', status: 'lido', categoria: 'Erro', respostas: [] },
  { id: 8, remetente: 'juliana.costa@empresa.com', destinatario: 'Você', assunto: 'Mudança de Filial', corpo: 'Fui transferida para a filial 02, preciso de novos acessos.', data: '07/10/2024 15:30', status: 'lido', categoria: 'Suporte', respostas: [] },
  { id: 9, remetente: 'pedro.santos@empresa.com', destinatario: 'Você', assunto: 'Reset de Senha', corpo: 'Esqueci minha senha, podem resetar para a padrão?', data: '07/10/2024 13:15', status: 'lido', categoria: 'Urgente', respostas: [] },
  { id: 10, remetente: 'camila.oliveira@empresa.com', destinatario: 'Você', assunto: 'Sistema Lento', corpo: 'O sistema está muito lento para emitir nota fiscal hoje.', data: '07/10/2024 10:00', status: 'lido', categoria: 'Erro', respostas: [] },
];

// ============================================================
// ROTA PROTEGIDA
// ============================================================
const PrivateRoute = ({ children }) => {
  const auth = sessionStorage.getItem('zauth');
  return auth ? children : <Navigate to="/login" replace />;
};

// ============================================================
// PÁGINA 404
// ============================================================
function NotFound() {
  return <Navigate to="/" replace />;
}

// ============================================================
// HOOK — Força HTTPS fora de localhost (produção)
// ============================================================
function useHttpsEnforce() {
  useEffect(() => {
    const isLocal =
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1' ||
      location.hostname.startsWith('192.168.') ||
      location.hostname.startsWith('10.') ||
      location.hostname.endsWith('.local');

    if (!isLocal && location.protocol !== 'https:') {
      location.replace('https:' + location.href.substring(location.protocol.length));
    }
  }, []);
}

// ============================================================
// HOOK — Session timeout por inatividade
// ============================================================
function useSessionTimeout() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const navigateRef = useRef(navigate);

  // Mantém a referência atualizada sem re-rodar o efeito
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (!sessionStorage.getItem('zauth')) return;

      timeoutRef.current = setTimeout(() => {
        sessionStorage.removeItem('zauth');
        sessionStorage.removeItem('@demo_notified');
        sessionStorage.removeItem('@demo_timer_started');
        sessionStorage.removeItem('@tour_seen');
        alert('Sessão expirada por inatividade. Faça login novamente.');
        navigateRef.current('/login');
      }, SESSION_IDLE_MS);
    };

    const events = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, []); // ← array vazio agora
}

// ============================================================
// COMPONENTE — Notificação de demonstração
// ============================================================
function DemoNotifier({ notification, onClose, onOpen }) {
  if (!notification) return null;
  return (
    <div className="demo-notif" role="alert" aria-live="polite">
      <button
        className="demo-notif-close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fechar notificação"
      >
        ×
      </button>
      <div className="demo-notif-head" onClick={onOpen}>
        <span className="demo-notif-badge">1 nova mensagem</span>
      </div>
      <div className="demo-notif-body" onClick={onOpen}>
        <div className="demo-notif-sender">{notification.remetente}</div>
        <div className="demo-notif-subject">{notification.assunto}</div>
        <div className="demo-notif-preview">{notification.corpo}</div>
      </div>
      <div className="demo-notif-action" onClick={onOpen}>Abrir chamado →</div>
    </div>
  );
}

// ============================================================
// COMPONENTE — Botão "Assistir tour"
// ============================================================
function TourButton({ onClick, running }) {
  const location = useLocation();
  const isInside =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/relatorios') ||
    location.pathname.startsWith('/tickets') ||
    location.pathname.startsWith('/codigo') ||
    location.pathname.startsWith('/cadastros') ||
    location.pathname.startsWith('/configuracoes');

  if (!isInside || running) return null;

  return (
    <button className="tour-launch" onClick={onClick} title="Assistir tour guiado">
      <span className="tour-launch-dot" />
      Assistir tour
    </button>
  );
}

// ============================================================
// APP INTERNO — dentro do Router para usar hooks de navegação
// ============================================================
function AppInner() {
  const [notification, setNotification] = useState(null);
  const [tourActive, setTourActive] = useState(false);
  const navigate = useNavigate();

  useHttpsEnforce();
  useSessionTimeout();

  // ---------------------------------------------------------
  // Mostra a notificação (com proteção contra repetição)
  // ---------------------------------------------------------
  const showNotification = () => {
    if (sessionStorage.getItem('@demo_notified')) return;

    const saved = localStorage.getItem('@mock_emails');
    let emails = saved ? JSON.parse(saved) : emailsFallback;
    if (!saved) localStorage.setItem('@mock_emails', JSON.stringify(emailsFallback));

    const naoLidos = emails.filter(e => e.status === 'nao_lido');
    if (naoLidos.length > 0) {
      setNotification(naoLidos[0]);
      sessionStorage.setItem('@demo_notified', 'true');
    }
  };

  // ---------------------------------------------------------
  // Fluxo pós-login
  //   - Se o tour nunca rodou → inicia o tour (notificação vem depois)
  //   - Se o tour já rodou    → mostra a notificação após 3s
  // ---------------------------------------------------------
  useEffect(() => {
    const handleLogin = () => {
      if (!localStorage.getItem('@mock_emails')) {
        localStorage.setItem('@mock_emails', JSON.stringify(emailsFallback));
      }

      const tourJaVisto = sessionStorage.getItem('@tour_seen');
      if (tourJaVisto) {
        setTimeout(showNotification, 3000);
        return;
      }
      setTimeout(() => setTourActive(true), 1500);
    };

    window.addEventListener('user-logged-in', handleLogin);
    return () => window.removeEventListener('user-logged-in', handleLogin);
  }, []);

  // ---------------------------------------------------------
  // Fim do tour (natural ou cancelado) → dispara a notificação
  // ---------------------------------------------------------
  const finishTour = () => {
    setTourActive(false);
    sessionStorage.setItem('@tour_seen', 'true');
    navigate('/dashboard');
    setTimeout(showNotification, 1200);
  };

  const startTourManual = () => {
    setNotification(null);
    sessionStorage.removeItem('@demo_notified');
    setTourActive(true);
  };

  const handleOpenNotif = () => {
    setNotification(null);
    navigate('/tickets');
  };

  const handleCloseNotif = () => {
    setNotification(null);
  };

  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Apresentacao />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas privadas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
        <Route path="/codigo" element={<PrivateRoute><Codigo /></PrivateRoute>} />
        <Route path="/cadastros" element={<PrivateRoute><Cadastros /></PrivateRoute>} />
        <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
        <Route path="/configuracoes/usuario/:id/:mode" element={<PrivateRoute><UsuarioDetalhe /></PrivateRoute>} />

        {/* Fallback — qualquer rota inexistente volta para a Apresentação */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <DemoNotifier
        notification={notification}
        onClose={handleCloseNotif}
        onOpen={handleOpenNotif}
      />

      <TourButton onClick={startTourManual} running={tourActive} />

      <Tour active={tourActive} onFinish={finishTour} />
    </>
  );
}

// ============================================================
// APP — ponto de entrada
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}