# Protheus Workspace

Portfólio interativo que simula um ambiente corporativo do ecossistema TOTVS Protheus.
Login, painel de indicadores, geração de relatórios, gestão de chamados e controle de
usuários funcionam de verdade dentro do navegador, com dados inventados.

**Demo:** https://protheus-workspace.vercel.app/

---

## Sobre o projeto

Sou estudante do Técnico em TI no COTUCA (Unicamp) e fui aprovada em Cibersegurança
na FIAP. Trabalho com ADVPL e Protheus no dia a dia e construí esse projeto para juntar
duas coisas que gosto: sistemas corporativos e desenvolvimento web.

A ideia era simples. Criar uma aplicação que qualquer pessoa pudesse abrir no navegador
e ver, na prática, o tipo de tarefa que eu resolvo no trabalho. Nada de imagem estática
de tela. Cada botão clicado produz efeito, cada formulário tem validação, cada número
vem de cálculo real sobre dados fictícios.

Usei o Protheus como tema porque é o sistema que eu conheço. Mas o projeto também
é parte do meu caminho para segurança. Entender como um sistema é construído por
dentro é o primeiro passo para aprender a proteger ele.

**Nenhum dado é real.** Nenhuma informação de empresa ou cliente foi utilizada.

---

## Funcionalidades

### Login
- Entrada apenas com o nome, sem banco de dados nem senha
- Bloqueio temporário após 5 tentativas seguidas, o usuário tem que ser composto com mais de dois caracteres
- Sessão com expiração automática após 30 minutos sem atividade
- Limpeza completa dos dados ao sair

### Painel de controle
- Quatro indicadores no topo (relatórios disponíveis, chamados abertos,
  concluídos e status do ambiente)
- Lista de atividades recentes com cor por categoria
- Três ações rápidas para as tarefas mais usadas
- Três painéis de análise: chamados por prioridade, por categoria e saúde
  do ambiente (uptime, última reindexação, backup, fila de processos e
  usuários conectados)

### Relatórios
Quatro rotinas que geram documentos completos em nova aba:
- **Títulos a Receber**, com agrupamento por cliente, status de vencimento
  e total geral
- **Performance de Vendas**, com ranking e barra de progresso por vendedor
- **Posição de Estoque**, com indicador visual de nível (mínimo e máximo)
  e alerta de produto crítico
- **Cadastro de Clientes**, com dados de contato, status e índice por estado

Cada relatório tem botão de impressão (abre a janela do navegador) e de
exportação em planilha. Tudo com marca d'água de demonstração.

### Chamados de TI
- Caixa de entrada no estilo cliente de e-mail
- Pastas: caixa de entrada, não lidos, lidos, concluídos e lixeira
- Cada chamado tem número de protocolo, prioridade, prazo de atendimento
  e categoria (Acesso, Suporte, Erro, Urgente)
- Filtros rápidos para urgentes e para chamados sem resposta
- Detalhe mostra histórico em formato de timeline (aberto, visualizado,
  respondido, concluído)
- Resposta, encaminhamento, marcação de lido e conclusão

### Código e Dicionário
- Aba de SQL com consultas comentadas explicando cada decisão
- Aba de ADVPL com rotina real devolvendo dados em formato de texto
- Bloco de código com numeração de linha e destaque de sintaxe
- Dicionário de dados do Protheus com as tabelas de clientes, vendedores,
  pedidos e itens
- Cada tabela lista os campos com tipo, tamanho, obrigatoriedade e descrição
- Explicação do ciclo de vida de um campo novo em cinco etapas

### Configurações de usuários
- Lista de usuários cadastrados com status visual
- Três ações por registro: visualizar, alterar e excluir
- Cada ação abre uma tela com permissões diferentes
- Validação de e-mail, senha e campos obrigatórios
- Exclusão pede confirmação explícita antes de executar

### Tour guiado
Passa por todas as telas automaticamente, destacando os elementos
principais e explicando o que cada um faz. Aparece no primeiro login
e pode ser acionado a qualquer momento pelo botão fixo no canto.

