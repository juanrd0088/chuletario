/* Motor del calendario litúrgico (Rito romano, calendario de España).
 * Calcula para cualquier fecha: tiempo, semana, ciclos A/B/C y I/II,
 * celebración principal según la Tabla de precedencias y la clave de lecturas.
 * Funciona en navegador (window.Liturgia) y en Node (module.exports). */
(function (root) {
  'use strict';

  var DAY = 86400000;
  function dn(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / DAY); }
  function ymd(n) { var t = new Date(n * DAY); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]; }
  function dow(n) { return ((n % 7) + 7 + 4) % 7; } // 0 = domingo
  function sundayOnOrBefore(n) { return n - dow(n); }
  function sundayAfter(n) { return n + (7 - dow(n)); }

  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return dn(y, month, day);
  }
  // Primer domingo de Adviento del año civil y (empieza el año litúrgico y+1)
  function advent1(y) { var x = dn(y, 12, 25); var s = x - (dow(x) === 0 ? 7 : dow(x)); return s - 21; }

  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII',
    'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV'];
  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  var RANK_NAME = { 1: 'Solemnidad', 2: 'Solemnidad', 3: 'Solemnidad', 4: 'Solemnidad', 5: 'Fiesta', 6: 'Domingo', 7: 'Fiesta', 8: 'Fiesta', 9: 'Feria', 10: 'Memoria obligatoria', 11: 'Memoria obligatoria', 12: 'Memoria libre', 13: 'Feria' };

  var CFG_ES = { epiphanyOnSunday: false, ascensionOnSunday: true, corpusOnSunday: true, spain: true };
  var CFG_US = { epiphanyOnSunday: true, ascensionOnSunday: true, corpusOnSunday: true, spain: false };

  function create(sanctoral, cfg) {
    cfg = cfg || CFG_ES;
    var yearCache = {};

    function epiphanyDate(y) {
      if (!cfg.epiphanyOnSunday) return dn(y, 1, 6);
      var j1 = dn(y, 1, 1); // domingo entre el 2 y el 8 de enero
      return sundayAfter(j1);
    }
    function baptismDate(y) {
      var ep = epiphanyDate(y);
      if (!cfg.epiphanyOnSunday) return sundayAfter(ep);
      var d = ymd(ep)[2];
      return d >= 7 ? ep + 1 : ep + 7;
    }
    function holyFamily(y) { // Navidad del año civil y
      for (var n = dn(y, 12, 26); n <= dn(y, 12, 31); n++) if (dow(n) === 0) return n;
      return dn(y, 12, 30);
    }

    // Datos del año litúrgico Y (que acaba en noviembre de Y)
    function yearData(Y) {
      if (yearCache[Y]) return yearCache[Y];
      var e = easter(Y), pent = e + 49;
      var o = {
        Y: Y, adv1: advent1(Y - 1), xmas: dn(Y - 1, 12, 25), nextAdv1: advent1(Y),
        hf: holyFamily(Y - 1), epiph: epiphanyDate(Y), bapt: baptismDate(Y),
        ash: e - 46, lent1: e - 42, palm: e - 7, easter: e,
        ascension: cfg.ascensionOnSunday ? e + 42 : e + 39, pent: pent,
        trinity: pent + 7, corpus: cfg.corpusOnSunday ? pent + 14 : pent + 11,
        heart: pent + 19, imHeart: pent + 20, christKing: advent1(Y) - 7
      };
      o.sunCycle = 'CAB'[Y % 3];
      o.wkCycle = Y % 2 === 1 ? 'I' : 'II';
      o.sanct = buildSanctoral(o);
      yearCache[Y] = o;
      return o;
    }

    // ---- Tiempo propio (temporal) ----
    function temporal(n, L) {
      var t = temporal0(n, L), k = t.key;
      if (k === 'JUEVES' || k === 'VIERNES' || k === 'VIGILIA') t.rankName = 'Triduo pascual';
      else if (k === 'NAV' || k === 'EPIF' || k === 'ASC' || k === 'PENT' || k === 'JAN1' || k === 'PAS1-0') t.rankName = 'Solemnidad';
      else if (k === 'SAGFAM' || k === 'BAUT') t.rankName = 'Fiesta';
      else if (/^PAS1-/.test(k)) t.rankName = 'Octava de Pascua';
      else if (k === 'CENIZA' || /^OCT/.test(k) || /^DEC/.test(k)) t.rankName = '';
      else if (t.dow === 0) t.rankName = 'Domingo';
      else t.rankName = 'Feria';
      return t;
    }
    function temporal0(n, L) {
      var w = dow(n), t = { dow: w };
      var md = ymd(n), m = md[1], d = md[2];
      if (n < L.xmas) { // Adviento
        var wk = Math.floor((n - L.adv1) / 7) + 1;
        t.season = 'adviento'; t.week = wk; t.color = 'morado';
        if (w === 0) {
          t.key = 'ADV' + wk + '-0'; t.rank = 2; t.name = 'Domingo ' + ROMAN[wk] + ' de Adviento';
          if (wk === 3) t.color = 'rosa';
        } else if (m === 12 && d >= 17) {
          t.key = 'DEC' + d; t.rank = 9; t.name = 'Feria mayor de Adviento';
          t.sub = d + ' de diciembre';
        } else {
          t.key = 'ADV' + wk + '-' + w; t.rank = 13; t.name = DIAS[w] + ' de la ' + ROMAN[wk] + ' semana de Adviento';
        }
        return t;
      }
      if (n <= L.bapt) { // Navidad
        t.season = 'navidad'; t.color = 'blanco';
        if (n === L.xmas) { t.key = 'NAV'; t.rank = 2; t.name = 'La Natividad del Señor'; return t; }
        if (n === L.hf) { t.key = 'SAGFAM'; t.rank = 5; t.name = 'La Sagrada Familia de Jesús, María y José'; return t; }
        if (m === 12) { t.key = 'OCT' + d; t.rank = 9; t.name = 'Día ' + d + ' de diciembre'; t.sub = 'Dentro de la Octava de Navidad'; return t; }
        if (m === 1 && d === 1) { t.key = 'JAN1'; t.rank = 3; t.name = 'Santa María, Madre de Dios'; t.sub = 'Octava de Navidad'; return t; }
        if (n === L.epiph) { t.key = 'EPIF'; t.rank = 2; t.name = 'La Epifanía del Señor'; return t; }
        if (n === L.bapt) { t.key = 'BAUT'; t.rank = 5; t.name = 'El Bautismo del Señor'; return t; }
        if (n < L.epiph) {
          if (w === 0) { t.key = 'NAV2DOM'; t.rank = 6; t.name = 'Domingo II después de Navidad'; return t; }
          t.key = 'JAN' + d; t.rank = 13; t.name = 'Feria del tiempo de Navidad'; t.sub = d + ' de enero'; return t;
        }
        // entre Epifanía y Bautismo
        if (!cfg.epiphanyOnSunday) { t.key = 'EPI' + (d - 6); t.sub = d + ' de enero'; }
        else { t.key = 'EPI' + w; t.sub = DIAS[w] + ' después de Epifanía'; }
        t.rank = 13; t.name = 'Feria del tiempo de Navidad';
        return t;
      }
      if (n < L.ash) { // Tiempo Ordinario I
        var base = sundayOnOrBefore(L.bapt);
        var wk1 = Math.floor((n - base) / 7) + 1;
        return ordinary(t, wk1, w);
      }
      if (n < L.easter) { // Cuaresma y Semana Santa
        t.season = 'cuaresma'; t.color = 'morado';
        if (n === L.ash) { t.key = 'CENIZA'; t.rank = 2; t.name = 'Miércoles de Ceniza'; return t; }
        if (n < L.lent1) { t.key = 'CEN-' + w; t.rank = 9; t.name = DIAS[w] + ' después de Ceniza'; return t; }
        var lw = Math.floor((n - L.lent1) / 7) + 1;
        t.week = lw;
        if (lw <= 5) {
          if (w === 0) { t.key = 'CUA' + lw + '-0'; t.rank = 2; t.name = 'Domingo ' + ROMAN[lw] + ' de Cuaresma'; if (lw === 4) t.color = 'rosa'; }
          else { t.key = 'CUA' + lw + '-' + w; t.rank = 9; t.name = DIAS[w] + ' de la ' + ROMAN[lw] + ' semana de Cuaresma'; }
          return t;
        }
        t.season = 'semanasanta';
        if (w === 0) { t.key = 'RAMOS'; t.rank = 2; t.color = 'rojo'; t.name = 'Domingo de Ramos en la Pasión del Señor'; return t; }
        if (w <= 3) { t.key = 'SEM-' + w; t.rank = 2; t.name = DIAS[w] + ' Santo'; return t; }
        if (w === 4) { t.key = 'JUEVES'; t.rank = 1; t.color = 'blanco'; t.name = 'Jueves Santo'; t.sub = 'Misa vespertina de la Cena del Señor'; t.season = 'triduo'; return t; }
        if (w === 5) { t.key = 'VIERNES'; t.rank = 1; t.color = 'rojo'; t.name = 'Viernes Santo de la Pasión del Señor'; t.season = 'triduo'; return t; }
        t.key = 'VIGILIA'; t.rank = 1; t.color = 'blanco'; t.name = 'Sábado Santo'; t.sub = 'Vigilia pascual en la noche santa'; t.season = 'triduo'; return t;
      }
      if (n <= L.pent) { // Pascua
        t.season = 'pascua'; t.color = 'blanco';
        var pw = Math.floor((n - L.easter) / 7) + 1; t.week = pw;
        if (n === L.easter) { t.key = 'PAS1-0'; t.rank = 1; t.name = 'Domingo de Pascua de la Resurrección del Señor'; return t; }
        if (n === L.pent) { t.key = 'PENT'; t.rank = 2; t.color = 'rojo'; t.name = 'Domingo de Pentecostés'; return t; }
        if (n === L.ascension) { t.key = 'ASC'; t.rank = 2; t.name = 'La Ascensión del Señor'; return t; }
        if (pw === 1) { t.key = 'PAS1-' + w; t.rank = 2; t.name = DIAS[w] + ' de la Octava de Pascua'; return t; }
        if (w === 0) { t.key = 'PAS' + pw + '-0'; t.rank = 2; t.name = 'Domingo ' + ROMAN[pw] + ' de Pascua'; return t; }
        t.key = 'PAS' + pw + '-' + w; t.rank = 13; t.name = DIAS[w] + ' de la ' + ROMAN[pw] + ' semana de Pascua'; return t;
      }
      // Tiempo Ordinario II (tras Pentecostés)
      var wk2 = 34 - Math.round((L.christKing - sundayOnOrBefore(n)) / 7);
      return ordinary(t, wk2, w);
    }
    function ordinary(t, wk, w) {
      t.season = 'ordinario'; t.week = wk; t.color = 'verde';
      if (w === 0) { t.key = 'TO' + wk + '-0'; t.rank = 6; t.name = 'Domingo ' + ROMAN[wk] + ' del Tiempo Ordinario'; }
      else { t.key = 'TO' + wk + '-' + w; t.rank = 13; t.name = DIAS[w] + ' de la ' + ROMAN[wk] + ' semana del Tiempo Ordinario'; }
      return t;
    }

    // ---- Celebraciones móviles con fecha calculada ----
    function movables(L) {
      var list = [
        { id: 'TRIN', n: L.trinity, rank: 3, color: 'blanco', name: 'La Santísima Trinidad' },
        { id: 'CORPUS', n: L.corpus, rank: 3, color: 'blanco', name: 'El Santísimo Cuerpo y Sangre de Cristo' },
        { id: 'SCORAZON', n: L.heart, rank: 3, color: 'blanco', name: 'El Sagrado Corazón de Jesús' },
        { id: 'CRISTOREY', n: L.christKing, rank: 3, color: 'blanco', name: 'Nuestro Señor Jesucristo, Rey del Universo' },
        { id: 'MARIAIGLESIA', n: L.pent + 1, rank: 10, color: 'blanco', name: 'Bienaventurada Virgen María, Madre de la Iglesia' },
        { id: 'INMCORAZON', n: L.imHeart, rank: 10, color: 'blanco', name: 'Inmaculado Corazón de la Bienaventurada Virgen María' }
      ];
      if (cfg.spain) list.push({ id: 'SUMOSACERDOTE', n: L.pent + 4, rank: 8, color: 'blanco', name: 'Nuestro Señor Jesucristo, Sumo y Eterno Sacerdote' });
      return list;
    }

    // ---- Santoral del año litúrgico, con traslados ----
    function buildSanctoral(L) {
      var byDay = {};
      function add(n, c) { (byDay[n] = byDay[n] || []).push(c); }
      // Las fechas fijas pertenecen al año civil: Adviento (Y-1) y el resto (Y)
      sanctoral.forEach(function (s) {
        var yr = s.m === 12 || (s.m === 11 && s.d >= 27) ? L.Y - 1 : L.Y;
        var n = dn(yr, s.m, s.d);
        if (n < L.adv1 || n >= L.nextAdv1) { yr = yr === L.Y ? L.Y - 1 : L.Y; n = dn(yr, s.m, s.d); }
        if (n < L.adv1 || n >= L.nextAdv1) return;
        var c = { id: s.id, n: n, rank: s.rank, color: s.color, name: s.name, solemn: s.rank <= 4 };
        // Traslados particulares
        if (s.id === 'joseph_spouse_of_mary') {
          if (n >= L.palm && n <= L.easter + 7) c.n = L.palm - 1;
          else if (dow(n) === 0) c.n = n + 1;
        }
        if (s.id === 'annunciation_of_the_lord') {
          if (n >= L.palm && n <= L.easter + 7) c.n = L.easter + 8;
          else if (dow(n) === 0 && n < L.palm) c.n = n + 1;
        }
        if (s.id === 'immaculate_conception_of_the_blessed_virgin_mary' && dow(n) === 0) c.n = n + 1;
        if (c.n !== n) c.transferred = true;
        add(c.n, c);
      });
      movables(L).forEach(function (c) { c.movable = true; add(c.n, c); });
      return byDay;
    }

    function day(y, m, d) {
      var n = dn(y, m, d);
      var Y = y; if (n >= advent1(y)) Y = y + 1;
      var L = yearData(Y);
      var t = temporal(n, L);
      var cands = (L.sanct[n] || []).concat(transferredInto(n, L)).filter(function (c) { return !c._movedAway; });
      cands.sort(function (a, b) { return a.rank - b.rank || (b.movable ? 1 : 0) - (a.movable ? 1 : 0); });
      var res = {
        date: [y, m, d], n: n, dow: t.dow, Y: Y, sunCycle: L.sunCycle, wkCycle: L.wkCycle,
        season: t.season, week: t.week, temporal: t, optional: [], commemorations: []
      };
      var principal = { kind: 'temporal', id: t.key, name: t.name, sub: t.sub, rank: t.rank, color: t.color, rankName: t.rankName };
      var top = cands[0];
      function names(list) { return list.map(function (c) { return c.name; }); }
      function items(list) { return list.map(function (c) { return { id: c.id, name: c.name, rank: c.rank, color: c.color }; }); }
      res.optionalItems = []; res.commemorationItems = [];
      if (top && top.rank < t.rank) {
        if (top.rank <= 8) {
          principal = { kind: 'sanctoral', id: top.id, name: top.name, rank: top.rank, color: top.color, movable: !!top.movable, rankName: top.id === 'commemoration_of_all_the_faithful_departed' ? 'Conmemoración' : RANK_NAME[top.rank] };
          if (top.transferred) principal.sub = 'Trasladada a este día';
        } else if (t.rank <= 9) {
          res.commemorationItems = items(cands.filter(function (c) { return c.rank >= 10; }));
          res.commemorations = names(res.commemorationItems);
        } else {
          var oblig = cands.filter(function (c) { return c.rank <= 11; });
          if (oblig.length) {
            principal = { kind: 'memoria', id: oblig[0].id, name: oblig[0].name, rank: oblig[0].rank, color: oblig[0].color, movable: !!oblig[0].movable, rankName: RANK_NAME[oblig[0].rank] };
            res.alsoObligatory = names(oblig.slice(1));
          }
          res.optionalItems = items(cands.filter(function (c) { return c.rank === 12; }));
          res.optional = names(res.optionalItems);
        }
      } else if (t.rank === 9) {
        res.commemorationItems = items(cands.filter(function (c) { return c.rank >= 10; }));
        res.commemorations = names(res.commemorationItems);
      }
      res.principal = principal;
      res.rankName = principal.rankName;
      return res;
    }

    // Solemnidades impedidas: se trasladan al primer día libre siguiente
    function transferredInto(n, L) {
      if (!L._transfers) {
        L._transfers = {};
        Object.keys(L.sanct).forEach(function (k) {
          var nn = +k;
          L.sanct[k].forEach(function (c) {
            if (!c.solemn || c.movable) return;
            var t = temporal(nn, L);
            var higher = L.sanct[k].some(function (o) { return o !== c && (o.rank < c.rank || (o.rank === c.rank && o.movable)); });
            var impeded = (t.rank < c.rank && t.rank !== 6 ? true : false) || higher;
            if (t.rank <= 2) impeded = true;
            if (!impeded) return;
            var target = nn + 1;
            for (var i = 0; i < 40; i++, target++) {
              var tt = temporal(target, L);
              var occ = (L.sanct[target] || []).some(function (o) { return o.rank <= 8; });
              if (tt.rank >= 9 && !occ) break;
            }
            c._movedAway = true;
            (L._transfers[target] = L._transfers[target] || []).push({ id: c.id, n: target, rank: c.rank, color: c.color, name: c.name, solemn: true, transferred: true });
          });
        });
      }
      return L._transfers[n] || [];
    }

    return { day: day, temporal: function (y, m, d) { var n = dn(y, m, d); var Y = n >= advent1(y) ? y + 1 : y; return temporal(n, yearData(Y)); }, yearData: yearData };
  }

  var api = { create: create, CFG_ES: CFG_ES, CFG_US: CFG_US, dn: dn, ymd: ymd, dow: dow, easter: easter, advent1: advent1, DIAS: DIAS, MESES: MESES, ROMAN: ROMAN };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Liturgia = api;
})(this);
