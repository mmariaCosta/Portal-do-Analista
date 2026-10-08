import { useState, useEffect, useCallback } from 'react';

const IMAGENS = [
  {
    src: '/screenshots/login.png',
    alt: 'Tela de login com contexto Protheus',
    titulo: 'Autenticação com contexto Protheus',
  },
  {
    src: '/screenshots/dashboard.png',
    alt: 'Painel de controle com KPIs dinâmicos',
    titulo: 'Painel com indicadores em tempo real',
  },
  {
    src: '/screenshots/chamados.png',
    alt: 'Gestão de chamados de TI por pastas',
    titulo: 'Chamados categorizados por pasta e cor',
  },
  {
    src: '/screenshots/relatorios.png',
    alt: 'Relatório HTML com agrupamentos e subtotais',
    titulo: 'Relatório HTML com subtotais e impressão',
  },
  {
    src: '/screenshots/codigo.png',
    alt: 'Trechos de código SQL e ADVPL',
    titulo: 'Código SQL e ADVPL comentado',
  },
  {
    src: '/screenshots/cadastros.png',
    alt: 'Dicionário Protheus com tabelas SA1, SA3, SC5 e SC6',
    titulo: 'Dicionário Protheus e estrutura de dados',
  },
  {
    src: '/screenshots/configuracoes.png',
    alt: 'Gestão de usuários e permissões',
    titulo: 'Gestão de usuários e permissões',
  },
];

export default function Galeria() {
  const [indexAtual, setIndexAtual] = useState(0);
  const [lightboxAberto, setLightboxAberto] = useState(false);

  const total = IMAGENS.length;

  const irPara = useCallback((i) => {
    setIndexAtual(((i % total) + total) % total);
  }, [total]);

  const proximo = useCallback(() => irPara(indexAtual + 1), [indexAtual, irPara]);
  const anterior = useCallback(() => irPara(indexAtual - 1), [indexAtual, irPara]);

  const abrirLightbox = () => setLightboxAberto(true);
  const fecharLightbox = () => setLightboxAberto(false);

  // Teclado: setas + ESC
  useEffect(() => {
    const onKey = (e) => {
      if (lightboxAberto) {
        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowRight') proximo();
        if (e.key === 'ArrowLeft') anterior();
      } else {
        if (e.key === 'ArrowRight') proximo();
        if (e.key === 'ArrowLeft') anterior();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxAberto, proximo, anterior]);

  // Bloqueia scroll quando o lightbox está aberto
  useEffect(() => {
    document.body.style.overflow = lightboxAberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxAberto]);

  // Pré-carrega a próxima imagem
  useEffect(() => {
    const prox = IMAGENS[(indexAtual + 1) % total];
    const ant = IMAGENS[(indexAtual - 1 + total) % total];
    [prox, ant].forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  }, [indexAtual, total]);

  const imgAtual = IMAGENS[indexAtual];

  return (
    <div className="gal-root">

      {/* ===== CARROSSEL PRINCIPAL ===== */}
      <div className="gal-stage">
        <button
          className="gal-arrow gal-arrow-left"
          onClick={anterior}
          aria-label="Imagem anterior"
          type="button"
        >
          <span className="gal-arrow-icon"></span>
        </button>

        <div className="gal-frame" onClick={abrirLightbox} role="button" tabIndex={0}>
          <img
            className="gal-img"
            src={imgAtual.src}
            alt={imgAtual.alt}
            loading="lazy"
          />
          <div className="gal-zoom-hint">
            <span className="gal-zoom-icon"></span>
            Ampliar
          </div>
        </div>

        <button
          className="gal-arrow gal-arrow-right"
          onClick={proximo}
          aria-label="Próxima imagem"
          type="button"
        >
          <span className="gal-arrow-icon"></span>
        </button>
      </div>

      {/* ===== RODAPÉ: título + indicadores ===== */}
      <div className="gal-footer">
        <div className="gal-caption">{imgAtual.titulo}</div>

        <div className="gal-dots">
          {IMAGENS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`gal-dot ${i === indexAtual ? 'active' : ''}`}
              onClick={() => irPara(i)}
              aria-label={`Ir para imagem ${i + 1}`}
            />
          ))}
        </div>

        <div className="gal-counter">
          {String(indexAtual + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightboxAberto && (
        <div className="gal-lightbox" onClick={fecharLightbox}>
          <button
            className="gal-lb-close"
            onClick={fecharLightbox}
            aria-label="Fechar"
            type="button"
          >
            ×
          </button>

          <button
            className="gal-lb-arrow gal-lb-arrow-left"
            onClick={(e) => { e.stopPropagation(); anterior(); }}
            aria-label="Imagem anterior"
            type="button"
          >
            <span className="gal-arrow-icon"></span>
          </button>

          <img
            className="gal-lb-img"
            src={imgAtual.src}
            alt={imgAtual.alt}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="gal-lb-arrow gal-lb-arrow-right"
            onClick={(e) => { e.stopPropagation(); proximo(); }}
            aria-label="Próxima imagem"
            type="button"
          >
            <span className="gal-arrow-icon"></span>
          </button>

          <div className="gal-lb-caption" onClick={(e) => e.stopPropagation()}>
            {imgAtual.titulo}
            <span className="gal-lb-count">
              {String(indexAtual + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}