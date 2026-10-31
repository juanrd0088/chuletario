const fs=require('fs');
const Lit=require('./liturgia.js');
const sant=JSON.parse(fs.readFileSync('santoral_es.json','utf8'));
const ES=Lit.create(sant, Lit.CFG_ES);
const T=JSON.parse(fs.readFileSync('temp.json','utf8'));
const need={}; const sanctNeed={};
for(let y=2026;y<=2060;y++) for(let n=Lit.dn(y,1,1); n<=Lit.dn(y,12,31); n++){
  const [Y,M,D]=Lit.ymd(n); const d=ES.day(Y,M,D); const p=d.principal;
  if(p.kind==='temporal' || p.kind==='memoria'){ // lecturas del temporal
    const k=d.temporal.key; const e=T[k];
    const cyc=/^TO\d+-[1-6]$/.test(k)?d.wkCycle:d.sunCycle;
    let ok=false;
    if(e){ const m=e.main||e.dia||e.cena; if(Array.isArray(m)) ok=true; else if(m && (m[cyc] || (m.I&&m.II&&m[cyc]))) ok=true; }
    if(!ok){ const id=k+' '+cyc; (need[id]=need[id]||[]).push(`${Y}-${M}-${D}`); }
  } else { (sanctNeed[p.id]=sanctNeed[p.id]||[]).push(`${Y}-${M}-${D}`); }
}
console.log('temporal sin lecturas:', Object.keys(need).length);
for(const [k,v] of Object.entries(need)) console.log(' ',k, v.length, v.slice(0,3).join(' '));
console.log('santoral (fiestas/solemnidades) que aparecen:', Object.keys(sanctNeed).length);
console.log(Object.keys(sanctNeed).join(', '));
