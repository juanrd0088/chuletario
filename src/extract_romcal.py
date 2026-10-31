import re, json
SRC='../repos/romcal/rites/roman1969/src/'
def parse_inputs(path):
    s=open(SRC+path,encoding='utf-8').read()
    i=s.find('inputs: Inputs = {')
    body=s[i:]
    items={}
    # entries at 4-space indent: "    id: {" ... "    },"
    for m in re.finditer(r'\n    ([a-z0-9_]+): \{(.*?)\n    \},', body, re.S):
        id_, b = m.group(1), m.group(2)
        d={}
        pm=re.search(r'precedence: Precedences\.(\w+)', b); d['prec']=pm.group(1) if pm else None
        dm=re.search(r'dateDef: \{ month: (\d+), date: (\d+) \}', b)
        if dm: d['m']=int(dm.group(1)); d['d']=int(dm.group(2))
        fm=re.search(r"dateDef: \{ dateFn: '(\w+)'(?:, addDay: (\d+))? \}", b)
        if fm: d['fn']=fm.group(1); d['add']=int(fm.group(2) or 0)
        cm=re.search(r'colors: (?:\[)?Colors\.(\w+)', b); d['color']=cm.group(1).lower() if cm else None
        lm=re.search(r"customLocaleId:\s*'(\w+)'", b); d['loc']=lm.group(1) if lm else None
        if 'dateExceptions' in b: d['exc']=True
        items[id_]=d
    return items
gen=parse_inputs('calendars/general-roman/index.ts')
eur=parse_inputs('calendars/regions/europe.ts')
esp=parse_inputs('calendars/countries/spain/index.ts')
loc=open(SRC+'locales/es.ts',encoding='utf-8').read()
names={}
for m in re.finditer(r"\n    ([a-z0-9_]+):\s*\n?\s*'((?:[^'\\]|\\.)*)'", loc):
    names[m.group(1)]=m.group(2).replace("\\'","'")
print(len(gen),len(eur),len(esp),len(names))
json.dump({'gen':gen,'eur':eur,'esp':esp,'names':names},open('romcal_data.json','w'),ensure_ascii=False,indent=1)
missing=[k for k in list(gen)+list(esp) if k not in names]
print('missing names',missing)
for k,v in gen.items():
    if 'fn' in v: print('fn',k,v)
print({v['prec'] for v in list(gen.values())+list(esp.values())+list(eur.values())})
