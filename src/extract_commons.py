import re, json
SRC='../repos/romcal/rites/roman1969/src/'
out={}
for path in ['calendars/general-roman/index.ts','calendars/regions/europe.ts','calendars/countries/spain/index.ts']:
    s=open(SRC+path,encoding='utf-8').read()
    body=s[s.find('inputs: Inputs = {'):]
    for m in re.finditer(r'\n    ([a-z0-9_]+): \{(.*?)\n    \},', body, re.S):
        b=m.group(2)
        cm=re.search(r'commonsDef:\s*(\[[^\]]*\]|Common\.\w+)', b)
        if cm:
            out[m.group(1)]=re.findall(r'Common\.(\w+)', cm.group(1))
json.dump(out,open('commons_raw.json','w'),indent=0)
from collections import Counter
print(len(out)); print(Counter(x for v in out.values() for x in v))
