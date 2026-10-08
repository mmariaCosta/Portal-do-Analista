# Segurança

Este projeto é uma demonstração de portfólio. Ele roda inteiramente no
navegador, sem servidor próprio. Ainda assim, apliquei o que fazia sentido
das recomendações do OWASP Top 10, tanto como prática quanto para
documentar o que aprendi estudando segurança por conta própria.

## O que está implementado

### Proteção contra injeção de script (XSS)

Todo campo de texto passa por uma função que remove tags HTML e caracteres
de controle antes de ser usado. Toda saída que vai para HTML é escapada
antes de ser exibida. Isso evita que alguém digite código no formulário e
ele seja executado na tela de outro usuário.

### Bloqueio por tentativas seguidas

Se alguém errar o login cinco vezes seguidas, o sistema bloqueia novas
tentativas por sessenta segundos. A ideia é dificultar tentativa e erro
automático.

### Sessão com expiração

A sessão de login dura no máximo trinta minutos. Se o usuário ficar parado
por esse tempo, o sistema encerra a sessão e pede login novamente. Isso
reduz o risco de alguém usar o computador depois que o dono saiu.

### Nenhuma senha é armazenada

O sistema não guarda senha nenhuma. No login, ele gera um identificador
aleatório e salva apenas esse identificador. Mesmo que alguém inspecione
o navegador, não encontra senha.

### Cabeçalhos de segurança

O site envia alguns cabeçalhos HTTP de proteção:

- `X-Frame-Options: DENY` impede que o site seja embutido dentro de outra
  página (proteção contra clickjacking)
- `X-Content-Type-Options: nosniff` evita que o navegador tente adivinhar
  o tipo de arquivo
- `Referrer-Policy` limita quais informações são enviadas quando o
  usuário clica em um link para fora
- `Permissions-Policy` desativa acesso a câmera, microfone e localização
  geográfica

### HTTPS forçado

Se o site for acessado por HTTP fora do ambiente local, o sistema
redireciona automaticamente para HTTPS.

### Limpeza ao sair

O botão de sair apaga tudo que estava guardado sobre a sessão. Também
remove dados temporários que foram criados durante o uso.

## O que não está implementado e por quê

Este é um projeto apenas de frontend. Sem servidor, várias proteções
importantes não podem ser feitas. Eu sei disso e prefiro deixar claro
em vez de fingir que o projeto é seguro.

**Autenticação real com hash de senha** não existe aqui porque exige
servidor. Um sistema de verdade guarda a senha transformada por um
algoritmo como bcrypt ou argon2, de forma que nem o administrador
consiga ler a senha original.

**Token assinado (JWT)** também precisa de servidor. O token atual é
apenas um identificador aleatório. Um token assinado garante que o
servidor reconheça quando alguém tenta forjar uma sessão.

**Restrição de origem (CORS)** só faz sentido quando existe servidor.
Aqui, todo o tráfego acontece dentro do próprio navegador.

**Log de auditoria** precisa de servidor para registrar quem fez o quê
e quando. Isso é importante em sistemas corporativos para investigar
incidentes.

**Rate limiting real** também precisa de servidor. O bloqueio que
implementei roda apenas no navegador, então alguém com conhecimento
técnico pode contornar recarregando a página.

## Referências que usei

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/