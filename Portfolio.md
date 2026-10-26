# Proyecto: Portfolio personal de Mireia Gutiérrez

## 1. Objetivo

Quiero crear mi **portfolio web personal** con dos objetivos:

1. **Presentarme profesionalmente** como QA Tester y Product Manager, y mostrar mi faceta de desarrolladora de videojuegos.
2. **Demostrar que sé trabajar con agentes de IA.** Esta web está construida con Claude Code, y la propia web es la prueba de que sé dirigir agentes para obtener un resultado profesional. No solo debe mostrar mi formación, sino ser en sí misma un ejemplo de mi trabajo con agentes.

La web debe:
- Presentarme de forma profesional, cercana y con personalidad.
- Mostrar mi experiencia, mi formación y mis proyectos de forma visual y atractiva.
- Facilitar que reclutadores, empresas o estudios contacten conmigo.
- Tener un **acabado de nivel profesional**: diseño cuidado, código limpio, buen rendimiento y sin errores.

## 2. Requisitos técnicos

- **Web estática:** solo HTML, CSS y JavaScript. Sin backend ni base de datos.
- Se publicará en un **hosting gratuito** (GitHub Pages, Netlify o similar).
- **Responsive obligatorio:** debe verse y funcionar bien en:
  - Móvil (desde 360 px de ancho)
  - Tablet (aprox. 768 px – 1024 px)
  - Escritorio (desde 1024 px, incluidas pantallas grandes)
- Diseño **mobile-first**.
- Ligera y rápida: imágenes optimizadas y vídeo que no bloquee la carga.
- Accesible: textos alternativos en imágenes, buen contraste y navegable con teclado.
- Compatible con los navegadores actuales (Chrome, Safari, Firefox, Edge).
- Como soy QA, el código debe ser limpio, ordenado y fácil de probar.

