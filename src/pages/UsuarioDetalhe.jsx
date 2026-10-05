import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usuariosIniciais } from './Configuracoes';
import { sanitizeInput, isValidEmail, isValidPassword } from '../utils/security';


export default function UsuarioDetalhe() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const { id, mode } = params;
  const isNovo = id === 'novo';
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isDelete = mode === 'delete';

  const [form, setForm] = useState({
    codigo: '', nome: '', email: '', senha: '', confirmarSenha: '',
    cargo: '', setor: '', status: 'ativo', dataFimAcesso: ''
  });
  const [original, setOriginal] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('@mock_users');
    const usuarios = saved ? JSON.parse(saved) : usuariosIniciais;

    if (isNovo) {
      // Gera próximo código disponível
      const nums = usuarios
        .map(u => parseInt(String(u.codigo).replace('USR', ''), 10))
        .filter(n => !isNaN(n));
      const proximo = String((Math.max(0, ...nums) + 1)).padStart(3, '0');
      setForm({
        codigo: 'USR' + proximo, nome: '', email: '', senha: '', confirmarSenha: '',
        cargo: '', setor: '', status: 'ativo', dataFimAcesso: ''
      });
      setOriginal(null);
      return;
    }

    const u = usuarios.find(x => String(x.id) === String(id));
    if (!u) {
      navigate('/configuracoes');
      return;
    }

    setForm({
      codigo: u.codigo,
      nome: u.nome,
      email: u.email,
      senha: u.senha,
      confirmarSenha: u.senha,
      cargo: u.cargo,
      setor: u.setor,
      status: u.status,
      dataFimAcesso: u.dataFimAcesso
    });
    setOriginal(u);
  }, [id, mode]);

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };


  const handleChange = (campo, valor) => {
    let v = valor;
    if (campo === 'nome' || campo === 'cargo' || campo === 'setor') {
      v = sanitizeInput(valor, 100);
    } else if (campo === 'email') {
      v = sanitizeInput(valor, 254);
    }
    setForm(prev => ({ ...prev, [campo]: v }));
    if (erro) setErro('');
  };

  const validar = () => {
    if (!form.nome.trim()) return 'Informe o nome do usuário.';
    if (!isValidEmail(form.email)) return 'Informe um e-mail válido.';
    if (!isValidPassword(form.senha)) return 'Senha deve ter ao menos 8 caracteres, com 1 letra e 1 número.';
    if (form.senha !== form.confirmarSenha) return 'As senhas não coincidem.';
    if (!form.cargo.trim()) return 'Informe o cargo.';
    if (!form.setor.trim()) return 'Informe o setor.';
    return '';
  };

  const handleSalvar = () => {
    const msg = validar();
    if (msg) { setErro(msg); return; }

    const saved = localStorage.getItem('@mock_users');
    let usuarios = saved ? JSON.parse(saved) : usuariosIniciais;

    if (isNovo) {
      const novoId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
      const novo = {
        id: novoId,
        codigo: form.codigo,
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cargo: form.cargo,
        setor: form.setor,
        status: form.status,
        dataFimAcesso: form.dataFimAcesso
      };
      usuarios = [...usuarios, novo];
    } else {
      usuarios = usuarios.map(u => u.id === original.id ? {
        ...u,
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cargo: form.cargo,
        setor: form.setor,
        status: form.status,
        dataFimAcesso: form.dataFimAcesso
      } : u);
    }

    localStorage.setItem('@mock_users', JSON.stringify(usuarios));
    navigate('/configuracoes');
  };

  const handleExcluir = () => {
    const saved = localStorage.getItem('@mock_users');
    let usuarios = saved ? JSON.parse(saved) : usuariosIniciais;
    usuarios = usuarios.filter(u => u.id !== original.id);
    localStorage.setItem('@mock_users', JSON.stringify(usuarios));
    navigate('/configuracoes');
  };

  const modoLabel = isNovo ? 'Novo usuário' : isView ? 'Visualização' : isEdit ? 'Alteração' : 'Exclusão';
  const disabled = isView || isDelete;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-logo">Portal do Analista</div>
        <nav className="header-nav">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Início</Link>
          <Link to="/relatorios" className={location.pathname === '/relatorios' ? 'active' : ''}>Relatórios</Link>
          <Link to="/tickets" className={location.pathname === '/tickets' ? 'active' : ''}>Chamados</Link>
          <Link to="/configuracoes" className={location.pathname.startsWith('/configuracoes') ? 'active' : ''}>Configurações</Link>
        </nav>
        <div className="header-user">
          <div className="user-info">
            <strong>{authData.user || 'Usuário'}</strong>
            <span>Filial {authData.filial || '01'} · {authData.modulo || 'Geral'}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="usr-wrap">
        <button className="usr-back" onClick={() => navigate('/configuracoes')}>
          ← Voltar para lista
        </button>

        <div className="usr-head">
          <div className="usr-meta">
            <span>Configurações</span>
            <span className="usr-dot"></span>
            <span>{modoLabel}</span>
            {!isNovo && <><span className="usr-dot"></span><span>{form.codigo}</span></>}
          </div>
          <h1 className="usr-title">
            {isNovo ? <>Cadastrar <em>novo usuário.</em></> :
             isView ? <>Visualizar <em>{form.nome}.</em></> :
             isEdit ? <>Alterar <em>{form.nome}.</em></> :
             <>{form.nome}<em>.</em></>}
          </h1>
          <p className="usr-subtitle">
            {isView && 'Modo somente leitura. Os campos abaixo não podem ser editados.'}
            {isEdit && 'Edite os dados abaixo e clique em Salvar para confirmar as alterações.'}
            {isDelete && 'Revise os dados abaixo. A exclusão é permanente e não poderá ser desfeita.'}
            {isNovo && 'Preencha os dados do novo usuário. Após salvar, ele estará disponível para uso.'}
          </p>
        </div>

        {isDelete && (
          <div className="usr-warning">
            <div className="usr-warning-icon">!</div>
            <div>
              <strong>Atenção — ação irreversível</strong>
              <p>Confirmar a exclusão removerá permanentemente o cadastro de <b>{form.nome}</b>. Esta ação não pode ser desfeita.</p>
            </div>
          </div>
        )}

        <div className="usr-form">
          <div className="usr-section">
            <div className="usr-sec-label">Identificação</div>
            <div className="usr-grid">
              <div className="form-group">
                <label>Código</label>
                <input type="text" value={form.codigo} disabled />
              </div>
              <div className="form-group span-2">
                <label>Nome completo</label>
                <input type="text" value={form.nome} disabled={disabled} onChange={e => handleChange('nome', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="usr-section">
            <div className="usr-sec-label">Acesso</div>
            <div className="usr-grid">
              <div className="form-group span-2">
                <label>E-mail</label>
                <input type="email" value={form.email} disabled={disabled} onChange={e => handleChange('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <div className="usr-pass-wrap">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={form.senha}
                    disabled={disabled}
                    onChange={e => handleChange('senha', e.target.value)}
                  />
                  <button type="button" className="usr-pass-toggle" onClick={() => setMostrarSenha(s => !s)}>
                    {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirmar senha</label>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.confirmarSenha}
                  disabled={disabled}
                  onChange={e => handleChange('confirmarSenha', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="usr-section">
            <div className="usr-sec-label">Função</div>
            <div className="usr-grid">
              <div className="form-group">
                <label>Cargo</label>
                <input type="text" value={form.cargo} disabled={disabled} onChange={e => handleChange('cargo', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Setor</label>
                <input type="text" value={form.setor} disabled={disabled} onChange={e => handleChange('setor', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="usr-section">
            <div className="usr-sec-label">Status e validade</div>
            <div className="usr-grid">
              <div className="form-group">
                <label>Situação</label>
                <div className="usr-status-toggle">
                  <button
                    type="button"
                    className={`usr-status-opt ${form.status === 'ativo' ? 'active' : ''}`}
                    disabled={disabled}
                    onClick={() => handleChange('status', 'ativo')}
                  >Ativo</button>
                  <button
                    type="button"
                    className={`usr-status-opt danger ${form.status === 'bloqueado' ? 'active' : ''}`}
                    disabled={disabled}
                    onClick={() => handleChange('status', 'bloqueado')}
                  >Bloqueado</button>
                </div>
              </div>
              <div className="form-group">
                <label>Data de fim de acesso</label>
                <input type="date" value={form.dataFimAcesso} disabled={disabled} onChange={e => handleChange('dataFimAcesso', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {erro && <div className="usr-error">{erro}</div>}

        <div className="usr-actions">
          <button className="usr-btn-secondary" onClick={() => navigate('/configuracoes')}>
            {isView ? 'Voltar' : 'Cancelar'}
          </button>

          {isEdit && (
            <button className="usr-btn-primary" onClick={handleSalvar}>
              {isNovo ? 'Cadastrar usuário' : 'Salvar alterações'}
            </button>
          )}

          {isDelete && (
            <button className="usr-btn-danger" onClick={handleExcluir}>
              Confirmar exclusão
            </button>
          )}
        </div>
      </main>
    </div>
  );
}