// Consolida observaciones -> tabla de lecturas del temporal y del santoral
const fs = require('fs');
const { parseCite } = require('./books.js');
const obsT = JSON.parse(fs.readFileSync('obs_temporal.json', 'utf8'));
const obsS = JSON.parse(fs.readFileSync('obs_sanct.json', 'utf8'));

const TYPE = { primera: 'p', salmo: 's', segunda: 'g', evangelio: 'e', procesion: 'r', lectura: 'l', epistola: 'g' };
const GOSPELS = new Set(['MAT', 'MRK', 'LUK', 'JHN']);
const errors = [];
// "7b" -> [PSA, '96:7'] ; "cf. 1a" -> [PSA, '96:1'] ; "Mk 16:15" -> [MRK, '16:15']
function respRef(resp, book, ref) {
  let x = resp.replace(/^(cf\.?|see)\s*/i, '').trim();
  if (/^[1-3]?\s*[A-Za-z]/.test(x) && !/^\d/.test(x)) {
    const c = parseCite(x, null);
    if (c.error) return null;
    const m = /^(\d+):(\d+)/.exec(c.r); return m ? [c.b, m[1] + ':' + m[2]] : null;
  }
  const m = /^(\d+)/.exec(x); if (!m) return null;
  const ch = (/^(\d+):/.exec(ref) || [])[1]; if (!ch) return null;
  return [book, ch + ':' + m[1]];
}
function convert(readings) {
  const out = [];
  for (const r of readings) {
    let t = TYPE[r.type];
    if (r.type === 'aleluya') continue;
    if (!t && /^otro/.test(r.type)) {
      // encabezado vacío: es una alternativa de la lectura anterior del mismo tipo
      const c0 = parseCite(r.cite, null);
      if (c0.error) { errors.push('otro ' + r.cite); continue; }
      const prev = [...out].reverse().find(x => (GOSPELS.has(c0.b) ? x[0] === 'e' : x[0] === 'g' || x[0] === 'p'));
      if (prev) { (prev[3] = prev[3] || []).push([c0.b, c0.r]); continue; }
      t = GOSPELS.has(c0.b) ? 'e' : 'g';
    }
    if (!t) { errors.push('tipo ' + r.type + ' ' + r.cite); continue; }
    const c = parseCite(r.cite, t === 's' ? 'PSA' : null);
    if (c.error) { errors.push(c.error + ' | ' + r.cite); continue; }
    const item = [t, c.b, c.r];
    const alts = c.alt.map(a => [c.b, a]);
    for (const a of r.alts) { const ca = parseCite(a, c.b); if (!ca.error) alts.push([ca.b, ca.r]); }
    if (alts.length) item.push(alts);
    if (t === 's' && r.resp) {
      const rr = respRef(r.resp, c.b, c.r);
      if (rr) { if (item.length < 4) item.push(null); item.push(rr); }
    }
    out.push(item);
  }
  return out;
}
const sig = arr => JSON.stringify(arr.map(x => [x[0], x[1], x[2]]));
const isMemorialTitle = t => /^(Memorial|Day of Prayer|Optional Memorial)/i.test(t) || /Memorial of/i.test(t);

function best(list) { // mayoría; empate -> más lecturas; luego la más antigua
  const groups = {};
  for (const o of list) { const s = sig(o.r); (groups[s] = groups[s] || []).push(o); }
  const g = Object.values(groups).sort((a, b) => b.length - a.length || b[0].r.length - a[0].r.length || a[0].date.localeCompare(b[0].date));
  return g[0][0];
}

const CYCLE_KEY = /^(TO\d+-0|ADV\d-0|CUA\d-0|PAS[1-7]-0|RAMOS|SAGFAM|BAUT|ASC|PENT|TRIN|CORPUS|SCORAZON|CRISTOREY|VIGILIA|NAV2DOM|EPIF)$/;
const OT_WEEKDAY = /^TO\d+-[1-6]$/;

