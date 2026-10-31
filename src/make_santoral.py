import json
d=json.load(open('romcal_data.json'))
gen,eur,esp,names=d['gen'],d['eur'],d['esp'],d['names']
FN={'presentationOfTheLord':(2,2),'annunciation':(3,25),'nativityOfJohnTheBaptist':(6,24),'peterAndPaulApostles':(6,29),
    'transfiguration':(8,6),'assumption':(8,15),'exaltationOfTheHolyCross':(9,14),'allSaints':(11,1),'immaculateConceptionOfMary':(12,8)}
RANK={'ProperOfTimeSolemnity_2':3,'GeneralSolemnity_3':3,'ProperSolemnity_PrincipalPatron_4a':4,'GeneralLordFeast_5':5,'GeneralFeast_7':7,
      'ProperFeast_PrincipalPatronOfARegion_8c':8,'ProperFeast_8f':8,'GeneralMemorial_10':10,'ProperMemorial_11b':11,'OptionalMemorial_12':12}
COL={'white':'blanco','red':'rojo','purple':'morado','green':'verde','rose':'rosa','black':'negro'}
merged={}
for src in (gen,eur,esp):
    for k,v in src.items():
        base=dict(merged.get(k,{}))
        for kk,vv in v.items():
            if vv is not None: base[kk]=vv
        merged[k]=base
SKIP={'mary_mother_of_the_church','immaculate_heart_of_mary','our_lord_jesus_christ_the_eternal_high_priest'}
RED_ES={'fructuosus_of_tarragona_bishop_and_augurius_of_tarragona_and_eulogius_of_tarragona_deacons_martyrs','vincent_of_saragossa_deacon',
 'hermenegild_the_visigoths_martyr','pelagius_of_cordoba_martyr','eulalia_of_merida_virgin','peter_poveda_and_innocent_of_mary_immaculate_canoura_priests_and_companions_martyrs','james_apostle','eulogius_of_cordoba_bishop'}
out=[]
for k,v in merged.items():
    if k in SKIP: continue
    if 'fn' in v: m,dd=FN[v['fn']]
    else: m,dd=v['m'],v['d']
    rank=RANK[v['prec']]
    color=COL.get(v.get('color') or 'white')
    if k in RED_ES: color='rojo'
    name=names.get(v.get('loc') or k) or names.get(k)
    out.append({'id':k,'m':m,'d':dd,'rank':rank,'color':color,'name':name})
out.append({'id':'all_souls','m':11,'d':2,'rank':3,'color':'morado','name':'Conmemoración de todos los fieles difuntos'})
out.sort(key=lambda x:(x['m'],x['d'],x['rank']))
json.dump(out,open('santoral_es.json','w'),ensure_ascii=False,indent=0)
print(len(out))
for o in out:
    if o['rank']<=8: print(o['m'],o['d'],o['rank'],o['color'],o['name'])
