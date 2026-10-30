# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto
Portfolio web personal de Mireia Gutiérrez Águila (QA Tester | Product Manager | game dev). La web además sirve como demostración de trabajo dirigiendo agentes de IA, así que el proceso (CLAUDE.md, Portfolio.md, revisión por pasos) forma parte del producto (sección "Cómo hice esta web").

**`Portfolio.md` es la especificación fuente de verdad**: textos, secciones, datos de experiencia/formación/proyectos, enlaces, paleta y requisitos. Consúltalo antes de implementar cualquier sección; no inventes datos que no estén allí — pregunta.

## Forma de trabajar (obligatorio)
- Responder siempre en español y explicar brevemente cada cambio (la usuaria está aprendiendo).
- Proponer un plan antes de programar y esperar aprobación.
- Escribe los comentarios del código en español
- Antes de pedir permiso para ejecutar un comando, explica en español y en lenguaje sencillo qué va a hacer, y si modifica o no algún archivo, poner el simbolo 🌀 al inicio de la explicación.
- Construir sección a sección y esperar revisión antes de pasar a la siguiente.
- La gestión de git (commits, ramas, merges) la hace Mireia; el agente solo sugiere qué incluir.

## Paleta aprobada (sustituye a los hex aproximados de Portfolio.md §7)
Extraída de `images/paleta_colores_{1,2,3}.jpeg` y aprobada por Mireia el 2026-10-26:
- Fondo `#08070D` · tarjetas `#15111D` · texto `#EDEAF5` · texto secundario `#A9A4BF`
- Magenta base `#940054`: solo rellenos (botones con texto claro, insignias, degradados, brillos). No usar como texto ni línea fina sobre fondo oscuro (contraste 2,3).
- Magenta claro `#EB4BA6`: mismo tono, para textos, bordes e iconos sobre fondo oscuro.
- Cian `#12DCF0` (enlaces) · verde turquesa `#2BD9A8` (acentos) · ámbar `#FF9F4A` (detalles puntuales)
- Violeta `#8B5CF6`: solo degradados y bordes, nunca texto (contraste 4,4).
- Sin coral (descartado expresamente).

## Tipografía aprobada (2026-10-27)
- Titulares y nombre: **Tektur** (Google Fonts, variable: `wdth` 75–100, `wght` 400–900). Único momento animado de la web: el nombre de la portada se despliega de estrecho a ancho al cargar (desactivado con `prefers-reduced-motion`).
- Texto de lectura: **Atkinson Hyperlegible Next** (Google Fonts).
- Solo estas dos familias; sin tercera fuente monoespaciada. Evitar etiquetas en MAYÚSCULAS espaciadas y numeración "01/02" salvo en contenido que sea una secuencia real (línea de tiempo, pasos de "Cómo hice esta web").
- Referencia visual: `diseno/muestra.html` (paleta, botones, línea de tiempo, tarjeta de juego).

## Marcadores en las respuestas
Al informar de lo que encuentres o hagas, marca cada punto según su tipo:
- 🔴 **Problema:** algo que está mal o rompe un requisito y hay que corregir (p. ej. un vídeo que supera los 5 MB, un error de JS, falta de contraste).
- 🟡 **Aviso:** algo que funciona pero conviene revisar o puede dar problemas (p. ej. compatibilidad con algún navegador, una decisión de diseño discutible).
- 📌 **Pendiente:** tarea o información que falta y queda para más adelante (p. ej. textos provisionales, datos que hay que confirmar).

## Stack y comandos
Web estática pura: HTML + CSS + JS vanilla, sin backend, sin build, sin dependencias. Despliegue previsto en hosting gratuito (GitHub Pages / Netlify).
- Servir en local: `python3 -m http.server 8000` y abrir http://localhost:8000
- No hay linter ni tests automatizados configurados.

