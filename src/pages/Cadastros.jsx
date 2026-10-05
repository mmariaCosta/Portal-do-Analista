import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Cadastros() {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };

  const tabelas = {
    SA1: {
      nome: 'Clientes',
      prefixo: 'A1_',
      desc: 'Cadastro mestre de clientes. Base para pedidos, notas fiscais e títulos.',
      campos: [
        { cod: 'A1_FILIAL', tipo: 'C', tam: '2',  titulo: 'Filial',         obrig: 'S', desc: 'Filial do registro' },
        { cod: 'A1_COD',    tipo: 'C', tam: '6',  titulo: 'Código',         obrig: 'S', desc: 'Código do cliente (chave 1)' },
        { cod: 'A1_LOJA',   tipo: 'C', tam: '2',  titulo: 'Loja',           obrig: 'S', desc: 'Loja do cliente (chave 2)' },
        { cod: 'A1_NOME',   tipo: 'C', tam: '40', titulo: 'Nome',           obrig: 'S', desc: 'Razão social ou nome completo' },
        { cod: 'A1_NREDUZ', tipo: 'C', tam: '20', titulo: 'Nome Reduzido',  obrig: 'N', desc: 'Nome fantasia' },
        { cod: 'A1_CGC',    tipo: 'C', tam: '14', titulo: 'CNPJ/CPF',       obrig: 'S', desc: 'Documento fiscal' },
        { cod: 'A1_EMAIL',  tipo: 'C', tam: '100', titulo: 'E-mail',        obrig: 'N', desc: 'E-mail principal de contato' },
        { cod: 'A1_EST',    tipo: 'C', tam: '2',  titulo: 'UF',             obrig: 'N', desc: 'Unidade federativa' },
        { cod: 'A1_MUN',    tipo: 'C', tam: '20', titulo: 'Município',      obrig: 'N', desc: 'Cidade do cliente' },
        { cod: 'A1_VEND',   tipo: 'C', tam: '6',  titulo: 'Vendedor',       obrig: 'N', desc: 'Vendedor responsável' },
        { cod: 'A1_MSBLQL', tipo: 'C', tam: '1',  titulo: 'Bloqueado',      obrig: 'N', desc: '1 = bloqueado, 2 = liberado' },
        { cod: 'A1_DTCAD',  tipo: 'D', tam: '8',  titulo: 'Data Cadastro',  obrig: 'N', desc: 'Data de inclusão do cliente' },
      ]
    },
    SA3: {
      nome: 'Vendedores',
      prefixo: 'A3_',
      desc: 'Cadastro de vendedores. Vinculado aos clientes e pedidos para cálculo de comissão.',
      campos: [
        { cod: 'A3_FILIAL', tipo: 'C', tam: '2',  titulo: 'Filial',         obrig: 'S', desc: 'Filial do registro' },
        { cod: 'A3_COD',    tipo: 'C', tam: '6',  titulo: 'Código',         obrig: 'S', desc: 'Código do vendedor' },
        { cod: 'A3_NOME',   tipo: 'C', tam: '30', titulo: 'Nome',           obrig: 'S', desc: 'Nome completo do vendedor' },
        { cod: 'A3_NREDUZ', tipo: 'C', tam: '15', titulo: 'Nome Reduzido',  obrig: 'N', desc: 'Nome curto para exibição' },
        { cod: 'A3_EMAIL',  tipo: 'C', tam: '100', titulo: 'E-mail',        obrig: 'N', desc: 'E-mail corporativo' },
        { cod: 'A3_COMIS',  tipo: 'N', tam: '5',  titulo: '% Comissão',     obrig: 'N', desc: 'Percentual de comissão (dec. 2)' },
        { cod: 'A3_DTNASC', tipo: 'D', tam: '8',  titulo: 'Nascimento',     obrig: 'N', desc: 'Data de nascimento' },
        { cod: 'A3_MSBLQL', tipo: 'C', tam: '1',  titulo: 'Bloqueado',      obrig: 'N', desc: '1 = bloqueado, 2 = liberado' },
      ]
    },
    SC5: {
      nome: 'Pedidos de Venda',
      prefixo: 'C5_',
      desc: 'Cabeçalho dos pedidos. Contém o cliente, vendedor, condição de pagamento e totais.',
      campos: [
        { cod: 'C5_FILIAL',  tipo: 'C', tam: '2',  titulo: 'Filial',        obrig: 'S', desc: 'Filial do registro' },
        { cod: 'C5_NUM',     tipo: 'C', tam: '6',  titulo: 'Número',        obrig: 'S', desc: 'Número do pedido (chave)' },
        { cod: 'C5_CLIENTE', tipo: 'C', tam: '6',  titulo: 'Cliente',       obrig: 'S', desc: 'Código do cliente' },
        { cod: 'C5_LOJACLI', tipo: 'C', tam: '2',  titulo: 'Loja Cliente',  obrig: 'S', desc: 'Loja do cliente' },
        { cod: 'C5_VEND1',   tipo: 'C', tam: '6',  titulo: 'Vendedor',      obrig: 'N', desc: 'Vendedor principal' },
        { cod: 'C5_EMISSAO', tipo: 'D', tam: '8',  titulo: 'Emissão',       obrig: 'N', desc: 'Data de emissão do pedido' },
        { cod: 'C5_CONDPAG', tipo: 'C', tam: '3',  titulo: 'Cond. Pagto',   obrig: 'N', desc: 'Condição de pagamento' },
        { cod: 'C5_VALOR',   tipo: 'N', tam: '14', titulo: 'Valor Total',   obrig: 'N', desc: 'Valor total do pedido (dec. 2)' },
        { cod: 'C5_STATUS',  tipo: 'C', tam: '1',  titulo: 'Status',        obrig: 'N', desc: 'Situação do pedido' },
      ]
    },
    SC6: {
      nome: 'Itens do Pedido',
      prefixo: 'C6_',
      desc: 'Detalhamento dos itens de cada pedido. Um pedido pode ter vários itens.',
      campos: [
        { cod: 'C6_FILIAL',  tipo: 'C', tam: '2',  titulo: 'Filial',        obrig: 'S', desc: 'Filial do registro' },
        { cod: 'C6_NUM',     tipo: 'C', tam: '6',  titulo: 'Pedido',        obrig: 'S', desc: 'Número do pedido (chave)' },
        { cod: 'C6_ITEM',    tipo: 'C', tam: '2',  titulo: 'Item',          obrig: 'S', desc: 'Sequência do item (chave)' },
        { cod: 'C6_PRODUTO', tipo: 'C', tam: '15', titulo: 'Produto',       obrig: 'S', desc: 'Código do produto' },
        { cod: 'C6_QTDVEN',  tipo: 'N', tam: '11', titulo: 'Qtde Vendida',  obrig: 'N', desc: 'Quantidade vendida (dec. 2)' },
        { cod: 'C6_PRCVEN',  tipo: 'N', tam: '14', titulo: 'Preço Venda',   obrig: 'N', desc: 'Preço unitário (dec. 2)' },
        { cod: 'C6_VALOR',   tipo: 'N', tam: '14', titulo: 'Valor Total',   obrig: 'N', desc: 'Total do item (dec. 2)' },
        { cod: 'C6_LOCAL',   tipo: 'C', tam: '2',  titulo: 'Armazém',       obrig: 'N', desc: 'Armazém de entrega' },
      ]
    }
  };

  const [tabelaAtiva, setTabelaAtiva] = useState('SA1');
  const tabelaAtual = tabelas[tabelaAtiva];

  const getTipoLabel = (t) => {
    switch (t) {
      case 'C': return { label: 'Caractere', class: 'tipo-c' };
      case 'N': return { label: 'Numérico',  class: 'tipo-n' };
      case 'D': return { label: 'Data',      class: 'tipo-d' };
      case 'L': return { label: 'Lógico',    class: 'tipo-l' };
      case 'M': return { label: 'Memo',      class: 'tipo-m' };
      default:  return { label: t,           class: '' };
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

      <main className="cad-wrap">
        <div className="cad-head">
          <div className="cad-meta">
            <span>Dicionário</span><span className="cad-dot"></span>
            <span>Estrutura de dados</span><span className="cad-dot"></span>
            <span>SX2 · SX3 · SIX · SX7</span>
          </div>
          <h1 className="cad-title">Cadastros <em>Protheus.</em></h1>
          <p className="cad-subtitle">
            Como estruturo as tabelas do sistema, quais campos são realmente
            necessários em cada cadastro e o ciclo de vida completo de um campo
            novo — desde a criação no dicionário até a reindexação.
          </p>
        </div>

        <div className="cad-strip">
          <div className="cad-strip-cell"><div className="lbl">Tabelas no projeto</div><div className="val">4</div></div>
          <div className="cad-strip-cell"><div className="lbl">Campos mapeados</div><div className="val">{Object.values(tabelas).reduce((s, t) => s + t.campos.length, 0)}</div></div>
          <div className="cad-strip-cell"><div className="lbl">Dicionários usados</div><div className="val">4</div></div>
          <div className="cad-strip-cell"><div className="lbl">Índices principais</div><div className="val">8</div></div>
        </div>

        <div className="cad-sec-label">Explorador de tabelas</div>
        <p className="cad-sec-desc">
          Selecione uma tabela para visualizar os campos que a compõem, com tipo,
          tamanho, obrigatoriedade e finalidade de cada um.
        </p>

        <div className="cad-explorer" data-tour="cad-explorer">
          <aside className="cad-tables">
            {Object.entries(tabelas).map(([cod, t]) => (
              <button
                key={cod}
                className={`cad-table-btn ${tabelaAtiva === cod ? 'active' : ''}`}
                onClick={() => setTabelaAtiva(cod)}
              >
                <span className="cad-table-code">{cod}</span>
                <span className="cad-table-name">{t.nome}</span>
                <span className="cad-table-count">{t.campos.length} campos</span>
              </button>
            ))}
          </aside>

          <div className="cad-fields">
            <div className="cad-fields-head">
              <div>
                <div className="cad-fields-tag">{tabelaAtual.prefixo}X · Tabela {tabelaAtiva}</div>
                <h2 className="cad-fields-title">{tabelaAtual.nome}</h2>
                <p className="cad-fields-desc">{tabelaAtual.desc}</p>
              </div>
              <div className="cad-fields-stat">
                <div className="lbl">Total</div>
                <div className="val">{tabelaAtual.campos.length}</div>
              </div>
            </div>

            <div className="cad-fields-table">
              <div className="cad-fields-row head">
                <div>Campo</div>
                <div>Tipo</div>
                <div>Tam</div>
                <div>Título</div>
                <div>Descrição</div>
                <div>Obrig.</div>
              </div>

              {tabelaAtual.campos.map(campo => {
                const tipoInfo = getTipoLabel(campo.tipo);
                return (
                  <div key={campo.cod} className="cad-fields-row">
                    <div className="cad-code">{campo.cod}</div>
                    <div><span className={`tipo-badge ${tipoInfo.class}`}>{tipoInfo.label}</span></div>
                    <div className="cad-tam">{campo.tam}</div>
                    <div className="cad-titulo">{campo.titulo}</div>
                    <div className="cad-desc">{campo.desc}</div>
                    <div>
                      <span className={`obrig-badge ${campo.obrig === 'S' ? 'yes' : 'no'}`}>
                        {campo.obrig === 'S' ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="cad-sec-label">Ciclo de vida de um campo novo</div>
        <p className="cad-sec-desc">
          Quando preciso adicionar um campo em uma tabela existente, sigo este
          fluxo. Cada etapa é obrigatória para que o Protheus reconheça o campo
          corretamente em todas as camadas.
        </p>

        <div className="cad-timeline" data-tour="cad-timeline">
          <div className="cad-step">
            <div className="cad-step-num">01</div>
            <div className="cad-step-dict">SX2</div>
            <h3 className="cad-step-title">Definição base</h3>
            <p className="cad-step-desc">
              Adiciono a linha com a chave <code>X2_CHAVE = 'A'</code>, o arquivo (<code>A1</code>),
              o nome do campo, tipo e tamanho. Isso informa ao Protheus que o campo existe.
            </p>
          </div>

          <div className="cad-step">
            <div className="cad-step-num">02</div>
            <div className="cad-step-dict">SX3</div>
            <h3 className="cad-step-title">Parâmetros</h3>
            <p className="cad-step-desc">
              Configuro título, descrição, picture de formatação, valor inicial e
              obrigatoriedade. É aqui que o campo ganha aparência e comportamento na tela.
            </p>
          </div>

          <div className="cad-step">
            <div className="cad-step-num">03</div>
            <div className="cad-step-dict">SIX</div>
            <h3 className="cad-step-title">Índice</h3>
            <p className="cad-step-desc">
              Se o campo será usado em filtros, ordenações ou chaves de busca,
              preciso adicioná-lo ao índice correspondente. Sem isso, a query não o alcança.
            </p>
          </div>

          <div className="cad-step">
            <div className="cad-step-num">04</div>
            <div className="cad-step-dict">SX7</div>
            <h3 className="cad-step-title">Gatilho</h3>
            <p className="cad-step-desc">
              Se houver regra de negócio (ex: preencher campo X quando campo Y mudar),
              cadastro um gatilho. Isso automatiza a lógica sem precisar programar em ADVPL.
            </p>
          </div>

          <div className="cad-step">
            <div className="cad-step-num">05</div>
            <div className="cad-step-dict">Reindex</div>
            <h3 className="cad-step-title">Reindexação</h3>
            <p className="cad-step-desc">
              Após alterações em dicionário, rodo o reindex para que a estrutura seja
              aplicada em todas as bases. Sem isso, o campo existe apenas em teoria.
            </p>
          </div>
        </div>

        <div className="cad-sec-label">Campos essenciais para relatórios</div>
        <p className="cad-sec-desc">
          Todo relatório precisa, no mínimo, de cinco categorias de campos para
          funcionar bem: agrupamento, exibição, filtro, ordenação e totalização.
        </p>

        <div className="cad-report-grid">
          <div className="cad-report-card">
            <div className="cad-rc-idx">01</div>
            <h3>Agrupamento</h3>
            <p className="cad-rc-desc">Define como os dados serão quebrados no relatório (por cliente, por vendedor, por mês).</p>
            <div className="cad-rc-example">
              <span className="cad-rc-lbl">Exemplo</span>
              <span className="cad-rc-val">A1_COD, A3_COD, C5_VEND1</span>
            </div>
          </div>

          <div className="cad-report-card">
            <div className="cad-rc-idx">02</div>
            <h3>Exibição</h3>
            <p className="cad-rc-desc">Campos de texto que aparecem para o leitor entender cada linha do relatório.</p>
            <div className="cad-rc-example">
              <span className="cad-rc-lbl">Exemplo</span>
              <span className="cad-rc-val">A1_NOME, A3_NOME, C6_PRODUTO</span>
            </div>
          </div>

          <div className="cad-report-card">
            <div className="cad-rc-idx">03</div>
            <h3>Filtro / Período</h3>
            <p className="cad-rc-desc">Campos de data que delimitam o intervalo consultado (data base, emissão, vencimento).</p>
            <div className="cad-rc-example">
              <span className="cad-rc-lbl">Exemplo</span>
              <span className="cad-rc-val">A1_DTCAD, C5_EMISSAO</span>
            </div>
          </div>

          <div className="cad-report-card">
            <div className="cad-rc-idx">04</div>
            <h3>Ordenação</h3>
            <p className="cad-rc-desc">Campos que definem a ordem lógica de apresentação — geralmente datas ou códigos.</p>
            <div className="cad-rc-example">
              <span className="cad-rc-lbl">Exemplo</span>
              <span className="cad-rc-val">C5_EMISSAO, C5_NUM</span>
            </div>
          </div>

          <div className="cad-report-card">
            <div className="cad-rc-idx">05</div>
            <h3>Totalização</h3>
            <p className="cad-rc-desc">Campos numéricos que serão somados para gerar subtotais e total geral.</p>
            <div className="cad-rc-example">
              <span className="cad-rc-lbl">Exemplo</span>
              <span className="cad-rc-val">C6_VALOR, C5_VALOR, A3_COMIS</span>
            </div>
          </div>

          <div className="cad-report-card">
            <div className="cad-rc-idx">06</div>
            <h3>Classificação</h3>
            <p className="cad-rc-desc">Campos que indicam status ou categoria — usados para colorir/classificar visualmente.</p>
            <div className="cad-rc-example">
              <span className="cad-rc-lbl">Exemplo</span>
              <span className="cad-rc-val">A1_MSBLQL, C5_STATUS</span>
            </div>
          </div>
        </div>

        <div className="cad-sec-label">Boas práticas que sigo</div>

        <div className="cad-principles">
          <div className="cad-principle">
            <span className="cad-p-idx">01</span>
            <h3>Nunca altero campo padrão</h3>
            <p>Se preciso de um campo diferente, crio um novo com prefixo personalizado (<code>A1_XMEUCAMPO</code>) em vez de mudar a definição do padrão Protheus.</p>
          </div>
          <div className="cad-principle">
            <span className="cad-p-idx">02</span>
            <h3>Documento tudo em SX3</h3>
            <p>Os campos de descrição no SX3 não são opcionais para mim. Se outro analista abrir o dicionário daqui a um ano, precisa entender o que cada campo faz.</p>
          </div>
          <div className="cad-principle">
            <span className="cad-p-idx">03</span>
            <h3>Índice apenas se justificar</h3>
            <p>Não crio índice para tudo. Se o campo não é usado em filtro, ordenação ou relacionamento, ele não precisa estar na SIX — isso evita overhead desnecessário.</p>
          </div>
          <div className="cad-principle">
            <span className="cad-p-idx">04</span>
            <h3>Reindexar sempre</h3>
            <p>Depois de mexer no dicionário, rodo a reindexação e teste em ambiente controlado antes de aplicar em produção. Não confio no "deve funcionar".</p>
          </div>
        </div>

        <div className="cad-foot">
          <span>Este material é um projeto de demonstração — nenhuma tabela real do cliente é exposta.</span>
        </div>
      </main>
    </div>
  );
}