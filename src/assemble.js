// Ensambla los datos finales: santoral de España + lecturas del temporal y del santoral
const fs = require('fs');
const T = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
const S = JSON.parse(fs.readFileSync('sanct_obs_conv.json', 'utf8'));
let santoral = JSON.parse(fs.readFileSync('santoral_es.json', 'utf8'));

// ---------- Nombres al estilo del calendario litúrgico español ----------
const RENAME = {
  joseph_spouse_of_mary: 'San José, esposo de la Bienaventurada Virgen María',
  annunciation_of_the_lord: 'La Anunciación del Señor',
  presentation_of_the_lord: 'La Presentación del Señor',
  nativity_of_john_the_baptist: 'La Natividad de San Juan Bautista',
  transfiguration_of_the_lord: 'La Transfiguración del Señor',
  exaltation_of_the_holy_cross: 'La Exaltación de la Santa Cruz',
  dedication_of_the_lateran_basilica: 'La Dedicación de la Basílica de Letrán',
  immaculate_conception_of_the_blessed_virgin_mary: 'La Inmaculada Concepción de la Bienaventurada Virgen María',
  nativity_of_the_blessed_virgin_mary: 'La Natividad de la Bienaventurada Virgen María',
  visitation_of_mary: 'La Visitación de la Bienaventurada Virgen María',
  assumption_of_the_blessed_virgin_mary: 'La Asunción de la Bienaventurada Virgen María',
  all_saints: 'Todos los Santos',
  stephen_the_first_martyr: 'San Esteban, protomártir',
  our_lady_of_the_pillar: 'Nuestra Señora del Pilar',
  conversion_of_saint_paul_the_apostle: 'La Conversión de San Pablo, apóstol',
  chair_of_saint_peter_the_apostle: 'La Cátedra de San Pedro, apóstol',
  catherine_of_siena_virgin: 'Santa Catalina de Siena, virgen y doctora de la Iglesia, patrona de Europa',
  james_apostle: 'Santiago, apóstol, patrono de España',
  holy_innocents_martyrs: 'Los Santos Inocentes, mártires',
  eulogius_of_cordoba_bishop: 'San Eulogio de Córdoba, presbítero y mártir',
  thomas_aquinas_priest: 'Santo Tomás de Aquino, presbítero y doctor de la Iglesia',
  cyril_of_jerusalem_bishop: 'San Cirilo de Jerusalén, obispo y doctor de la Iglesia',
  cyril_of_alexandria_bishop: 'San Cirilo de Alejandría, obispo y doctor de la Iglesia',
  catherine_of_alexandria_virgin: 'Santa Catalina de Alejandría, virgen y mártir',
  anthony_of_egypt_abbot: 'San Antonio, abad',
  blaise_of_sebaste_bishop: 'San Blas, obispo y mártir',
  john_paul_ii_pope: 'San Juan Pablo II, papa',
  john_xxiii_pope: 'San Juan XXIII, papa',
  christopher_magallanes_priest_and_companions_martyrs: 'Santos Cristóbal Magallanes, presbítero, y compañeros, mártires',
  robert_bellarmine_bishop: 'San Roberto Belarmino, obispo y doctor de la Iglesia',
  pontian_i_pope_and_hippolytus_of_rome_priest: 'Santos Ponciano, papa, e Hipólito, presbítero, mártires',
  lawrence_ruiz_and_companions_martyrs: 'Santos Lorenzo Ruiz y compañeros, mártires',
  gregory_of_narek_abbot: 'San Gregorio de Narek, abad y doctor de la Iglesia',
  romuald_of_ravenna_abbot: 'San Romualdo, abad',
  columban_of_luxeuil_abbot: 'San Columbano, abad',
  ephrem_the_syrian_deacon: 'San Efrén, diácono y doctor de la Iglesia',
  teresa_benedicta_of_the_cross_stein_virgin: 'Santa Teresa Benedicta de la Cruz, virgen y mártir, patrona de Europa',
  our_lady_of_sorrows: 'Bienaventurada Virgen María de los Dolores',
  queenship_of_the_blessed_virgin_mary: 'Santa María Virgen, Reina',
  our_lady_of_mount_carmel: 'Nuestra Señora la Virgen del Carmen',
  presentation_of_the_blessed_virgin_mary: 'La Presentación de la Bienaventurada Virgen María',
  passion_of_saint_john_the_baptist: 'El Martirio de San Juan Bautista',
  sharbel_makhluf_priest: 'San Chárbel Makhluf, presbítero',
  ildephonsus_of_toledo_bishop: 'San Ildefonso, obispo',
  john_of_kanty_priest: 'San Juan de Kety, presbítero',
  rita_of_cascia_religious: 'Santa Rita de Casia, religiosa',
  louis_ix_of_france: 'San Luis de Francia',
  joachim_and_anne_parents_of_mary: 'San Joaquín y Santa Ana, padres de la Virgen María',
  seven_holy_founders_of_the_servite_order: 'Los siete santos Fundadores de los Siervos de la Virgen María',
  michael_gabriel_and_raphael_archangels: 'Santos Miguel, Gabriel y Rafael, arcángeles',
  isidore_of_seville_bishop: 'San Isidoro de Sevilla, obispo y doctor de la Iglesia',
  our_lady_of_the_rosary: 'Nuestra Señora la Virgen del Rosario',
  commemoration_of_all_the_faithful_departed: 'Conmemoración de todos los fieles difuntos'
};
santoral = santoral.filter(s => s.id !== 'all_souls');
santoral.forEach(s => { if (RENAME[s.id]) s.name = RENAME[s.id]; });
// romcal agrupa a veces el id; buscar por prefijo los que no coinciden exactamente
for (const [k, v] of Object.entries(RENAME)) if (!santoral.some(s => s.id === k)) { const s = santoral.find(s => s.id.startsWith(k.slice(0, 25))); if (s) s.name = v; else console.log('RENAME sin destino', k); }

