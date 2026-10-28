// Comportamiento general de la web: menú hamburguesa, idioma y pie de página.
// Depende de js/traducciones.js, que se carga antes que este archivo.

const IDIOMAS = ['es', 'ca', 'en'];
const CLAVE_IDIOMA = 'idioma';
let idiomaActual = 'es';

// ---------- Utilidades ----------

// Devuelve el texto traducido; si falta, usa el español para no dejar huecos
function t(clave) {
  return TRADUCCIONES[idiomaActual][clave] ?? TRADUCCIONES.es[clave] ?? clave;
}

// localStorage puede fallar (navegación privada, cookies bloqueadas): nunca debe romper la web
function leerPreferencia() {
  try {
    return localStorage.getItem(CLAVE_IDIOMA);
  } catch {
    return null;
  }
}

function guardarPreferencia(idioma) {
  try {
    localStorage.setItem(CLAVE_IDIOMA, idioma);
  } catch {
    // Sin almacenamiento: el idioma se mantiene solo durante esta visita
  }
}

// ---------- Menú hamburguesa ----------

const botonMenu = document.querySelector('.cabecera__menu');
const navegacion = document.querySelector('#navegacion');

function menuAbierto() {
  return botonMenu.getAttribute('aria-expanded') === 'true';
}

function actualizarEtiquetaMenu() {
  botonMenu.setAttribute('aria-label', t(menuAbierto() ? 'nav.cerrar' : 'nav.abrir'));
}

function cambiarMenu(abrir) {
  botonMenu.setAttribute('aria-expanded', String(abrir));
  document.body.classList.toggle('menu-abierto', abrir);
  actualizarEtiquetaMenu();
}

botonMenu.addEventListener('click', () => cambiarMenu(!menuAbierto()));

// Al elegir una sección, el menú se cierra
navegacion.querySelectorAll('.nav__enlace').forEach((enlace) => {
  enlace.addEventListener('click', () => cambiarMenu(false));
});

// La tecla Esc cierra el menú y devuelve el foco al botón
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && menuAbierto()) {
    cambiarMenu(false);
    botonMenu.focus();
  }
});

// Si se agranda la ventana hasta la versión de escritorio, el menú desplegable ya no tiene sentido
window.matchMedia('(min-width: 1200px)').addEventListener('change', (consulta) => {
  if (consulta.matches) cambiarMenu(false);
});

// ---------- Idioma ----------

function aplicarIdioma(idioma) {
  idiomaActual = IDIOMAS.includes(idioma) ? idioma : 'es';
  document.documentElement.lang = idiomaActual;

  document.querySelectorAll('[data-i18n]').forEach((elemento) => {
    elemento.textContent = t(elemento.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((elemento) => {
    elemento.setAttribute('aria-label', t(elemento.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((elemento) => {
    elemento.setAttribute('alt', t(elemento.dataset.i18nAlt));
  });
  document.querySelectorAll('[data-i18n-content]').forEach((elemento) => {
    elemento.setAttribute('content', t(elemento.dataset.i18nContent));
  });

  document.querySelectorAll('.idiomas__boton').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.dataset.idioma === idiomaActual));
  });

  // El botón del menú tiene su propia etiqueta, que depende de si está abierto o cerrado
  actualizarEtiquetaMenu();
}

// Idioma inicial: el elegido antes por la persona; si no, el de su navegador.
// Si el navegador usa un idioma que no tenemos (francés, alemán…), se muestra en inglés.
function idiomaInicial() {
  const guardado = leerPreferencia();
  if (IDIOMAS.includes(guardado)) return guardado;

  const navegador = (navigator.language || 'es').slice(0, 2).toLowerCase();
  return IDIOMAS.includes(navegador) ? navegador : 'en';
}

document.querySelectorAll('.idiomas__boton').forEach((boton) => {
  boton.addEventListener('click', () => {
    aplicarIdioma(boton.dataset.idioma);
    guardarPreferencia(idiomaActual);
  });
});

aplicarIdioma(idiomaInicial());

// ---------- Vídeos ----------

// Los vídeos con data-reproducir-visible solo se reproducen mientras se ven en pantalla,
// para no gastar batería ni datos. Con movimiento reducido no se reproducen: queda el póster.
const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !prefiereMenosMovimiento) {
  const observadorVideos = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      // Con el scroll horizontal activo, js/scroll-horizontal.js decide cuándo se reproduce
      if (entrada.target.closest('.horizontal-activo')) return;

      if (entrada.isIntersecting) {
        entrada.target.play().catch(() => {}); // el navegador puede bloquearlo; no es un error
      } else {
        entrada.target.pause();
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('video[data-reproducir-visible]').forEach((video) => {
    observadorVideos.observe(video);
  });
}

// ---------- Pie de página ----------

// El año del copyright se actualiza solo
document.querySelector('.pie__anio').textContent = new Date().getFullYear();