## Arquitectura prevista
- `index.html` — one-page con secciones: Inicio · Sobre mí · Experiencia · Formación · Habilidades · Proyectos · Cómo hice esta web · Contacto · footer.
- Una página de detalle por videojuego (Ecos, MitoCat, Feminist), con contenido adaptado de su página de itch.io y gameplay de YouTube con carga diferida (miniatura + play, el iframe solo al hacer clic).
- `css/styles.css` — mobile-first; breakpoints ~360 / 768–1024 / ≥1024 px.
- `js/main.js` — navegación sticky, menú hamburguesa, scroll suave, carrusel de proyectos circular (swipe izq/der), selector de idioma ES / CA / EN.
- `js/cursor-trail.js` — estela de partículas en canvas; desactivada en táctil y con `prefers-reduced-motion`, sin bloquear clics (`pointer-events: none`).
- `js/scroll-horizontal.js` — Habilidades: el scroll vertical desplaza los paneles hacia la derecha (sección más alta + contenido `sticky`; el script solo calcula `--recorrido`, `--alto-extra`, `--x`, `--progreso`, `--salida` y `--video`, y el CSS mueve y desvanece las piezas). Fases: las 5 tarjetas se desplazan 1 a 1 con el scroll; luego siguen saliendo por la izquierda mientras se desvanecen (también el indicador) y aparece el vídeo grande `.video-final`, quedando solo el título y el vídeo; después, una pausa de scroll. Con el scroll horizontal activo, el script controla el play/pause del vídeo y `main.js` lo ignora. Se activa desde 768 px de ancho y 560 px de alto, sin `prefers-reduced-motion`; si no, los paneles van en vertical. Con JS apagado también queda en vertical. El recorrido se mide desde el borde derecho del último panel, nunca con el ancho de `.horizontal__carril`: WebKit (Safari) y Firefox lo calculan con unos 1700 px de más y los paneles se pasarían de largo dejando la pantalla vacía.
- `js/mapa-formacion.js` — Formación como mapa de habilidades. Lee la lista `<ul class="formacion">` del HTML (que queda oculta y es el respaldo sin JS; cada `<li>` lleva `data-icono` y `data-logos` con ids del sprite) y construye un camino de nodos del más antiguo al más reciente, con panel de detalle (patrón de pestañas con flechas/Home/End). En ≥1024 px el camino es horizontal en zigzag y el ratón selecciona al pasar por encima; por debajo es vertical, el panel cuelga bajo el nodo elegido y solo se selecciona con clic/toque (si no, el panel empujaría los nodos y el cursor elegiría otro sin querer). El brillo de cercanía del cursor y las transiciones se desactivan con `prefers-reduced-motion`; los textos se refrescan al cambiar el atributo `lang`. La línea es un SVG cuyos puntos se recalculan con `ResizeObserver`.
- `js/carrusel-proyectos.js` — carrusel circular de Proyectos (3 tarjetas `.juego` en `.carrusel__pista`). Sin JS las tarjetas van apiladas; con JS se les pone `.carrusel--activo` en el contenedor y se superponen en una celda de la rejilla, colocadas por `data-pos` (`centro`/`izq`/`der`/`oculta`) con `translate`/`scale`/`rotate` y perspectiva. Cada juego tiene su color de acento (`--acento`). Cambio de juego: flechas, puntos, ←/→, clic en una tarjeta lateral o deslizar (pointer events + `touch-action: pan-y`; el clic posterior a un arrastre se suprime y se bloquea `dragstart`, si no Firefox/WebKit arrastran el enlace). El contenido de las tarjetas laterales es `inert`. Solo se reproduce el vídeo de la tarjeta central con el carrusel a la vista (IntersectionObserver); cada vídeo tiene botón de pausa (WCAG 2.2.2) y con `prefers-reduced-motion` arrancan en pausa mostrando el póster. Tras cada `play()` se vuelve a comprobar si el vídeo debe seguir sonando: WebKit/Firefox pueden ignorar un `pause()` pedido mientras el `play()` carga. Pósters en `images/proyectos/` (fotograma del segundo 5 de cada vídeo, sacado con ffmpeg). Los botones "Ver más" apuntan a `juegos/<juego>.html` (páginas de la fase 4).
- `js/contacto.js` — botón "Copiar email" de Contacto. Viene con `hidden` en el HTML (sin JS solo queda el `mailto`) y el script lo muestra; copia con `navigator.clipboard` y, si el navegador lo niega (p. ej. `file://`), usa un `<textarea>` temporal con `execCommand('copy')`. El aviso "¡Copiado!" va en un `role="status"` y se borra a los 3 s. Decisión: sin formulario (Formspree descartado: cuenta de terceros, datos de visitantes y spam). LinkedIn no existe en Simple Icons (404), así que se usa el icono propio `icono-persona` con su nombre al lado.
- `js/workflow.js` — "Cómo hice esta web" como flujo de trabajo en tres fases (Preparar · Construir sección a sección · Entregar). El HTML ya es una lista vertical por fases con todo el texto visible (es lo que ve quien no tenga JavaScript y quien tenga menos de 1100 px). El script añade `.flujo--activo` al `.flujo`, convierte el título de cada `.flujo__carta` en un botón y esconde su `.flujo__detalle`. Desde 1100 px y con `.flujo--activo` el flujo es un diagrama dibujado sobre un lienzo de 1400 × 900 que se escala: cada carta/rombo/final lleva sus medidas en `--x --y --w --h` (unidades del lienzo) y las flechas y zonas son un SVG (`.flujo__fondo`) con el mismo viewBox, así que **si se mueve una carta hay que mover también el trazo de su flecha**. El diagrama se sale de la columna de 63 rem (`width: min(87.5rem, 100vw - 2rem)`). Los detalles flotan junto a la carta (`data-lado` = `der`/`der-abajo`/`izq`/`abajo`) sin mover nada: se abren al pasar el ratón (solo ratón y ≥ 1100 px), al enfocar con teclado o al pulsar/tocar (queda fijo); Esc o pulsar fuera lo cierran (con `pointerdown`: Safari en iPhone no lanza `click` en `document` al tocar zonas vacías). Verde = seguir adelante, rosa discontinuo = "no"/vuelta atrás, cian discontinuo = siguiente sección, ámbar = insignia QA (donde Mireia hizo testing). Los textos largos en inglés/catalán son el riesgo: las cajas pequeñas (`flujo__carta--caja`) son de 205–290 × 72–92 unidades. Textos en `flujo.*` de `js/traducciones.js`.
- Nada de CSS/JS en línea en el HTML. Imágenes en `images/` (subcarpetas `logos/`, `proyectos/`), vídeos en `videos/`.
- Logos de tecnologías: SVG monocromos de Simple Icons (CC0) en `images/logos/` (ver su README). Además van incrustados como sprite (`<symbol id="logo-...">`) al principio del `<body>` de `index.html` y se pintan con `<use href="#logo-...">` y `fill: var(--acento)`, para que funcionen también si el HTML se abre como archivo (`file://`): ni `mask-image` ni un `<use>` externo funcionan ahí en Chrome. Al añadir un logo hay que añadirlo en los dos sitios. Las habilidades sin marca (bug, matraz, ciclo, lista de comprobación, equipo, liderazgo, docencia) usan iconos propios de `images/iconos/`, que van en el mismo sprite con ids `icono-...`. El sprite se regenera con un script que no vive en el repo (se pierde entre sesiones): hay que reescribirlo copiando el interior de cada SVG, sin su `<title>`, y sustituyendo el bloque `<svg class="sprite">` de `index.html`. La vista previa `diseno/iconos.html` usa el mismo sprite.

## Restricciones no obvias
- Vídeos loop de tarjetas: autoplay, muted, loop, sin controles, con poster; solo reproducir cuando la tarjeta es visible (IntersectionObserver) o en hover en escritorio. Objetivo <5 MB, ≤720p, H.264 sin audio, con `faststart` (los actuales ya cumplen: ~4,4 MB; comprimidos con ffmpeg en dos pasadas a 800k). `video_loop_habilidades.mp4` trae un borde blanco (12 px a los lados, 2 px arriba y abajo) que se recorta en CSS con `scale: 1.03`; su póster es `images/poster_habilidades.jpg`. La foto de perfil está en AVIF (900 px de ancho, con transparencia) porque el Mac no puede generar WebP.
- Estética sci-fi/HUD oscura (sin modo claro); neón solo como acento, el texto siempre con buen contraste. Accesibilidad: alt en imágenes, navegable con teclado.
- No publicar teléfono ni datos de referencias. CV en la raíz como `cv-mireia-gutierrez.pdf` (versión pública, ya sin teléfono ni referencias). Si se sustituye, comprobar que no esté dañado: varias exportaciones de Canva salieron corruptas y se veían en blanco fuera de Vista Previa.
