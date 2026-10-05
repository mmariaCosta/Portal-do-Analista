import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const emailsIniciais = [
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

export default function Tickets() {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const [emails, setEmails] = useState([]);
  const [pastaAtiva, setPastaAtiva] = useState('entrada');
  const [emailSelecionado, setEmailSelecionado] = useState(null);
  const [textoResposta, setTextoResposta] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showForwardForm, setShowForwardForm] = useState(false);
  const [forwardDest, setForwardDest] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('@mock_emails');
    if (saved) {
      setEmails(JSON.parse(saved));
    } else {
      setEmails(emailsIniciais);
      localStorage.setItem('@mock_emails', JSON.stringify(emailsIniciais));
    }
  }, []);

  useEffect(() => {
    if (emails.length > 0) {
      localStorage.setItem('@mock_emails', JSON.stringify(emails));
    }
  }, [emails]);

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };

  const abrirEmail = (email) => {
    setEmailSelecionado(email);
    setShowForwardForm(false);
    setForwardDest('');
    if (email.status === 'nao_lido') {
      atualizarStatus(email.id, 'lido');
    }
  };

  const atualizarEmail = (id, campos) => {
    const updated = emails.map(e => e.id === id ? { ...e, ...campos } : e);
    setEmails(updated);
    if (emailSelecionado && emailSelecionado.id === id) {
      setEmailSelecionado({ ...emailSelecionado, ...campos });
    }
  };

  const atualizarStatus = (id, novoStatus) => {
    atualizarEmail(id, { status: novoStatus });
  };

  const handleAcao = (acao) => {
    if (!emailSelecionado) return;

    switch (acao) {
      case 'lido':
        atualizarStatus(emailSelecionado.id, 'lido');
        setFeedback('Marcado como lido');
        break;
      case 'nao_lido':
        atualizarStatus(emailSelecionado.id, 'nao_lido');
        setFeedback('Marcado como não lido');
        break;
      case 'concluir':
        atualizarStatus(emailSelecionado.id, 'concluido');
        setFeedback('Chamado concluído');
        setEmailSelecionado(null);
        break;
      case 'excluir':
        atualizarStatus(emailSelecionado.id, 'excluido');
        setFeedback('Mensagem movida para a lixeira');
        setEmailSelecionado(null);
        break;
      case 'encaminhar':
        setShowForwardForm(true);
        break;
      default:
        break;
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCategoriaChange = (e) => {
    if (!emailSelecionado) return;
    atualizarEmail(emailSelecionado.id, { categoria: e.target.value });
  };

  const enviarResposta = (e) => {
    e.preventDefault();
    if (!textoResposta.trim()) return;

    const novaResposta = {
      data: new Date().toLocaleString('pt-BR'),
      texto: textoResposta
    };

    const updated = emails.map(email =>
      email.id === emailSelecionado.id
        ? { ...email, respostas: [...(email.respostas || []), novaResposta] }
        : email
    );

    setEmails(updated);
    setEmailSelecionado({ ...emailSelecionado, respostas: [...(emailSelecionado.respostas || []), novaResposta] });
    setTextoResposta('');
    setFeedback('Resposta enviada');
    setTimeout(() => setFeedback(''), 3000);
  };

  const enviarEncaminhamento = (e) => {
    e.preventDefault();
    if (!forwardDest.trim()) return;

    setFeedback(`Encaminhado para ${forwardDest}`);
    setShowForwardForm(false);
    setForwardDest('');
    setTimeout(() => setFeedback(''), 3000);
  };

  const emailsFiltrados = emails.filter(email => {
    if (pastaAtiva === 'entrada') return email.status !== 'concluido' && email.status !== 'excluido';
    if (pastaAtiva === 'nao_lidos') return email.status === 'nao_lido';
    if (pastaAtiva === 'lidos') return email.status === 'lido';
    if (pastaAtiva === 'concluidos') return email.status === 'concluido';
    if (pastaAtiva === 'lixeira') return email.status === 'excluido';
    return true;
  });

  const getCorCategoria = (cat) => {
    switch(cat) {
      case 'Urgente': return '#dc2626';
      case 'Acesso': return '#5b21b6';
      case 'Erro': return '#d97706';
      case 'Suporte': return '#16a34a';
      default: return '#6b6b78';
    }
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

      <main className="tk-client">
        <aside className="tk-sidebar" data-tour="tk-sidebar">
          <button className={`tk-folder ${pastaAtiva === 'entrada' ? 'active' : ''}`} onClick={() => { setPastaAtiva('entrada'); setEmailSelecionado(null); }}>
            Caixa de entrada
          </button>
          <button className={`tk-folder ${pastaAtiva === 'nao_lidos' ? 'active' : ''}`} onClick={() => { setPastaAtiva('nao_lidos'); setEmailSelecionado(null); }}>
            Não lidos
            <span className="tk-badge">{emails.filter(e => e.status === 'nao_lido').length}</span>
          </button>
          <button className={`tk-folder ${pastaAtiva === 'lidos' ? 'active' : ''}`} onClick={() => { setPastaAtiva('lidos'); setEmailSelecionado(null); }}>
            Lidos
          </button>
          <button className={`tk-folder ${pastaAtiva === 'concluidos' ? 'active' : ''}`} onClick={() => { setPastaAtiva('concluidos'); setEmailSelecionado(null); }}>
            Concluídos
          </button>
          <button className={`tk-folder ${pastaAtiva === 'lixeira' ? 'active' : ''}`} onClick={() => { setPastaAtiva('lixeira'); setEmailSelecionado(null); }}>
            Lixeira
          </button>
        </aside>

        <section className="tk-list" data-tour="tk-list">
          {emailsFiltrados.length === 0 ? (
            <p style={{ padding: '24px', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              Nenhuma mensagem nesta pasta.
            </p>
          ) : (
            emailsFiltrados.map(email => (
              <div
                key={email.id}
                className={`tk-item ${email.status === 'nao_lido' ? 'unread' : ''} ${emailSelecionado?.id === email.id ? 'selected' : ''}`}
                onClick={() => abrirEmail(email)}
              >
                <div className="tk-item-header">
                  <span className="tk-sender">{email.remetente}</span>
                  <span className="tk-date">{email.data}</span>
                </div>
                <div className="tk-subject">
                  <span className="tk-dot" style={{ backgroundColor: getCorCategoria(email.categoria) }}></span>
                  {email.assunto}
                </div>
                <div className="tk-preview">{email.corpo}</div>
              </div>
            ))
          )}
        </section>

        <section className="tk-read">
          {emailSelecionado ? (
            <div className="tk-read-content">
              <button 
                className="tk-back" 
                onClick={() => setEmailSelecionado(null)}
              >
                ← Voltar para a lista
              </button>
              <div className="tk-toolbar">
                <button onClick={() => handleAcao('lido')}>Lido</button>
                <button onClick={() => handleAcao('nao_lido')}>Não lido</button>
                <button onClick={() => handleAcao('concluir')}>Concluir</button>
                <button onClick={() => handleAcao('excluir')}>Excluir</button>
                <button onClick={() => handleAcao('encaminhar')}>Encaminhar</button>

                <select
                  className="tk-category-select"
                  value={emailSelecionado.categoria || 'Geral'}
                  onChange={handleCategoriaChange}
                  style={{ color: getCorCategoria(emailSelecionado.categoria) }}
                >
                  <option value="Geral">Geral</option>
                  <option value="Acesso">Acesso</option>
                  <option value="Suporte">Suporte</option>
                  <option value="Erro">Erro</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div className="tk-read-header">
                <h2>{emailSelecionado.assunto}</h2>
                <div className="tk-meta">
                  <div className="tk-avatar">{emailSelecionado.remetente.charAt(0).toUpperCase()}</div>
                  <div className="tk-meta-body">
                    <strong>{emailSelecionado.remetente}</strong>
                    <span>Para: {emailSelecionado.destinatario || 'Você'}</span>
                    <span>{emailSelecionado.data}</span>
                  </div>
                </div>
              </div>

              <div className="tk-read-body">
                <p>{emailSelecionado.corpo}</p>
              </div>

              {showForwardForm && (
                <form onSubmit={enviarEncaminhamento} className="tk-forward">
                  <label>Encaminhar para</label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={forwardDest}
                    onChange={e => setForwardDest(e.target.value)}
                    required
                    autoFocus
                  />
                  <div className="tk-forward-actions">
                    <button type="submit" className="btn-primary">Enviar</button>
                    <button type="button" className="tk-btn-cancel" onClick={() => setShowForwardForm(false)}>Cancelar</button>
                  </div>
                </form>
              )}

              {emailSelecionado.respostas && emailSelecionado.respostas.length > 0 && (
                <div className="tk-reply-thread">
                  <h4>Histórico de respostas</h4>
                  {emailSelecionado.respostas.map((resp, index) => (
                    <div key={index} className="tk-reply-bubble">
                      <div className="tk-reply-meta">Você respondeu em {resp.data}</div>
                      <p>{resp.texto}</p>
                    </div>
                  ))}
                </div>
              )}

              {emailSelecionado.status !== 'concluido' && emailSelecionado.status !== 'excluido' ? (
                <form onSubmit={enviarResposta} className="tk-reply-form">
                  <textarea
                    rows="3"
                    placeholder="Digite sua resposta para o usuário..."
                    value={textoResposta}
                    onChange={e => setTextoResposta(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary">Responder</button>
                </form>
              ) : (
                <div className="tk-concluded">
                  {emailSelecionado.status === 'concluido'
                    ? 'Chamado concluído.'
                    : 'Esta mensagem está na lixeira.'}
                </div>
              )}
            </div>
          ) : (
            <div className="tk-empty">
              Selecione uma mensagem para ler e responder.
            </div>
          )}
        </section>
      </main>

      {feedback && <div className="tk-toast">{feedback}</div>}
    </div>
  );
}