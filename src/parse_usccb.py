import re, os, json, html, sys
RAW = sys.argv[1]
out = []
def clean(x):
    x = re.sub(r'<[^>]+>', ' ', x)
    return re.sub(r'\s+', ' ', html.unescape(x)).strip()
for fn in sorted(os.listdir(RAW)):
    if not fn.endswith('.cfm'): continue
    s = open(os.path.join(RAW, fn), encoding='utf-8', errors='replace').read()
    m = re.match(r'(\d{4}-\d{2}-\d{2})(?:-(\d{6}))?(?:-(.*))?\.cfm', fn)
    date, _, variant = m.group(1), m.group(2), m.group(3)
    # blocks: lectionary header blocks and verse blocks in order
    title = None; lect = None
    lm = re.search(r'b-lectionary.*?<h2>(.*?)</h2>\s*<p>(.*?)</p>', s, re.S)
    if lm:
        title = clean(lm.group(1)); lect = clean(lm.group(2))
    readings = []
    for vm in re.finditer(r'<h3 class="name">(.*?)</h3>\s*<div class="address">(.*?)</div>(?:\s*</div>\s*<div class="content-body">(.*?)</div>)?', s, re.S):
        name = clean(vm.group(1))
        addr = clean(vm.group(2))
        body = vm.group(3) or ''
        rm = re.search(r'R\.\s*\(([^)]{1,40})\)', html.unescape(re.sub(r'<[^>]+>', ' ', body)))
        readings.append([name, addr, rm.group(1).strip() if rm else None])
    out.append({'file': fn, 'date': date, 'variant': variant, 'title': title, 'lect': lect, 'readings': readings})
json.dump(out, open('usccb.json', 'w'), ensure_ascii=False, indent=0)
print(len(out))
from collections import Counter
c = Counter(r[0] for o in out for r in o['readings'])
print(c.most_common(40))
print(sum(1 for o in out if not o['readings']), 'files without readings')
print([o['file'] for o in out if not o['readings']][:20])
