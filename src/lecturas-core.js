/* Lecturas del día: resolución de lecturas y formato español de las citas */
(function (root) {
  'use strict';
  var BOOKS = {
    GEN: ['Gén', 'Lectura del libro del Génesis', 'genesis'], EXO: ['Éx', 'Lectura del libro del Éxodo', 'exodo'],
    LEV: ['Lev', 'Lectura del libro del Levítico', 'levitico'], NUM: ['Núm', 'Lectura del libro de los Números', 'numeros'],
    DEU: ['Dt', 'Lectura del libro del Deuteronomio', 'deuteronomio'], JOS: ['Jos', 'Lectura del libro de Josué', 'josue'],
    JDG: ['Jue', 'Lectura del libro de los Jueces', 'jueces'], RUT: ['Rut', 'Lectura del libro de Rut', 'rut'],
    '1SA': ['1 Sam', 'Lectura del primer libro de Samuel', '1-samuel'], '2SA': ['2 Sam', 'Lectura del segundo libro de Samuel', '2-samuel'],
    '1KI': ['1 Re', 'Lectura del primer libro de los Reyes', '1-reyes'], '2KI': ['2 Re', 'Lectura del segundo libro de los Reyes', '2-reyes'],
    '1CH': ['1 Crón', 'Lectura del primer libro de las Crónicas', '1-cronicas'], '2CH': ['2 Crón', 'Lectura del segundo libro de las Crónicas', '2-cronicas'],
    EZR: ['Esd', 'Lectura del libro de Esdras', 'esdras'], NEH: ['Neh', 'Lectura del libro de Nehemías', 'nehemias'],
    TOB: ['Tob', 'Lectura del libro de Tobías', 'tobias'], JDT: ['Jdt', 'Lectura del libro de Judit', 'judit'],
    EST: ['Est', 'Lectura del libro de Ester', 'ester'], '1MA': ['1 Mac', 'Lectura del primer libro de los Macabeos', '1-macabeos'],
    '2MA': ['2 Mac', 'Lectura del segundo libro de los Macabeos', '2-macabeos'], JOB: ['Job', 'Lectura del libro de Job', 'job'],
    PSA: ['Sal', 'Salmo responsorial', 'salmos'], PRO: ['Prov', 'Lectura del libro de los Proverbios', 'proverbios'],
    ECC: ['Ecl', 'Lectura del libro del Eclesiastés', 'eclesiastes'], SNG: ['Cant', 'Lectura del libro del Cantar de los Cantares', 'cantar-de-los-cantares'],
    WIS: ['Sab', 'Lectura del libro de la Sabiduría', 'sabiduria'], SIR: ['Eclo', 'Lectura del libro del Eclesiástico', 'eclesiastico'],
    ISA: ['Is', 'Lectura del libro de Isaías', 'isaias'], JER: ['Jer', 'Lectura del libro de Jeremías', 'jeremias'],
    LAM: ['Lam', 'Lectura del libro de las Lamentaciones', 'lamentaciones'], BAR: ['Bar', 'Lectura del libro de Baruc', 'baruc'],
    EZK: ['Ez', 'Lectura de la profecía de Ezequiel', 'ezequiel'], DAN: ['Dan', 'Lectura de la profecía de Daniel', 'daniel'],
    HOS: ['Os', 'Lectura de la profecía de Oseas', 'oseas'], JOL: ['Jl', 'Lectura de la profecía de Joel', 'joel'],
    AMO: ['Am', 'Lectura de la profecía de Amós', 'amos'], OBA: ['Abd', 'Lectura de la profecía de Abdías', 'abdias'],
    JON: ['Jon', 'Lectura de la profecía de Jonás', 'jonas'], MIC: ['Miq', 'Lectura de la profecía de Miqueas', 'miqueas'],
    NAM: ['Nah', 'Lectura de la profecía de Nahún', 'nahun'], HAB: ['Hab', 'Lectura de la profecía de Habacuc', 'habacuc'],
    ZEP: ['Sof', 'Lectura de la profecía de Sofonías', 'sofonias'], HAG: ['Ag', 'Lectura de la profecía de Ageo', 'ageo'],
    ZEC: ['Zac', 'Lectura de la profecía de Zacarías', 'zacarias'], MAL: ['Mal', 'Lectura de la profecía de Malaquías', 'malaquias'],
    MAT: ['Mt', 'Lectura del santo evangelio según san Mateo', 'mateo'], MRK: ['Mc', 'Lectura del santo evangelio según san Marcos', 'marcos'],
    LUK: ['Lc', 'Lectura del santo evangelio según san Lucas', 'lucas'], JHN: ['Jn', 'Lectura del santo evangelio según san Juan', 'juan'],
    ACT: ['Hch', 'Lectura del libro de los Hechos de los Apóstoles', 'hechos-de-los-apostoles'],
    ROM: ['Rom', 'Lectura de la carta del apóstol san Pablo a los Romanos', 'romanos'],
    '1CO': ['1 Cor', 'Lectura de la primera carta del apóstol san Pablo a los Corintios', '1-corintios'],
    '2CO': ['2 Cor', 'Lectura de la segunda carta del apóstol san Pablo a los Corintios', '2-corintios'],
    GAL: ['Gál', 'Lectura de la carta del apóstol san Pablo a los Gálatas', 'galatas'],
    EPH: ['Ef', 'Lectura de la carta del apóstol san Pablo a los Efesios', 'efesios'],
    PHP: ['Flp', 'Lectura de la carta del apóstol san Pablo a los Filipenses', 'filipenses'],
    COL: ['Col', 'Lectura de la carta del apóstol san Pablo a los Colosenses', 'colosenses'],
    '1TH': ['1 Tes', 'Lectura de la primera carta del apóstol san Pablo a los Tesalonicenses', '1-tesalonicenses'],
    '2TH': ['2 Tes', 'Lectura de la segunda carta del apóstol san Pablo a los Tesalonicenses', '2-tesalonicenses'],
    '1TI': ['1 Tim', 'Lectura de la primera carta del apóstol san Pablo a Timoteo', '1-timoteo'],
    '2TI': ['2 Tim', 'Lectura de la segunda carta del apóstol san Pablo a Timoteo', '2-timoteo'],
    TIT: ['Tit', 'Lectura de la carta del apóstol san Pablo a Tito', 'tito'], PHM: ['Flm', 'Lectura de la carta del apóstol san Pablo a Filemón', 'filemon'],
    HEB: ['Heb', 'Lectura de la carta a los Hebreos', 'hebreos'], JAS: ['Sant', 'Lectura de la carta del apóstol Santiago', 'santiago'],
    '1PE': ['1 Pe', 'Lectura de la primera carta del apóstol san Pedro', '1-pedro'], '2PE': ['2 Pe', 'Lectura de la segunda carta del apóstol san Pedro', '2-pedro'],
    '1JN': ['1 Jn', 'Lectura de la primera carta del apóstol san Juan', 'juan-cartas-1-3'], '2JN': ['2 Jn', 'Lectura de la segunda carta del apóstol san Juan', 'juan-cartas-1-3'],
    '3JN': ['3 Jn', 'Lectura de la tercera carta del apóstol san Juan', 'juan-cartas-1-3'], JUD: ['Jds', 'Lectura de la carta del apóstol san Judas', 'judas'],
    REV: ['Ap', 'Lectura del libro del Apocalipsis', 'apocalipsis']
  };
  var GOSPELS = { MAT: 1, MRK: 1, LUK: 1, JHN: 1 };

  // Numeración griega (la del Leccionario español) a partir de la hebrea
  function greek(h, v) {
    if (h <= 8 || h >= 148) return String(h);
    if (h === 9 || h === 10) return '9';
    if (h <= 113) return String(h - 1);
    if (h === 114 || h === 115) return '113';
    if (h === 116) return v >= 10 ? '115' : '114';
    if (h <= 146) return String(h - 1);
    if (h === 147) return v >= 12 ? '147' : '146';
    return String(h);
  }
  function ceeAnchor(h) {
    if (h <= 9 || h >= 148) return 'cap' + h;
    if (h === 10) return 'cap10';
    if (h === 114) return 'cap114 (113a)';
    if (h === 115) return 'cap115 (113b)';
    if (h === 116) return 'cap116 (114-115)';
    if (h === 147) return 'cap147 (146-147)';
    return 'cap' + h + ' (' + (h - 1) + ')';
  }
  // "45:1,4-6" -> "45, 1. 4-6" ; "8:23-9:3" -> "8, 23–9, 3"
  function fmtRef(b, r) {
    return r.split(';').map(function (part) {
      var m = /^([0-9a-z]+):(.*)$/.exec(part);
      if (!m) return part;
      var ch = m[1], vv = m[2];
      var chDisp = ch;
      if (b === 'PSA') chDisp = greek(+ch, parseInt(vv, 10) || 1);
      vv = vv.split(',').map(function (seg) {
        return seg.replace(/^([0-9]+[a-z]*)-([0-9]+):([0-9]+[a-z]*)$/, function (_, a, c2, v2) {
          return a + '–' + (b === 'PSA' ? greek(+c2, +v2) : c2) + ', ' + v2;
        });
      }).join('. ');
      return chDisp + ', ' + vv;
    }).join('; ');
  }
  function citeText(b, r) { return BOOKS[b][0] + ' ' + fmtRef(b, r); }
  function ceeLink(b, r) {
    var slug = BOOKS[b][2];
    var ch = parseInt(r, 10);
    var base = 'https://www.conferenciaepiscopal.es/biblia/' + slug + '/';
    if (/^juan-cartas/.test(slug) || isNaN(ch)) return base;
    if (b === 'PSA') return base + '#' + encodeURIComponent(ceeAnchor(ch)).replace(/%28/g, '(').replace(/%29/g, ')');
    return base + '#cap' + ch;
  }

  var LABEL = { p: 'Primera lectura', s: 'Salmo responsorial', g: 'Segunda lectura', e: 'Evangelio', r: 'Evangelio de la procesión de ramos', l: 'Lectura' };
  var ORD = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima', 'Octava'];
  var MASS = {
    vigilia: 'Misa vespertina de la vigilia', noche: 'Misa de medianoche', aurora: 'Misa de la aurora', dia: 'Misa del día',
    crismal: 'Misa crismal', cena: 'Misa vespertina de la Cena del Señor', main: ''
  };
  var MASS_ORDER = ['vigilia', 'noche', 'aurora', 'dia', 'crismal', 'cena', 'main'];

  function resolveMass(val, day) {
    if (Array.isArray(val)) return val;
    if (val.I || val.II) {
      var first = val[day.wkCycle] || [];
      var gos = day.sunCycle === 'A' && val.eA ? val.eA : val.e;
      return first.concat(gos || []);
    }
    return val[day.sunCycle] || val.A || [];
  }
  function toItems(list, key) {
    var items = [], nonPsalm = 0, vigil = key === 'VIGILIA';
    list.forEach(function (x) {
      var t = x[0], b = x[1], r = x[2], alts = x[3] || [];
      var label = LABEL[t];
      if (vigil && t !== 's') {
        if (t === 'e') label = 'Evangelio';
        else if (b === 'ROM') label = 'Epístola';
        else label = ORD[nonPsalm] + ' lectura';
        if (t !== 'e' && b !== 'ROM') nonPsalm++;
      }
      if (t === 's' && b !== 'PSA') label = 'Cántico responsorial';
      items.push({
        type: t, label: label, title: t === 's' ? '' : BOOKS[b][1], gospel: !!GOSPELS[b] && (t === 'e' || t === 'r'),
        cite: citeText(b, r), link: ceeLink(b, r),
        resp: x[4] ? citeText(x[4][0], x[4][1]) : null,
        alts: alts.map(function (a) { return { cite: citeText(a[0], a[1]), link: ceeLink(a[0], a[1]), title: BOOKS[a[0]][1] }; })
      });
    });
    return items;
  }

  // Devuelve {masses:[{id,label,items}], note}
  function readingsFor(day, LT, LS) {
    var p = day.principal, entry, note = '', key = day.temporal.key;
    var ferial = LT[key];
    if (p.kind === 'sanctoral') { entry = LS[p.id]; key = p.id; }
    else entry = ferial;
    if (!entry) return { masses: [], note: 'No hay lecturas registradas para este día.' };
    var memProp = p.kind === 'memoria' ? LS[p.id] : null;
    var masses = [];
    MASS_ORDER.forEach(function (m) {
      if (!entry[m]) return;
      var list = resolveMass(entry[m], day).slice();
      if (memProp && memProp.replace) {
        memProp.replace.forEach(function (rep) {
          var i = list.findIndex(function (x) { return x[0] === rep[0]; });
          if (i >= 0) list[i] = rep; else list.push(rep);
        });
      } else if (memProp && memProp.main) {
        list = resolveMass(memProp.main, day);
      }
      masses.push({ id: m, label: MASS[m], items: toItems(list, key) });
    });
    if (p.kind === 'memoria') {
      if (memProp && memProp.replace) note = 'Lecturas de la feria, con ' + (memProp.replace.some(function (r) { return r[0] === 'e'; }) && memProp.replace.length === 1 ? 'el evangelio propio' : 'lecturas propias') + ' de la memoria.';
      else if (memProp && memProp.main) note = 'Lecturas propias de la memoria.';
      else note = 'Lecturas de la feria. Para la memoria pueden tomarse también las del común o las propias.';
    }
    if (key === 'VIGILIA') note = 'Lecturas de la Vigilia pascual, que se celebra en la noche del sábado.';
    return { masses: masses, note: note };
  }

  var api = { readingsFor: readingsFor, citeText: citeText, ceeLink: ceeLink, fmtRef: fmtRef, BOOKS: BOOKS, MASS: MASS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Lecturas = api;
})(this);
