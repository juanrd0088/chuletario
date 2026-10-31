/* Liturgia de las Horas: instrucciones para rezar Laudes, Vísperas y Completas con el libro.
 * Sigue la Ordenación general de la Liturgia de las Horas (OGLH 133-134, 225-240, 88). */
(function (root) {
  'use strict';
  var R = ['', 'I', 'II', 'III', 'IV'];
  var DN = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var MESES = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Salterio en cuatro semanas (numeración de los salmos del libro litúrgico)
  var PS = {
    1: {
      V1: ['Sal 140, 1-9', 'Sal 141', 'Cántico Flp 2, 6-11'], L0: ['Sal 62, 2-9', 'Cántico Dn 3, 57-88. 56', 'Sal 149'], V2: ['Sal 109, 1-5. 7', 'Sal 113 A', 'Cántico Ap 19, 1-7'],
      L: [null, ['Sal 5', 'Cántico 1 Cr 29', 'Sal 28'], ['Sal 23', 'Cántico Tb 13', 'Sal 32'], ['Sal 35', 'Cántico Jdt 16', 'Sal 46'], ['Sal 56', 'Cántico Jr 31', 'Sal 47'], ['Sal 50', 'Cántico Is 45', 'Sal 99'], ['Sal 118, 145-152', 'Cántico Éx 15', 'Sal 116']],
      V: [null, ['Sal 10', 'Sal 14', 'Cántico Ef 1, 3-10'], ['Sal 19', 'Sal 20', 'Cántico Ap 4, 11; 5, 9-10. 12'], ['Sal 26 (I)', 'Sal 26 (II)', 'Cántico Col 1, 12-20'], ['Sal 29', 'Sal 31', 'Cántico Ap 11, 17-18; 12, 10b-12a'], ['Sal 40', 'Sal 45', 'Cántico Ap 15, 3-4']]
    },
    2: {
      V1: ['Sal 118, 105-112', 'Sal 15', 'Cántico Flp 2, 6-11'], L0: ['Sal 117', 'Cántico Dn 3, 52-57', 'Sal 150'], V2: ['Sal 109, 1-5. 7', 'Sal 113 B', 'Cántico Ap 19, 1-7'],
      L: [null, ['Sal 41', 'Cántico Eclo 36', 'Sal 18 A'], ['Sal 42', 'Cántico Is 38', 'Sal 64'], ['Sal 76', 'Cántico 1 Sam 2', 'Sal 96'], ['Sal 79', 'Cántico Is 12', 'Sal 80'], ['Sal 50', 'Cántico Hab 3', 'Sal 147'], ['Sal 91', 'Cántico Dt 32', 'Sal 8']],
      V: [null, ['Sal 44 (I)', 'Sal 44 (II)', 'Cántico Ef 1, 3-10'], ['Sal 48 (I)', 'Sal 48 (II)', 'Cántico Ap 4, 11; 5, 9-10. 12'], ['Sal 61', 'Sal 66', 'Cántico Col 1, 12-20'], ['Sal 71 (I)', 'Sal 71 (II)', 'Cántico Ap 11, 17-18; 12, 10b-12a'], ['Sal 114', 'Sal 120', 'Cántico Ap 15, 3-4']]
    },
    3: {
      V1: ['Sal 112', 'Sal 115', 'Cántico Flp 2, 6-11'], L0: ['Sal 92', 'Cántico Dn 3, 57-88. 56', 'Sal 148'], V2: ['Sal 109, 1-5. 7', 'Sal 110', 'Cántico Ap 19, 1-7'],
      L: [null, ['Sal 83', 'Cántico Is 2', 'Sal 95'], ['Sal 84', 'Cántico Is 26', 'Sal 66'], ['Sal 85', 'Cántico Is 33', 'Sal 97'], ['Sal 86', 'Cántico Is 40', 'Sal 98'], ['Sal 50', 'Cántico Jr 14', 'Sal 99'], ['Sal 118, 145-152', 'Cántico Sab 9', 'Sal 116']],
      V: [null, ['Sal 122', 'Sal 123', 'Cántico Ef 1, 3-10'], ['Sal 124', 'Sal 130', 'Cántico Ap 4, 11; 5, 9-10. 12'], ['Sal 125', 'Sal 126', 'Cántico Col 1, 12-20'], ['Sal 131 (I)', 'Sal 131 (II)', 'Cántico Ap 11, 17-18; 12, 10b-12a'], ['Sal 134 (I)', 'Sal 134 (II)', 'Cántico Ap 15, 3-4']]
    },
    4: {
      V1: ['Sal 121', 'Sal 129', 'Cántico Flp 2, 6-11'], L0: ['Sal 117', 'Cántico Dn 3, 52-57', 'Sal 150'], V2: ['Sal 109, 1-5. 7', 'Sal 111', 'Cántico Ap 19, 1-7'],
      L: [null, ['Sal 89', 'Cántico Is 42', 'Sal 134'], ['Sal 100', 'Cántico Dn 3, 26-41', 'Sal 143'], ['Sal 107', 'Cántico Is 61-62', 'Sal 145'], ['Sal 142', 'Cántico Is 66', 'Sal 146'], ['Sal 50', 'Cántico Tb 13', 'Sal 147'], ['Sal 91', 'Cántico Ez 36', 'Sal 8']],
      V: [null, ['Sal 135 (I)', 'Sal 135 (II)', 'Cántico Ef 1, 3-10'], ['Sal 136', 'Sal 137', 'Cántico Ap 4, 11; 5, 9-10. 12'], ['Sal 138 (I)', 'Sal 138 (II)', 'Cántico Col 1, 12-20'], ['Sal 143 (I)', 'Sal 143 (II)', 'Cántico Ap 11, 17-18; 12, 10b-12a'], ['Sal 144 (I)', 'Sal 144 (II)', 'Cántico Ap 15, 3-4']]
    }
  };
  var LENT_V2 = 'Cántico 1 Pe 2, 21-24';
  var XMAS_V2 = ['Sal 109, 1-5. 7', 'Sal 129', 'Cántico Col 1, 12-20'];
  var COMP = {
    domI: { title: 'del domingo, después de las I Vísperas', ps: ['Sal 4', 'Sal 133'] },
    domII: { title: 'del domingo, después de las II Vísperas', ps: ['Sal 90'] },
    1: { title: 'del lunes', ps: ['Sal 85'] }, 2: { title: 'del martes', ps: ['Sal 142, 1-11'] },
    3: { title: 'del miércoles', ps: ['Sal 30, 2-6', 'Sal 129'] }, 4: { title: 'del jueves', ps: ['Sal 15'] },
    5: { title: 'del viernes', ps: ['Sal 87'] }, 6: { title: 'del sábado', ps: ['Sal 4', 'Sal 133'] }
  };
  // Tomos de la edición española de la Liturgia de las Horas
  var TOMOS = {
    1: { name: 'Tomo I', desc: 'Adviento y Navidad' },
    2: { name: 'Tomo II', desc: 'Cuaresma, Triduo pascual y Pascua' },
    3: { name: 'Tomo III', desc: 'Tiempo Ordinario, semanas I a XVII' },
    4: { name: 'Tomo IV', desc: 'Tiempo Ordinario, semanas XVIII a XXXIV' }
  };
  var O_ANT = { 17: '«Oh Sabiduría»', 18: '«Oh Adonai»', 19: '«Oh Renuevo del tronco de Jesé»', 20: '«Oh Llave de David»', 21: '«Oh Sol que nace de lo alto»', 22: '«Oh Rey de las naciones»', 23: '«Oh Emmanuel»' };

  function create(Cal, Lit, santoral, commons) {
    var SDATE = {};
    santoral.forEach(function (s) { SDATE[s.id] = [s.m, s.d]; });

    function dayOf(n) { var a = Lit.ymd(n); return Cal.day(a[0], a[1], a[2]); }

    function psalterWeek(d) {
      var t = d.temporal, L = Cal.yearData(d.Y);
      switch (d.season) {
        case 'adviento': return t.week;
        case 'navidad': return (Math.floor((d.n - L.adv1) / 7) % 4) + 1;
        case 'cuaresma': return /^CEN/.test(t.key) ? 4 : ((t.week - 1) % 4) + 1;
        case 'semanasanta': case 'triduo': return 2;
        default: return ((t.week - 1) % 4) + 1;
      }
    }

    // Tomo según el tiempo litúrgico (el Propio de los santos de cada tomo trae los santos de esas fechas)
    function tomoOf(d) {
      switch (d.season) {
        case 'adviento': case 'navidad': return 1;
        case 'cuaresma': case 'semanasanta': case 'triduo': case 'pascua': return 2;
        default: return d.temporal.week <= 17 ? 3 : 4;
      }
    }
    function tomoInfo(t) { return { n: t, name: TOMOS[t].name, desc: TOMOS[t].desc }; }

    function lc(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
    function ptLabel(d) {
      var t = d.temporal, k = t.key;
      if (d.principal.kind === 'sanctoral' && d.principal.movable) return d.principal.name;
      if (/^DEC/.test(k) || (/^JAN\d/.test(k) && k !== 'JAN1') || /^EPI\d/.test(k)) return t.sub;
      if (/^OCT/.test(k)) return t.name.replace(/^Día /, '') + ', octava de Navidad';
      if (/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado) de la/.test(t.name)) return lc(t.name);
      return t.name;
    }
    function PT(d) { return 'Propio del tiempo (' + ptLabel(d) + ')'; }
    function SAL(d, w, extra) { return 'Salterio, ' + DN[d.dow] + ' de la semana ' + R[w] + (extra ? ', ' + extra : ''); }
    function SALSun(w, extra) { return 'Salterio, domingo de la semana ' + R[w] + (extra ? ', ' + extra : ''); }
    function saintDate(id) { var x = SDATE[id]; return x ? x[1] + ' de ' + MESES[x[0]] : ''; }
    function PSANT(p) { return p.movable ? 'Propio (' + p.name + ')' : 'Propio de los santos (' + saintDate(p.id) + ')'; }

    function isFem(name) { return /^(Santa|Santas|Nuestra Señora|Bienaventurada|Santísima Virgen|Santa María)\b/.test(name); }
    function isPlural(name) { return /^(Santos|Santas|Los Santos|Los siete)\b/.test(name) || /compañeros/.test(name); }
    function commonText(id, name) {
      var toks = commons[id] || ['PROP'];
      if (toks.indexOf('PROP') >= 0 || toks.indexOf('DIF') >= 0) return null;
      var fem = isFem(name), pl = isPlural(name), out = [];
      toks.forEach(function (t) {
        var s = {
          Martyrs: pl ? 'mártires (varios mártires)' : 'mártires (un mártir)', VirginMartyrs: 'mártires (una virgen mártir)', WomanMartyrs: 'mártires (una santa mártir)',
          MissionaryMartyrs: 'mártires (misioneros)', Pastors: pl ? 'pastores (varios pastores)' : 'pastores', PastorsSeveral: 'pastores (varios pastores)',
          Popes: 'pastores (un papa)', Bishops: pl ? 'pastores (varios pastores)' : 'pastores (un obispo)', Missionaries: 'pastores (misioneros)', Founders: 'pastores (fundadores)',
          DoctorsOfTheChurch: 'doctores de la Iglesia', Virgins: pl ? 'vírgenes (varias vírgenes)' : 'vírgenes (una virgen)',
          Saints: fem ? 'santas mujeres' : 'santos varones', HolyWomen: 'santas mujeres', SaintsSeveral: 'santos varones (varios santos)',
          Religious: fem ? 'santas mujeres (religiosas)' : 'santos varones (religiosos)', Abbots: 'santos varones (religiosos)', Monks: 'santos varones (religiosos)', Nuns: 'santas mujeres (religiosas)',
          MercyWorkers: fem ? 'santas mujeres (obras de misericordia)' : 'santos varones (obras de misericordia)', Educators: fem ? 'santas mujeres (educadoras)' : 'santos varones (educadores)',
          BlessedVirginMary: 'santa María Virgen', APO: 'apóstoles', DED: 'la dedicación de una iglesia'
        }[t];
        if (s && out.indexOf(s) < 0) out.push(s);
      });
      if (!out.length) return null;
      return 'común de ' + out.join(' o de ');
    }
    function commonShort(id, name) {
      var c = commonText(id, name); if (!c) return null;
      return 'C' + c.slice(1).replace(/ \([^)]*\)/g, '');
    }

    // ---------- Tipo de oficio ----------
    var TSOL = { NAV: 1, JAN1: 1, EPIF: 1, ASC: 1, PENT: 1, 'PAS1-0': 1 };
    function kindOf(d, choice) {
      var p = d.principal, t = d.temporal;
      if (p.kind === 'sanctoral') {
        if (p.id === 'commemoration_of_all_the_faithful_departed') return { type: 'difuntos', saint: p };
        if (p.movable) return { type: p.rank <= 4 ? 'tsol' : 'tfeast', saint: p };
        return { type: p.rank <= 4 ? 'ssol' : 'sfeast', saint: p };
      }
      if (p.kind === 'memoria') return { type: 'mem', saint: p };
      if (choice && choice !== 'feria') {
        if (choice === 'smsab') return { type: 'bvmsat' };
        var opt = (d.optionalItems || []).find(function (o) { return o.id === choice; });
        if (opt) return { type: 'mem', saint: opt, optional: true };
      }
      var k = t.key;
      if (k === 'JUEVES' || k === 'VIERNES' || k === 'VIGILIA') return { type: 'triduo' };
      if (TSOL[k]) return { type: 'tsol' };
      if (k === 'SAGFAM' || k === 'BAUT') return { type: 'tfeast' };
      if (/^OCT/.test(k)) return { type: 'octnav' };
      if (/^PAS1-/.test(k)) return { type: 'octpas' };
      if (d.dow === 0) return { type: d.season === 'ordinario' ? 'otsun' : 'strongsun' };
      if (d.season === 'ordinario') return { type: 'otfer' };
      if (/^DEC/.test(k)) return { type: 'dec17' };
      return { type: 'strongfer' };
    }

    function hasFirstVespers(e) {
      var p = e.principal;
      if (e.temporal.key === 'PAS1-0') return false;
      if (e.dow === 0) return true;
      if (p.id === 'commemoration_of_all_the_faithful_departed') return false;
      if (p.kind === 'sanctoral' && p.rank <= 4) return true;
      if (p.kind === 'temporal' && TSOL[e.temporal.key]) return true;
      return false;
    }
    function firstVespersWin(d, e, choice) {
      if (!hasFirstVespers(e)) return false;
      var r0 = d.principal.rank;
      if (d.principal.kind === 'temporal' && choice && choice !== 'feria') r0 = 12;
      var r1 = e.principal.rank;
      return e.dow === 0 ? r1 <= r0 : r1 < r0;
    }
    function inOctave(d) {
      var k = d.temporal.key;
      return k === 'NAV' || /^OCT/.test(k) || k === 'JAN1' || /^PAS1-/.test(k) ||
        (d.season === 'navidad' && d.date[1] === 12 && d.date[2] >= 26);
    }

    // ---------- Piezas comunes ----------
    function seasonNotes(d, parts) {
      if (d.season === 'cuaresma' || d.season === 'semanasanta') parts.lent = true;
      if (d.season === 'pascua') parts.easter = true;
      return parts;
    }
    function marksAdd(list, book, place) {
      if (!list.some(function (m) { return m.book === book && m.place === place; })) list.push({ book: book, place: place });
    }
    function setAll(P, v, keys) { (keys || ['himno', 'antifonas', 'lectura', 'responsorio', 'cantico', 'preces', 'oracion', 'invit']).forEach(function (k) { P[k] = v; }); }

    // Santos: memorias, fiestas y solemnidades
    function saintPlan(P, sk, d, hour, w, kind) {
      var p = sk.saint, com = commonText(p.id, p.name), date = p.movable ? p.name : saintDate(p.id);
      var book = p.movable ? 'Propio' : 'Propio de los santos';
      var feria = d.season === 'ordinario' ? 'la feria' : 'la feria (Propio del tiempo)';
      if (kind === 'mem') {
        P.rule = com ? 'Lo que el santo tenga propio está en el ' + book + ' (' + date + '); lo que no tenga, se toma del ' + com + ', o de ' + feria + '.'
          : 'Lo propio de la memoria está en el ' + book + ' (' + date + '); lo que no tenga propio, de ' + feria + '.';
        setAll(P, com ? 'Propio del santo, o común' : 'Propio de la memoria, o feria');
        P.antifonas = 'las del salterio, salvo que el santo las tenga propias';
        P.oracion = book + ' (' + date + ')';
        marksAdd(P.marks, 'Salterio', DN[d.dow] + ', semana ' + R[w]);
        marksAdd(P.marks, book, date);
        if (com) marksAdd(P.marks, commonShort(p.id, p.name), hour);
        if (d.season !== 'ordinario') marksAdd(P.marks, 'Propio del tiempo', ptLabel(d));
      } else {
        if (com) P.rule = 'Todo se toma del ' + book + ' (' + date + '); lo que no tenga propio, del ' + com + '.';
        setAll(P, com ? 'Propio, o común' : book);
        P.oracion = book + ' (' + date + ')';
        marksAdd(P.marks, book, date);
        if (com) marksAdd(P.marks, commonShort(p.id, p.name), hour);
      }
      return com;
    }

    function lcArticle(name) { return name.replace(/^(La|El|Los|Las) /, function (m) { return m.toLowerCase(); }); }
    function deDel(name) {
      if (/^Bienaventurada /.test(name)) return 'de la ' + name;
      if (/^Inmaculado /.test(name)) return 'del ' + name;
      var x = lcArticle(name); return /^el /.test(x) ? 'del ' + x.slice(3) : 'de ' + x;
    }
    function fixBook(d, P) {
      if (d.principal.id !== 'SUMOSACERDOTE') return P;
      ['himno', 'antifonas', 'lectura', 'responsorio', 'cantico', 'preces', 'oracion', 'invit', 'psalmsFrom'].forEach(function (k) { if (P[k]) P[k] = P[k].replace('Propio del tiempo', 'Propio'); });
      P.marks.forEach(function (m) { m.book = m.book.replace('Propio del tiempo', 'Propio'); });
      return P;
    }

    // ---------- Laudes ----------
    function laudes(d, choice) {
      var sk = kindOf(d, choice), w = psalterWeek(d), dow = d.dow;
      var P = { hour: 'laudes', marks: [], notes: [], psalterWeek: w };
      switch (sk.type) {
        case 'otfer':
          P.office = 'Feria del Tiempo Ordinario';
          setAll(P, 'Salterio');
          P.psalms = PS[w].L[dow];
          marksAdd(P.marks, 'Salterio', DN[dow] + ', semana ' + R[w]);
          break;
        case 'otsun':
          P.office = d.principal.name;
          setAll(P, 'Salterio');
          P.cantico = 'Propio del tiempo, la del ciclo ' + d.sunCycle; P.oracion = 'Propio del tiempo';
          P.psalms = PS[w].L0;
          marksAdd(P.marks, 'Salterio', 'domingo, semana ' + R[w]);
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d) + ', ciclo ' + d.sunCycle);
          break;
        case 'strongfer': case 'dec17':
          P.office = d.temporal.name + (d.temporal.sub ? ' · ' + d.temporal.sub : '');
          setAll(P, 'Propio del tiempo');
          P.antifonas = sk.type === 'dec17' ? 'las propias de la feria (Propio del tiempo)' : d.season === 'semanasanta' ? 'las propias (Propio del tiempo)' : 'las del salterio';
          P.psalms = PS[w].L[dow];
          marksAdd(P.marks, 'Salterio', DN[dow] + ', semana ' + R[w]);
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d));
          break;
        case 'strongsun':
          P.office = d.principal.name;
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las propias del domingo (Propio del tiempo)';
          P.psalms = PS[w].L0; P.psalmsFrom = 'del salterio, domingo de la semana ' + R[w];
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d));
          marksAdd(P.marks, 'Salterio', 'domingo, semana ' + R[w]);
          break;
        case 'tsol': case 'tfeast': case 'octnav':
          P.office = sk.type === 'octnav' ? d.temporal.name + ' · ' + d.temporal.sub : d.principal.name;
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las propias (Propio del tiempo)';
          P.psalms = PS[1].L0; P.psalmsFrom = 'del domingo de la semana I del salterio';
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d));
          marksAdd(P.marks, 'Salterio', 'domingo, semana I');
          break;
        case 'octpas':
          P.office = d.temporal.name;
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las del domingo de Pascua (Propio del tiempo)';
          P.responsorio = 'En su lugar se dice la antífona «Este es el día en que actuó el Señor…»';
          P.psalms = PS[1].L0; P.psalmsFrom = 'del domingo de la semana I del salterio';
          marksAdd(P.marks, 'Propio del tiempo', 'domingo de Pascua y ' + lc(d.temporal.name));
          marksAdd(P.marks, 'Salterio', 'domingo, semana I');
          break;
        case 'triduo':
          return triduo(d, 'laudes');
        case 'ssol': case 'sfeast':
          P.office = sk.saint.name;
          saintPlan(P, sk, d, 'Laudes', w, 'feast');
          P.antifonas = P.antifonas === 'Propio, o común' ? 'propias o del común' : 'las propias';
          P.psalms = PS[1].L0; P.psalmsFrom = 'del domingo de la semana I del salterio';
          marksAdd(P.marks, 'Salterio', 'domingo, semana I');
          break;
        case 'mem':
          P.office = (sk.optional ? 'Memoria libre ' : 'Memoria ') + deDel(sk.saint.name);
          saintPlan(P, sk, d, 'Laudes', w, 'mem');
          P.psalms = PS[w].L[dow];
          break;
        case 'bvmsat':
          P.office = 'Santa María en sábado (memoria libre)';
          setAll(P, 'Común de santa María Virgen');
          P.antifonas = 'las del salterio';
          P.psalms = PS[w].L[6];
          marksAdd(P.marks, 'Salterio', 'sábado, semana ' + R[w]);
          marksAdd(P.marks, 'Común de santa María Virgen', 'Laudes');
          break;
        case 'difuntos':
          P.office = 'Conmemoración de todos los fieles difuntos';
          setAll(P, 'Oficio de difuntos');
          P.antifonas = 'las del Oficio de difuntos'; P.psalmsFrom = 'del Oficio de difuntos (Laudes)';
          P.oracion = 'Propio de los santos (2 de noviembre)';
          marksAdd(P.marks, 'Oficio de difuntos', 'Laudes');
          marksAdd(P.marks, 'Propio de los santos', '2 de noviembre');
          break;
      }
      commemoration(d, P);
      return finish(d, seasonNotes(d, P));
    }

    // ---------- Vísperas ----------
    function visperas(n, choice) {
      var d = dayOf(n), e = dayOf(n + 1);
      if (firstVespersWin(d, e, choice)) {
        var fv = firstVespers(e, d), t0 = tomoOf(d), t1 = tomoOf(e);
        if (t0 !== t1) fv.notes.unshift('Esta tarde cambias de tomo: estas Vísperas ya están en el ' + TOMOS[t1].name + ' (' + TOMOS[t1].desc + '), no en el ' + TOMOS[t0].name + ' de esta mañana.');
        return fv;
      }
      var sk = kindOf(d, choice), w = psalterWeek(d), dow = d.dow;
      var P = { hour: 'visperas', marks: [], notes: [], psalterWeek: w };
      if (d.season === 'navidad' && d.date[1] === 12 && d.date[2] >= 26 && d.date[2] <= 28 && sk.type === 'sfeast') sk = { type: 'octnav', feastDay: true };
      switch (sk.type) {
        case 'otfer':
          P.office = 'Feria del Tiempo Ordinario';
          setAll(P, 'Salterio');
          P.psalms = PS[w].V[dow];
          marksAdd(P.marks, 'Salterio', DN[dow] + ', semana ' + R[w]);
          break;
        case 'otsun':
          P.office = 'II Vísperas del ' + d.principal.name;
          setAll(P, 'Salterio');
          P.cantico = 'Propio del tiempo, la del ciclo ' + d.sunCycle; P.oracion = 'Propio del tiempo';
          P.psalms = PS[w].V2;
          marksAdd(P.marks, 'Salterio', 'domingo, semana ' + R[w] + ', II Vísperas');
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d) + ', ciclo ' + d.sunCycle);
          break;
        case 'strongfer': case 'dec17':
          P.office = d.temporal.name + (d.temporal.sub ? ' · ' + d.temporal.sub : '');
          setAll(P, 'Propio del tiempo');
          P.antifonas = sk.type === 'dec17' ? 'las propias de la feria (Propio del tiempo)' : d.season === 'semanasanta' ? 'las propias (Propio del tiempo)' : 'las del salterio';
          if (sk.type === 'dec17' && O_ANT[d.date[2]]) P.cantico = 'Propio del tiempo: la antífona ' + O_ANT[d.date[2]];
          P.psalms = PS[w].V[dow];
          marksAdd(P.marks, 'Salterio', DN[dow] + ', semana ' + R[w]);
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d));
          break;
        case 'strongsun':
          P.office = 'II Vísperas del ' + d.principal.name;
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las propias del domingo (Propio del tiempo)';
          P.psalms = PS[w].V2.slice(); P.psalmsFrom = 'del salterio, domingo de la semana ' + R[w] + ', II Vísperas';
          oAnt(P, d.date);
          if (d.season === 'cuaresma' || d.season === 'semanasanta') { P.psalms[2] = LENT_V2; P.notes.push('En Cuaresma el cántico del final es el de la primera carta de Pedro, que el salterio indica en lugar del Apocalipsis.'); }
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d));
          marksAdd(P.marks, 'Salterio', 'domingo, semana ' + R[w] + ', II Vísperas');
          break;
        case 'tsol': case 'tfeast':
          P.office = (d.principal.rank <= 4 || d.dow === 0 ? 'II Vísperas ' : 'Vísperas ') + (/^Domingo/.test(d.principal.name) ? 'del ' + d.principal.name : deDel(d.principal.name));
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las propias (Propio del tiempo)'; P.psalmsFrom = 'propios (Propio del tiempo)';
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(d) + (d.principal.rank <= 4 || d.dow === 0 ? ', II Vísperas' : ''));
          break;
        case 'octnav':
          P.office = 'Vísperas de la octava de Navidad · ' + d.date[2] + ' de diciembre';
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las de las II Vísperas de Navidad';
          P.psalms = XMAS_V2; P.psalmsFrom = 'de las II Vísperas de Navidad';
          marksAdd(P.marks, 'Propio del tiempo', 'Navidad, II Vísperas (salmodia)');
          marksAdd(P.marks, 'Propio del tiempo', d.date[2] + ' de diciembre');
          if (sk.feastDay) P.notes.push('Las Vísperas de hoy son de la octava de Navidad, no de la fiesta del santo.');
          break;
        case 'octpas':
          P.office = 'Vísperas · ' + d.temporal.name;
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las del domingo de Pascua (Propio del tiempo)';
          P.responsorio = 'En su lugar se dice la antífona «Este es el día en que actuó el Señor…»';
          P.psalms = PS[1].V2; P.psalmsFrom = 'de las Vísperas del domingo de Pascua';
          marksAdd(P.marks, 'Propio del tiempo', 'domingo de Pascua y ' + lc(d.temporal.name));
          break;
        case 'triduo':
          return triduo(d, 'visperas');
        case 'ssol': case 'sfeast': {
          var solemn = sk.type === 'ssol';
          P.office = (solemn || d.dow === 0 ? 'II Vísperas ' : 'Vísperas ') + deDel(sk.saint.name);
          var com = saintPlan(P, sk, d, 'Vísperas', w, 'feast');
          P.antifonas = com ? 'propias o del común' : 'las propias';
          P.psalmsFrom = com ? 'propios o, si no los tiene, del común' : 'propios';
          break;
        }
        case 'mem':
          P.office = 'Vísperas de la ' + (sk.optional ? 'memoria libre ' : 'memoria ') + deDel(sk.saint.name);
          saintPlan(P, sk, d, 'Vísperas', w, 'mem');
          P.psalms = PS[w].V[dow];
          break;
        case 'bvmsat':
          return visperas(n, 'feria');
        case 'difuntos':
          P.office = 'Vísperas · Conmemoración de todos los fieles difuntos';
          setAll(P, 'Oficio de difuntos');
          P.antifonas = 'las del Oficio de difuntos'; P.psalmsFrom = 'del Oficio de difuntos (Vísperas)';
          P.oracion = 'Propio de los santos (2 de noviembre)';
          marksAdd(P.marks, 'Oficio de difuntos', 'Vísperas');
          break;
      }
      commemoration(d, P);
      return finish(d, seasonNotes(d, P));
    }

    function oAnt(P, dd) { if (dd[1] === 12 && O_ANT[dd[2]]) P.cantico = 'Propio del tiempo: la antífona ' + O_ANT[dd[2]] + ' (' + dd[2] + ' de diciembre)'; }
    function firstVespers(e, d) {
      var sk = kindOf(e), w = psalterWeek(e);
      var P = { hour: 'visperas', marks: [], notes: [], first: true, psalterWeek: w };
      P.office = 'I Vísperas ' + (/^(La|El|Los|Las) /.test(e.principal.name) || e.principal.kind !== 'temporal' ? deDel(e.principal.name) : 'del ' + e.principal.name);
      switch (sk.type) {
        case 'otsun':
          setAll(P, 'Salterio');
          P.cantico = 'Propio del tiempo, la del ciclo ' + e.sunCycle; P.oracion = 'Propio del tiempo';
          P.psalms = PS[w].V1;
          marksAdd(P.marks, 'Salterio', 'domingo, semana ' + R[w] + ', I Vísperas');
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(e) + ', ciclo ' + e.sunCycle);
          break;
        case 'strongsun':
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las propias del domingo (Propio del tiempo)';
          P.psalms = PS[w].V1; P.psalmsFrom = 'del salterio, domingo de la semana ' + R[w] + ', I Vísperas';
          if (d) oAnt(P, d.date);
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(e) + ', I Vísperas');
          marksAdd(P.marks, 'Salterio', 'domingo, semana ' + R[w] + ', I Vísperas');
          break;
        case 'ssol': case 'sfeast': {
          var com = saintPlan(P, sk, e, 'I Vísperas', w, 'feast');
          P.antifonas = com ? 'propias o del común' : 'las propias';
          P.psalmsFrom = com ? 'propios o, si no los tiene, del común (I Vísperas)' : 'propios';
          P.marks.forEach(function (m) { if (/^Propio/.test(m.book)) m.place += ', I Vísperas'; });
          break;
        }
        default:
          setAll(P, 'Propio del tiempo');
          P.antifonas = 'las propias (Propio del tiempo)'; P.psalmsFrom = 'propios (Propio del tiempo)';
          marksAdd(P.marks, 'Propio del tiempo', ptLabel(e) + ', I Vísperas');
      }
      P.notes.push('Esta tarde ya empieza la celebración de mañana: se rezan sus primeras Vísperas.');
      return finish(e, seasonNotes(e, P));
    }

    function triduo(d, hour) {
      var k = d.temporal.key, P = { hour: hour, marks: [], notes: [], psalterWeek: 2, lent: true };
      var lbl = { JUEVES: 'Jueves Santo', VIERNES: 'Viernes Santo', VIGILIA: 'Sábado Santo' }[k];
      P.office = (hour === 'laudes' ? 'Laudes del ' : 'Vísperas del ') + lbl;
      setAll(P, 'Propio del tiempo');
      P.antifonas = 'las propias (Propio del tiempo)'; P.psalmsFrom = 'los que indica el Propio del tiempo';
      P.responsorio = 'En su lugar se dice la antífona «Cristo se hizo por nosotros obediente…»';
      marksAdd(P.marks, 'Propio del tiempo', lbl);
      if (hour === 'visperas' && k === 'JUEVES') P.notes.push('Estas Vísperas solo las rezan quienes no participan en la Misa vespertina de la Cena del Señor.');
      if (hour === 'visperas' && k === 'VIERNES') P.notes.push('Estas Vísperas solo las rezan quienes no participan en la celebración de la Pasión del Señor.');
      return finish(d, P);
    }

    function commemoration(d, P) {
      if (!d.commemorationItems || !d.commemorationItems.length) return;
      var c = d.commemorationItems[0];
      P.commem = 'Hoy se puede hacer conmemoración de ' + c.name + ': después de la oración, omitiendo su conclusión, se añaden la antífona (propia o del común) y la oración del santo (' + PSANT(c) + ').';
    }

    // ---------- Completas ----------
    function completas(n, choice, now) {
      var d = dayOf(n), e = dayOf(n + 1), k = d.temporal.key;
      var which, notes = [], fvw = firstVespersWin(d, e, choice);
      var tc = fvw ? tomoOf(e) : tomoOf(d);
      if (tc !== tomoOf(d)) notes.push('Estas Completas, como las Vísperas de esta tarde, ya se rezan con el ' + TOMOS[tc].name + '.');
      if (fvw) which = 'domI';
      else if (k === 'JUEVES' || k === 'VIERNES' || k === 'VIGILIA') which = 'domII';
      else if (inOctave(d)) { which = 'domII'; notes.push('Durante la octava se rezan las Completas del domingo, después de las I o de las II Vísperas, a elección.'); }
      else if (d.dow === 0 || (d.principal.kind === 'sanctoral' && d.principal.rank <= 4 && d.principal.id !== 'commemoration_of_all_the_faithful_departed') ||
        (d.principal.kind === 'temporal' && TSOL[k])) which = 'domII';
      else which = d.dow;
      var c = COMP[which];
      var easter = d.season === 'pascua';
      var lent = d.season === 'cuaresma' || d.season === 'semanasanta' || d.season === 'triduo';
      if (k === 'VIGILIA') notes.push('Quienes participan en la Vigilia pascual no rezan estas Completas.');
      if (now != null && now < 4) notes.push('Pasada la medianoche, si todavía no te has acostado, reza las Completas del día anterior.');
      var steps = [
        { part: 'Invocación', text: '«Dios mío, ven en mi auxilio. — Señor, date prisa en socorrerme.» Gloria al Padre' + (lent ? '. En Cuaresma no se dice aleluya.' : ' y aleluya.') },
        { part: 'Examen de conciencia', text: 'Un momento de silencio para repasar el día. Puede seguir un acto penitencial, como el «Yo confieso».' },
        { part: 'Himno', text: 'Uno de los himnos de Completas que trae tu libro' + (easter ? ' (en tiempo pascual, el propio de este tiempo).' : '.') },
        { part: 'Salmodia', refs: c.ps, text: 'Cada salmo con su antífona y el Gloria al Padre al final.' },
        { part: 'Lectura breve', text: 'La de estas mismas Completas.' },
        { part: 'Responsorio breve', text: k === 'JUEVES' || k === 'VIERNES' || k === 'VIGILIA' ? 'En su lugar se dice la antífona «Cristo se hizo por nosotros obediente…» (Propio del tiempo).' :
          (/^PAS1-/.test(k) ? 'En su lugar se dice la antífona «Este es el día en que actuó el Señor…».' : '«En tus manos, Señor, encomiendo mi espíritu…»' + (easter ? ', con aleluya.' : '.')) },
        { part: 'Cántico evangélico', text: 'Cántico de Simeón, «Ahora, Señor, según tu promesa, puedes dejar a tu siervo irse en paz» (Lc 2, 29-32). Antífona: «Sálvanos, Señor, despiertos, protégenos mientras dormimos…»' + (easter ? ', con aleluya.' : '.') },
        { part: 'Oración', text: 'La de estas mismas Completas.' },
        { part: 'Bendición', text: '«El Señor todopoderoso nos conceda una noche tranquila y una santa muerte. — Amén.»' },
        { part: 'Antífona de la Virgen', text: easter ? '«Reina del cielo, alégrate, aleluya».' : 'La Salve u otra de las antífonas marianas del libro.' }
      ];
      return {
        hour: 'completas', office: 'Completas ' + c.title, notes: notes, steps: steps, tomo: tomoInfo(tc),
        marks: [{ book: 'Completas', place: c.title.replace(/^del /, '') }]
      };
    }

    // ---------- Montaje de los pasos ----------
    function antTxt(a) { return a === 'Salterio' ? 'las del salterio' : a === 'Propio del tiempo' ? 'las propias (Propio del tiempo)' : a; }
    function dot(t) { return /[.»…]$/.test(t) ? t : t + '.'; }
    function finish(d, P) {
      fixBook(d, P);
      var lent = P.lent || d.season === 'cuaresma' || d.season === 'semanasanta';
      var steps = [];
      steps.push({ part: 'Invocación', text: '«Dios mío, ven en mi auxilio. — Señor, date prisa en socorrerme.» Gloria al Padre' + (lent ? '. En Cuaresma no se dice aleluya.' : ' y aleluya.') });
      steps.push({ part: 'Himno', src: P.himno });
      var salm = { part: 'Salmodia', refs: P.psalms || null };
      salm.text = (P.psalmsFrom ? 'Salmos ' + P.psalmsFrom + '. ' : '') + 'Antífonas: ' + antTxt(P.antifonas) + '. Cada salmo empieza y termina con su antífona, y acaba con el Gloria al Padre.' + (P.easter ? ' En tiempo pascual las antífonas llevan aleluya.' : '');
      steps.push(salm);
      steps.push({ part: 'Lectura breve', src: P.lectura });
      if (/^En su lugar/.test(P.responsorio)) steps.push({ part: 'Responsorio breve', text: dot(P.responsorio) });
      else steps.push({ part: 'Responsorio breve', src: P.responsorio });
      steps.push({ part: 'Cántico evangélico', text: (P.hour === 'laudes'
        ? 'Benedictus, «Bendito sea el Señor, Dios de Israel» (Lc 1, 68-79), en el Ordinario.'
        : 'Magníficat, «Proclama mi alma la grandeza del Señor» (Lc 1, 46-55), en el Ordinario.') + ' Antífona: ' + dot(lcFirst(P.cantico)) });
      steps.push({ part: 'Preces', src: P.preces, text: P.hour === 'visperas' ? 'La última intención es siempre por los difuntos.' : null });
      steps.push({ part: 'Padrenuestro', text: 'Con la invitación que lo introduce.' });
      steps.push({ part: 'Oración', src: P.oracion });
      if (P.commem) steps.push({ part: 'Conmemoración', text: P.commem, optional: true });
      steps.push({ part: 'Conclusión', text: 'Si no preside un sacerdote o diácono: «El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna. — Amén.»' });
      var pre = null;
      if (P.hour === 'laudes') pre = 'Si es tu primera oración del día, empieza con el Invitatorio (en el Ordinario): «Señor, ábreme los labios. — Y mi boca proclamará tu alabanza», y el salmo 94 con su antífona (' + lcFirst(P.invit || P.himno) + '). Después pasa directamente al himno.';
      return { hour: P.hour, office: P.office, psalterWeek: P.psalterWeek, tomo: tomoInfo(tomoOf(d)), marks: P.marks, notes: P.notes, rule: P.rule || null, steps: steps, pre: pre, first: !!P.first };
    }
    function lcFirst(t) { return /^(Propio|Salterio|Común|Oficio)/.test(t) ? t : t; }

    function options(d) {
      var o = [];
      var p = d.principal;
      if (p.kind === 'temporal' && d.optionalItems && d.optionalItems.length) {
        o.push({ id: 'feria', label: 'Feria' });
        d.optionalItems.forEach(function (x) { o.push({ id: x.id, label: x.name }); });
      }
      if (p.kind === 'temporal' && d.season === 'ordinario' && d.dow === 6) {
        if (!o.length) o.push({ id: 'feria', label: 'Feria' });
        o.push({ id: 'smsab', label: 'Santa María en sábado' });
      }
      return o;
    }

    return {
      forDay: function (n, choice, nowHour) {
        var d = dayOf(n);
        return { psalterWeek: psalterWeek(d), tomo: tomoInfo(tomoOf(d)), options: options(d), laudes: laudes(d, choice), visperas: visperas(n, choice), completas: completas(n, choice, nowHour) };
      },
      psalterWeek: function (n) { return psalterWeek(dayOf(n)); },
      tomo: function (n) { return tomoInfo(tomoOf(dayOf(n))); }
    };
  }

  var api = { create: create, PS: PS, TOMOS: TOMOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Horas = api;
})(this);
