const Lit=require('./liturgia.js'); const L=require('./lecturas-core.js');
const D=JSON.parse(require('fs').readFileSync('data.json','utf8'));
const sant=D.SANTORAL.map(a=>({id:a[0],m:a[1],d:a[2],rank:a[3],color:a[4],name:a[5]}));
const ES=Lit.create(sant,Lit.CFG_ES);
function show(y,m,d){ const day=ES.day(y,m,d); const r=L.readingsFor(day,D.LECT_T,D.LECT_S);
  const p=day.principal;
  let s=`${Lit.DIAS[day.dow].slice(0,3)} ${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')} [${day.sunCycle}/${day.wkCycle}] ${p.name}${p.sub?' ('+p.sub+')':''} · ${day.rankName} · ${p.color}`;
  if(p.kind!=='temporal') s+=`  <${day.temporal.name}>`;
  if(day.optional.length) s+=`  libres: ${day.optional.join('; ')}`;
  if(day.commemorations.length) s+=`  conmem: ${day.commemorations.join('; ')}`;
  console.log(s);
  for(const ms of r.masses){ console.log('     '+(ms.label?'['+ms.label+'] ':'')+ms.items.map(i=>i.cite).join(' | ')); }
  if(r.note) console.log('     nota: '+r.note);
}
const args=process.argv.slice(2);
const [a,b]=args; const n0=Lit.dn(...a.split('-').map(Number)), n1=Lit.dn(...b.split('-').map(Number));
for(let n=n0;n<=n1;n++){ const [y,m,d]=Lit.ymd(n); show(y,m,d); }