// ---------- Rellenos del temporal (citas del Ordo de lecturas; salmos con numeración hebrea) ----------
const fills = {
  NAV2DOM: (() => { const r = [['p', 'SIR', '24:1-2,8-12'], ['s', 'PSA', '147:12-13,14-15,19-20'], ['g', 'EPH', '1:3-6,15-18'], ['e', 'JHN', '1:1-18', [['JHN', '1:1-5,9-14']]]]; return { main: { A: r, B: r, C: r } }; })(),
  'ADV3-4': { main: [['p', 'ISA', '54:1-10'], ['s', 'PSA', '30:2,4,5-6,11-12,13'], ['e', 'LUK', '7:24-30']] },
  'ADV3-5': { main: [['p', 'ISA', '56:1-3a,6-8'], ['s', 'PSA', '67:2-3,5,7-8'], ['e', 'JHN', '5:33-36']] }
};
const sunFills = {
  'TO4-0': { C: [['p', 'JER', '1:4-5,17-19'], ['s', 'PSA', '71:1-2,3-4a,5-6ab,15ab,17'], ['g', '1CO', '12:31-13:13', [['1CO', '13:4-13']]], ['e', 'LUK', '4:21-30']] },
  'TO7-0': { B: [['p', 'ISA', '43:18-19,21-22,24b-25'], ['s', 'PSA', '41:2-3,4-5,13-14'], ['g', '2CO', '1:18-22'], ['e', 'MRK', '2:1-12']] },
  'TO8-0': {
    A: [['p', 'ISA', '49:14-15'], ['s', 'PSA', '62:2-3,6-7,8-9'], ['g', '1CO', '4:1-5'], ['e', 'MAT', '6:24-34']],
    B: [['p', 'HOS', '2:16b,17b,21-22'], ['s', 'PSA', '103:1-2,3-4,8,10,12-13'], ['g', '2CO', '3:1b-6'], ['e', 'MRK', '2:18-22']]
  },
  'TO9-0': {
    A: [['p', 'DEU', '11:18,26-28,32'], ['s', 'PSA', '31:2-3,3-4,17,25'], ['g', 'ROM', '3:21-25,28'], ['e', 'MAT', '7:21-27']],
    B: [['p', 'DEU', '5:12-15'], ['s', 'PSA', '81:3-4,5-6,6-8,10-11'], ['g', '2CO', '4:6-11'], ['e', 'MRK', '2:23-3:6', [['MRK', '2:23-28']]]],
    C: [['p', '1KI', '8:41-43'], ['s', 'PSA', '117:1,2'], ['g', 'GAL', '1:1-2,6-10'], ['e', 'LUK', '7:1-10']]
  },
  'TO10-0': {
    A: [['p', 'HOS', '6:3-6'], ['s', 'PSA', '50:1,8,12-13,14-15'], ['g', 'ROM', '4:18-25'], ['e', 'MAT', '9:9-13']],
    C: [['p', '1KI', '17:17-24'], ['s', 'PSA', '30:2,4,5-6,11,12,13'], ['g', 'GAL', '1:11-19'], ['e', 'LUK', '7:11-17']]
  },
  'TO11-0': { C: [['p', '2SA', '12:7-10,13'], ['s', 'PSA', '32:1-2,5,7,11'], ['g', 'GAL', '2:16,19-21'], ['e', 'LUK', '7:36-8:3', [['LUK', '7:36-50']]]] },
  'TO12-0': { C: [['p', 'ZEC', '12:10-11;13:1'], ['s', 'PSA', '63:2,3-4,5-6,8-9'], ['g', 'GAL', '3:26-29'], ['e', 'LUK', '9:18-24']] },
  'TO13-0': { C: [['p', '1KI', '19:16b,19-21'], ['s', 'PSA', '16:1-2,5,7-8,9-10,11'], ['g', 'GAL', '5:1,13-18'], ['e', 'LUK', '9:51-62']] },
  'TO24-0': { C: [['p', 'EXO', '32:7-11,13-14'], ['s', 'PSA', '51:3-4,12-13,17,19'], ['g', '1TI', '1:12-17'], ['e', 'LUK', '15:1-32', [['LUK', '15:1-10']]]] },
  'TO31-0': { C: [['p', 'WIS', '11:22-12:2'], ['s', 'PSA', '145:1-2,8-9,10-11,13cd-14'], ['g', '2TH', '1:11-2:2'], ['e', 'LUK', '19:1-10']] },
  'TO32-0': { C: [['p', '2MA', '7:1-2,9-14'], ['s', 'PSA', '17:1,5-6,8,15'], ['g', '2TH', '2:16-3:5'], ['e', 'LUK', '20:27-38', [['LUK', '20:27,34-38']]]] },
  'CUA3-0': { C: [['p', 'EXO', '3:1-8a,13-15'], ['s', 'PSA', '103:1-2,3-4,6-7,8,11'], ['g', '1CO', '10:1-6,10-12'], ['e', 'LUK', '13:1-9']] },
  'CUA4-0': { C: [['p', 'JOS', '5:9a,10-12'], ['s', 'PSA', '34:2-3,4-5,6-7'], ['g', '2CO', '5:17-21'], ['e', 'LUK', '15:1-3,11-32']] },
  'CUA5-0': { C: [['p', 'ISA', '43:16-21'], ['s', 'PSA', '126:1-2ab,2cd-3,4-5,6'], ['g', 'PHP', '3:8-14'], ['e', 'JHN', '8:1-11']] },
  ASC: { C: [['p', 'ACT', '1:1-11'], ['s', 'PSA', '47:2-3,6-7,8-9'], ['g', 'EPH', '1:17-23', [['HEB', '9:24-28;10:19-23']]], ['e', 'LUK', '24:46-53']] }
};
for (const [k, v] of Object.entries(sunFills)) { T[k] = T[k] || { main: {} }; Object.assign(T[k].main, v); }
Object.assign(T, fills);
// Pentecostés, ciclo C
T.PENT.dia.C = [['p', 'ACT', '2:1-11'], ['s', 'PSA', '104:1,24,29-30,31,34'], ['g', '1CO', '12:3b-7,12-13', [['ROM', '8:8-17']]], ['e', 'JHN', '20:19-23', [['JHN', '14:15-16,23b-26']]]];
T.PENT.vigilia.C = T.PENT.vigilia.A;
// Ferias del Tiempo Ordinario que faltaban
const wkFills = {
  'TO6-3': { II: [['p', 'JAS', '1:19-27'], ['s', 'PSA', '15:2-3ab,3cd-4ab']] },
  'TO6-4': { II: [['p', 'JAS', '2:1-9'], ['s', 'PSA', '34:2-3,4-5,6-7']] },
  'TO6-5': { II: [['p', 'JAS', '2:14-24,26'], ['s', 'PSA', '112:1-2,3-4,5-6']] },
  'TO6-6': { II: [['p', 'JAS', '3:1-10'], ['s', 'PSA', '12:2-3,4-5,7-8']] },
  'TO7-1': { II: [['p', 'JAS', '3:13-18'], ['s', 'PSA', '19:8,9,10,15']] },
  'TO16-2': { I: [['p', 'EXO', '14:21-15:1'], ['s', 'EXO', '15:8-9,10,12,17']] },
  'TO34-4': { I: [['p', 'DAN', '6:12-28'], ['s', 'DAN', '3:68-74']] }
};
for (const [k, v] of Object.entries(wkFills)) Object.assign(T[k].main, v);
// Errata de la fuente en el II domingo de Adviento B
T['ADV2-0'].main.B[1] = ['s', 'PSA', '85:9ab-10,11-12,13-14', null, ['PSA', '85:8']];
// Ester: numeración del leccionario español
T['CUA1-4'].main[0] = ['p', 'EST', '4:17k,l-z'];

