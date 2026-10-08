import { useState, useEffect } from 'react';
import AppHeader from '../components/AppHeader';

const emailsIniciais = [
  { id: 1, protocolo: '#2024-0123', remetente: 'joao.silva@empresa.com', solicitante: 'João Silva', destinatario: 'Você', assunto: 'Desbloqueio de Usuário', corpo: 'Olá TI, meu usuário bloqueou após 3 tentativas erradas. Podem desbloquear?', data: '10/10/2024 09:30', status: 'nao_lido', categoria: 'Acesso', prioridade: 'P2', sla: '4h', respostas: [] },
  { id: 2, protocolo: '#2024-0122', remetente: 'maria.souza@empresa.com', solicitante: 'Maria Souza', destinatario: 'Você', assunto: 'Criação de Usuário', corpo: 'Preciso de acesso ao módulo Financeiro para o novo estagiário, Pedro.', data: '10/10/2024 08:15', status: 'nao_lido', categoria: 'Acesso', prioridade: 'P3', sla: '8h', respostas: [] },
  { id: 3, protocolo: '#2024-0121', remetente: 'carlos.mendes@empresa.com', solicitante: 'Carlos Mendes', destinatario: 'Você', assunto: 'Acesso a Relatório', corpo: 'Não consigo acessar o relatório U_RELVEND no menu de Faturamento.', data: '09/10/2024 16:45', status: 'nao_lido', categoria: 'Suporte', prioridade: 'P3', sla: '8h', respostas: [] },
  { id: 4, protocolo: '#2024-0120', remetente: 'ana.paula@empresa.com', solicitante: 'Ana Paula', destinatario: 'Você', assunto: 'Alteração de Permissão', corpo: 'Preciso de permissão de aprovação de pedidos de compra.', data: '09/10/2024 14:20', status: 'nao_lido', categoria: 'Acesso', prioridade: 'P2', sla: '4h', respostas: [] },
  { id: 5, protocolo: '#2024-0119', remetente: 'roberto.alves@empresa.com', solicitante: 'Roberto Alves', destinatario: 'Você', assunto: 'Desbloqueio de Usuário', corpo: 'Usuário travado no Protheus, favor desbloquear.', data: '09/10/2024 11:10', status: 'nao_lido', categoria: 'Urgente', prioridade: 'P1', sla: '1h', respostas: [] },
  { id: 6, protocolo: '#2024-0118', remetente: 'fernanda.lima@empresa.com', solicitante: 'Fernanda Lima', destinatario: 'Você', assunto: 'Criação de Usuário', corpo: 'Novo usuário para o setor de Compras. Nome: Lucas Rocha.', data: '08/10/2024 10:05', status: 'lido', categoria: 'Acesso', prioridade: 'P3', sla: '8h', respostas: [] },
  { id: 7, protocolo: '#2024-0117', remetente: 'lucas.rocha@empresa.com', solicitante: 'Lucas Rocha', destinatario: 'Você', assunto: 'Erro em Relatório', corpo: 'Erro ao gerar relatório de estoque, apresenta divergência.', data: '08/10/2024 09:40', status: 'lido', categoria: 'Erro', prioridade: 'P2', sla: '4h', respostas: [] },
  { id: 8, protocolo: '#2024-0116', remetente: 'juliana.costa@empresa.com', solicitante: 'Juliana Costa', destinatario: 'Você', assunto: 'Mudança de Filial', corpo: 'Fui transferida para a filial 02, preciso de novos acessos.', data: '07/10/2024 15:30', status: 'lido', categoria: 'Suporte', prioridade: 'P3', sla: '8h', respostas: [] },
  { id: 9, protocolo: '#2024-0115', remetente: 'pedro.santos@empresa.com', solicitante: 'Pedro Santos', destinatario: 'Você', assunto: 'Reset de Senha', corpo: 'Esqueci minha senha, podem resetar para a padrão?', data: '07/10/2024 13:15', status: 'lido', categoria: 'Urgente', prioridade: 'P1', sla: '1h', respostas: [] },
  { id: 10, protocolo: '#2024-0114', remetente: 'camila.oliveira@empresa.com', solicitante: 'Camila Oliveira', destinatario: 'Você', assunto: 'Sistema Lento', corpo: 'O sistema está muito lento para emitir nota fiscal hoje.', data: '07/10/2024 10:00', status: 'lido', categoria: 'Erro', prioridade: 'P2', sla: '4h', respostas: [] },
];

