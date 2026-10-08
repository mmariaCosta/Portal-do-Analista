import { useState } from 'react';
import AppHeader from '../components/AppHeader';

function highlightLine(line, lang) {
  let html = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const trimmed = line.trim();
  const isCommentOnly =
    (lang === 'sql' && trimmed.startsWith('--')) ||
    (lang === 'advpl' && (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')));

  if (isCommentOnly) {
    return `<span class="c-cm">${html}</span>`;
  }

  let commentSuffix = '';
  const marker = lang === 'sql' ? '--' : '//';
  const idx = html.indexOf(marker);
  if (idx > -1) {
    commentSuffix = `<span class="c-cm">${html.slice(idx)}</span>`;
    html = html.slice(0, idx);
  }

  html = html.replace(/("[^"]*")/g, '<span class="c-str">$1</span>');
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="c-num">$1</span>');

  const sqlKw = ['SELECT','FROM','WHERE','AND','OR','LEFT','RIGHT','INNER','JOIN','ON','ORDER','BY','AS','GROUP','HAVING','INSERT','INTO','UPDATE','DELETE','VALUES','SET','LIKE','IN','NOT','NULL','IS','DISTINCT','COUNT','SUM','AVG','MAX','MIN','CASE','WHEN','THEN','ELSE','END','ASC','DESC'];
  const advplKw = ['User','Function','Static','Local','Return','If','Else','ElseIf','EndIf','While','EndDo','For','Next','Do','Case','EndCase','Default','Nil','Self','Public','Private'];

  const kws = lang === 'sql' ? sqlKw : advplKw;
  kws.forEach(kw => {
    const re = new RegExp(`\\b(${kw})\\b`, 'gi');
    html = html.replace(re, '<span class="c-kw">$1</span>');
  });

  return html + commentSuffix;
}

function CodeBlock({ filename, language, code }) {
  const lines = code.trim().split('\n');
  return (
    <div className="dev-code">
      <div className="dev-code-head">
        <div className="dev-code-dots">
          <span></span><span></span><span></span>
        </div>
        <div className="dev-code-file">{filename}</div>
        <div className="dev-code-lang">{language}</div>
      </div>
      <div className="dev-code-body">
        {lines.map((line, i) => (
          <div className="code-line" key={i}>
            <span className="code-ln">{String(i + 1).padStart(2, '0')}</span>
            <span
              className="code-content"
              dangerouslySetInnerHTML={{ __html: highlightLine(line, language === 'SQL' ? 'sql' : 'advpl') }}
            />
          </div>
        ))}
      </div>
      <div className="dev-code-foot">
        <span>UTF-8</span>
        <span>·</span>
        <span>LF</span>
        <span>·</span>
        <span>{lines.length} linhas</span>
        <span className="dev-code-foot-right">{language}</span>
      </div>
    </div>
  );
}

export default function Codigo() {
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};
  const [tab, setTab] = useState('sql');

  const codeSql = `
-- Lista clientes ativos da filial com a região
-- Objetivo: alimentar o painel inicial do portal
SELECT
    T.A1_COD       AS CODIGO,
    T.A1_NOME      AS NOME,
    T.A1_EMAIL     AS EMAIL,
    T.A1_MSBLQL    AS BLOQUEADO,
    A.DESCRICAO    AS REGIAO
FROM SA1010 T
LEFT JOIN CC2010 A
       ON A.CODIGO = T.A1_REGIAO
      AND A.D_E_L_E_T_ = ''
WHERE T.D_E_L_E_T_ = ''
  AND T.A1_FILIAL = :filial
ORDER BY T.A1_COD
  `;

  const codeAdvpl = `
/*/{Protheus.doc} ListaClientes
    Retorna clientes da filial em formato JSON
    para consumo pelo painel React.
    @author Maria Costa
/*/
User Function ListaClientes()
    Local cQry    := ""
    Local cAlias  := GetNextAlias()
    Local oJson   := JsonObject():New()
    Local aItens  := {}
    Local oItem   := Nil

    cQry := "SELECT A1_COD, A1_NOME, A1_EMAIL "
    cQry += "FROM " + RetSQLName("SA1") + " "
    cQry += "WHERE D_E_L_E_T_ = '' "
    cQry += "AND A1_FILIAL = '" + xFilial("SA1") + "'"

    TcQuery(cQry) New Alias(cAlias)

    (cAlias)->(DbGoTop())
    While !(cAlias)->(Eof())
        oItem := JsonObject():New()
        oItem["codigo"] := AllTrim((cAlias)->A1_COD)
        oItem["nome"]   := AllTrim((cAlias)->A1_NOME)
        oItem["email"]  := AllTrim((cAlias)->A1_EMAIL)
        aAdd(aItens, oItem)
        (cAlias)->(DbSkip())
    EndDo

    (cAlias)->(DbCloseArea())
    oJson["items"] := aItens
Return oJson:ToJson()
  `;

  return (
    <div className="app-container">
      <AppHeader user={authData} />

      <main className="dev-wrap">
        <div className="dev-head">
          <div className="dev-meta">
            <span>Desenvolvimento</span>
            <span className="dev-dot"></span>
            <span>SQL & ADVPL</span>
          </div>
          <h1 className="dev-title">Como eu <em>programo.</em></h1>
          <p className="dev-subtitle">
            Trechos curtos e reais do meu dia a dia — queries SQL enxutas e
            rotinas ADVPL de responsabilidade única, escritas com foco em
            clareza, manutenção e desempenho.
          </p>
        </div>

        <div className="dev-tabs" data-tour="dev-tabs">
          <button
            className={`dev-tab ${tab === 'sql' ? 'active' : ''}`}
            onClick={() => setTab('sql')}
          >
            <span className="dev-tab-idx">01</span>
            SQL
            <span className="dev-tab-desc">Queries do Protheus</span>
          </button>
          <button
            className={`dev-tab ${tab === 'advpl' ? 'active' : ''}`}
            onClick={() => setTab('advpl')}
          >
            <span className="dev-tab-idx">02</span>
            ADVPL
            <span className="dev-tab-desc">Rotinas & integrações</span>
          </button>
        </div>

        {tab === 'sql' && (
          <div className="dev-panel">
            <div className="dev-panel-intro">
              <h2>Consultas SQL</h2>
              <p>
                Escrevo as queries com filtros explícitos, joins nomeados e
                nomes de colunas legíveis. Sempre filtrando <code>D_E_L_E_T_</code> e
                a filial para não trazer registros indevidos.
              </p>
            </div>

            <div data-tour="dev-code">
              <CodeBlock
                filename="clientes_ativos.sql"
                language="SQL"
                code={codeSql}
              />
            </div>

            <div className="dev-notes">
              <div className="dev-note">
                <span className="dev-note-idx">01</span>
                <h3>Filtro obrigatório</h3>
                <p>
                  Toda query filtra <code>D_E_L_E_T_ = ''</code> para ignorar registros
                  deletados logicamente pelo Protheus. Sem isso, dados antigos
                  apareceriam nos relatórios.
                </p>
              </div>
              <div className="dev-note">
                <span className="dev-note-idx">02</span>
                <h3>Nomes legíveis com AS</h3>
                <p>
                  Uso <code>AS</code> para renomear colunas crípticas (<code>A1_COD</code>) em
                  nomes compreensíveis (<code>CODIGO</code>). O front-end recebe JSON
                  pronto, sem precisar conhecer o dicionário do Protheus.
                </p>
              </div>
              <div className="dev-note">
                <span className="dev-note-idx">03</span>
                <h3>JOIN explícito</h3>
                <p>
                  <code>LEFT JOIN</code> em vez de <code>JOIN</code> para não perder o cliente
                  caso a tabela auxiliar não tenha correspondência. Sempre
                  com o filtro <code>D_E_L_E_T_</code> também no <code>ON</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'advpl' && (
          <div className="dev-panel">
            <div className="dev-panel-intro">
              <h2>Rotinas ADVPL</h2>
              <p>
                Funções pequenas, com um único propósito. Uso aliases únicos
                via <code>GetNextAlias()</code>, fecho as áreas ao final e sempre
                devolvo JSON para o front-end.
              </p>
            </div>

            <div data-tour="dev-code">
              <CodeBlock
                filename="ListaClientes.prw"
                language="ADVPL"
                code={codeAdvpl}
              />
            </div>

            <div className="dev-notes">
              <div className="dev-note">
                <span className="dev-note-idx">01</span>
                <h3>Alias isolado</h3>
                <p>
                  Nunca uso o alias <code>SA1</code> direto. Sempre gero um novo com
                  <code> GetNextAlias()</code> para evitar conflitos com outras rotinas
                  abertas pelo sistema.
                </p>
              </div>
              <div className="dev-note">
                <span className="dev-note-idx">02</span>
                <h3>Liberação de recursos</h3>
                <p>
                  Ao final do loop sempre chamo <code>(cAlias)-&gt;(DbCloseArea())</code>.
                  Isso libera a área no dicionário e evita o erro clássico
                  "área de trabalho aberta".
                </p>
              </div>
              <div className="dev-note">
                <span className="dev-note-idx">03</span>
                <h3>Retorno em JSON</h3>
                <p>
                  Monto o retorno com <code>JsonObject()</code> para expor direto via
                  REST. É o mesmo padrão que uso nos <code>WSRESTFUL</code> que
                  alimentam este portal.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="dev-section">
          <div className="dev-section-label">Princípios que sigo</div>
          <div className="dev-principles">
            <div className="dev-principle">
              <span className="dev-principle-num">01</span>
              <h3>Simplicidade primeiro</h3>
              <p>Prefiro três funções curtas a uma função gigante. Cada uma faz uma coisa só e faz bem feito.</p>
            </div>
            <div className="dev-principle">
              <span className="dev-principle-num">02</span>
              <h3>Nome claro</h3>
              <p>Variáveis, funções e colunas com nomes que dizem o que são. Sem abreviações obscuras, sem <code>x</code> ou <code>tmp1</code>.</p>
            </div>
            <div className="dev-principle">
              <span className="dev-principle-num">03</span>
              <h3>Tratamento de erro</h3>
              <p>Toda integração REST retorna erro HTTP apropriado. Toda query abre e fecha a área corretamente.</p>
            </div>
            <div className="dev-principle">
              <span className="dev-principle-num">04</span>
              <h3>Documentação mínima</h3>
              <p>Cabeçalho <code>Protheus.doc</code> em toda função relevante. Comentários apenas onde o código não é autoexplicativo.</p>
            </div>
          </div>
        </div>

        <div className="dev-foot">
          <span>Este portal é um projeto de demonstração — nenhum código proprietário é exposto.</span>
        </div>
      </main>
    </div>
  );
}