## 3. Estructura de archivos

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   ├── foto_mireia_principal.avif
└── videos/
```

- Mantener el CSS y el JS en archivos separados, nada en línea dentro del HTML.
- Las imágenes van en `/images` y los vídeos en `/videos`.

## 4. Navegación

- Menú con pestañas o enlaces a cada sección: **Inicio · Sobre mí · Experiencia · Formación · Habilidades · Proyectos · Contacto**.
- En móvil, el menú se convierte en un **menú hamburguesa**.
- Menú fijo (sticky) al hacer scroll.
- Desplazamiento suave al pulsar cada enlace.
- Selector de idioma: español / català / inglés

**Formato:** una sola página con scroll por secciones, más una página de detalle para cada proyecto de videojuego.

## 5. Secciones

### 5.1 Inicio (Hero)
- Nombre: **Mireia Gutiérrez Águila**
- Rol: **QA Tester | Product Manager**, con mención a desarrollo de videojuegos.
- Frase corta que me defina, por ejemplo: *"Evolution = growth + perpetual learning"* (mi lema). 
- **Vídeo destacado** (ver punto 6).
- Botones de llamada a la acción: "Ver proyectos" y "Contacto".

### 5.2 Sobre mí
- Foto de perfil (`/images/foto_mireia_principal.avif`).
- Texto de presentación (se puede pulir, pero la idea es esta):

  > Me interesan los proyectos que combinan pensamiento conceptual y analítico. Me gusta involucrarme y me considero sociable y colaborativa.
  > Empecé en el mundo de la tecnología estudiando programación en PHP, lo que me abrió las puertas para trabajar como QA Tester. Tras dos años en The Knot Worldwide, continué mi carrera como QA en Zitro, donde actualmente compagino este rol con el de Product Manager.
  > En el último año me he iniciado en la programación de videojuegos, formándome en Godot, Unity y Unreal, y he creado algunos videojuegos propios.

### 5.3 Experiencia laboral
Mostrar como **línea de tiempo (timeline)** vertical, de más reciente a más antigua:

| Puesto | Empresa | Periodo | Descripción |
|---|---|---|---|
| Product Manager | Zitro | 2025 – actualidad | Creación y gestión de la documentación de una web interna de backoffice, coordinando requerimientos con diseño, operaciones y desarrollo, y definiendo mejoras que facilitan la operativa diaria. |
| QA Tester | Zitro | 2022 – actualidad | Diseño y ejecución de planes de prueba en Backend, Frontend y Backoffice, estableciendo prioridades, analizando el impacto de los cambios y proponiendo mejoras que optimizan la eficiencia de otros equipos. |
| QA Tester | The Knot Worldwide (WeddingWire) | 2019 – 2021 | Revisión manual de la web y la versión móvil de una multinacional. En los últimos meses, liderazgo de QA de todas las apps de la empresa. |
| Maestra | Enseñanza, Generalitat de Catalunya | 2013 – 2018 | Cursos de iniciación a la robótica educativa y la programación. Formación digital para maestros en el uso de nuevas tecnologías en el aula. Dinamización de equipos con proyectos en Drive, Trello y Slack. |
- Añadir una forma de ampliar información de cada perfil con los siguientes textos:

  - Game Developer (aunque no es una experiencia en una empresa, como hobby)
    - Mi experiencia como game developer: En noviembre de 2025, gracias a W_i_dev, una comunidad increíble que impulsa la presencia de las mujeres en la industria, me inicié en el mundo del desarrollo de videojuegos en mi tiempo libre. Empecé con un tutorial de Godot para crear un videojuego para un jam de 6 días, Echos, un pequeño juego de plataformas; posteriormente, decidí probar los otros dos motores más demandados para tener una visión más amplia y ver cuál encajaba más conmigo. Creé un juego muy variado con Unity, MitoCat, donde mezclé 2D, 3D, plataforma, un shooter, distintas físicas y mecánicas variadas para aprender el máximo posible, no sin antes realizar cursos de C#. Mi último proyecto es Feminist, un videojuego para móvil creado en Unreal, en el cual me inicié en el tema de los Blueprints; también intenté que este fuese diverso para enriquecer mi aprendizaje. 

  - Product Manager
    - Combinar mis roles de Product Manager y QA Tester me otorga una visión técnica muy cercana y actualizada de todos los cambios y mejoras a nivel de server. Esta perspectiva me ha permitido liderar iniciativas con un impacto directo en la eficiencia de los equipos y la calidad del producto.
    Me implico activamente en identificar y entender las necesidades de backoffice que detecta cada equipo —como la visualización de datos, la implementación de barreras lógicas por parte de server para prevenir errores de configuración o el cumplimiento de normativas específicas por jurisdicción—, adaptando y orientando la creación de nuevas aplicaciones para darles respuesta de la mejor forma posible.
    He mejorado notablemente las documentaciones, haciéndolas mucho más específicas y técnicas, algo que los equipos de PHP y Diseño han valorado muy positivamente en comparación con la gestión anterior. Además, he fomentado un canal de comunicación mucho más abierto, fluido y cercano con Desarrollo PHP y el equipo de server, logrando una implicación mucho más alta en los proyectos por ambas partes.
    Gracias a este flujo de trabajo colaborativo, he podido proponer cambios sustanciales e importantes no solo a nivel de frontend, sino también directamente en el servidor. Asumiendo cada vez más responsabilidad, he propuesto y gestionado desde cero —tanto para la parte de server como para PHP— un gran proyecto estratégico y esencial para la empresa. 

  - QA Tester
    - Como QA Tester, mi experiencia abarca tanto entornos corporativos como el desarrollo de producto. En mi puesto actual, me encargo del testing de backend —tanto de juegos de casino como del backoffice y webs internas de la empresa—, además de realizar pruebas de frontend en los propios juegos de casino. Previamente, fui única responsable de QA en aplicaciones móviles (Android e iOS).
    En el plano técnico, he impulsado proyectos de automatización para optimizar la calidad de los procesos: utilicé Selenium para testear la web de backoffice de la empresa y, además, he iniciado iniciativas con Cypress para robustecer las validaciones de los juegos.
    Nunca me conformo con lo establecido: no me limito a ver qué falla ni doy por sentado que algo no puede cambiar solo porque "siempre se haya hecho así". Siempre voy un paso más allá en busca de estrategias de mejora y una buena organización, facilitando metodologías eficientes incluso a otros equipos. Para ello, fomento una vía de diálogo constante, organizando reuniones cuando es necesario, creando documentación clara y estructurando tareas que facilitan la colaboración y el flujo de trabajo.

  - Maestra
    - Aunque a primera vista pueda parecer que no guarda relación con mi trayectoria tecnológica actual, mi experiencia como maestra es uno de mis mayores activos y me aporta una perspectiva diferencial. A lo largo de mi recorrido en el ámbito educativo, he trabajado principalmente en escuelas basadas en metodologías por proyectos. Diseñar, planificar y coordinar proyectos educativos junto con los alumnos y profesores era mi día a día, lo que me otorgó una visión global muy sólida sobre la estructura de proyectos, la gestión de prioridades y la importancia vital de la comunicación entre equipos.
    Toda esta base pedagógica y organizativa me resulta de un valor incalculable en mi día a día actual, tanto en mi rol como Product Manager como en el diseño y gestión de AGENTES de IA, permitiéndome estructurar flujos complejos, anticipar necesidades y coordinar equipos de forma eficiente.   

### 5.4 Formación
Tarjetas o lista con año, título y centro:

| Año | Formación | Centro |
|---|---|---|
| 2026 | Claude Code | BIG School |
| 2025 | Desarrollo de videojuegos: Unity, Unreal y Godot | LuisCanary, entre otros formadores |
| 2024 | QA Testing – Bootcamp QA | BootcampQA |
| 2023 | QA Automation: Selenium / Cypress | Udemy |
| 2018 | Programación web en PHP | Vapor Universitari de Terrassa (Barcelona) |
| 2010 | Grado Magisterio + Especialidad EF | Universidad Autónoma de Barcelona (UAB)

### 5.5 Habilidades y tecnologías
Mostrar con **iconos o logos** agrupados por categoría (buscar logos a corde con la estetica de la web):

- **QA y testing:** Cypress, Selenium, testing manual (Backend, Frontend, Backoffice), planes de prueba.
- **Desarrollo de videojuegos:** Unreal Engine, Unity, Godot, Android, Linux, Apple, Windows.
- **Desarrollo web y bases de datos:** PHP, MySQL, MongoDB.
- **Herramientas y metodologías:** Agile, GitHub, Jenkins, Trello, Slack, Claude Code.
- **Habilidades personales:** gestión de producto, coordinación entre equipos, liderazgo de QA, formación y docencia.
- Icluir en elta sección el video `/videos/video_loop_habilidades.mp4`

### 5.6 Proyectos (videojuegos)
- Se presentan en fichas, una para cada juego, se puede pasar de una a otra deslizando a derecha e izquierda, al llegar a la última sigue dando la vuelta. Consultar detalle diseño propuesto en: https://www.figma.com/board/Wgcf9OCbl0Oz8h3pU3TKgE/targetas_juegos_ejemplos?node-id=0-1&t=eOQOYORbWoRJ5Yog-1

- Cada tarjeta: título, video en loop, motor usado con el logo(Unreal / Unity / Godot), fecha indicio, fecha fin, descripción corta y botón detalle que abre la parte del portolio ese juego en una vista nueva.
- Proyectos: 
  - Proyecto 1:
    - Nombre juego: Echos de un futuro pasado
    - video corto:`videos/ecos_video_corto_loop.mp4`
    - Motor:Godot (mostrar con logo)
    - Plataforma: Android (mostrar con logo)
    - Tiempo invertido: 6 dias (mostrar con logo calendario)
    - Fecha inicio: 3 noviembre 2025
    - Fecha fin: 9 noviempre 2025
    - Pequeña descripción: Creado con GODOT durante una Jam de 6 días. Está protagonizado por una chica quiere descubrir quien es en realidad.
    
   - Proyecto 2:
    - Nombre juego: MitoCat
    - video corto: `videos/mitocat_video_corto_loop.mp4`
    - Motor: Unity (mostrar con logo)
    - Plataforma: Windows, Linux y Mac (mostrar con logos)
    - Tiempo invertido: 5 meses (mostrar con logo calendario)
    - Fecha inicio: diciembre 2025
    - Fecha fin: mayo 2026
    - Pequeña descripción: Es una aventura basada en la Mitología Catalana, donde cada personaje tiene su propia historia y desafío.
    
  - Proyecto 3:
    - Nombre juego: Feminist
    - video corto: `videos/feminist_video_corto_loop.mp4` 
    - Motor: Unreal (mostrar con logo)
    - Platagorma: Android (mostrar con logo)
    - Tiempo invertido: 3 meses (mostrar con logo calendario)
    - Fecha inicio: julio 2026
    - Fecha fin: octubre 2026
    - Pequeña descripción: Feminist, un videojuego reivindicativo y feminista.
     

- Al pulsar de botón de "Saver más" se abre la página de detalle del proyecto con capturas, vídeo de gameplay y enlace para jugar y una descripción más amplia. Extraer toda la informació e imagenes de la pagina de itch.io de cada juego, pero adaptarlo a la estetica del portfolio. Los videos estan especidicados en la sección videos de este documento. A continuacion ponego el enlace de itch.io de cada proyeto:
  - Proyecto 1: Ecos de un futuro pasado https://mireiaguila9.itch.io/ecos
  - Proyecto 2: MitoCat https://mireiaguila9.itch.io/mitocat
  - Proyecto 3 : Feminist https://mireiaguila9.itch.io/feminist



   
- Enlace a mi perfil de itch.io: https://mireiaguila9.itch.io/

### 5.7 Cómo hice esta web
- Sección breve que explique que la web se ha construido con **Claude Code** y agentes de IA.
- Explicar mi proceso: planificación del proyecto, instrucciones a los agentes (CLAUDE.md, Portfolio.md), uso de skills, construcción por partes y revisión de cada paso.
- Destacar mi papel como QA: revisión, pruebas en distintos dispositivos y control de calidad del resultado.
- Enlace al **repositorio de GitHub** del proyecto, para que se pueda ver el código y los archivos de instrucciones.
- Tono cercano y claro, no excesivamente técnico.

### 5.8 Contacto
- Email: mireiaguila@gmail.com
- LinkedIn: https://www.linkedin.com/in/mireia-gutiérrez-águila-qatester-pm
- itch.io: https://mireiaguila9.itch.io/
- GitHub: https://github.com/MireiaGutierrezAguila
- Opcional: formulario de contacto mediante un servicio gratuito (p. ej. Formspree).
- Botón para **descargar mi CV en PDF** (`/cv-mireia-gutierrez.pdf`). 
- **No mostrar** el número de teléfono ni datos de las referencias en la web pública.

### 5.8 Pie de página (footer)
- Copyright, enlaces a redes y botón para volver arriba.

## 6. Vídeo

- **Loops cortos (~40 s):** en la carpeta `videos/`. Se usan en las tarjetas de proyecto.
  - Reproducción automática, sin sonido, en bucle y sin controles.
  - Solo se reproducen cuando la tarjeta es visible en pantalla (o al pasar el ratón, en escritorio).
  - Imagen de portada (poster) mientras cargan.
  - Optimizados: MP4 (H.264), máx. 720p, sin audio, menos de 5 MB cada uno.
- **Vídeos largos (gameplays, hasta ~8 min):** alojados en **YouTube** e insertados en la página de detalle de cada proyecto.
  - Carga diferida: mostrar una miniatura con botón de play y cargar el reproductor solo al hacer clic.
  - Enlaces:

    - Enlace video MitoCat:https://youtu.be/KDDkfI_Yom4
    - Enlace video  Feminist: https://youtu.be/xuc37u4N7Q0
    - Enlace video Ecos: https://youtu.be/esFK2ao73F0

## 7. Estilo visual

Estilo **futurista / sci-fi con colores neón sobre fondo oscuro**, inspirado en interfaces de videojuegos (HUD).
Referencias visuales: `images/paleta_colores_1.jpeg` , `images/paleta_colores_2.jpeg` y `images/paleta_colores_3.jpeg`. Consúltalas para captar el ambiente general.

- Colores (aproximados; extrae los tonos exactos de las imágenes de referencia y propónmelos antes de aplicarlos):
  - Fondo principal (casi negro): `#0A0A12`
  - Fondo de tarjetas/secciones: `#14121F`
  - Magenta neón (color principal): `#E03CF0`
  - Cian neón (secundario, enlaces): `#00E5FF`
  - Verde turquesa (acentos): `#1DE9B6`
  - Violeta: `#7C4DFF`
  - Naranja/ámbar (detalles puntuales): `#FF9A3C`
  - Texto principal: `#EDEAF5`
  - Texto secundario: `#A9A4BF`