export default function Tickets() {
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const [emails, setEmails] = useState([]);
  const [pastaAtiva, setPastaAtiva] = useState('entrada');
  const [emailSelecionado, setEmailSelecionado] = useState(null);
  const [textoResposta, setTextoResposta] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showForwardForm, setShowForwardForm] = useState(false);
  const [forwardDest, setForwardDest] = useState('');
  const [filtroRapido, setFiltroRapido] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('@mock_emails');

    const migrarEmail = (email, idx) => ({
      protocolo: email.protocolo || `#2024-${String(123 - idx).padStart(4, '0')}`,
      solicitante: email.solicitante || email.remetente?.split('@')[0]?.replace('.', ' ') || 'Solicitante',
      prioridade: email.prioridade || 'P3',
      sla: email.sla || '8h',
      respostas: email.respostas || [],
      ...email,
    });

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrados = parsed.map(migrarEmail);
        setEmails(migrados);
        localStorage.setItem('@mock_emails', JSON.stringify(migrados));
      } catch {
        setEmails(emailsIniciais);
        localStorage.setItem('@mock_emails', JSON.stringify(emailsIniciais));
      }
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
        setFeedback('Chamado movido para a lixeira');
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
    if (filtroRapido === 'urgente') return email.categoria === 'Urgente' && email.status !== 'concluido' && email.status !== 'excluido';
    if (filtroRapido === 'sem_resposta') return (email.respostas || []).length === 0 && email.status !== 'concluido' && email.status !== 'excluido';

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

  const getIniciais = (nome) => {
    if (!nome || typeof nome !== 'string') return '??';
    return nome
      .split(' ')
      .map(p => p.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getCorAvatar = (nome) => {
    if (!nome || typeof nome !== 'string') return '#6b6b78';
    const cores = ['#5b21b6', '#0891b2', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#db2777'];
    const soma = nome.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    return cores[soma % cores.length];
  };

  const contarPorPasta = (pasta) => {
    if (pasta === 'entrada') return emails.filter(e => e.status !== 'concluido' && e.status !== 'excluido').length;
    if (pasta === 'nao_lidos') return emails.filter(e => e.status === 'nao_lido').length;
    if (pasta === 'lidos') return emails.filter(e => e.status === 'lido').length;
    if (pasta === 'concluidos') return emails.filter(e => e.status === 'concluido').length;
    if (pasta === 'lixeira') return emails.filter(e => e.status === 'excluido').length;
    return 0;
  };

  return (
    <div className="app-container">
      <AppHeader user={authData} />

      <main className="tk-client">
        <aside className="tk-sidebar" data-tour="tk-sidebar">
          <div className="tk-sidebar-section">
            <div className="tk-sidebar-label">Pastas</div>
            <button
              className={`tk-folder ${pastaAtiva === 'entrada' && !filtroRapido ? 'active' : ''}`}
              onClick={() => { setPastaAtiva('entrada'); setFiltroRapido(null); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#7c3aed' }}></span>
              <span className="tk-folder-label">Caixa de entrada</span>
              <span className="tk-count">{contarPorPasta('entrada')}</span>
            </button>
            <button
              className={`tk-folder ${pastaAtiva === 'nao_lidos' && !filtroRapido ? 'active' : ''}`}
              onClick={() => { setPastaAtiva('nao_lidos'); setFiltroRapido(null); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#2563eb' }}></span>
              <span className="tk-folder-label">Não lidos</span>
              {contarPorPasta('nao_lidos') > 0 && (
                <span className="tk-count tk-count-strong">{contarPorPasta('nao_lidos')}</span>
              )}
            </button>
            <button
              className={`tk-folder ${pastaAtiva === 'lidos' && !filtroRapido ? 'active' : ''}`}
              onClick={() => { setPastaAtiva('lidos'); setFiltroRapido(null); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#8a8a96' }}></span>
              <span className="tk-folder-label">Lidos</span>
              <span className="tk-count">{contarPorPasta('lidos')}</span>
            </button>
            <button
              className={`tk-folder ${pastaAtiva === 'concluidos' && !filtroRapido ? 'active' : ''}`}
              onClick={() => { setPastaAtiva('concluidos'); setFiltroRapido(null); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#16a34a' }}></span>
              <span className="tk-folder-label">Concluídos</span>
              <span className="tk-count">{contarPorPasta('concluidos')}</span>
            </button>
            <button
              className={`tk-folder ${pastaAtiva === 'lixeira' && !filtroRapido ? 'active' : ''}`}
              onClick={() => { setPastaAtiva('lixeira'); setFiltroRapido(null); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#dc2626' }}></span>
              <span className="tk-folder-label">Lixeira</span>
              <span className="tk-count">{contarPorPasta('lixeira')}</span>
            </button>
          </div>

          <div className="tk-sidebar-section">
            <div className="tk-sidebar-label">Filtros rápidos</div>
            <button
              className={`tk-folder tk-folder-filter ${filtroRapido === 'urgente' ? 'active' : ''}`}
              onClick={() => { setFiltroRapido('urgente'); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#dc2626' }}></span>
              <span className="tk-folder-label">Urgentes</span>
            </button>
            <button
              className={`tk-folder tk-folder-filter ${filtroRapido === 'sem_resposta' ? 'active' : ''}`}
              onClick={() => { setFiltroRapido('sem_resposta'); setEmailSelecionado(null); }}
            >
              <span className="tk-folder-mark" style={{ background: '#d97706' }}></span>
              <span className="tk-folder-label">Sem resposta</span>
            </button>
          </div>
        </aside>

        <section className="tk-list" data-tour="tk-list">
          <div className="tk-list-head">
            <h2>
              {filtroRapido === 'urgente' ? 'Chamados urgentes' :
               filtroRapido === 'sem_resposta' ? 'Sem resposta' :
               pastaAtiva === 'entrada' ? 'Caixa de entrada' :
               pastaAtiva === 'nao_lidos' ? 'Não lidos' :
               pastaAtiva === 'lidos' ? 'Lidos' :
               pastaAtiva === 'concluidos' ? 'Concluídos' :
               'Lixeira'}
            </h2>
            <span className="tk-list-count">{emailsFiltrados.length} {emailsFiltrados.length === 1 ? 'chamado' : 'chamados'}</span>
          </div>

          {emailsFiltrados.length === 0 ? (
            <p className="tk-empty-list">Nenhum chamado nesta pasta.</p>
          ) : (
            emailsFiltrados.map(email => (
              <div
                key={email.id}
                className={`tk-item ${email.status === 'nao_lido' ? 'unread' : ''} ${emailSelecionado?.id === email.id ? 'selected' : ''}`}
                onClick={() => abrirEmail(email)}
              >
                <div className="tk-item-header">
                  <div className="tk-item-left">
                    <span className="tk-avatar-small" style={{ backgroundColor: getCorAvatar(email.solicitante) }}>
                      {getIniciais(email.solicitante)}
                    </span>
                    <span className="tk-sender">{email.solicitante}</span>
                  </div>
                  <span className="tk-date">{email.data.split(' ')[1]}</span>
                </div>
                <div className="tk-subject">
                  <span className="tk-dot" style={{ backgroundColor: getCorCategoria(email.categoria) }}></span>
                  {email.assunto}
                </div>
                <div className="tk-preview">{email.corpo}</div>
                <div className="tk-item-foot">
                  <span className="tk-protocolo">{email.protocolo}</span>
                  <span className={`tk-badge-prio tk-prio-${email.prioridade.toLowerCase()}`}>{email.prioridade}</span>
                  <span className={`tk-sla ${email.prioridade === 'P1' ? 'tk-sla-urgent' : email.prioridade === 'P2' ? 'tk-sla-warn' : ''}`}>
                    SLA {email.sla}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="tk-read">
          {emailSelecionado ? (
            <div className="tk-read-card">
              <div className="tk-read-toolbar">
                <button className="tk-back" onClick={() => setEmailSelecionado(null)}>
                  <span className="tk-back-arrow"></span> Voltar
                </button>
                <div className="tk-toolbar-actions">
                  <button className="tk-tb-btn" onClick={() => handleAcao('lido')}>Marcar lido</button>
                  <button className="tk-tb-btn" onClick={() => handleAcao('nao_lido')}>Marcar não lido</button>
                  <button className="tk-tb-btn" onClick={() => handleAcao('encaminhar')}>Encaminhar</button>
                  <button className="tk-tb-btn tk-tb-btn-danger" onClick={() => handleAcao('excluir')}>Excluir</button>
                  <button className="tk-tb-btn tk-tb-btn-primary" onClick={() => handleAcao('concluir')}>Concluir</button>
                </div>
              </div>

              <div className="tk-read-header">
                <div className="tk-read-protocolo">
                  <span className="tk-protocolo-strong">{emailSelecionado.protocolo}</span>
                  <span className={`tk-badge-prio tk-prio-${emailSelecionado.prioridade.toLowerCase()}`}>{emailSelecionado.prioridade}</span>
                  <span className={`tk-sla tk-sla-header ${emailSelecionado.prioridade === 'P1' ? 'tk-sla-urgent' : emailSelecionado.prioridade === 'P2' ? 'tk-sla-warn' : ''}`}>
                    SLA {emailSelecionado.sla}
                  </span>
                </div>
                <h1 className="tk-read-title">{emailSelecionado.assunto}</h1>

                <div className="tk-read-metabar">
                  <div className="tk-avatar" style={{ background: getCorAvatar(emailSelecionado.solicitante) }}>
                    {getIniciais(emailSelecionado.solicitante)}
                  </div>
                  <div className="tk-meta-body">
                    <strong>{emailSelecionado.solicitante}</strong>
                    <span className="tk-meta-email">{emailSelecionado.remetente}</span>
                  </div>
                  <div className="tk-meta-right">
                    <div className="tk-meta-lbl">Aberto em</div>
                    <div className="tk-meta-val">{emailSelecionado.data}</div>
                  </div>
                  <div className="tk-meta-right">
                    <div className="tk-meta-lbl">Categoria</div>
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
                </div>
              </div>

              <div className="tk-read-body">
                <div className="tk-read-body-label">Descrição do chamado</div>
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

              <div className="tk-timeline">
                <div className="tk-timeline-label">Histórico do chamado</div>
                <div className="tk-timeline-item">
                  <span className="tk-timeline-dot tk-tl-dot-open"></span>
                  <span className="tk-timeline-text">Chamado aberto por {emailSelecionado.solicitante}</span>
                  <span className="tk-timeline-time">{emailSelecionado.data}</span>
                </div>
                {emailSelecionado.status !== 'nao_lido' && (
                  <div className="tk-timeline-item">
                    <span className="tk-timeline-dot tk-tl-dot-read"></span>
                    <span className="tk-timeline-text">Visualizado pela equipe de TI</span>
                    <span className="tk-timeline-time">hoje</span>
                  </div>
                )}
                {emailSelecionado.respostas?.map((resp, i) => (
                  <div key={i} className="tk-timeline-item">
                    <span className="tk-timeline-dot tk-tl-dot-reply"></span>
                    <span className="tk-timeline-text">Resposta enviada</span>
                    <span className="tk-timeline-time">{resp.data}</span>
                  </div>
                ))}
                {emailSelecionado.status === 'concluido' && (
                  <div className="tk-timeline-item">
                    <span className="tk-timeline-dot tk-tl-dot-done"></span>
                    <span className="tk-timeline-text">Chamado concluído</span>
                    <span className="tk-timeline-time">hoje</span>
                  </div>
                )}
              </div>

              {emailSelecionado.respostas && emailSelecionado.respostas.length > 0 && (
                <div className="tk-reply-thread">
                  <div className="tk-thread-label">Histórico de respostas</div>
                  {emailSelecionado.respostas.map((resp, index) => (
                    <div key={index} className="tk-reply-bubble">
                      <div className="tk-reply-meta">
                        <span className="tk-reply-author">{authData.nome || 'Você'}</span>
                        <span className="tk-reply-date">{resp.data}</span>
                      </div>
                      <p>{resp.texto}</p>
                    </div>
                  ))}
                </div>
              )}

              {emailSelecionado.status !== 'concluido' && emailSelecionado.status !== 'excluido' ? (
                <form onSubmit={enviarResposta} className="tk-reply-form">
                  <div className="tk-reply-label">Sua resposta</div>
                  <textarea
                    rows="4"
                    placeholder="Digite sua resposta para o solicitante..."
                    value={textoResposta}
                    onChange={e => setTextoResposta(e.target.value)}
                    required
                  />
                  <div className="tk-reply-actions">
                    <span className="tk-reply-hint">Enter para nova linha · Botão para enviar</span>
                    <button type="submit" className="btn-primary">Enviar resposta</button>
                  </div>
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
              <div className="tk-empty-mark"></div>
              <div className="tk-empty-title">Nenhum chamado selecionado</div>
              <p className="tk-empty-desc">
                Selecione um chamado na lista à esquerda para visualizar os detalhes,
                responder ao solicitante ou alterar o status.
              </p>
            </div>
          )}
        </section>
      </main>

      {feedback && <div className="tk-toast">{feedback}</div>}
    </div>
  );
}