// Libros de la Biblia: código, variantes inglesas, abreviatura española, título de la lectura, ruta en la Biblia de la CEE
const BOOKS = [
  ['GEN', ['genesis', 'gn', 'gen'], 'Gén', 'Lectura del libro del Génesis', 'genesis'],
  ['EXO', ['exodus', 'ex', 'exod'], 'Éx', 'Lectura del libro del Éxodo', 'exodo'],
  ['LEV', ['leviticus', 'lv', 'lev'], 'Lev', 'Lectura del libro del Levítico', 'levitico'],
  ['NUM', ['numbers', 'nm', 'num'], 'Núm', 'Lectura del libro de los Números', 'numeros'],
  ['DEU', ['deuteronomy', 'dt', 'deut'], 'Dt', 'Lectura del libro del Deuteronomio', 'deuteronomio'],
  ['JOS', ['joshua', 'jos', 'josh'], 'Jos', 'Lectura del libro de Josué', 'josue'],
  ['JDG', ['judges', 'jgs', 'judg'], 'Jue', 'Lectura del libro de los Jueces', 'jueces'],
  ['RUT', ['ruth', 'ru'], 'Rut', 'Lectura del libro de Rut', 'rut'],
  ['1SA', ['1samuel', '1sm', '1sam'], '1 Sam', 'Lectura del primer libro de Samuel', '1-samuel'],
  ['2SA', ['2samuel', '2sm', '2sam'], '2 Sam', 'Lectura del segundo libro de Samuel', '2-samuel'],
  ['1KI', ['1kings', '1kgs', '1kg'], '1 Re', 'Lectura del primer libro de los Reyes', '1-reyes'],
  ['2KI', ['2kings', '2kgs', '2kg'], '2 Re', 'Lectura del segundo libro de los Reyes', '2-reyes'],
  ['1CH', ['1chronicles', '1chr', '1chron'], '1 Crón', 'Lectura del primer libro de las Crónicas', '1-cronicas'],
  ['2CH', ['2chronicles', '2chr', '2chron'], '2 Crón', 'Lectura del segundo libro de las Crónicas', '2-cronicas'],
  ['EZR', ['ezra', 'ezr'], 'Esd', 'Lectura del libro de Esdras', 'esdras'],
  ['NEH', ['nehemiah', 'neh'], 'Neh', 'Lectura del libro de Nehemías', 'nehemias'],
  ['TOB', ['tobit', 'tb', 'tob'], 'Tob', 'Lectura del libro de Tobías', 'tobias'],
  ['JDT', ['judith', 'jdt'], 'Jdt', 'Lectura del libro de Judit', 'judit'],
  ['EST', ['esther', 'est'], 'Est', 'Lectura del libro de Ester', 'ester'],
  ['1MA', ['1maccabees', '1mc', '1mac', '1macc'], '1 Mac', 'Lectura del primer libro de los Macabeos', '1-macabeos'],
  ['2MA', ['2maccabees', '2mc', '2mac', '2macc'], '2 Mac', 'Lectura del segundo libro de los Macabeos', '2-macabeos'],
  ['JOB', ['job', 'jb'], 'Job', 'Lectura del libro de Job', 'job'],
  ['PSA', ['psalm', 'psalms', 'ps', 'pss'], 'Sal', 'Salmo responsorial', 'salmos'],
  ['PRO', ['proverbs', 'prv', 'prov'], 'Prov', 'Lectura del libro de los Proverbios', 'proverbios'],
  ['ECC', ['ecclesiastes', 'eccl', 'qoheleth', 'eccles'], 'Ecl', 'Lectura del libro del Eclesiastés', 'eclesiastes'],
  ['SNG', ['songofsongs', 'sg', 'sgs', 'song', 'songofsolomon'], 'Cant', 'Lectura del libro del Cantar de los Cantares', 'cantar-de-los-cantares'],
  ['WIS', ['wisdom', 'wis'], 'Sab', 'Lectura del libro de la Sabiduría', 'sabiduria'],
  ['SIR', ['sirach', 'sir', 'ecclesiasticus', 'sirarch'], 'Eclo', 'Lectura del libro del Eclesiástico', 'eclesiastico'],
  ['ISA', ['isaiah', 'is', 'isa'], 'Is', 'Lectura del libro de Isaías', 'isaias'],
  ['JER', ['jeremiah', 'jer'], 'Jer', 'Lectura del libro de Jeremías', 'jeremias'],
  ['LAM', ['lamentations', 'lam'], 'Lam', 'Lectura del libro de las Lamentaciones', 'lamentaciones'],
  ['BAR', ['baruch', 'bar'], 'Bar', 'Lectura del libro de Baruc', 'baruc'],
  ['EZK', ['ezekiel', 'ez', 'ezek'], 'Ez', 'Lectura de la profecía de Ezequiel', 'ezequiel'],
  ['DAN', ['daniel', 'dn', 'dan'], 'Dan', 'Lectura de la profecía de Daniel', 'daniel'],
  ['HOS', ['hosea', 'hos'], 'Os', 'Lectura de la profecía de Oseas', 'oseas'],
  ['JOL', ['joel', 'jl'], 'Jl', 'Lectura de la profecía de Joel', 'joel'],
  ['AMO', ['amos', 'am'], 'Am', 'Lectura de la profecía de Amós', 'amos'],
  ['OBA', ['obadiah', 'ob', 'obad'], 'Abd', 'Lectura de la profecía de Abdías', 'abdias'],
  ['JON', ['jonah', 'jon'], 'Jon', 'Lectura de la profecía de Jonás', 'jonas'],
  ['MIC', ['micah', 'mi', 'mic'], 'Miq', 'Lectura de la profecía de Miqueas', 'miqueas'],
  ['NAM', ['nahum', 'na', 'nah'], 'Nah', 'Lectura de la profecía de Nahún', 'nahun'],
  ['HAB', ['habakkuk', 'hb', 'hab'], 'Hab', 'Lectura de la profecía de Habacuc', 'habacuc'],
  ['ZEP', ['zephaniah', 'zep', 'zeph'], 'Sof', 'Lectura de la profecía de Sofonías', 'sofonias'],
  ['HAG', ['haggai', 'hg', 'hag'], 'Ag', 'Lectura de la profecía de Ageo', 'ageo'],
  ['ZEC', ['zechariah', 'zec', 'zech'], 'Zac', 'Lectura de la profecía de Zacarías', 'zacarias'],
  ['MAL', ['malachi', 'mal'], 'Mal', 'Lectura de la profecía de Malaquías', 'malaquias'],
  ['MAT', ['matthew', 'mt', 'matt'], 'Mt', 'Lectura del santo evangelio según san Mateo', 'mateo'],
  ['MRK', ['mark', 'mk', 'm'], 'Mc', 'Lectura del santo evangelio según san Marcos', 'marcos'],
  ['LUK', ['luke', 'lk'], 'Lc', 'Lectura del santo evangelio según san Lucas', 'lucas'],
  ['JHN', ['john', 'jn'], 'Jn', 'Lectura del santo evangelio según san Juan', 'juan'],
  ['ACT', ['acts', 'actsoftheapostles'], 'Hch', 'Lectura del libro de los Hechos de los Apóstoles', 'hechos-de-los-apostoles'],
  ['ROM', ['romans', 'rom'], 'Rom', 'Lectura de la carta del apóstol san Pablo a los Romanos', 'romanos'],
  ['1CO', ['1corinthians', '1cor'], '1 Cor', 'Lectura de la primera carta del apóstol san Pablo a los Corintios', '1-corintios'],
  ['2CO', ['2corinthians', '2cor'], '2 Cor', 'Lectura de la segunda carta del apóstol san Pablo a los Corintios', '2-corintios'],
  ['GAL', ['galatians', 'gal'], 'Gál', 'Lectura de la carta del apóstol san Pablo a los Gálatas', 'galatas'],
  ['EPH', ['ephesians', 'eph'], 'Ef', 'Lectura de la carta del apóstol san Pablo a los Efesios', 'efesios'],
  ['PHP', ['philippians', 'phil', 'phiippians'], 'Flp', 'Lectura de la carta del apóstol san Pablo a los Filipenses', 'filipenses'],
  ['COL', ['colossians', 'col'], 'Col', 'Lectura de la carta del apóstol san Pablo a los Colosenses', 'colosenses'],
  ['1TH', ['1thessalonians', '1thes', '1thess'], '1 Tes', 'Lectura de la primera carta del apóstol san Pablo a los Tesalonicenses', '1-tesalonicenses'],
  ['2TH', ['2thessalonians', '2thes', '2thess'], '2 Tes', 'Lectura de la segunda carta del apóstol san Pablo a los Tesalonicenses', '2-tesalonicenses'],
  ['1TI', ['1timothy', '1tm', '1tim'], '1 Tim', 'Lectura de la primera carta del apóstol san Pablo a Timoteo', '1-timoteo'],
  ['2TI', ['2timothy', '2tm', '2tim'], '2 Tim', 'Lectura de la segunda carta del apóstol san Pablo a Timoteo', '2-timoteo'],
  ['TIT', ['titus', 'ti', 'tit'], 'Tit', 'Lectura de la carta del apóstol san Pablo a Tito', 'tito'],
  ['PHM', ['philemon', 'phlm', 'philem', 'phmn'], 'Flm', 'Lectura de la carta del apóstol san Pablo a Filemón', 'filemon'],
  ['HEB', ['hebrews', 'heb'], 'Heb', 'Lectura de la carta a los Hebreos', 'hebreos'],
  ['JAS', ['james', 'jas'], 'Sant', 'Lectura de la carta del apóstol Santiago', 'santiago'],
  ['1PE', ['1peter', '1pt', '1pet'], '1 Pe', 'Lectura de la primera carta del apóstol san Pedro', '1-pedro'],
  ['2PE', ['2peter', '2pt', '2pet'], '2 Pe', 'Lectura de la segunda carta del apóstol san Pedro', '2-pedro'],
  ['1JN', ['1john', '1jn'], '1 Jn', 'Lectura de la primera carta del apóstol san Juan', 'juan-cartas-1-3'],
  ['2JN', ['2john', '2jn'], '2 Jn', 'Lectura de la segunda carta del apóstol san Juan', 'juan-cartas-1-3'],
  ['3JN', ['3john', '3jn'], '3 Jn', 'Lectura de la tercera carta del apóstol san Juan', 'juan-cartas-1-3'],
  ['JUD', ['jude', 'jud'], 'Jds', 'Lectura de la carta del apóstol san Judas', 'judas'],
  ['REV', ['revelation', 'rv', 'rev', 'apocalypse'], 'Ap', 'Lectura del libro del Apocalipsis', 'apocalipsis']
];
const BY_VARIANT = {};
for (const b of BOOKS) for (const v of b[1]) BY_VARIANT[v] = b[0];