const TEMP = {}; const missing = []; const memorialProps = [];
for (const [key, all] of Object.entries(obsT)) {
  const masses = {};
  for (const o of all) {
    let mass = o.mass;
    if (key === 'JUEVES') mass = /Chrism/i.test(o.title) ? 'crismal' : 'cena';
    if (mass === 'main' && (key === 'NAV')) continue;
    (masses[mass] = masses[mass] || []).push({ sun: o.sun, wk: o.wk, r: convert(o.readings), date: o.date, title: o.title });
  }
  const entry = {};
  for (const [mass, list0] of Object.entries(masses)) {
    let list = list0;
    if (CYCLE_KEY.test(key)) {
      const v = {};
      for (const cyc of ['A', 'B', 'C']) {
        const l = list.filter(o => o.sun === cyc);
        if (l.length) v[cyc] = best(l).r; else missing.push(key + ' ciclo ' + cyc + (mass !== 'main' ? ' (' + mass + ')' : ''));
      }
      entry[mass] = v;
    } else if (OT_WEEKDAY.test(key)) {
      const v = {};
      const plain = list.filter(o => !isMemorialTitle(o.title));
      for (const wk of ['I', 'II']) {
        let l = plain.filter(o => o.wk === wk);
        if (!l.length) l = list.filter(o => o.wk === wk);
        if (!l.length) { missing.push(key + ' año ' + wk); continue; }
        // primera lectura y salmo: mayoría
        const ps = l.map(o => ({ ...o, r: o.r.filter(x => x[0] !== 'e') }));
        v[wk] = best(ps).r;
      }
      // evangelio: común a todos los años; en el año A a veces cambia
      const base = plain.length ? plain : list;
      const gos = o => ({ ...o, r: o.r.filter(x => x[0] === 'e') });
      const e = best(list.map(gos)).r;
      v.e = e;
      const plainA = plain.filter(o => o.sun === 'A').sort((a, b) => b.date.localeCompare(a.date));
      if (plainA.length) { const la = gos(plainA[0]); if (sig(la.r) !== sig(e)) v.eA = la.r; }
      entry[mass] = v;
      // memorias con lecturas propias
      for (const o of list.filter(o => isMemorialTitle(o.title))) {
        const ferial = (v[o.wk] || []).concat(v.e);
        const diff = o.r.filter(x => !ferial.some(f => f[0] === x[0] && f[1] === x[1] && f[2] === x[2]));
        if (diff.length) memorialProps.push({ date: o.date, title: o.title, diff });
      }
    } else {
      const plain = list.filter(o => !isMemorialTitle(o.title));
      const b = best(plain.length ? plain : list);
      entry[mass] = b.r;
      for (const o of list.filter(o => isMemorialTitle(o.title))) {
        const diff = o.r.filter(x => !b.r.some(f => f[0] === x[0] && f[1] === x[1] && f[2] === x[2]));
        if (diff.length) memorialProps.push({ date: o.date, title: o.title, diff });
      }
    }
  }
  TEMP[key] = entry;
}

// Santoral: fiestas y solemnidades (y memorias con números propios)
const SANCT = {};
for (const [mmdd, list0] of Object.entries(obsS)) {
  const byTitle = {};
  for (const o of list0) {
    const t = o.title.replace(/\s+(Vigil|Mass during the Day).*$/i, '').trim();
    (byTitle[t] = byTitle[t] || []).push({ r: convert(o.readings), date: o.date, title: o.title, mass: o.mass, lect: o.lect });
  }
  SANCT[mmdd] = Object.entries(byTitle).map(([t, l]) => {
    const masses = {};
    for (const o of l) (masses[o.mass === 'vigilia' ? 'vigilia' : 'main'] = masses[o.mass === 'vigilia' ? 'vigilia' : 'main'] || []).push(o);
    const out = { title: t, dates: l.map(o => o.date) };
    for (const [m, ll] of Object.entries(masses)) out[m] = best(ll).r;
    return out;
  });
}

fs.writeFileSync('temp.json', JSON.stringify(TEMP));
fs.writeFileSync('sanct_obs_conv.json', JSON.stringify(SANCT, null, 1));
fs.writeFileSync('memorial_props.json', JSON.stringify(memorialProps, null, 1));
console.log('errores', [...new Set(errors)].join('\n'));
console.log('faltan', missing.length); console.log(missing.join('\n'));
console.log('memorias propias', memorialProps.length);
