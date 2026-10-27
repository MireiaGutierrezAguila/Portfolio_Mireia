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
- Nada de CSS/JS en línea en el HTML. Imágenes en `images/` (subcarpetas `logos/`, `proyectos/`), vídeos en `videos/`.

## Restricciones no obvias
- Vídeos loop de tarjetas: autoplay, muted, loop, sin controles, con poster; solo reproducir cuando la tarjeta es visible (IntersectionObserver) o en hover en escritorio. Objetivo <5 MB, ≤720p, H.264 sin audio, con `faststart` (los actuales ya cumplen: ~4,4 MB; comprimidos con ffmpeg en dos pasadas a 800k). La foto de perfil está en AVIF (900 px de ancho, con transparencia) porque el Mac no puede generar WebP.
- Estética sci-fi/HUD oscura (sin modo claro); neón solo como acento, el texto siempre con buen contraste. Accesibilidad: alt en imágenes, navegable con teclado.
- No publicar teléfono ni datos de referencias. CV en la raíz como `cv-mireia-gutierrez.pdf` (versión pública, ya sin teléfono ni referencias). Si se sustituye, comprobar que no esté dañado: varias exportaciones de Canva salieron corruptas y se veían en blanco fuera de Vista Previa.