// "Isaiah 8:23—9:3" -> {b:'ISA', r:'8:23-9:3'} ; sin libro en un salmo -> PSA
const SINGLE = new Set(['OBA', 'PHM', '2JN', '3JN', 'JUD']);
function parseCite(raw, defaultBook) {
  let s = raw.replace(/\u00a0/g, ' ').trim();
  s = s.replace(/^(see|cf\.?)\s+/i, '');
  s = s.replace(/\.$/, '').trim();
  let m = /^((?:[1-3]\s*)?[A-Za-z][A-Za-z\. ]*?)\s*((?:\d+|[A-F])\s*:.*)$/.exec(s);
  let book, rest;
  if (m) {
    const k = m[1].toLowerCase().replace(/[\s\.]/g, '');
    book = BY_VARIANT[k];
    if (!book) return { error: 'libro desconocido: ' + m[1], raw };
    rest = m[2];
  } else if ((m = /^((?:[1-3]\s*)?[A-Za-z][A-Za-z\. ]*?)\s*(\d.*)$/.exec(s)) && SINGLE.has(BY_VARIANT[m[1].toLowerCase().replace(/[\s\.]/g, '')])) {
    book = BY_VARIANT[m[1].toLowerCase().replace(/[\s\.]/g, '')];
    rest = '1:' + m[2];
  } else if (/^\d+\s*:/.test(s) && defaultBook) { book = defaultBook; rest = s; }
  else return { error: 'sin formato', raw };
  const parts = rest.split(/\s+or\s+/i).map(p => p.replace(/^[1-3]?\s*[A-Za-z][A-Za-z\. ]*?\s+(?=\d)/, ''));
  const norm = parts.map(p => p.replace(/\s*(and|&)\s*/gi, ',').replace(/[\u2014\u2013\u2212]/g, '-').replace(/-+/g, '-').replace(/\s+/g, '').replace(/,+/g, ',').replace(/\.$/, '').toLowerCase());
  return { b: book, r: norm[0], alt: norm.slice(1) };
}
module.exports = { BOOKS, parseCite };