### Tema claro e escuro
Um botão no cabeçalho alterna entre os dois temas. A escolha fica salva
no navegador e é respeitada nos relatórios que abrem em nova aba.

### Notificação de demonstração
Após o login, um card no canto superior direito simula a chegada de um
chamado novo. Ao clicar, o sistema abre direto na tela de chamados.

### Responsividade
Layout adaptado para tablet e celular. Menu horizontal vira lista
deslizável, colunas se empilham, formulários se reorganizam.

---

## Tecnologias e decisões técnicas

### React
Base do projeto. Escolhi porque é a ferramenta que estou mais ultilizando no momento e porque permite que cada tela seja um componente com
responsabilidade clara. O sistema tem sete telas e quatro relatórios
gerados dinamicamente, então componentização ajuda bastante.

### Vite
Substitui o Create React App. Motivo principal é velocidade: build e
recarga em tempo real são muito mais rápidos. Também tem configuração
menos verbosa.

### JavaScript puro, sem TypeScript
Ainda estou aprendendo TypeScript. Para esse projeto, o esforço de
tipagem não compensava o prazo, e JavaScript resolve bem.

### CSS puro, sem framework
Optei por CSS escrito à mão. Aprendi muito mais sobre variáveis CSS,
media queries, grid e flexbox do que se tivesse usado Tailwind ou
Bootstrap. E o resultado tem identidade visual própria.

### Variáveis CSS para tema
Os dois temas (claro e escuro) usam o mesmo conjunto de variáveis CSS.
O botão de alternar apenas muda um atributo no `<html>`, e todas as
cores do site reagem automaticamente. Isso evitou duplicar CSS.

### localStorage e sessionStorage
Uso `localStorage` para preferências que devem persistir (tema,
lista de usuários cadastrados, chamados fictícios). Uso
`sessionStorage` para a sessão de login, que precisa sumir quando
o usuário fecha a aba.

### Rotas protegidas
Toda tela privada é envolvida por um componente que verifica se existe
sessão ativa. Sem sessão, redireciona para o login. Isso evita acessar
`/dashboard` direto pela URL.

### Deploy na Vercel
Escolhi porque a integração com repositório é automática. Cada push
para a branch principal gera um deploy novo em menos de um minuto.

---

## Estrutura do projeto
    src/
    components/ Componentes reutilizáveis (header, galeria, tour)
    hooks/ Hooks personalizados (tema, sessão)
    pages/ Cada tela da aplicação
    utils/ Funções auxiliares de segurança
    App.jsx Configuração das rotas
    main.jsx Ponto de entrada
    public/
    screenshots/ Imagens usadas na galeria


---

## O que aprendi construindo isso

- **Estado persistente é traiçoeiro.** Toda vez que mudei a estrutura
  dos dados salvos no navegador, precisei escrever migração. Aprendi
  a versionar formato de dados.

- **Loop infinito de renderização é comum em React.** Um `useEffect`
  com dependência instável trava o navegador. Aprendi a usar `useRef`
  para valores que não devem disparar re-render.

- **Variáveis CSS mudam tudo.** Fazer tema claro e escuro parecia
  assustador. Com variáveis, foi questão de trocar valores.

- **Componentizar cedo economiza tempo.** O cabeçalho estava copiado
  em sete arquivos. Quando precisei mudar, tive que mudar em sete
  lugares. Aprendi a extrair componente na primeira repetição.

- **Segurança em frontend tem limite.** Muita coisa que parecia
  fácil (hash de senha, token assinado, log de auditoria) exige
  backend. Documentei isso em `SECURITY.md`.

---

## Próximos passos

- Migrar para TypeScript
- Estudar backend para implementar autenticação real
- Construir o SkyGuard, uma simulação de central de monitoramento
  de segurança
- Adicionar testes automatizados

---

## Sobre mim

Maria Costa. Estagiária de desenvolvimento, estudante de Cibersegurança
na FIAP a partir de 2027.

- E-mail: mmaria.costa@outlook.com
- LinkedIn: https://www.linkedin.com/in/mmariacosta
- GitHub: https://github.com/mmariacosta

---

## Licença

MIT. Veja [LICENSE](LICENSE) para detalhes.