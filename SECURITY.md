# Política de Segurança

Este projeto é uma demonstração de portfólio. Ainda assim, aplica-se
defesa em profundidade seguindo as diretrizes do OWASP Top 10.

## Camadas implementadas

### 1. Prevenção de XSS (A03)
- Todo input é sanitizado por `sanitizeInput()` — remove tags e caracteres de controle
- Todo output que vai para HTML é escapado por `escapeHtml()`
- CSP bloqueia execução de scripts de origens externas

### 2. Autenticação (A07)
- Rate limiting: 5 tentativas → bloqueio de 1 minuto
- Senhas não são armazenadas em `sessionStorage`; só um token aleatório
- Sessão expira após 30 minutos de inatividade
- Validação de senha: mínimo 8 caracteres, com letra e número

### 3. Configuração (A05)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` — bloqueia clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` desativa câmera, microfone, geolocalização
- HTTPS forçado em produção

### 4. Dados sensíveis (A02)
- Nenhuma senha real é armazenada (dados mockados)
- Sessão em `sessionStorage` (não `localStorage`) — limpa ao fechar a aba
- Logout limpa todos os dados de sessão e cache local

## Limitações

Por ser uma aplicação **frontend-only** (sem backend), algumas proteções
reais só podem ser implementadas em servidor:
- Autenticação real com bcrypt/argon2
- Tokens JWT com assinatura e rotação
- CORS restrito
- Logs de auditoria no servidor

Estas práticas estão documentadas para demonstrar entendimento
dos conceitos mesmo sem um backend real.

## Referências
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/