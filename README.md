# 🎯 Protheus Workspace

> Um projeto de estudo que virou portfólio: simulando o dia a dia de um analista no ecossistema TOTVS Protheus com relatórios HTML-ADVPL, chamados de TI e painel de indicadores.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![ADVPL](https://img.shields.io/badge/ADVPL-Protheus-00A651?style=flat&logoColor=white)](https://www.totvs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📖 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Segurança](#-segurança)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [O que aprendi com este projeto](#-o-que-aprendi-com-este-projeto)
- [Próximos passos](#-próximos-passos)
- [Sobre mim](#-sobre-mim)
- [Licença](#-licença)

---

## 💡 Sobre o Projeto

Sou estudante de **Técnico em TI no COTUCA (Unicamp)** e fui aprovada em **Cibersegurança na FIAP**. Trabalho com **ADVPL e Protheus** no dia a dia e decidi criar este projeto para juntar duas coisas que gosto muito: sistemas corporativos e desenvolvimento web.

A ideia foi simples: **simular o ambiente real de um analista de sistemas** em uma aplicação que qualquer pessoa pode abrir no navegador. Tudo funciona de verdade — não é um mockup estático.

> ⚠️ **Todos os dados são fictícios.** Nenhuma informação real de empresa ou cliente é utilizada. É um ambiente seguro para demonstração.

### Por que fiz este projeto?

- Para praticar **React + CSS** fora da sala de aula
- Para mostrar, na prática, o tipo de coisa que faço com **ADVPL e Protheus**
- Para aprender sobre **segurança web** aplicada (que é a área que vou estudar na FIAP)
- Para ter um portfólio real, construído por mim, do zero

Não vou fingir que sei tudo — este projeto tem coisas que eu ainda estou aprendendo. Mas foi feito com cuidado, testado e pensado para ser útil para quem for avaliar meu trabalho.

---

## ✨ Funcionalidades

### 🔐 Login
- Entrada com **Filial** + **Módulo** (como no Protheus)
- Bloqueio após 5 tentativas erradas (para não deixar tentar senha infinitas vezes)
- Sessão que expira depois de 30 minutos parado
- Nenhuma senha fica guardada — só um token aleatório

### 📊 Dashboard
- Números que mudam conforme você interage com o sistema
- Lista dos últimos chamados recebidos
- Atalhos para as tarefas mais comuns

### 📄 Relatórios ADVPL (4 tipos)
- **Títulos a Receber** — cards por cliente
- **Performance de Vendas** — ranking com barras
- **Posição de Estoque** — nível visual (mín/máx)
- **Cadastro de Clientes** — grid com índice por estado
- Botões de **Imprimir** e **Exportar CSV** que funcionam

### 🎫 Chamados de TI
- Funciona como um e-mail: caixa de entrada, lidos, concluídos, lixeira
- Categorias coloridas (Acesso, Suporte, Erro, Urgente)
- Posso responder, encaminhar e concluir
- 10 chamados fictícios já vêm prontos para testar

### 💻 Tela de Código
- Exemplos de **SQL** e **ADVPL** com syntax highlighting
- Cada trecho comentado explicando o que faz

### 📚 Cadastros Protheus
- Explorador das tabelas **SA1, SA3, SC5 e SC6**
- Mostra todos os campos com tipo, tamanho e obrigatoriedade
- Explica o ciclo de vida de um campo novo: **SX2 → SX3 → SIX → SX7 → Reindex**

### ⚙️ Configurações de Usuários
- Lista de usuários cadastrados
- Três ações: **Visualizar**, **Alterar** e **Excluir**
- Cada ação abre uma tela diferente com permissões diferentes

### 🎬 Tour Automático
- Passa por todas as telas sozinho, mostrando o que cada uma faz
- Aparece automaticamente no primeiro login

### 📱 Funciona no celular
- Testado em várias resoluções
- Menu e listas se adaptam para telas pequenas

---

## 🛠 Tecnologias

Essas são as ferramentas que usei. Algumas eu já conhecia, outras estou aprendendo:

### Front-end
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white&style=flat-square)

### Protheus / Back-end simulado
![ADVPL](https://img.shields.io/badge/-ADVPL-00A651?style=flat-square)
![TOTVS Protheus](https://img.shields.io/badge/-TOTVS%20Protheus-000000?style=flat-square)
![SQL](https://img.shields.io/badge/-SQL-4479A1?style=flat-square)

---

## 🔒 Segurança

Essa é a parte que mais me interessou estudar — tanto que vou cursar Cibersegurança na FIAP. Aqui eu tentei aplicar as recomendações do **OWASP Top 10** que estudei por conta própria.

### O que eu fiz

| Ameaça | Como eu tentei evitar |
|---|---|
| **XSS** (injetar script nos campos) | Sanitizo tudo que entra e escapo tudo que sai |
| **Força bruta no login** | Bloqueio após 5 tentativas por 60 segundos |
| **Sessão eterna** | Timeout de 30 minutos de inatividade |
| **Senhas guardadas** | Não guardo senha nenhuma, só um token |
| **Iframe malicioso** | Configurei `X-Frame-Options: DENY` |
| **Scripts externos** | Content Security Policy bloqueia o que não é meu |
| **HTTP sem segurança** | Forço HTTPS em produção |

### O que eu **ainda não sei** fazer

Como este é um projeto só de front-end (sem servidor de verdade), várias proteções importantes **não podem ser feitas aqui**. Eu sei disso e anotei no arquivo [`SECURITY.md`](SECURITY.md):

- Login com hash de senha (bcrypt/argon2) precisa de backend
- Tokens JWT assinados precisam de servidor
- CORS real precisa de servidor
- Logs de auditoria precisam de servidor

**Sinceridade:** isso aqui não é uma aplicação "segura de verdade". É uma demonstração do que eu **entendi** sobre segurança aplicada em front-end. As proteções reais virão quando eu aprender backend.

---

## 🚀 Como Executar

### Você vai precisar de:
- **Node.js 18+** ([baixar aqui](https://nodejs.org/))
- **npm** (vem junto com o Node)

### Passo a passo

```bash
# 1. Baixar o projeto
git clone https://github.com/seu-usuario/portal-analista.git
cd portal-analista

# 2. Instalar o que precisa
npm install

# 3. Rodar
npm run dev