// Construye la tabla de citas a partir de las páginas del leccionario (2023-2027)
const fs = require('fs');
const Lit = require('./liturgia.js');
const US = Lit.create([], Lit.CFG_US);
const data = JSON.parse(fs.readFileSync('usccb.json', 'utf8'));
const santoral = JSON.parse(fs.readFileSync('santoral_es.json', 'utf8'));

function firstNum(l) { const m = /(\d+)/.exec(l || ''); return m ? +m[1] : null; }

// Normaliza los encabezados: tipo de lectura y alternativas ("o bien")
function normalize(readings) {
  const out = [];
  let prevType = null;
  for (const [nameRaw, cite, resp] of readings) {
    const name = nameRaw.toLowerCase().trim();
    let type = null;
    if (/^or\b|^or:/.test(name)) { if (out.length) { out[out.length - 1].alts.push(cite); } continue; }
    if (!cite) continue;
    if (/sequence/.test(name)) continue;
    if (/alleluia|verse before|gospel acclamation/.test(name)) { type = 'aleluya'; }
    else if (/procession.*gospel/.test(name)) type = 'procesion';
    else if (/gospel/.test(name)) type = 'evangelio';
    else if (/psalm|responsorial/.test(name) || /^psalm/i.test(cite)) type = 'salmo';
    else if (/epistle/.test(name)) type = 'epistola';
    else if (/reading 2|reading ii\b|^reading ii$/.test(name)) type = 'segunda';
    else if (/reading (iii|iv|v|vi|vii|3|4|5|6|7)\b/.test(name)) type = 'lectura';
    else if (/reading 1|reading i\b|^reading$|reading i$/.test(name)) type = 'primera';
    else if (/canticle/.test(name)) type = 'salmo';
    else type = 'otro:' + name;
    out.push({ type, cite, alts: [], resp: resp || null });
    prevType = type;
  }
  return out;
}

const VAR = { Vigil: 'vigilia', Night: 'noche', Dawn: 'aurora', Day: 'dia', Supper: 'cena', chrism: 'crismal' };

const temporalObs = {}; // key -> [{sun, wk, mass, lect, readings, date}]
const sanctObs = {};    // mmdd -> [{title, lect, readings, date, mass}]

for (const e of data) {
  if (!e.readings.length) continue;
  const [y, m, d] = e.date.split('-').map(Number);
  const info = US.day(y, m, d);
  const lect = firstNum(e.lect);
  const v = e.variant || '';
  if (/Extended|Thanksgiving/.test(v)) continue;
  let mass = VAR[v] || 'main';
  const readings = normalize(e.readings);
  const title = e.title || '';
  if (lect !== null && lect <= 508) {
    let key = info.principal.kind === 'temporal' ? info.temporal.key : info.principal.id;
    if (info.temporal.key === 'ASC' || /Ascension/.test(title)) {
      if (v === 'Sunday') key = 'PAS7-0';
      else if (v === 'Thursday' || (/Thursday of the Sixth Week/.test(title) && v !== 'Ascension')) key = 'PAS6-4';
      else key = 'ASC';
    }
    if (/^Year[ABC]$/.test(v)) { if (v.slice(4) !== info.sunCycle) continue; }
    if (key === 'VIGILIA' && !/Vigil/i.test(title) && !/Holy Saturday/i.test(title)) {}
    (temporalObs[key] = temporalObs[key] || []).push({ sun: info.sunCycle, wk: info.wkCycle, mass, lect, readings, date: e.date, title });
  } else {
    const mmdd = String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    (sanctObs[mmdd] = sanctObs[mmdd] || []).push({ title, lect: e.lect, readings, date: e.date, mass });
  }
}

fs.writeFileSync('obs_temporal.json', JSON.stringify(temporalObs, null, 0));
fs.writeFileSync('obs_sanct.json', JSON.stringify(sanctObs, null, 0));
console.log('temporal keys', Object.keys(temporalObs).length, 'sanct dates', Object.keys(sanctObs).length);
