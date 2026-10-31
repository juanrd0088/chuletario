const fs = require('fs');
process.chdir(__dirname);
const C = fs.readFileSync('commons.json', 'utf8');
let data = fs.readFileSync('data.js', 'utf8') + 'window.COMMONS=' + C + ';\n';
fs.writeFileSync('data_full.js', data);
function assemble(headExtra) {
  let h = fs.readFileSync('app-template.html', 'utf8');
  const rep = (k, src) => { src = src.replace(/<\/script/gi, '<\\/script'); h = h.replace('/*@' + k + '@*/', () => src); };
  rep('LITURGIA', fs.readFileSync('liturgia.js', 'utf8'));
  rep('CORE', fs.readFileSync('lecturas-core.js', 'utf8'));
  rep('HORAS', fs.readFileSync('horas.js', 'utf8'));
  rep('DATA', data);
  rep('PDF', fs.readFileSync('pdf.js', 'utf8'));
  h = h.replace('/*@FONTS@*/', () => fs.readFileSync('pdf-fonts.json', 'utf8'));
  h = h.replace('<!--@HEAD@-->', headExtra);
  return h;
}

fs.mkdirSync('../out', { recursive: true });
// 1) Versión para el artifact (el envoltorio lo añade la publicación)
const art = assemble('');
fs.writeFileSync('../out/misal-diario.html', art);
// 2) Versión independiente para GitHub Pages
const head = [
  '<meta name="theme-color" content="#f5eedd" media="(prefers-color-scheme: light)">',
  '<meta name="theme-color" content="#1c1712" media="(prefers-color-scheme: dark)">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="Misal">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
  '<link rel="manifest" href="manifest.webmanifest">',
  '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">',
  '<link rel="apple-touch-icon" href="apple-touch-icon.png">'
].join('\n');
let body = assemble(head);
// separar cabecera (title, meta, link, style) del cuerpo
const cut = body.indexOf('<div class="page">');
const headPart = body.slice(0, cut), bodyPart = body.slice(cut);
const reset = '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>';
const full = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + reset + '\n' + headPart + '</head>\n<body>\n' + bodyPart + '\n</body>\n</html>\n';

fs.writeFileSync('../index.html', full);
console.log('artifact', art.length, 'github', full.length);
