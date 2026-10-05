import { Link, useLocation, useNavigate } from 'react-router-dom';
import { escapeHtml } from '../utils/security';

export default function Relatorios() {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = JSON.parse(sessionStorage.getItem('zauth')) || {};

  const handleLogout = () => {
    sessionStorage.removeItem('zauth');
    navigate('/login');
  };

  const cssBase = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f4f7; color: #111114; letter-spacing: -0.011em; -webkit-font-smoothing: antialiased; }
    .topbar { position: sticky; top: 0; z-index: 100; padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; background: rgba(245,244,247,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(17,17,20,0.08); }
    .topbar-brand { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #111114; }
    .topbar-brand::before { content: ""; width: 8px; height: 8px; background: #5b21b6; border-radius: 2px; }
    .topbar-actions { display: flex; gap: 8px; }
    .btn { border: 1px solid rgba(17,17,20,0.15); background: #fff; color: #111114; border-radius: 6px; padding: 9px 16px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; letter-spacing: -0.01em; }
    .btn:hover { background: #111114; color: #fff; border-color: #111114; }
    .btn-primary { background: #111114; color: #fff; border-color: #111114; }
    .btn-primary:hover { background: #2a2a32; }
    .demo-bar { background: #fffbeb; border-bottom: 1px solid #fcd34d; padding: 10px 48px; font-size: 12px; color: #78350f; display: flex; align-items: center; gap: 10px; }
    .demo-bar::before { content: ""; width: 6px; height: 6px; background: #d97706; border-radius: 50%; }
    .demo-bar strong { font-weight: 600; }
    .wrap { max-width: 1400px; margin: 0 auto; padding: 56px 48px 80px; }
    .doc-head { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid rgba(17,17,20,0.1); }
    .doc-meta { font-size: 11px; font-weight: 500; color: #6b6b78; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 16px; display: flex; gap: 10px; align-items: center; }
    .doc-meta .dot { width: 3px; height: 3px; background: #c5c2cf; border-radius: 50%; }
    .doc-title { font-size: 38px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.08; color: #111114; margin-bottom: 14px; }
    .doc-title em { font-style: italic; color: #5b21b6; font-weight: 400; }
    .doc-desc { font-size: 15px; color: #6b6b78; line-height: 1.6; max-width: 720px; }
    .params { display: grid; grid-template-columns: repeat(6, 1fr); border-top: 1px solid rgba(17,17,20,0.1); border-bottom: 1px solid rgba(17,17,20,0.1); margin-bottom: 56px; }
    .param { padding: 24px 20px 20px; border-right: 1px solid rgba(17,17,20,0.1); }
    .param:last-child { border-right: none; }
    .param .lbl { font-size: 10px; font-weight: 500; color: #8a8a96; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 12px; }
    .param .val { font-size: 22px; font-weight: 500; color: #111114; letter-spacing: -0.02em; line-height: 1.15; font-variant-numeric: tabular-nums; }
    .param .val small { display: block; font-size: 11px; color: #6b6b78; font-weight: 400; letter-spacing: 0; margin-top: 4px; }
    .param .val.accent { color: #5b21b6; }
    .param .val.danger { color: #dc2626; }
    .param .val.warn { color: #d97706; }
    .param .val.ok { color: #2563eb; }
    .sec-label { font-size: 11px; font-weight: 500; color: #8a8a96; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
    .sec-label::after { content: ""; flex: 1; height: 1px; background: rgba(17,17,20,0.1); }
    .foot { margin-top: 64px; padding-top: 24px; border-top: 1px solid rgba(17,17,20,0.1); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #8a8a96; letter-spacing: 0.08em; }
    .foot strong { color: #6b6b78; font-weight: 500; }
    @media print { body { background: #fff; } .topbar, .demo-bar { display: none; } .wrap { padding: 0; max-width: 100%; } .group, .card { page-break-inside: avoid; } @page { size: A4 landscape; margin: 1.2cm; } }
  `;

  const scriptExportar = `
    function exportarCSV() {
      var rows = document.querySelectorAll('[data-csv]');
      var header = document.querySelector('[data-csv-header]');
      if (!header) return;
      var csv = [];
      var hs = header.querySelectorAll('th');
      var h = [];
      hs.forEach(function(th){ h.push('"' + th.innerText.trim() + '"'); });
      csv.push(h.join(';'));
      rows.forEach(function(r){
        var cells = r.querySelectorAll('td');
        if (cells.length === 0) return;
        var line = [];
        cells.forEach(function(c){ line.push('"' + c.innerText.trim().replace(/\\s+/g,' ') + '"'); });
        csv.push(line.join(';'));
      });
      var blob = new Blob([csv.join('\\n')], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'relatorio.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
  `;

  const openReport = (title, cssExtra, body) => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>${cssBase}${cssExtra}</style></head><body>
      <div class="topbar">
        <div class="topbar-brand">Portal do Analista</div>
        <div class="topbar-actions">
          <button class="btn" onclick="window.print()">Imprimir</button>
          <button class="btn btn-primary" onclick="exportarCSV()">Exportar CSV</button>
        </div>
      </div>
      <div class="demo-bar"><strong>Demonstração.</strong> Este relatório contém dados fictícios criados para fins de portfólio.</div>
      <div class="wrap">${body}</div>
      <script>${scriptExportar}</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
    else alert('Habilite pop-ups para visualizar o relatório.');
  };

  const fmt = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ============================================================
  // 1) TÍTULOS A RECEBER
  // ============================================================
  const gerarRelatorioTitulos = () => {
    const dataBase = new Date().toLocaleDateString('pt-BR');
    const horaBase = new Date().toLocaleTimeString('pt-BR');
    const usuario = escapeHtml(authData.user || 'Visitante');

    const grupos = [
      { chave: 'DEMO-001/X', nome: 'EMPRESA FICTÍCIA ALFA', cidade: 'CIDADE DEMO', uf: 'XX',
        titulos: [
          { doc: 'DOC-AAAA', venc: '31/12/2099', dias: 0, status: 'hoje', valor: 100 },
          { doc: 'DOC-BBBB', venc: '15/02/2099', dias: -30, status: 'avencer', valor: 200 },
          { doc: 'DOC-CCCC', venc: '31/12/2050', dias: 9999, status: 'vencido', valor: 300 },
        ]},
      { chave: 'DEMO-002/Y', nome: 'COMÉRCIO FICTÍCIO BETA', cidade: 'MUNICÍPIO TESTE', uf: 'YY',
        titulos: [
          { doc: 'DOC-DDDD', venc: '10/07/2050', dias: 5000, status: 'vencido', valor: 400 },
          { doc: 'DOC-EEEE', venc: '01/02/2099', dias: -25, status: 'avencer', valor: 500 },
        ]},
      { chave: 'DEMO-003/Z', nome: 'INDÚSTRIA FICTÍCIA GAMA', cidade: 'LOCALIDADE DEMO', uf: 'ZZ',
        titulos: [
          { doc: 'DOC-FFFF', venc: '31/12/2000', dias: 99999, status: 'vencido', valor: 1000 },
          { doc: 'DOC-GGGG', venc: '15/12/2099', dias: -100, status: 'avencer', valor: 2000 },
          { doc: 'DOC-HHHH', venc: '01/01/2099', dias: 0, status: 'hoje', valor: 3000 },
        ]},
    ];

    let totalItens = 0, venc = 0, avenc = 0, hoje = 0, soma = 0;
    grupos.forEach(g => g.titulos.forEach(t => {
      totalItens++; soma += t.valor;
      if (t.status === 'vencido') venc++; else if (t.status === 'avencer') avenc++; else hoje++;
    }));

    const cssExtra = `
      .client { background: #fff; border: 1px solid rgba(17,17,20,0.08); border-radius: 12px; margin-bottom: 24px; overflow: hidden; page-break-inside: avoid; }
      .client-head { padding: 24px 28px; border-bottom: 1px solid rgba(17,17,20,0.06); display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
      .client-id h3 { font-size: 17px; font-weight: 500; letter-spacing: -0.02em; color: #111114; margin-bottom: 4px; }
      .client-id p { font-size: 12px; color: #6b6b78; }
      .client-stat { display: flex; gap: 32px; }
      .client-stat div { text-align: right; }
      .client-stat .lbl { font-size: 10px; color: #8a8a96; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; font-weight: 500; }
      .client-stat .val { font-size: 18px; font-weight: 500; color: #111114; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
      .client-body { padding: 20px 28px 24px; }
      .client-body table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .client-body thead th { text-align: left; padding: 8px 10px; font-size: 10px; color: #8a8a96; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; border-bottom: 1px solid rgba(17,17,20,0.15); }
      .client-body tbody td { padding: 12px 10px; border-bottom: 1px solid rgba(17,17,20,0.05); color: #111114; }
      .client-body tbody tr:last-child td { border-bottom: none; }
      .client-body .mono { font-family: "Consolas", monospace; font-size: 12px; color: #4a4a52; }
      .client-body .muted { color: #8a8a96; font-size: 12px; }
      .client-body .num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; }
      .status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
      .status::before { content: ""; width: 6px; height: 6px; border-radius: 50%; }
      .status.vencido::before { background: #dc2626; }
      .status.avencer::before { background: #d97706; }
      .status.hoje::before { background: #2563eb; }
      .grand-total { margin-top: 24px; padding: 24px 32px; background: #111114; color: #fff; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
      .grand-total .lbl { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; }
      .grand-total .val { font-size: 24px; font-weight: 500; font-variant-numeric: tabular-nums; }
    `;

    let body = `
      <header class="doc-head">
        <div class="doc-meta"><span>Relatório</span><span class="dot"></span><span>Títulos a Receber</span><span class="dot"></span><span>U_DEMO_REL</span><span class="dot"></span><span>${dataBase}</span></div>
        <h1 class="doc-title">Títulos a Receber<br /><em>por cliente.</em></h1>
        <p class="doc-desc">Demonstrativo analítico de títulos em aberto, agrupados por cliente, com classificação por status de vencimento e totalização consolidada.</p>
      </header>
      <div class="params">
        <div class="param"><div class="lbl">Emissão</div><div class="val">${dataBase}<small>${horaBase}</small></div></div>
        <div class="param"><div class="lbl">Usuário</div><div class="val">${usuario}<small>Filial 01</small></div></div>
        <div class="param"><div class="lbl">Registros</div><div class="val">${totalItens}<small>${grupos.length} clientes</small></div></div>
        <div class="param"><div class="lbl">Vencidos</div><div class="val danger">${venc}<small>em atraso</small></div></div>
        <div class="param"><div class="lbl">A vencer</div><div class="val warn">${avenc}<small>dentro do prazo</small></div></div>
        <div class="param"><div class="lbl">Vencem hoje</div><div class="val ok">${hoje}<small>atenção imediata</small></div></div>
      </div>
      <div class="sec-label">Detalhamento por cliente</div>
    `;

    grupos.forEach(g => {
      let somaCliente = 0;
      g.titulos.forEach(t => somaCliente += t.valor);
      body += `
        <div class="client">
          <div class="client-head">
            <div class="client-id">
              <h3>${g.nome}</h3>
              <p>${g.chave} · ${g.cidade} · ${g.uf}</p>
            </div>
            <div class="client-stat">
              <div><div class="lbl">Títulos</div><div class="val">${g.titulos.length}</div></div>
              <div><div class="lbl">Total</div><div class="val">R$ ${fmt(somaCliente)}</div></div>
            </div>
          </div>
          <div class="client-body">
            <table>
              <thead data-csv-header><tr>
                <th>Documento</th><th>Vencimento</th><th>Dias</th><th>Status</th><th style="text-align:right">Valor</th>
              </tr></thead>
              <tbody>
      `;
      g.titulos.forEach(t => {
        let diasTxt = t.status === 'vencido' ? `${t.dias} dias` : t.status === 'avencer' ? `Faltam ${Math.abs(t.dias)} dias` : 'Hoje';
        let stTxt = t.status === 'vencido' ? 'Vencido' : t.status === 'avencer' ? 'A Vencer' : 'Vence hoje';
        body += `<tr data-csv>
          <td class="mono">${t.doc}</td>
          <td class="muted">${t.venc}</td>
          <td class="muted">${diasTxt}</td>
          <td><span class="status ${t.status}">${stTxt}</span></td>
          <td class="num">${fmt(t.valor)}</td>
        </tr>`;
      });
      body += `</tbody></table></div></div>`;
    });

    body += `
      <div class="grand-total">
        <div class="lbl">Total geral consolidado</div>
        <div class="val">R$ ${fmt(soma)}</div>
      </div>
      <div class="foot">
        <span><strong>U_DEMO_REL</strong> · Portal do Analista · Documento técnico</span>
        <span>Emitido em ${dataBase} às ${horaBase} por ${usuario}</span>
      </div>
    `;

    openReport('U_DEMO_REL — Títulos a Receber', cssExtra, body);
  };

  // ============================================================
  // 2) PERFORMANCE DE VENDAS
  // ============================================================
  const gerarRelatorioVendas = () => {
    const dataBase = new Date().toLocaleDateString('pt-BR');
    const horaBase = new Date().toLocaleTimeString('pt-BR');
    const usuario = authData.user || 'Visitante';

    const vendedores = [
      { pos: 1, nome: 'VENDEDOR FICTÍCIO ALFA', cod: 'DEMO-001', regiao: 'SUDESTE', meta: 50000, realizado: 62000, pedidos: 42 },
      { pos: 2, nome: 'VENDEDOR FICTÍCIO BETA', cod: 'DEMO-002', regiao: 'SUL', meta: 45000, realizado: 41000, pedidos: 36 },
      { pos: 3, nome: 'VENDEDOR FICTÍCIO GAMA', cod: 'DEMO-003', regiao: 'NORDESTE', meta: 40000, realizado: 38500, pedidos: 31 },
      { pos: 4, nome: 'VENDEDOR FICTÍCIO DELTA', cod: 'DEMO-004', regiao: 'CENTRO-OESTE', meta: 35000, realizado: 22000, pedidos: 18 },
      { pos: 5, nome: 'VENDEDOR FICTÍCIO EPSILON', cod: 'DEMO-005', regiao: 'NORTE', meta: 30000, realizado: 14500, pedidos: 11 },
    ];

    const totalRealizado = vendedores.reduce((s, v) => s + v.realizado, 0);
    const totalMeta = vendedores.reduce((s, v) => s + v.meta, 0);
    const pctGeral = Math.round((totalRealizado / totalMeta) * 100);

    const cssExtra = `
      .ranking { display: flex; flex-direction: column; gap: 12px; }
      .rank-row { background: #fff; border: 1px solid rgba(17,17,20,0.08); border-radius: 12px; padding: 22px 28px; display: grid; grid-template-columns: 60px 1fr 260px 320px; gap: 24px; align-items: center; page-break-inside: avoid; }
      .rank-pos { font-size: 32px; font-weight: 500; color: #111114; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; line-height: 1; }
      .rank-pos.top1 { color: #5b21b6; }
      .rank-pos.top2 { color: #6b6b78; }
      .rank-pos.top3 { color: #d97706; }
      .rank-name h3 { font-size: 16px; font-weight: 500; color: #111114; margin-bottom: 4px; letter-spacing: -0.02em; }
      .rank-name p { font-size: 12px; color: #6b6b78; }
      .bar-wrap { display: flex; flex-direction: column; gap: 6px; }
      .bar-labels { display: flex; justify-content: space-between; font-size: 10px; color: #8a8a96; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
      .bar-track { height: 6px; background: #efedf3; border-radius: 3px; overflow: hidden; }
      .bar-fill { height: 100%; background: #5b21b6; border-radius: 3px; }
      .bar-fill.warn { background: #d97706; }
      .bar-fill.ok { background: #16a34a; }
      .rank-metrics { display: flex; gap: 24px; justify-content: flex-end; }
      .rank-metric { text-align: right; }
      .rank-metric .lbl { font-size: 10px; color: #8a8a96; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; font-weight: 500; }
      .rank-metric .val { font-size: 14px; font-weight: 500; color: #111114; font-variant-numeric: tabular-nums; }
    `;

    let body = `
      <header class="doc-head">
        <div class="doc-meta"><span>Relatório</span><span class="dot"></span><span>Performance de Vendas</span><span class="dot"></span><span>U_DEMO_VEND</span><span class="dot"></span><span>${dataBase}</span></div>
        <h1 class="doc-title">Performance de Vendas<br /><em>ranking por vendedor.</em></h1>
        <p class="doc-desc">Comparativo de desempenho individual no período, com apuração de meta, realizado e percentual de atingimento.</p>
      </header>
      <div class="params">
        <div class="param"><div class="lbl">Emissão</div><div class="val">${dataBase}<small>${horaBase}</small></div></div>
        <div class="param"><div class="lbl">Usuário</div><div class="val">${usuario}<small>Filial 01</small></div></div>
        <div class="param"><div class="lbl">Vendedores</div><div class="val">${vendedores.length}<small>no ranking</small></div></div>
        <div class="param"><div class="lbl">Realizado</div><div class="val">R$ ${(totalRealizado/1000).toFixed(0)}k<small>soma total</small></div></div>
        <div class="param"><div class="lbl">Meta total</div><div class="val">R$ ${(totalMeta/1000).toFixed(0)}k<small>objetivo</small></div></div>
        <div class="param"><div class="lbl">Atingimento</div><div class="val ${pctGeral >= 100 ? 'ok' : 'warn'}">${pctGeral}%<small>da meta geral</small></div></div>
      </div>
      <div class="sec-label">Ranking de vendedores</div>
      <div class="ranking">
    `;

    vendedores.forEach(v => {
      const pct = Math.round((v.realizado / v.meta) * 100);
      const barClass = pct >= 100 ? 'ok' : pct >= 60 ? '' : 'warn';
      const posClass = v.pos === 1 ? 'top1' : v.pos === 2 ? 'top2' : v.pos === 3 ? 'top3' : '';
      const pad = String(v.pos).padStart(2, '0');

      body += `
        <div class="rank-row">
          <div class="rank-pos ${posClass}">${pad}</div>
          <div class="rank-name">
            <h3>${v.nome}</h3>
            <p>${v.cod} · Região ${v.regiao} · ${v.pedidos} pedidos</p>
          </div>
          <div class="bar-wrap">
            <div class="bar-labels"><span>Realizado</span><span>${pct}%</span></div>
            <div class="bar-track"><div class="bar-fill ${barClass}" style="width:${Math.min(pct, 100)}%"></div></div>
          </div>
          <div class="rank-metrics">
            <div class="rank-metric"><div class="lbl">Realizado</div><div class="val">R$ ${fmt(v.realizado)}</div></div>
            <div class="rank-metric"><div class="lbl">Meta</div><div class="val">R$ ${fmt(v.meta)}</div></div>
          </div>
        </div>`;
    });

    body += `</div>
      <div class="foot">
        <span><strong>U_DEMO_VEND</strong> · Portal do Analista · Documento técnico</span>
        <span>Emitido em ${dataBase} às ${horaBase} por ${usuario}</span>
      </div>
    `;

    openReport('U_DEMO_VEND — Performance de Vendas', cssExtra, body);
  };

  // ============================================================
  // 3) POSIÇÃO DE ESTOQUE
  // ============================================================
  const gerarRelatorioEstoque = () => {
    const dataBase = new Date().toLocaleDateString('pt-BR');
    const horaBase = new Date().toLocaleTimeString('pt-BR');
    const usuario = authData.user || 'Visitante';

    const armazens = [
      { cod: '01', nome: 'ARMAZÉM DEMO CENTRAL', cidade: 'CIDADE DEMO',
        produtos: [
          { cod: 'PROD-AAA', nome: 'PRODUTO FICTÍCIO ALFA', saldo: 145, min: 50, max: 200, unit: 'UN', valor: 45.90 },
          { cod: 'PROD-BBB', nome: 'PRODUTO FICTÍCIO BETA', saldo: 32, min: 80, max: 300, unit: 'UN', valor: 128.50 },
          { cod: 'PROD-CCC', nome: 'PRODUTO FICTÍCIO GAMA', saldo: 210, min: 60, max: 250, unit: 'CX', valor: 89.90 },
        ]},
      { cod: '02', nome: 'ARMAZÉM DEMO SUL', cidade: 'MUNICÍPIO TESTE',
        produtos: [
          { cod: 'PROD-DDD', nome: 'PRODUTO FICTÍCIO DELTA', saldo: 18, min: 40, max: 150, unit: 'UN', valor: 210.00 },
          { cod: 'PROD-EEE', nome: 'PRODUTO FICTÍCIO EPSILON', saldo: 95, min: 30, max: 180, unit: 'UN', valor: 65.40 },
        ]},
    ];

    let totalProdutos = 0, totalCriticos = 0, valorTotal = 0;
    armazens.forEach(a => a.produtos.forEach(p => {
      totalProdutos++; valorTotal += p.saldo * p.valor;
      if (p.saldo < p.min) totalCriticos++;
    }));

    const cssExtra = `
      .warehouse { background: #fff; border: 1px solid rgba(17,17,20,0.08); border-radius: 12px; margin-bottom: 24px; overflow: hidden; page-break-inside: avoid; }
      .wh-head { padding: 22px 28px; border-bottom: 1px solid rgba(17,17,20,0.06); display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
      .wh-id h3 { font-size: 16px; font-weight: 500; color: #111114; margin-bottom: 4px; letter-spacing: -0.02em; }
      .wh-id p { font-size: 12px; color: #6b6b78; }
      .wh-id p code { font-family: "Consolas", monospace; color: #5b21b6; background: #ede9fe; padding: 2px 6px; border-radius: 3px; font-size: 11px; }
      .wh-stat { display: flex; gap: 28px; }
      .wh-stat .lbl { font-size: 10px; color: #8a8a96; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 4px; font-weight: 500; }
      .wh-stat .val { font-size: 16px; font-weight: 500; color: #111114; font-variant-numeric: tabular-nums; }
      .prod-list { padding: 8px 28px 20px; }
      .prod-row { display: grid; grid-template-columns: 1.6fr 1fr 220px 140px; gap: 24px; padding: 20px 0; border-bottom: 1px solid rgba(17,17,20,0.05); align-items: center; }
      .prod-row:last-child { border-bottom: none; }
      .prod-id h4 { font-size: 14px; font-weight: 500; color: #111114; margin-bottom: 3px; }
      .prod-id p { font-size: 11px; color: #8a8a96; font-family: "Consolas", monospace; }
      .prod-info { font-size: 12px; color: #6b6b78; }
      .prod-info strong { color: #111114; font-weight: 500; }
      .level-bar { display: flex; flex-direction: column; gap: 6px; }
      .level-labels { display: flex; justify-content: space-between; font-size: 10px; color: #8a8a96; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
      .level-track { height: 8px; background: #efedf3; border-radius: 4px; overflow: hidden; position: relative; }
      .level-min { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #dc2626; }
      .level-fill { height: 100%; border-radius: 4px; }
      .level-fill.ok { background: #16a34a; }
      .level-fill.warn { background: #d97706; }
      .level-fill.critical { background: #dc2626; }
      .prod-valor { text-align: right; font-variant-numeric: tabular-nums; }
      .prod-valor .val { font-size: 14px; font-weight: 500; color: #111114; }
      .prod-valor .lbl { font-size: 10px; color: #8a8a96; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
      .badge-critico { display: inline-block; font-size: 10px; color: #dc2626; background: #fef2f2; padding: 2px 8px; border-radius: 8px; margin-left: 6px; font-weight: 600; letter-spacing: 0.06em; }
    `;

    let body = `
      <header class="doc-head">
        <div class="doc-meta"><span>Relatório</span><span class="dot"></span><span>Posição de Estoque</span><span class="dot"></span><span>U_DEMO_ESTQ</span><span class="dot"></span><span>${dataBase}</span></div>
        <h1 class="doc-title">Posição de Estoque<br /><em>por armazém.</em></h1>
        <p class="doc-desc">Levantamento de saldo físico e financeiro por armazém, com indicador visual de nível em relação ao estoque mínimo e máximo.</p>
      </header>
      <div class="params">
        <div class="param"><div class="lbl">Emissão</div><div class="val">${dataBase}<small>${horaBase}</small></div></div>
        <div class="param"><div class="lbl">Usuário</div><div class="val">${usuario}<small>Filial 01</small></div></div>
        <div class="param"><div class="lbl">Armazéns</div><div class="val">${armazens.length}<small>ativos</small></div></div>
        <div class="param"><div class="lbl">Produtos</div><div class="val">${totalProdutos}<small>no total</small></div></div>
        <div class="param"><div class="lbl">Críticos</div><div class="val danger">${totalCriticos}<small>abaixo do mínimo</small></div></div>
        <div class="param"><div class="lbl">Valor total</div><div class="val accent">R$ ${(valorTotal/1000).toFixed(1)}k<small>em estoque</small></div></div>
      </div>
      <div class="sec-label">Detalhamento por armazém</div>
    `;

    armazens.forEach(a => {
      body += `
        <div class="warehouse">
          <div class="wh-head">
            <div class="wh-id">
              <h3>${a.nome}</h3>
              <p><code>${a.cod}</code> · ${a.cidade}</p>
            </div>
            <div class="wh-stat">
              <div><div class="lbl">Produtos</div><div class="val">${a.produtos.length}</div></div>
            </div>
          </div>
          <div class="prod-list">
      `;
      a.produtos.forEach(p => {
        const pct = Math.min(Math.round((p.saldo / p.max) * 100), 100);
        const critico = p.saldo < p.min;
        const nivelClass = critico ? 'critical' : pct < 60 ? 'warn' : 'ok';
        body += `
          <div class="prod-row">
            <div class="prod-id">
              <h4>${p.nome}${critico ? '<span class="badge-critico">CRÍTICO</span>' : ''}</h4>
              <p>${p.cod} · Unidade: ${p.unit}</p>
            </div>
            <div class="prod-info">
              <strong>${p.saldo}</strong> em estoque<br />
              mínimo ${p.min} · máximo ${p.max}
            </div>
            <div class="level-bar">
              <div class="level-labels"><span>Nível</span><span>${pct}%</span></div>
              <div class="level-track">
                <div class="level-min"></div>
                <div class="level-fill ${nivelClass}" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="prod-valor">
              <div class="lbl">Valor unit.</div>
              <div class="val">R$ ${fmt(p.valor)}</div>
            </div>
          </div>
        `;
      });
      body += `</div></div>`;
    });

    body += `
      <div class="foot">
        <span><strong>U_DEMO_ESTQ</strong> · Portal do Analista · Documento técnico</span>
        <span>Emitido em ${dataBase} às ${horaBase} por ${usuario}</span>
      </div>
    `;

    openReport('U_DEMO_ESTQ — Posição de Estoque', cssExtra, body);
  };

  // ============================================================
  // 4) CADASTRO DE CLIENTES
  // ============================================================
  const gerarRelatorioClientes = () => {
    const dataBase = new Date().toLocaleDateString('pt-BR');
    const horaBase = new Date().toLocaleTimeString('pt-BR');
    const usuario = authData.user || 'Visitante';

    const clientes = [
      { cod: 'DEMO-001', loja: 'X', nome: 'EMPRESA FICTÍCIA ALFA', cnpj: '00.000.000/0001-00', uf: 'XX', cidade: 'CIDADE DEMO', contato: 'contato.alfa@demo.com', fone: '(00) 0000-0000', status: 'ativo', desde: '01/01/2020' },
      { cod: 'DEMO-002', loja: 'Y', nome: 'COMÉRCIO FICTÍCIO BETA', cnpj: '00.000.000/0002-00', uf: 'YY', cidade: 'MUNICÍPIO TESTE', contato: 'contato.beta@demo.com', fone: '(00) 0000-0001', status: 'ativo', desde: '15/03/2021' },
      { cod: 'DEMO-003', loja: 'Z', nome: 'INDÚSTRIA FICTÍCIA GAMA', cnpj: '00.000.000/0003-00', uf: 'ZZ', cidade: 'LOCALIDADE DEMO', contato: 'contato.gama@demo.com', fone: '(00) 0000-0002', status: 'inativo', desde: '20/07/2019' },
      { cod: 'DEMO-004', loja: 'W', nome: 'DISTRIBUIDORA FICTÍCIA DELTA', cnpj: '00.000.000/0004-00', uf: 'XX', cidade: 'VILA EXEMPLO', contato: 'contato.delta@demo.com', fone: '(00) 0000-0003', status: 'ativo', desde: '05/11/2022' },
      { cod: 'DEMO-005', loja: 'V', nome: 'SERVIÇOS FICTÍCIOS EPSILON', cnpj: '00.000.000/0005-00', uf: 'YY', cidade: 'BAIRRO TESTE', contato: 'contato.epsilon@demo.com', fone: '(00) 0000-0004', status: 'bloqueado', desde: '10/02/2023' },
      { cod: 'DEMO-006', loja: 'U', nome: 'COMÉRCIO FICTÍCIO ZETA', cnpj: '00.000.000/0006-00', uf: 'ZZ', cidade: 'CENTRO DEMO', contato: 'contato.zeta@demo.com', fone: '(00) 0000-0005', status: 'ativo', desde: '28/09/2021' },
    ];

    const ativos = clientes.filter(c => c.status === 'ativo').length;
    const inativos = clientes.filter(c => c.status === 'inativo').length;
    const bloqueados = clientes.filter(c => c.status === 'bloqueado').length;

    const ufs = {};
    clientes.forEach(c => ufs[c.uf] = (ufs[c.uf] || 0) + 1);

    const cssExtra = `
      .uf-index { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
      .uf-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: #fff; border: 1px solid rgba(17,17,20,0.08); border-radius: 20px; font-size: 12px; }
      .uf-chip strong { color: #5b21b6; font-weight: 600; font-family: "Consolas", monospace; letter-spacing: 0.04em; }
      .uf-chip span { color: #6b6b78; }
      .clients-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
      .client-card { background: #fff; border: 1px solid rgba(17,17,20,0.08); border-radius: 12px; padding: 22px 24px; page-break-inside: avoid; }
      .cc-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 12px; }
      .cc-code { font-family: "Consolas", monospace; font-size: 11px; color: #5b21b6; background: #ede9fe; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.04em; }
      .cc-status { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 5px; }
      .cc-status::before { content: ""; width: 5px; height: 5px; border-radius: 50%; }
      .cc-status.ativo { color: #16a34a; }
      .cc-status.ativo::before { background: #16a34a; }
      .cc-status.inativo { color: #6b6b78; }
      .cc-status.inativo::before { background: #6b6b78; }
      .cc-status.bloqueado { color: #dc2626; }
      .cc-status.bloqueado::before { background: #dc2626; }
      .cc-name { font-size: 15px; font-weight: 500; color: #111114; letter-spacing: -0.015em; margin-bottom: 4px; line-height: 1.3; }
      .cc-cnpj { font-size: 11px; color: #8a8a96; font-family: "Consolas", monospace; margin-bottom: 16px; }
      .cc-data { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; padding-top: 14px; border-top: 1px solid rgba(17,17,20,0.06); }
      .cc-data .lbl { font-size: 9px; color: #8a8a96; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; margin-bottom: 3px; }
      .cc-data .val { font-size: 12px; color: #111114; word-break: break-all; }
      @media print { .clients-grid { grid-template-columns: 1fr 1fr; } }
    `;

    const body = `
      <header class="doc-head">
        <div class="doc-meta"><span>Relatório</span><span class="dot"></span><span>Cadastro de Clientes</span><span class="dot"></span><span>U_DEMO_CLI</span><span class="dot"></span><span>${dataBase}</span></div>
        <h1 class="doc-title">Cadastro de Clientes<br /><em>por unidade federativa.</em></h1>
        <p class="doc-desc">Relação de clientes cadastrados com informações de contato, status atual e índice de distribuição geográfica.</p>
      </header>
      <div class="params">
        <div class="param"><div class="lbl">Emissão</div><div class="val">${dataBase}<small>${horaBase}</small></div></div>
        <div class="param"><div class="lbl">Usuário</div><div class="val">${usuario}<small>Filial 01</small></div></div>
        <div class="param"><div class="lbl">Total</div><div class="val">${clientes.length}<small>clientes</small></div></div>
        <div class="param"><div class="lbl">Ativos</div><div class="val ok">${ativos}<small>em operação</small></div></div>
        <div class="param"><div class="lbl">Inativos</div><div class="val">${inativos}<small>sem movimento</small></div></div>
        <div class="param"><div class="lbl">Bloqueados</div><div class="val danger">${bloqueados}<small>restrição</small></div></div>
      </div>

      <div class="sec-label">Índice por UF</div>
      <div class="uf-index">
        ${Object.entries(ufs).map(([uf, qtd]) => `<div class="uf-chip"><strong>${uf}</strong><span>${qtd} cliente${qtd > 1 ? 's' : ''}</span></div>`).join('')}
      </div>

      <div class="sec-label">Clientes cadastrados</div>
      <div class="clients-grid">
        ${clientes.map(c => `
          <div class="client-card">
            <div class="cc-head">
              <span class="cc-code">${c.cod}/${c.loja}</span>
              <span class="cc-status ${c.status}">${c.status}</span>
            </div>
            <div class="cc-name">${c.nome}</div>
            <div class="cc-cnpj">${c.cnpj}</div>
            <div class="cc-data">
              <div><div class="lbl">Cidade</div><div class="val">${c.cidade}</div></div>
              <div><div class="lbl">UF</div><div class="val">${c.uf}</div></div>
              <div><div class="lbl">E-mail</div><div class="val">${c.contato}</div></div>
              <div><div class="lbl">Telefone</div><div class="val">${c.fone}</div></div>
              <div><div class="lbl">Cliente desde</div><div class="val">${c.desde}</div></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="foot">
        <span><strong>U_DEMO_CLI</strong> · Portal do Analista · Documento técnico</span>
        <span>Emitido em ${dataBase} às ${horaBase} por ${usuario}</span>
      </div>
    `;

    openReport('U_DEMO_CLI — Cadastro de Clientes', cssExtra, body);
  };

  // ============================================================
  // LISTA DE RELATÓRIOS
  // ============================================================
  const relatorios = [
    { id: 1, nome: 'Relatório de Títulos a Receber', rotina: 'U_DEMO_REL', desc: 'Cards por cliente com subtotais, status de vencimento e classificação por dias em atraso.', gerar: gerarRelatorioTitulos },
    { id: 2, nome: 'Performance de Vendas', rotina: 'U_DEMO_VEND', desc: 'Ranking de vendedores com barras de progresso, meta vs. realizado e percentual de atingimento.', gerar: gerarRelatorioVendas },
    { id: 3, nome: 'Posição de Estoque', rotina: 'U_DEMO_ESTQ', desc: 'Saldo por armazém com indicador visual de nível (mínimo/máximo) e alerta de produtos críticos.', gerar: gerarRelatorioEstoque },
    { id: 4, nome: 'Cadastro de Clientes', rotina: 'U_DEMO_CLI', desc: 'Grid em formato diretório com dados de contato, status e índice de distribuição por UF.', gerar: gerarRelatorioClientes },
  ];

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

      <main className="rel-wrap" data-tour="rel-wrap">
        <div className="rel-head">
          <h1 className="rel-title">Relatórios</h1>
          <p className="rel-subtitle">
            Rotinas HTML geradas em ADVPL. Cada relatório abre em nova aba com opções
            de impressão e exportação — todos os dados são fictícios.
          </p>
        </div>

        <div className="rel-list">
          {relatorios.map((rel, idx) => (
            <div key={rel.id} className="rel-row">
              <div className="rel-idx">{String(idx + 1).padStart(2, '0')}</div>
              <div className="rel-info">
                <h3>{rel.nome}</h3>
                <p>{rel.desc}</p>
              </div>
              <div className="rel-routine">{rel.rotina}</div>
              <button className="rel-action" onClick={rel.gerar}>
                Gerar →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}