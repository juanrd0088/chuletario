const Lit=require('./liturgia.js'); const H=require('./horas.js');
const D=JSON.parse(require('fs').readFileSync('data.json','utf8'));
const C=JSON.parse(require('fs').readFileSync('commons.json','utf8'));
const sant=D.SANTORAL.map(a=>({id:a[0],m:a[1],d:a[2],rank:a[3],color:a[4],name:a[5]}));
const Cal=Lit.create(sant,Lit.CFG_ES); const Ho=H.create(Cal,Lit,sant,C);
const [a,b,choice,full]=process.argv.slice(2);
const n0=Lit.dn(...a.split('-').map(Number)), n1=b?Lit.dn(...b.split('-').map(Number)):n0;
for(let n=n0;n<=n1;n++){ const [y,m,d]=Lit.ymd(n); const day=Cal.day(y,m,d); const r=Ho.forDay(n,choice||null,10);
  console.log(`\n### ${Lit.DIAS[day.dow]} ${y}-${m}-${d} · ${day.principal.name} · salterio ${r.psalterWeek} · opciones: ${r.options.map(o=>o.label).join(' | ')}`);
  for(const h of ['laudes','visperas','completas']){ const x=r[h];
    console.log(`  [${h}] ${x.office} — cintas: ${x.marks.map(m=>m.book+': '+m.place).join(' / ')}`);
    if(full){ for(const s of x.steps) console.log(`      ${s.part}: ${s.src?"<"+s.src+"> ":""}${s.refs?"["+s.refs.join("; ")+"] ":""}${s.text||""}`); if(x.rule) console.log("      REGLA: "+x.rule); if(x.pre) console.log('      PRE: '+x.pre); if(x.notes.length) console.log('      NOTAS: '+x.notes.join(' | ')); }
    else { const s=x.steps.find(s=>s.part==='Salmodia'); console.log('      salmodia: '+(s.refs?s.refs.join('; '):'')+' :: '+s.text.slice(0,120)); if(x.notes.length) console.log('      NOTAS: '+x.notes.join(' | ')); }
  }
}
