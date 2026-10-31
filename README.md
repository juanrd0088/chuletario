# Misal diario

App web para el móvil para rezar con la Iglesia, según el calendario litúrgico de España:

- **Lecturas de la Misa** de cada día (citas con enlace a la Biblia de la CEE).
- **Liturgia de las Horas**: instrucciones para rezar Laudes, Vísperas y Completas con el libro, con el tomo que hay que coger.
- **Imprimir en PDF** (A4, A5, A6): Misa del día, celebración propia o cualquier hora.
- Modo claro y oscuro.

Se publica con GitHub Pages desde la raíz de este repositorio: `index.html` es la app completa en un solo archivo.

## Estructura

```
index.html              ← la app (GENERADO: no editar a mano)
manifest.webmanifest    ← para instalarla en el móvil
icon-*.png, apple-touch-icon.png
.nojekyll               ← Pages publica los archivos tal cual
src/                    ← código fuente
```

### `src/`: lo que se edita

| Archivo | Qué es |
|---|---|
| `app-template.html` | Página: estilos, estructura y lógica de pantalla (pestañas, selector de días, tema, pantalla Imprimir). Tiene marcadores `/*@…@*/` donde se insertan los demás archivos. |
| `liturgia.js` | Motor del calendario litúrgico (tiempos, ciclos A/B/C e I/II, precedencias, traslados, calendario de España). |
| `lecturas-core.js` | Formato español de las citas, enlaces a la Biblia de la CEE y respuesta del salmo. |
| `horas.js` | Reglas de la Liturgia de las Horas (OGLH): salterio, tomos, I Vísperas, memorias, fiestas, Completas. |
| `pdf.js` | Generación del PDF con jsPDF (maquetación propia, fuentes incrustadas). |
| `data.js` / `data.json` | Datos: santoral y citas del leccionario (generados, ver abajo). |
| `commons.json` | Común de cada santo para las Horas. |
| `pdf-fonts.json` | Fuentes TTF (EB Garamond, IM Fell) en base64 para el PDF. |
| `build.js` | Une todo en `index.html`. |

### Construir

```
node src/build.js
```

Escribe `index.html` en la raíz y `out/misal-diario.html` (la versión para el artifact de Claude, sin cabecera; `out/` no se sube).

### Datos (solo si hay que regenerarlos)

Cadena de las citas del leccionario, ejecutando cada paso dentro de `src/`:

`parse_usccb.py` → `usccb.json` → `build_lect.js` → `consolidate2.js` → `temp.json`, `sanct_obs_conv.json` → `assemble.js` → `data.js`, `data.json`

Santoral: `extract_romcal.py` → `romcal_data.json` → `make_santoral.py` → `santoral_es.json`. Comunes: `extract_commons.py` → `commons_raw.json` → `make_commons.js` → `commons.json`. (Los scripts `extract_*` y `parse_usccb.py` leen fuentes externas que no están en el repositorio; sus resultados sí.) `coverage.js`, `show.js` y `showh.js` sirven para revisar.

## Estado y decisiones

El historial, las decisiones y lo pendiente están en el documento `lecturas-decisiones.md` del proyecto "Oracion" en Claude.