// Quitar lo que España no usa (Ascensión en jueves, VII domingo de Pascua, etc.)
delete T['PAS7-0'];

// ---------- Santoral ----------
const LS = {};
const pick = (mmdd, re) => { const e = (S[mmdd] || []).find(x => !re || re.test(x.title)); return e; };
const BY_DATE = {
  '01-25': 'conversion_of_saint_paul_the_apostle', '02-02': 'presentation_of_the_lord', '02-22': 'chair_of_saint_peter_the_apostle',
  '03-19': 'joseph_spouse_of_mary', '03-25': 'annunciation_of_the_lord', '04-25': 'mark_evangelist', '05-03': 'philip_and_james_apostles',
  '05-14': 'matthias_apostle', '05-31': 'visitation_of_mary', '06-24': 'nativity_of_john_the_baptist', '06-29': 'peter_and_paul_apostles',
  '07-03': 'thomas_apostle', '07-22': 'mary_magdalene', '08-06': 'transfiguration_of_the_lord', '08-10': 'lawrence_of_rome_deacon', '08-15': 'assumption_of_the_blessed_virgin_mary',
  '08-24': 'bartholomew_apostle', '09-08': 'nativity_of_the_blessed_virgin_mary', '09-14': 'exaltation_of_the_holy_cross',
  '09-21': 'matthew_apostle', '09-29': 'michael_gabriel_and_raphael_archangels', '10-18': 'luke_evangelist', '10-28': 'simon_and_jude_apostles',
  '11-01': 'all_saints', '11-02': 'commemoration_of_all_the_faithful_departed', '11-09': 'dedication_of_the_lateran_basilica',
  '11-30': 'andrew_apostle', '12-08': 'immaculate_conception_of_the_blessed_virgin_mary', '12-26': 'stephen_the_first_martyr',
  '12-27': 'john_apostle', '12-28': 'holy_innocents_martyrs'
};
for (const [mmdd, id] of Object.entries(BY_DATE)) {
  const list = (S[mmdd] || []).filter(x => (x.main && x.main.length) || (x.vigilia && x.vigilia.length));
  if (!list.length) { console.log('SIN DATOS', mmdd, id); continue; }
  // la observación con más fechas
  list.sort((a, b) => b.dates.length - a.dates.length);
  const e = list[0];
  const out = {};
  if (e.main && e.main.length) out.main = e.main;
  if (e.vigilia && e.vigilia.length) out.vigilia = e.vigilia;
  LS[id] = out;
}
// Asunción: misa del día
LS.assumption_of_the_blessed_virgin_mary.main = [['p', 'REV', '11:19a;12:1-6a,10ab'], ['s', 'PSA', '45:10,11,12,16'], ['g', '1CO', '15:20-27'], ['e', 'LUK', '1:39-56']];
// Transfiguración: evangelio según el ciclo
{
  const base = LS.transfiguration_of_the_lord.main.filter(x => x[0] !== 'e');
  LS.transfiguration_of_the_lord = { main: {
    A: base.concat([['e', 'MAT', '17:1-9']]), B: base.concat([['e', 'MRK', '9:2-10']]), C: base.concat([['e', 'LUK', '9:28b-36']])
  } };
}
// Propias de España y de Europa (comprobadas con el leccionario español)
Object.assign(LS, {
  cyril_constantine_the_philosopher_monk_and_methodius_michael_of_thessaloniki_bishop: { main: [['p', 'ACT', '13:46-49'], ['s', 'PSA', '117:1,2'], ['e', 'LUK', '10:1-9']] },
  isidore_of_seville_bishop: { main: [['p', '1CO', '2:1-10'], ['s', 'PSA', '119:99-100,101-102,103-104'], ['e', 'MAT', '5:13-16']] },
  catherine_of_siena_virgin: { main: [['p', '1JN', '1:5-2:2'], ['s', 'PSA', '103:1b-2,8-9,13-14,17-18a'], ['e', 'MAT', '11:25-30']] },
  benedict_of_nursia_abbot: { main: [['p', 'PRO', '2:1-9'], ['s', 'PSA', '34:2-3,4-5,6-7,8-9,10-11'], ['e', 'MAT', '19:27-29']] },
  bridget_of_sweden_religious: { main: [['p', 'GAL', '2:19-20'], ['s', 'PSA', '34:2-3,4-5,6-7,8-9,10-11'], ['e', 'JHN', '15:1-8']] },
  teresa_benedicta_of_the_cross_stein_virgin: { main: [['p', 'HOS', '2:16b,17b,21-22'], ['s', 'PSA', '45:11-12,14-15,16-17'], ['e', 'MAT', '25:1-13']] },
  james_apostle: { main: [['p', 'ACT', '4:33;5:12,27b-33;12:2'], ['s', 'PSA', '67:2-3,5,7-8'], ['g', '2CO', '4:7-15'], ['e', 'MAT', '20:20-28']] },
  our_lady_of_the_pillar: { main: [['p', '1CH', '15:3-4,15-16;16:1-2', [['ACT', '1:12-14']]], ['s', 'PSA', '27:1,3,4,5'], ['e', 'LUK', '11:27-28']] },
  teresa_of_jesus_of_avila_virgin: { main: [['p', 'SIR', '15:1-6'], ['s', 'PSA', '89:2-3,6-7,8-9,16-17,18-19'], ['e', 'MAT', '11:25-30']] },
  SUMOSACERDOTE: { main: {
    A: [['p', 'GEN', '22:9-18'], ['s', 'PSA', '40:7-8a,8b-9,10-11ab,17'], ['e', 'MAT', '26:36-42']],
    B: [['p', 'JER', '31:31-34'], ['s', 'PSA', '110:1,2,3,4'], ['e', 'MRK', '14:12a,22-25']],
    C: [['p', 'ISA', '6:1-4,8'], ['s', 'PSA', '23:2-3,5,6'], ['e', 'JHN', '17:1-2,9,14-26']]
  } },
  MARIAIGLESIA: { main: [['p', 'GEN', '3:9-15,20', [['ACT', '1:12-14']]], ['s', 'PSA', '87:1-2,3,5,6-7'], ['e', 'JHN', '19:25-34']] },
  // Memorias con alguna lectura propia (el resto, de la feria)
  timothy_of_ephesus_and_titus_of_crete_bishops: { replace: [['p', '2TI', '1:1-8', [['TIT', '1:1-5']]], ['s', 'PSA', '96:1-2a,2b-3,7-8a,10']] },
  barnabas_apostle: { replace: [['p', 'ACT', '11:21b-26;13:1-3'], ['s', 'PSA', '98:1,2-3ab,3cd-4,5-6']] },
  martha_of_bethany_mary_of_bethany_and_lazarus_of_bethany: { replace: [['e', 'JHN', '11:19-27', [['LUK', '10:38-42']]]] },
  passion_of_saint_john_the_baptist: { replace: [['e', 'MRK', '6:17-29']] },
  our_lady_of_sorrows: { replace: [['e', 'JHN', '19:25-27', [['LUK', '2:33-35']]]] },
  holy_guardian_angels: { replace: [['e', 'MAT', '18:1-5,10']] },
  INMCORAZON: { replace: [['e', 'LUK', '2:41-51']] }
});
// Solemnidades móviles del temporal ya están en T (TRIN, CORPUS, SCORAZON, CRISTOREY)
for (const k of ['TRIN', 'CORPUS', 'SCORAZON', 'CRISTOREY']) { LS[k] = T[k]; delete T[k]; }