- Efectos: brillos (glow) sutiles en bordes y botones, líneas y formas geométricas tipo HUD, degradados entre magenta, violeta y cian.
- Los colores neón se usan como **acentos**, no para bloques grandes de texto. El texto debe ser siempre legible, con buen contraste.
- La web es **oscura por defecto** (no hace falta modo claro).
- Animaciones suaves y sutiles, sin sobrecargar.

- Modo oscuro:  sí
- Referencias de webs que me gustan:
  - https://aikah.robertoattanasio.com/en
  - https://jimo.ai/product/ai
  - https://www.raomuhammadhamza.tech/ (esta me gusta pero entiendo que es demasiado complicada)

Añade un efecto de estela al cursor (cursor trail) usando canvas:
- Partículas pequeñas que siguen al ratón y se desvanecen suavemente.
- Usa los colores del proyecto.
- Que sea sutil y no afecte al rendimiento.
- Desactívalo en dispositivos táctiles y si el usuario tiene activado prefers-reduced-motion.
- Que no bloquee los clics en los elementos de la web.
- Ponlo en un archivo aparte: js/cursor-trail.js

## 8. Contenido disponible

- Foto de perfil: `images/foto_mireia_principal.avif`
- Logos de tecnologías:  usar iconos libres adaptdos al diseño.
- Imágenes de proyectos: usar info e imagenes de itch.io de cada proyecto (especificadas en apartado proyectos)
- Vídeos:  `/videos` o youtube(especificados en el apartado videos)
- Textos: los de este documento. Claude puede pulirlos y usar textos provisionales donde falte información.

## 9. Forma de trabajar

- Responde siempre en español.
- Antes de programar, **propón un plan** con los pasos y espera a que lo apruebe.
- Construye la web **por partes**, sección a sección, y espera mi revisión antes de pasar a la siguiente.
- Si falta información, pregúntame en lugar de inventarla.
- Explica brevemente los cambios que hagas, porque estoy aprendiendo.
