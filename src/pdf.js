/* Misal diario: generación de PDF (A4, A5, A6) con las fuentes de la app, y vista previa en HTML.
 * Entrada: una "hoja" descriptiva (spec) con cabecera y bloques. Salida: Blob PDF. */
(function (root) {
  'use strict';
  var SIZES = {
    a4: { w: 595.28, h: 841.89, m: 58, mt: 52, base: 12 },
    a5: { w: 419.53, h: 595.28, m: 40, mt: 36, base: 10.5 },
    a6: { w: 297.64, h: 419.53, m: 24, mt: 22, base: 8.6 }
  };
  var C = { ink: [43, 33, 24], soft: [110, 95, 75], rubric: [165, 42, 32], gilt: [168, 132, 60], rule: [217, 207, 191], slip: [250, 246, 238],
    verde: [77, 122, 70], morado: [106, 61, 120], blanco: [231, 217, 168], blancoEdge: [185, 154, 82], rojo: [176, 48, 42], rosa: [213, 142, 163] };
  var TAPES = [C.rojo, C.verde, C.gilt, C.morado, C.blanco];
  var JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  var loading = null, FONTS = null;

  function loadLib() {
    if (root.jspdf && root.jspdf.jsPDF) return Promise.resolve(root.jspdf.jsPDF);
    if (loading) return loading;
    loading = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = JSPDF_URL; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = function () { if (root.jspdf && root.jspdf.jsPDF) res(root.jspdf.jsPDF); else { loading = null; rej(new Error('lib')); } };
      s.onerror = function () { loading = null; s.remove(); rej(new Error('offline')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  function fonts() {
    if (!FONTS) FONTS = JSON.parse(document.getElementById('pdf-fonts').textContent);
    return FONTS;
  }

  // ---------- Maquetación ----------
  function Layout(doc, S) {
    this.doc = doc; this.S = S; this.k = S.base / 12;
    this.x = S.m; this.w = S.w - 2 * S.m;
    this.top = S.mt; this.y = S.mt;
    this.bottom = S.h - S.mt - 16 * this.k;
  }
  var L = Layout.prototype;
  L.font = function (s) { this.doc.setFont(s.font, s.style || 'normal'); this.doc.setFontSize(s.size); };
  L.tw = function (text, s) { this.font(s); return this.doc.getTextWidth(text) + (s.cs ? s.cs * text.length : 0); };
  L.newPage = function () { this.doc.addPage([this.S.w, this.S.h], 'portrait'); this.y = this.top; };
  L.ensure = function (h) { if (this.y + h > this.bottom && this.y > this.top + 1 && h <= this.bottom - this.top) this.newPage(); };

  // Parte un texto con estilos mezclados en líneas del ancho dado
  L.lines = function (segs, width) {
    var lines = [], cur = null, pend = null, self = this;
    function fresh() { cur = { items: [], w: 0, size: 0 }; }
    fresh();
    segs.forEach(function (s) {
      if (!s || !s.text) return;
      String(s.text).split(/(\s+)/).forEach(function (tok) {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { if (cur.items.length) pend = { s: s, w: self.tw(' ', s) }; return; }
        var ww = self.tw(tok, s), need = (pend ? pend.w : 0) + ww;
        if (cur.items.length && cur.w + need > width) { lines.push(cur); fresh(); pend = null; }
        if (pend && cur.items.length) { cur.items.push({ text: ' ', s: pend.s, w: pend.w }); cur.w += pend.w; }
        pend = null;
        cur.items.push({ text: tok, s: s, w: ww }); cur.w += ww;
        cur.size = Math.max(cur.size, s.lh || s.size);
      });
    });
    if (cur.items.length) lines.push(cur);
    return lines;
  };
  L.height = function (lines, lh) { return lines.reduce(function (a, l) { return a + l.size * lh; }, 0); };
  L.drawLines = function (lines, x, width, lh, align) {
    var doc = this.doc, self = this;
    lines.forEach(function (ln) {
      var lineH = ln.size * lh;
      if (self.y + lineH > self.bottom && self.y > self.top + 1) self.newPage();
      var base = self.y + (lineH - ln.size) / 2 + ln.size * 0.8;
      var xx = x + (align === 'center' ? (width - ln.w) / 2 : 0);
      // agrupa trozos seguidos con el mismo estilo
      var runs = [];
      ln.items.forEach(function (it) {
        var last = runs[runs.length - 1];
        if (last && last.s === it.s) { last.text += it.text; last.w += it.w; } else runs.push({ text: it.text, s: it.s, w: it.w });
      });
      runs.forEach(function (r) {
        self.font(r.s); doc.setTextColor.apply(doc, r.s.color || C.ink);
        doc.text(r.text, xx, base, r.s.cs ? { charSpace: r.s.cs } : undefined);
        xx += r.w;
      });
      self.y += lineH;
    });
  };
  L.para = function (segs, opt) {
    opt = opt || {};
    var x = this.x + (opt.indent || 0), w = this.w - (opt.indent || 0);
    var lines = this.lines(segs, w);
    this.drawLines(lines, x, w, opt.lh || 1.35, opt.align);
    return lines;
  };
  L.gap = function (h) { this.y += h * this.k; };
  L.hrule = function (color, weight) {
    var doc = this.doc; doc.setDrawColor.apply(doc, color || C.rule); doc.setLineWidth((weight || 0.6) * this.k);
    doc.line(this.x, this.y, this.x + this.w, this.y);
  };
  L.poly = function (pts, color) {
    var doc = this.doc, d = [];
    for (var i = 1; i < pts.length; i++) d.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
    doc.setFillColor.apply(doc, color); doc.lines(d, pts[0][0], pts[0][1], [1, 1], 'F', true);
  };
  // Cruz patada (✠) dibujada, porque la fuente no la trae
  L.cross = function (cx, cy, r, color) {
    var a = r * 0.2, b = r * 0.55, self = this;
    [0, 1, 2, 3].forEach(function (q) {
      var t = q * Math.PI / 2, cs = Math.cos(t), sn = Math.sin(t);
      function P(x, y) { return [cx + x * cs - y * sn, cy + x * sn + y * cs]; }
      self.poly([P(0, -a), P(r, -b), P(r * 0.9, 0), P(r, b), P(0, a)], color);
    });
  };
  L.ribbon = function (x, y, w, h, color, edge) {
    this.poly([[x, y], [x + w, y], [x + w, y + h], [x + w / 2, y + h * 0.78], [x, y + h]], color);
    if (edge) { var doc = this.doc; doc.setDrawColor.apply(doc, edge); doc.setLineWidth(0.4 * this.k); doc.lines([[w, 0], [0, h], [-w / 2, -h * 0.22], [-w / 2, h * 0.22]], x, y, [1, 1], 'S', true); }
  };
  // Trazo con coordenadas absolutas en una caja de 24 unidades (M, L, C)
  L.path24 = function (cmds, ox, oy, sc, style, closed) {
    var segs = [], cx = 0, cy = 0, sx = 0, sy = 0, started = false;
    cmds.forEach(function (c) {
      if (c[0] === 'M') { cx = sx = c[1]; cy = sy = c[2]; started = true; }
      else if (c[0] === 'L') { segs.push([c[1] - cx, c[2] - cy]); cx = c[1]; cy = c[2]; }
      else if (c[0] === 'C') { segs.push([c[1] - cx, c[2] - cy, c[3] - cx, c[4] - cy, c[5] - cx, c[6] - cy]); cx = c[5]; cy = c[6]; }
    });
    if (started) this.doc.lines(segs, ox + sx * sc, oy + sy * sc, [sc, sc], style, !!closed);
  };
  // Sagrado Corazón: cruz, llamas, corazón y corona de espinas
  L.sacredHeart = function (cx, cy, size) {
    var doc = this.doc, sc = size / 24, ox = cx - 12 * sc, oy = cy - 12 * sc, self = this;
    doc.setFillColor.apply(doc, C.gilt);
    doc.rect(ox + 11.35 * sc, oy + 0.3 * sc, 1.3 * sc, 4.5 * sc, 'F');
    doc.rect(ox + 10.1 * sc, oy + 1.5 * sc, 3.8 * sc, 1.2 * sc, 'F');
    function flame(dx, w, h0, h1) {
      var x = 12 + dx, d = h1 - h0;
      self.path24([['M', x, h0], ['C', x + w * 0.68, h0 + d * 0.22, x + w, h0 + d * 0.42, x + w, h0 + d * 0.62],
        ['C', x + w, h0 + d * 0.84, x + w * 0.53, h1, x, h1], ['C', x - w * 0.53, h1, x - w, h0 + d * 0.84, x - w, h0 + d * 0.62],
        ['C', x - w, h0 + d * 0.42, x - w * 0.68, h0 + d * 0.22, x, h0]], ox, oy, sc, 'F', true);
    }
    flame(0, 1.9, 4.6, 10.4); flame(-2.9, 1.1, 7, 10.5); flame(2.9, 1.1, 7, 10.5);
    doc.setFillColor.apply(doc, C.rubric);
    this.path24([['M', 12, 22.6], ['C', 8.6, 19.7, 5, 16.6, 5, 12.9], ['C', 5, 10.5, 6.7, 8.7, 8.9, 8.7], ['C', 10.3, 8.7, 11.4, 9.5, 12, 10.6],
      ['C', 12.6, 9.5, 13.7, 8.7, 15.1, 8.7], ['C', 17.3, 8.7, 19, 10.5, 19, 12.9], ['C', 19, 16.6, 15.4, 19.7, 12, 22.6]], ox, oy, sc, 'F', true);
    doc.setDrawColor.apply(doc, C.gilt); doc.setLineWidth(1.1 * sc);
    this.path24([['M', 5.6, 14.2], ['C', 7.6, 15.1, 9.8, 15.5, 12, 15.5], ['C', 14.2, 15.5, 16.4, 15.1, 18.4, 14.2]], ox, oy, sc, 'S', false);
  };
  // Adorno bajo la cabecera: florón (por defecto) o Sagrado Corazón (guardado para el adorno según el tiempo litúrgico)
  L.fleuron = function (ornament) {
    var doc = this.doc, k = this.k, cx = this.x + this.w / 2, half = Math.min(this.w * 0.32, 120 * k);
    var heart = ornament === 'corazon', y = this.y + (heart ? 7 : 6) * k, gapX = (heart ? 13 : 10) * k;
    doc.setDrawColor.apply(doc, C.gilt); doc.setLineWidth(0.5 * k);
    [0, 2.2 * k].forEach(function (dy) {
      doc.line(cx - half, y + dy, cx - gapX, y + dy);
      doc.line(cx + gapX, y + dy, cx + half, y + dy);
    });
    if (heart) { this.sacredHeart(cx, y + 1.1 * k, 19 * k); this.y += 20 * k; return; }
    var s = { font: 'EBG', size: 11 * k, color: C.gilt };
    this.font(s); doc.setTextColor.apply(doc, C.gilt);
    var g = '\u2766', gw = doc.getTextWidth(g);
    doc.text(g, cx - gw / 2, y + 4.4 * k);
    this.y += 14 * k;
  };

  // ---------- Estilos ----------
  function ST(k) {
    return {
      kicker: { font: 'FellSC', size: 11 * k, color: C.rubric, cs: 1.3 * k },
      date: { font: 'EBG', style: 'italic', size: 12 * k, color: C.soft },
      title: { font: 'Fell', size: 25 * k, color: C.ink },
      initial: { font: 'Fell', size: 33 * k, color: C.rubric, lh: 25 * k },
      sub: { font: 'EBG', style: 'italic', size: 14 * k, color: C.soft },
      rank: { font: 'FellSC', size: 11 * k, color: C.rubric, cs: 0.9 * k },
      meta: { font: 'EBG', size: 11 * k, color: C.soft },
      line: { font: 'EBG', style: 'italic', size: 11 * k, color: C.soft },
      extraB: { font: 'FellSC', size: 10 * k, color: C.rubric, cs: 0.6 * k },
      extra: { font: 'EBG', size: 10.5 * k, color: C.soft },
      label: { font: 'FellSC', size: 11 * k, color: C.rubric, cs: 1.1 * k },
      rtitle: { font: 'EBG', style: 'italic', size: 12 * k, color: C.ink },
      cite: { font: 'EBGM', size: 18 * k, color: C.ink },
      altB: { font: 'FellSC', size: 10 * k, color: C.rubric, cs: 0.6 * k },
      alt: { font: 'EBG', size: 11 * k, color: C.soft },
      rsym: { font: 'EBG', size: 12.5 * k, color: C.rubric },
      rtext: { font: 'EBG', style: 'italic', size: 11.5 * k, color: C.ink },
      note: { font: 'EBG', style: 'italic', size: 10.5 * k, color: C.soft },
      pre: { font: 'EBG', style: 'italic', size: 10.5 * k, color: C.rubric },
      body: { font: 'EBG', size: 11 * k, color: C.ink },
      bodyI: { font: 'EBG', style: 'italic', size: 11 * k, color: C.ink },
      refs: { font: 'EBGM', size: 12 * k, color: C.ink },
      num: { font: 'Fell', size: 12 * k, color: C.rubric },
      slipT: { font: 'FellSC', size: 10.5 * k, color: C.rubric, cs: 1 * k },
      book: { font: 'EBGM', size: 11 * k, color: C.ink },
      place: { font: 'EBG', size: 10.5 * k, color: C.soft },
      ruleB: { font: 'FellSC', size: 10 * k, color: C.rubric, cs: 0.6 * k },
      ruleT: { font: 'EBG', size: 10.5 * k, color: C.ink },
      mass: { font: 'FellSC', size: 11.5 * k, color: C.ink, cs: 1 * k },
      foot: { font: 'EBG', style: 'italic', size: 8 * k, color: C.soft },
      amen: { font: 'Fell', style: 'normal', size: 11 * k, color: C.gilt }
    };
  }

  // ---------- Dibujo de una hoja ----------
  L.header = function (sp, T) {
    var k = this.k;
    if (sp.kicker) { this.para([Object.assign({ text: sp.kicker }, T.kicker)], { align: 'center', lh: 1.2 }); this.gap(2); }
    this.fleuron(sp.ornament); this.gap(10);
    if (sp.date) { this.para([Object.assign({ text: sp.date }, T.date)], { lh: 1.3 }); this.gap(2); }
    var t = sp.title || '';
    if (t) this.para([Object.assign({ text: t.charAt(0) }, T.initial), Object.assign({ text: t.slice(1) }, T.title)], { lh: 1.12 });
    if (sp.subtitle) { this.gap(3); this.para([Object.assign({ text: sp.subtitle }, T.sub)], { lh: 1.25 }); }
    if (sp.meta && sp.meta.length) {
      this.gap(7);
      var segs = [];
      sp.meta.forEach(function (m, i) {
        if (i === 0 && sp.metaRank) { segs.push(Object.assign({ text: m + '   ' }, T.rank)); }
        else segs.push(Object.assign({ text: (i > (sp.metaRank ? 1 : 0) ? ' · ' : '') + m }, T.meta));
      });
      this.para(segs, { lh: 1.3 });
    }
    if (sp.line) { this.gap(2); this.para([Object.assign({ text: sp.line }, T.line)], { lh: 1.3 }); }
    var self = this;
    (sp.extras || []).forEach(function (e) { self.gap(2); self.para([Object.assign({ text: e[0] + ' ' }, T.extraB), Object.assign({ text: e[1] }, T.extra)], { lh: 1.3 }); });
    this.gap(14 * (sp.compact ? 0.7 : 1));
  };

  L.reading = function (b, T, first) {
    var k = this.k, self = this, crossW = b.gospel ? 13 * k : 0;
    var lab = this.lines([Object.assign({ text: b.label }, T.label)], this.w);
    var tit = b.title ? this.lines([Object.assign({ text: b.title }, T.rtitle)], this.w - crossW) : [];
    var cit = this.lines([Object.assign({ text: b.cite }, T.cite)], this.w);
    var alt = b.alts && b.alts.length ? this.lines([Object.assign({ text: 'o bien ' }, T.altB), Object.assign({ text: b.alts.join(' · ') }, T.alt)], this.w) : [];
    var rsp = b.resp ? this.lines([Object.assign({ text: '\u211F ' }, T.rsym), Object.assign({ text: b.resp }, b.respText ? T.rtext : T.alt)], this.w) : [];
    var h = (first ? 0 : 12 * k) + this.height(lab, 1.3) + this.height(tit, 1.3) + 3 * k + this.height(cit, 1.2) + (rsp.length ? 2 * k + this.height(rsp, 1.3) : 0) + (alt.length ? 3 * k + this.height(alt, 1.3) : 0) + 4 * k;
    this.ensure(h);
    if (!first) { this.gap(2); this.hrule(); this.gap(10); }
    this.drawLines(lab, this.x, this.w, 1.3);
    if (tit.length) {
      var y0 = this.y;
      if (b.gospel) this.cross(this.x + 4.6 * k, y0 + T.rtitle.size * 0.68, 4.6 * k, C.rubric);
      this.drawLines(tit, this.x + crossW, this.w - crossW, 1.3);
    }
    this.gap(3);
    this.drawLines(cit, this.x, this.w, 1.2);
    if (rsp.length) { this.gap(2); this.drawLines(rsp, this.x, this.w, 1.3); }
    if (alt.length) { this.gap(3); this.drawLines(alt, this.x, this.w, 1.3); }
    this.gap(4);
  };

  L.marks = function (b, T) {
    var k = this.k, self = this, padX = 10 * k, padY = 8 * k, tapeW = 6 * k, gapX = 9 * k;
    var innerW = this.w - 2 * padX - tapeW - gapX;
    var title = this.lines([Object.assign({ text: b.title || 'Prepara las cintas' }, T.slipT)], this.w - 2 * padX);
    var rows = b.items.map(function (m) { return self.lines([Object.assign({ text: m.book }, T.book), Object.assign({ text: '  ' + m.place }, T.place)], innerW); });
    var rowsH = rows.reduce(function (a, r) { return a + self.height(r, 1.3) + 4 * k; }, 0);
    var tomo = b.tomo ? this.lines([Object.assign({ text: 'Libro  ' }, T.slipT), Object.assign({ text: b.tomo.name }, T.book), Object.assign({ text: '  ' + b.tomo.desc }, T.place)], this.w - 2 * padX) : [];
    var tomoH = tomo.length ? this.height(tomo, 1.3) + 9 * k : 0;
    var h = padY * 2 + this.height(title, 1.3) + 4 * k + rowsH + tomoH;
    this.ensure(h);
    var doc = this.doc, y0 = this.y;
    doc.setFillColor.apply(doc, C.slip); doc.setDrawColor.apply(doc, C.rule); doc.setLineWidth(0.6 * k);
    doc.roundedRect(this.x, y0, this.w, h - 4 * k, 4 * k, 4 * k, 'FD');
    this.y = y0 + padY;
    if (tomo.length) {
      this.drawLines(tomo, this.x + padX, this.w - 2 * padX, 1.3);
      this.gap(4); doc.setDrawColor.apply(doc, C.rule); doc.setLineWidth(0.5 * k);
      doc.line(this.x + padX, this.y, this.x + this.w - padX, this.y); this.gap(5);
    }
    this.drawLines(title, this.x + padX, this.w - 2 * padX, 1.3);
    this.gap(4);
    rows.forEach(function (r, i) {
      var c = TAPES[i % TAPES.length];
      self.ribbon(self.x + padX, self.y + 1 * k, tapeW, 12 * k, c, c === C.blanco ? C.blancoEdge : null);
      self.drawLines(r, self.x + padX + tapeW + gapX, innerW, 1.3);
      self.gap(4);
    });
    this.y = y0 + h + 4 * k;
  };

  L.rule = function (b, T) {
    var k = this.k, ind = 9 * k;
    var lines = this.lines([Object.assign({ text: (b.label || 'Regla de hoy') + '. ' }, T.ruleB), Object.assign({ text: b.text }, T.ruleT)], this.w - ind);
    var h = this.height(lines, 1.35);
    this.ensure(h + 8 * k);
    var y0 = this.y, doc = this.doc;
    this.drawLines(lines, this.x + ind, this.w - ind, 1.35);
    doc.setDrawColor.apply(doc, C.rubric); doc.setLineWidth(1.6 * k);
    doc.line(this.x + 1 * k, y0 + 2 * k, this.x + 1 * k, this.y - 2 * k);
    this.gap(8);
  };

  L.text = function (b, T) {
    var st = T[b.style || 'note'];
    var lines = this.lines([Object.assign({ text: b.text }, st)], this.w);
    this.ensure(this.height(lines, 1.35));
    this.drawLines(lines, this.x, this.w, 1.35);
    this.gap(6);
  };

  L.heading = function (b, T) {
    var lines = this.lines([Object.assign({ text: b.text }, T.mass)], this.w);
    this.ensure(this.height(lines, 1.3) + 40 * this.k);
    this.drawLines(lines, this.x, this.w, 1.3);
    this.gap(4);
  };

  L.step = function (b, T, first) {
    var k = this.k, self = this, col = 20 * k, w2 = this.w - col;
    var lab = this.lines([Object.assign({ text: b.label + (b.optional ? '' : '') }, T.label)].concat(b.optional ? [Object.assign({ text: '  · si se desea' }, T.note)] : []), w2);
    var refs = b.refs && b.refs.length ? this.lines([Object.assign({ text: b.refs.join('  ·  ') }, T.refs)], w2) : [];
    var segs = [];
    if (b.src) segs.push(Object.assign({ text: b.src + '.' + (b.text ? ' ' : '') }, T.bodyI));
    if (b.text) segs.push(Object.assign({ text: b.text }, T.body));
    var body = segs.length ? this.lines(segs, w2) : [];
    var h = (first ? 0 : 14 * k) + this.height(lab, 1.3) + (refs.length ? 2 * k + this.height(refs, 1.3) : 0) + this.height(body, 1.35);
    this.ensure(h);
    if (!first) { this.gap(5); this.hrule(); this.gap(8); }
    var y0 = this.y, doc = this.doc;
    var nst = T.num; this.font(nst); doc.setTextColor.apply(doc, nst.color);
    var nw = doc.getTextWidth(String(b.n));
    doc.text(String(b.n), this.x + col - 7 * k - nw, y0 + nst.size * 0.95);
    this.drawLines(lab, this.x + col, w2, 1.3);
    if (refs.length) { this.gap(2); this.drawLines(refs, this.x + col, w2, 1.3); }
    if (body.length) this.drawLines(body, this.x + col, w2, 1.35);
  };

  L.draw = function (sp) {
    var T = ST(this.k), self = this, prev = null;
    this.header(sp, T);
    (sp.blocks || []).forEach(function (b) {
      var first = !prev || prev.t !== b.t;
      if (b.t === 'reading') self.reading(b, T, first);
      else if (b.t === 'marks') self.marks(b, T);
      else if (b.t === 'rule') self.rule(b, T);
      else if (b.t === 'heading') self.heading(b, T);
      else if (b.t === 'step') self.step(b, T, first);
      else self.text(b, T);
      prev = b;
    });
  };

  L.footers = function (text, T) {
    var doc = this.doc, n = doc.getNumberOfPages(), k = this.k, S = this.S;
    for (var i = 1; i <= n; i++) {
      doc.setPage(i);
      var t = text + (n > 1 ? '  ·  ' + i + '/' + n : '');
      this.font(T.foot); doc.setTextColor.apply(doc, T.foot.color);
      var w = doc.getTextWidth(t);
      doc.text(t, (S.w - w) / 2, S.h - S.mt * 0.55);
    }
  };

  function render(spec, sizeKey) {
    return loadLib().then(function (jsPDF) {
      var S = SIZES[sizeKey] || SIZES.a5;
      var doc = new jsPDF({ unit: 'pt', format: [S.w, S.h], orientation: 'portrait', compress: true });
      var F = fonts();
      [['EBG-R', 'EBG', 'normal'], ['EBG-I', 'EBG', 'italic'], ['EBG-M', 'EBGM', 'normal'], ['FELL', 'Fell', 'normal'], ['FELLSC', 'FellSC', 'normal']].forEach(function (f) {
        doc.addFileToVFS(f[0] + '.ttf', F[f[0]]); doc.addFont(f[0] + '.ttf', f[1], f[2]);
      });
      doc.setProperties({ title: spec.docTitle || spec.title || 'Misal diario', creator: 'Misal diario' });
      var lay = new Layout(doc, S);
      lay.draw(spec);
      lay.footers(spec.footer || 'Misal diario', ST(lay.k));
      return { blob: doc.output('blob'), pages: doc.getNumberOfPages() };
    });
  }

  // ---------- Vista previa en HTML (mismas proporciones que el papel) ----------
  function preview(spec, sizeKey, host) {
    var S = SIZES[sizeKey] || SIZES.a5;
    host.textContent = '';
    var sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.style.setProperty('--u', (100 / S.w).toFixed(4) + 'cqw');
    sheet.style.setProperty('--k', String(S.base / 12));
    sheet.style.setProperty('--m', S.m);
    sheet.style.aspectRatio = S.w + ' / ' + S.h;
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    var inner = el('div', 'sheet-in');
    if (spec.kicker) inner.appendChild(el('p', 'p-kicker', spec.kicker));
    var fl = el('div', 'p-fleuron');
    if (spec.ornament === 'corazon') fl.innerHTML = '<svg class="sh" viewBox="0 0 24 24" aria-hidden="true"><path class="sh-g" d="M11.35 0.3h1.3v4.5h-1.3z M10.1 1.5h3.8v1.2h-3.8z"/><path class="sh-g" d="M12 4.6c1.3 1.3 1.9 2.4 1.9 3.6 0 1.3-.9 2.2-1.9 2.2s-1.9-.9-1.9-2.2c0-1.2.6-2.3 1.9-3.6z M9.1 7c.75.75 1.1 1.4 1.1 2.1 0 .8-.5 1.4-1.1 1.4s-1.1-.6-1.1-1.4c0-.7.35-1.35 1.1-2.1z M14.9 7c.75.75 1.1 1.4 1.1 2.1 0 .8-.5 1.4-1.1 1.4s-1.1-.6-1.1-1.4c0-.7.35-1.35 1.1-2.1z"/><path class="sh-h" d="M12 22.6C8.6 19.7 5 16.6 5 12.9 5 10.5 6.7 8.7 8.9 8.7c1.4 0 2.5.8 3.1 1.9.6-1.1 1.7-1.9 3.1-1.9 2.2 0 3.9 1.8 3.9 4.2 0 3.7-3.6 6.8-7 9.7z"/><path class="sh-t" d="M5.6 14.2c2 .9 4.2 1.3 6.4 1.3s4.4-.4 6.4-1.3"/></svg>'; else fl.appendChild(el('span', 'orn', '\u2766'));
    inner.appendChild(fl);
    if (spec.date) inner.appendChild(el('p', 'p-date', spec.date));
    if (spec.title) {
      var h = el('p', 'p-title'); h.appendChild(el('span', 'p-ini', spec.title.charAt(0))); h.appendChild(document.createTextNode(spec.title.slice(1))); inner.appendChild(h);
    } else inner.appendChild(el('p', 'p-title p-empty', 'Escribe un título'));
    if (spec.subtitle) inner.appendChild(el('p', 'p-sub', spec.subtitle));
    if (spec.meta && spec.meta.length) {
      var m = el('p', 'p-meta');
      spec.meta.forEach(function (x, i) {
        if (i === 0 && spec.metaRank) m.appendChild(el('span', 'p-rank', x + ' '));
        else m.appendChild(document.createTextNode((i > (spec.metaRank ? 1 : 0) ? ' · ' : '') + x));
      });
      inner.appendChild(m);
    }
    if (spec.line) inner.appendChild(el('p', 'p-line', spec.line));
    (spec.extras || []).forEach(function (e) { var p = el('p', 'p-extra'); p.appendChild(el('b', '', e[0] + ' ')); p.appendChild(document.createTextNode(e[1])); inner.appendChild(p); });
    var prev = null;
    (spec.blocks || []).forEach(function (b) {
      var first = !prev || prev.t !== b.t, d;
      if (b.t === 'reading') {
        d = el('div', 'p-reading' + (first ? ' first' : ''));
        d.appendChild(el('p', 'p-label', b.label));
        if (b.title) { var t = el('p', 'p-rtitle'); if (b.gospel) t.appendChild(el('span', 'p-cross', '✠ ')); t.appendChild(document.createTextNode(b.title)); d.appendChild(t); }
        d.appendChild(el('p', 'p-cite', b.cite));
        if (b.resp) { var rs = el('p', 'p-resp' + (b.respText ? ' txt' : '')); rs.appendChild(el('span', 'p-rsym', '\u211F ')); rs.appendChild(document.createTextNode(b.resp)); d.appendChild(rs); }
        if (b.alts && b.alts.length) { var a = el('p', 'p-alt'); a.appendChild(el('b', '', 'o bien ')); a.appendChild(document.createTextNode(b.alts.join(' · '))); d.appendChild(a); }
      } else if (b.t === 'marks') {
        d = el('div', 'p-slip');
        if (b.tomo) { var tp = el('p', 'p-tomo'); tp.appendChild(el('span', 'p-slipt', 'Libro ')); tp.appendChild(el('b', '', b.tomo.name)); tp.appendChild(document.createTextNode('  ' + b.tomo.desc)); d.appendChild(tp); }
        d.appendChild(el('p', 'p-slipt', b.title || 'Prepara las cintas'));
        b.items.forEach(function (it, i) { var r = el('p', 'p-mark'); r.appendChild(el('i', 'p-tape t' + (i % 5))); r.appendChild(el('b', '', it.book)); r.appendChild(document.createTextNode('  ' + it.place)); d.appendChild(r); });
      } else if (b.t === 'rule') {
        d = el('p', 'p-rule'); d.appendChild(el('b', '', (b.label || 'Regla de hoy') + '. ')); d.appendChild(document.createTextNode(b.text));
      } else if (b.t === 'heading') {
        d = el('p', 'p-heading', b.text);
      } else if (b.t === 'step') {
        d = el('div', 'p-step' + (first ? ' first' : ''));
        d.appendChild(el('span', 'p-n', String(b.n)));
        var bd = el('div', 'p-sbody');
        bd.appendChild(el('p', 'p-label', b.label));
        if (b.refs && b.refs.length) bd.appendChild(el('p', 'p-refs', b.refs.join('  ·  ')));
        var tx = el('p', 'p-body');
        if (b.src) tx.appendChild(el('i', '', b.src + '.' + (b.text ? ' ' : '')));
        if (b.text) tx.appendChild(document.createTextNode(b.text));
        bd.appendChild(tx); d.appendChild(bd);
      } else {
        d = el('p', 'p-' + (b.style || 'note'), b.text);
      }
      inner.appendChild(d); prev = b;
    });
    inner.appendChild(el('p', 'p-foot', spec.footer || 'Misal diario'));
    sheet.appendChild(inner);
    host.appendChild(sheet);
  }

  var api = { render: render, preview: preview, load: loadLib, SIZES: SIZES };
  root.MisalPDF = api;
})(this);
