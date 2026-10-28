# Logos de tecnologías

- **Fuente:** [Simple Icons](https://simpleicons.org), versión 16.36.0, descargados el 2026-10-28 desde `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<nombre>.svg`.
- **Licencia:** los dibujos son CC0 1.0 (dominio público), así que no requieren atribución. Las marcas pertenecen a sus propietarios y aquí solo se usan para indicar las tecnologías con las que trabaja Mireia.
- **Formato:** SVG monocromo de un solo trazo (`viewBox="0 0 24 24"`, sin color propio). Se recolorean con CSS (`fill: currentColor`).
- **Archivos:** `android`, `apple`, `claudecode`, `css`, `cypress`, `eclipseide`, `github`, `godotengine`, `html5`, `jenkins`, `linux`, `mongodb`, `mysql`, `php`, `pycharm`, `selenium`, `slack`, `trello`, `unity`, `unrealengine`, `visualstudiocode`, `windows`.
- **Excepción de versión:** `visualstudiocode.svg` es de Simple Icons **11.0.0** (también CC0), porque el catálogo retiró los logos de Visual Studio y Visual Studio Code en versiones posteriores. `html5`, `css`, `eclipseide` y `pycharm` se descargaron el 2026-10-28 de la 16.36.0.
- **Sin logo en el catálogo:** Agile (se muestra como texto).

## Dónde se usan

- En `index.html` van incrustados en un bloque `<svg class="sprite">` al principio del `<body>` (un `<symbol id="logo-...">` por logo) y se pintan con `<use href="#logo-...">`. Así funcionan aunque la página se abra directamente como archivo (`file://`), cosa que no ocurre con imágenes enlazadas desde CSS.
- Estos archivos sueltos son la fuente original y se reutilizarán en las páginas de detalle de los juegos.
