// ============================================================
// Utilitários de segurança — sanitização, validação e escape
// ============================================================

// Remove tags HTML e caracteres de controle
export function sanitizeInput(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u001F\u007F]/g, '') // caracteres de controle
    .replace(/<[^>]*>/g, '')                 // tags HTML
    .replace(/[<>]/g, '')                    // sobrou < ou >
    .trim()
    .slice(0, maxLen);
}

// Escapa caracteres perigosos para reexibição em HTML
export function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return String(str ?? '').replace(/[&<>"'/`=]/g, c => map[c]);
}

// Valida e-mail (formato RFC simplificado)
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

// Valida senha: mínimo 8 caracteres, 1 letra, 1 número
export function isValidPassword(pwd) {
  if (typeof pwd !== 'string') return false;
  if (pwd.length < 8 || pwd.length > 128) return false;
  return /[a-zA-Z]/.test(pwd) && /\d/.test(pwd);
}

// Gera um token pseudo-aleatório (NÃO é seguro para produção real)
export function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// Mascara e-mail para logs: joao@empresa.com → j***@empresa.com
export function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return '*'.repeat(user.length) + '@' + domain;
  return user[0] + '*'.repeat(user.length - 2) + user.slice(-1) + '@' + domain;
}

// ============================================================
// Rate limiting em memória (para login)
// ============================================================
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minuto

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

export function resetRateLimit() {
  sessionStorage.removeItem('@login_attempts');
}