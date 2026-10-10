# Protheus Workspace

Portfólio interativo que simula um ambiente corporativo do ecossistema TOTVS Protheus. Login, painel de indicadores, geração de relatórios, gestão de chamados e controle de usuários funcionam de verdade dentro do navegador, com dados inventados.

**Demo:** [protheus-workspace.vercel.app](https://protheus-workspace.vercel.app/)

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias e decisões técnicas](#tecnologias-e-decisões-técnicas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Blocos de código relevantes](#blocos-de-código-relevantes)
- [Configuração de segurança](#configuração-de-segurança)
- [Problemas encontrados e soluções](#problemas-encontrados-e-soluções)
- [Melhorias aplicadas](#melhorias-aplicadas)
- [Próximos passos](#próximos-passos)
- [Referências](#referências)
- [Sobre mim](#sobre-mim)
- [Licença](#licença)

---

## Sobre o projeto

Sou estudante do Técnico em TI no COTUCA (Unicamp) e fui aprovada em Cibersegurança na FIAP. Trabalho com ADVPL e Protheus no dia a dia e construí esse projeto para juntar duas coisas que gosto: sistemas corporativos e desenvolvimento web.

A ideia era simples: criar uma aplicação que qualquer pessoa pudesse abrir no navegador e ver, na prática, o tipo de tarefa que eu resolvo no trabalho. Nada de imagem estática de tela. Cada botão clicado produz efeito, cada formulário tem validação, cada número vem de cálculo real sobre dados fictícios.

Usei o Protheus como tema porque é o sistema que eu conheço. Mas o projeto também é parte do meu caminho para segurança. Entender como um sistema é construído por dentro é o primeiro passo para aprender a proteger ele.

**Nenhum dado é real.** Nenhuma informação de empresa ou cliente foi utilizada.

---

## Funcionalidades

### Login
- Entrada apenas com o nome, sem banco de dados nem senha
- Bloqueio temporário após 5 tentativas seguidas
- Sessão com expiração automática após 30 minutos sem atividade
- Limpeza completa dos dados ao sair

### Painel de controle
- Quatro indicadores no topo (relatórios disponíveis, chamados abertos, concluídos e status do ambiente)
- Lista de atividades recentes com cor por categoria
- Três ações rápidas para as tarefas mais usadas
- Três painéis de análise: chamados por prioridade, por categoria e saúde do ambiente

### Relatórios
Quatro rotinas que geram documentos completos em nova aba:
- **Títulos a Receber** — agrupamento por cliente, status de vencimento e total geral
- **Performance de Vendas** — ranking e barra de progresso por vendedor
- **Posição de Estoque** — indicador visual de nível (mínimo e máximo)
- **Cadastro de Clientes** — dados de contato, status e índice por estado

Cada relatório tem botão de impressão e de exportação em planilha. Tudo com marca d'água de demonstração.

### Chamados de TI
- Caixa de entrada no estilo cliente de e-mail
- Pastas: caixa de entrada, não lidos, lidos, concluídos e lixeira
- Cada chamado tem protocolo, prioridade, SLA e categoria
- Filtros rápidos para urgentes e para chamados sem resposta
- Detalhe mostra histórico em timeline e permite responder, encaminhar ou concluir

### Código e Dicionário
- Aba de SQL com consultas comentadas
- Aba de ADVPL com rotina real devolvendo JSON
- Bloco de código com numeração de linha e destaque de sintaxe
- Dicionário de dados do Protheus com tabelas SA1, SA3, SC5 e SC6
- Ciclo de vida de um campo novo em cinco etapas

### Configurações de usuários
- Lista de usuários cadastrados com status visual
- Três ações por registro: visualizar, alterar e excluir
- Validação de e-mail, senha e campos obrigatórios
- Exclusão pede confirmação explícita antes de executar

### Tour guiado
Passa por todas as telas automaticamente, destacando os elementos principais e explicando o que cada um faz. Aparece no primeiro login e pode ser acionado a qualquer momento.

### Tema claro e escuro
Um botão no cabeçalho alterna entre os dois temas. A escolha fica salva no navegador e é respeitada nos relatórios que abrem em nova aba.

### Notificação de demonstração
Após o login, um card no canto superior direito simula a chegada de um chamado novo. Ao clicar, o sistema abre direto na tela de chamados.

### Responsividade
Layout adaptado para tablet e celular. Menu horizontal vira lista deslizável, colunas se empilham, formulários se reorganizam. Ajustes finos para telas abaixo de 640px e 400px.

---

## Tecnologias e decisões técnicas

### React
Base do projeto. Escolhi porque é a ferramenta que estou mais utilizando no momento e porque permite que cada tela seja um componente com responsabilidade clara.

### Vite
Substitui o Create React App. Build e recarga em tempo real são muito mais rápidos.

### JavaScript puro, sem TypeScript
Ainda estou aprendendo TypeScript. Para esse projeto, o esforço de tipagem não compensava o prazo.

### CSS puro, sem framework
Optei por CSS escrito à mão. Aprendi muito mais sobre variáveis CSS, media queries, grid e flexbox do que se tivesse usado Tailwind ou Bootstrap.

### Variáveis CSS para tema
Os dois temas usam o mesmo conjunto de variáveis CSS. O botão apenas muda um atributo no `<html>`, e todas as cores reagem automaticamente.

### localStorage e sessionStorage
Uso `localStorage` para preferências que devem persistir (tema, usuários cadastrados, chamados fictícios). Uso `sessionStorage` para a sessão de login.

### Rotas protegidas
Toda tela privada é envolvida por um componente que verifica se existe sessão ativa. Sem sessão, redireciona para o login.

### Deploy na Vercel
Integração automática com repositório. Cada push gera um deploy novo em menos de um minuto.

---

## Estrutura do projeto

```
src/
├── components/
│   ├── AppHeader.jsx        Header comum a todas as telas privadas
│   ├── Galeria.jsx          Carrossel + lightbox da apresentação
│   ├── ProtectedRoute.jsx   Guarda de rotas autenticadas
│   └── Tour.jsx             Tour guiado automático
├── hooks/
│   └── useTheme.js          Hook de tema claro/escuro
├── pages/
│   ├── Apresentacao.jsx     Landing page pública
│   ├── Cadastros.jsx        Dicionário de dados Protheus
│   ├── Codigo.jsx           Trechos SQL e ADVPL
│   ├── Configuracoes.jsx    Lista de usuários
│   ├── Dashboard.jsx        Painel inicial
│   ├── Login.jsx            Autenticação simplificada
│   ├── Relatorios.jsx       Central de relatórios
│   ├── Tickets.jsx          Gestão de chamados
│   └── UsuarioDetalhe.jsx   Visualizar / alterar / excluir usuário
├── utils/
│   └── security.js          Sanitização, validação e rate limiting
├── App.jsx                  Configuração de rotas
├── App.css                  Estilos globais (tema, layout, responsivo)
├── index.css                Reset e base
└── main.jsx                 Ponto de entrada

public/
└── screenshots/             Imagens usadas na galeria
```

---

## Como rodar localmente

Pré-requisitos: Node.js 18+ e npm.

```bash
# clonar
git clone https://github.com/mmariacosta/protheus-workspace.git
cd protheus-workspace

# instalar dependências
npm install

# rodar em desenvolvimento
npm run dev
# → http://localhost:5173

# build de produção
npm run build

# pré-visualizar o build
npm run preview
```

---

## Blocos de código relevantes

### 1. Tema aplicado antes do React montar

Evita o "flash" de tema errado ao carregar a página. Fica dentro do `<head>` do `index.html`:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('@pw_theme') || 'light';
      document.documentElement.setAttribute('data-theme', t);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

### 2. Variáveis CSS para tema

Todo o sistema de tema é baseado em variáveis. Trocar o atributo no `<html>` já muda todas as cores:

```css
:root,
[data-theme="light"] {
  --bg: #f4f4f6;
  --surface: #ffffff;
  --text: #111114;
  --accent: #7c3aed;
  --accent-strong: #6d28d9;
  --danger: #dc2626;
}

[data-theme="dark"] {
  --bg: #0d0d0d;
  --surface: #161616;
  --text: #e8e8ea;
  --accent: #a78bfa;
  --accent-strong: #7c3aed;
  --danger: #f87171;
}
```

### 3. Rota protegida

Verifica a sessão antes de renderizar a tela privada:

```jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const auth = sessionStorage.getItem('zauth');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### 4. Rate limiting do login

Bloqueio temporário após 5 tentativas — puro JS, em memória:

```js
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

export function checkRateLimit() {
  const raw = sessionStorage.getItem('@login_attempts');
  const data = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
  if (data.lockedUntil && Date.now() < data.lockedUntil) {
    const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000);
    return { blocked: true, remaining };
  }
  return { blocked: false };
}

export function registerFailedAttempt() {
  const raw = sessionStorage.getItem('@login_attempts');
  const data = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
  data.count = (data.count || 0) + 1;
  if (data.count >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_MS;
    data.count = 0;
  }
  sessionStorage.setItem('@login_attempts', JSON.stringify(data));
}
```

### 5. Sanitização de entrada

Remove tags HTML e caracteres de controle antes de qualquer exibição:

```js
export function sanitizeInput(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}
```

### 6. Relatórios em nova aba com tema preservado

Os relatórios são strings HTML montadas em JS, abertas em nova aba com o tema atual do usuário:

```js
const temaAtual = document.documentElement.getAttribute('data-theme') || 'light';

const html = `<!DOCTYPE html>
<html data-theme="${temaAtual}">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>${cssBase}${cssExtra}</style>
  </head>
  <body>
    <div class="topbar">...</div>
    <div class="wrap">${body}</div>
    <script>${scriptExportar}</script>
  </body>
</html>`;

const w = window.open('', '_blank');
if (w) {
  w.document.write(html);
  w.document.close();
}
```

### 7. Migração de dados salvos

Sempre que a estrutura dos dados salvos muda, é preciso migrar o que já está no navegador:

```js
const migrarEmail = (email, idx) => ({
  protocolo: email.protocolo || `#2024-${String(123 - idx).padStart(4, '0')}`,
  solicitante: email.solicitante || email.remetente?.split('@')[0]?.replace('.', ' ') || 'Solicitante',
  prioridade: email.prioridade || 'P3',
  sla: email.sla || '8h',
  respostas: email.respostas || [],
  ...email,
});
```

### 8. Responsividade — tickets no celular

No celular, a sidebar de pastas vira uma barra horizontal e o painel de leitura ocupa a tela toda:

```css
@media (max-width: 640px) {
  .tk-client {
    grid-template-columns: 1fr;
  }
  .tk-sidebar {
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  .tk-folder {
    flex-shrink: 0;
    white-space: nowrap;
  }
  /* Quando um ticket está aberto, esconde lista e mostra a leitura */
  .tk-client:has(.tk-read-card) .tk-sidebar,
  .tk-client:has(.tk-read-card) .tk-list {
    display: none;
  }
  .tk-client:has(.tk-read-card) .tk-read {
    display: flex;
  }
}
```

---

## Configuração de segurança

### `index.html`

Apenas diretivas que funcionam via `<meta>` são mantidas:

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta http-equiv="Permissions-Policy"
  content="camera=(), microphone=(), geolocation=(), payment=()" />
```

### `vercel.json`

CSP completa e `X-Frame-Options` são enviados via HTTP header, que é o lugar correto:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()" }
      ]
    }
  ]
}
```

---

## Problemas encontrados e soluções

### 1. Aviso no console: `frame-ancestors is ignored when delivered via a <meta> element`

**Causa:** o navegador ignora `frame-ancestors` quando enviado via `<meta>`. Só funciona via HTTP header.

**Solução:** remover do `<meta>` e mover para `vercel.json`.

### 2. Aviso no console: `X-Frame-Options may only be set via an HTTP header`

**Causa:** mesmo problema. Via `<meta>` não tem efeito.

**Solução:** remover do `<meta>` e mover para `vercel.json`.

### 3. `GET /vite.svg 404`

**Causa:** o `index.html` referenciava `/vite.svg`, mas o arquivo não existia mais em `public/`.

**Solução:** trocar por um favicon SVG inline em `data:` ou colocar um arquivo próprio em `public/favicon.svg`.

### 4. Painel de leitura de chamados não abria no celular

**Causa:** o CSS usava `.tk-client:has(.tk-read-content) .tk-read { display: flex }`, mas o JSX não aplicava a classe `tk-read-content` em lugar nenhum. O `:has()` nunca dava match, e o painel de leitura continuava com `display: none` herdado da media query de tablet.

**Solução:** trocar `.tk-read-content` por `.tk-read-card` no CSS, que é a classe realmente aplicada no JSX:

```css
@media (max-width: 640px) {
  .tk-client:has(.tk-read-card) .tk-list { display: none; }
  .tk-client:has(.tk-read-card) .tk-read { display: flex; }
}
```

### 5. Loop infinito de renderização no tour

**Causa:** `useEffect` com dependências instáveis (função `navigate` recriada a cada render) disparava em loop.

**Solução:** isolar `navigate` e `onFinish` em `useRef` para não virar dependência reativa, e guardar a última rota navegada em `navigatedRef`.

```jsx
const navigateRef = useRef(navigate);
useEffect(() => { navigateRef.current = navigate; }, [navigate]);

const navigatedRef = useRef(null);

useEffect(() => {
  if (!active || !step) return;
  if (location.pathname === step.path) return;
  if (navigatedRef.current === step.path) return;
  navigatedRef.current = step.path;
  navigateRef.current(step.path);
}, [active, stepIndex, step?.path, location.pathname]);
```

### 6. Flash de tema errado ao recarregar

**Causa:** o React montava com tema padrão antes de ler o `localStorage`, causando um piscar.

**Solução:** aplicar o tema direto no `<head>`, antes do bundle carregar.

### 7. Perda de dados ao evoluir estrutura

**Causa:** quando o formato dos objetos salvos mudava, dados antigos quebravam a aplicação.

**Solução:** função de migração que preenche campos ausentes com valores padrão, rodando na inicialização.

---

## Melhorias aplicadas

### Interface e usabilidade
- Layout responsivo completo para tablet (≤1024px) e celular (≤640px e ≤400px)
- Sidebar de tickets vira barra horizontal no celular
- Tabelas de configurações e cadastros viram cards empilhados
- Galeria com lightbox, navegação por teclado e pré-carregamento da próxima imagem
- Tour guiado com destaque visual, auto-avanço e barra de progresso

### Performance
- Vite substituindo CRA
- Pré-carregamento das imagens adjacentes na galeria
- `useCallback` nas funções de navegação da galeria para evitar re-render

### Segurança
- Sanitização de entrada em todos os formulários
- Validação de e-mail e senha
- Rate limiting de login com bloqueio temporário
- Sessão em `sessionStorage`, não em `localStorage`
- CSP completa e `X-Frame-Options` enviados via HTTP header
- `escapeHtml` para tudo que é reexibido em HTML

### Acessibilidade
- `aria-label` nos botões sem texto
- `role="button"` e `tabIndex` em elementos clicáveis que não são botões
- Contraste adequado nos dois temas
- Foco visível em campos e botões

### Qualidade de código
- Componentização precoce (header, galeria, tour isolados)
- Hooks personalizados (`useTheme`)
- Utilitários de segurança centralizados em `utils/security.js`
- Migração de dados para não quebrar `localStorage` antigo

---

## Próximos passos

- [ ] Migrar para TypeScript
- [ ] Estudar backend para implementar autenticação real
- [ ] Construir o **SkyGuard**, uma simulação de central de monitoramento de segurança
- [ ] Adicionar testes automatizados (Vitest + Testing Library)
- [ ] Adicionar CI no GitHub Actions
- [ ] Melhorar o tour para funcionar bem em telas pequenas
- [ ] Adicionar `README.md` com screenshots atualizadas

---

## Referências

Documentação e materiais que usei como base durante o desenvolvimento.

### Front-end
- [React — documentação oficial](https://react.dev/)
- [Vite — guia](https://vitejs.dev/guide/)
- [MDN — CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN — Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [MDN — CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [MDN — `:has()` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [web.dev — Responsive design](https://web.dev/responsive-web-design-basics/)

### Segurança
- [OWASP — XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP — Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN — X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

### TOTVS Protheus
- [TOTVS — documentação oficial](https://tdn.totvs.com/)
- [TOTVS — Dicionário de dados (SX2, SX3, SIX, SX7)](https://tdn.totvs.com/display/public/framework/Dicionario)

### Deploy
- [Vercel — configuração de headers](https://vercel.com/docs/projects/project-configuration#headers)
- [Vercel — deploy de SPA com Vite](https://vercel.com/guides/deploying-vite-with-vercel)

---

## Sobre mim

**Maria Costa** — estagiária de desenvolvimento, estudante de Cibersegurança na FIAP a partir de 2027.

- E-mail: [mmaria.costa@outlook.com](mailto:mmaria.costa@outlook.com)
- LinkedIn: [linkedin.com/in/mmariacosta](https://www.linkedin.com/in/mmariacosta)
- GitHub: [github.com/mmariacosta](https://github.com/mmariacosta)

---

## Licença

MIT. Veja [LICENSE](LICENSE) para detalhes.