// ---------- Completar respuestas de salmo que faltan ----------
// Mismo salmo con los mismos versículos: si todas las respuestas conocidas coinciden, se copia
(function fillResp() {
  const known = {};
  const visit = (x, fn) => { if (Array.isArray(x)) { if (x[0] === 's' && typeof x[1] === 'string') fn(x); else x.forEach(y => visit(y, fn)); } else if (x && typeof x === 'object') Object.values(x).forEach(y => visit(y, fn)); };
  const key = x => x[1] + ' ' + x[2];
  [T, LS].forEach(D => visit(D, x => { if (x[4]) { const k = key(x), v = x[4].join(' '); (known[k] = known[k] || new Set()).add(v); } }));
  let filled = 0, missing = 0;
  [T, LS].forEach(D => visit(D, x => {
    if (x[4]) return;
    const set = known[key(x)];
    if (set && set.size === 1) { const [b, r] = [...set][0].split(' '); while (x.length < 4) x.push(null); x[4] = [b, r]; filled++; } else missing++;
  }));
  console.log('respuestas completadas', filled, 'sin respuesta', missing);
})();

// ---------- Comprobación de cobertura ----------
const Lit = require('./liturgia.js');
const ES = Lit.create(santoral, Lit.CFG_ES);
const problems = {};
for (let y = 2026; y <= 2045; y++) for (let n = Lit.dn(y, 1, 1); n <= Lit.dn(y, 12, 31); n++) {
  const [Y, M, D] = Lit.ymd(n); const d = ES.day(Y, M, D); const p = d.principal;
  if (p.kind === 'sanctoral') { if (!LS[p.id]) (problems['S ' + p.id] = problems['S ' + p.id] || []).push(`${Y}-${M}-${D}`); continue; }
  const k = d.temporal.key; const e = T[k];
  const ok = e && Object.values(e).every(m => Array.isArray(m) || (m.I ? m[d.wkCycle] : m[d.sunCycle]));
  if (!ok) (problems['T ' + k + ' ' + d.sunCycle + d.wkCycle] = problems['T ' + k + ' ' + d.sunCycle + d.wkCycle] || []).push(`${Y}-${M}-${D}`);
}
console.log('problemas', Object.keys(problems).length);
for (const [k, v] of Object.entries(problems)) console.log(' ', k, v.slice(0, 3).join(' '));

const SANT_OUT = santoral.map(s => [s.id, s.m, s.d, s.rank, s.color, s.name]);
fs.writeFileSync('data.js', '/* Datos: santoral de España y citas del leccionario (Ordo lectionum Missae) */\nwindow.SANTORAL=' + JSON.stringify(SANT_OUT) + ';\nwindow.LECT_T=' + JSON.stringify(T) + ';\nwindow.LECT_S=' + JSON.stringify(LS) + ';\n');
fs.writeFileSync('data.json', JSON.stringify({ SANTORAL: SANT_OUT, LECT_T: T, LECT_S: LS }));
console.log('tamaño data.js', fs.statSync('data.js').size);
