// Entrada de la portada (solo index.html): el trisquel se dibuja solo y después se abre el telón.
// Se carga en el <head>, sin defer, para poder tapar la página desde el primer fotograma.
// - Sale cada vez que se carga o se recarga la portada. No sale si se llega desde otra página a una
//   sección concreta (#hash, p. ej. «Volver a Proyectos»), ni al volver atrás con el navegador, ni con
//   «reducir movimiento». Sin JavaScript no existe: la página se ve directamente.
// - Se salta al pulsar una tecla, hacer clic, tocar o hacer scroll.
// - Mientras dura, la página queda inerte (teclado y lectores de pantalla no entran en lo que no se ve).
// - Pase lo que pase (logo que no carga, fuente lenta...), a los 15 s se quita sola: nunca bloquea la web.
// El dibujo está en js/intro-logo.js (se descarga solo si la entrada va a verse) y el estilo en css/intro.css.

(function () {
  const raiz = document.documentElement;

  // ---------- ¿Toca verla? ----------
  const navegacion = performance.getEntriesByType('navigation')[0];
  const tipo = navegacion ? navegacion.type : 'navigate';
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Al recargar sale siempre (aunque la dirección lleve una sección); al venir de otra página con una
  // sección o al volver atrás, no: ahí ya se está navegando por la web
  const llegaASeccion = location.hash && tipo !== 'reload';
  if (reducido || tipo === 'back_forward' || llegaASeccion) return;

  // ---------- Tiempos (milisegundos) ----------
  const FUENTE_MAX = 1500;     // espera máxima a la tipografía fina del texto
  const BRILLO = 5300;         // desde que empieza a dibujarse: se enciende el resplandor
  const SALIDA = 8100;         // desde que empieza a dibujarse: se abre el telón (el logo ya está completo desde los 6,1 s y se queda 2 s a la vista)
  const SEGURIDAD = 15000;     // desde el principio: se quita pase lo que pase

  let overlay = null;
  let saliendo = false;
  let terminado = false;
  const temporizadores = [];
  const EVENTOS = ['keydown', 'pointerdown', 'wheel', 'touchstart'];

  raiz.classList.add('intro-activa');
  raiz.dataset.intro = 'si'; // js/portada.js lo lee para saber que el nombre debe esperar a que se abra el telón

  function paginaInerte(inerte) {
    document.querySelectorAll('body > header, body > main, body > footer').forEach((elemento) => {
      elemento.inert = inerte;
    });
  }

  // Quita todo y deja la página como si la entrada no hubiera existido
  function terminar() {
    if (terminado) return;
    terminado = true;
    temporizadores.forEach(clearTimeout);
    EVENTOS.forEach((evento) => window.removeEventListener(evento, saltar, true));
    raiz.classList.remove('intro-activa');
    paginaInerte(false);
    overlay?.remove();
  }

  // Abre el telón: la portada aparece (y el nombre empieza a escribirse) mientras la entrada se desvanece
  function salir(rapido) {
    if (!overlay) return terminar();
    if (saliendo) return;
    saliendo = true;
    raiz.classList.remove('intro-activa');
    paginaInerte(false);
    if (rapido) overlay.classList.add('intro--rapida');
    overlay.classList.add('intro--saliendo');
    overlay.addEventListener('transitionend', (evento) => {
      if (evento.target === overlay) terminar();
    });
    temporizadores.push(setTimeout(terminar, rapido ? 500 : 1200));
  }

  // La tecla que salta la entrada no debe, además, desplazar la página (espacio, flechas, Re Pág...)
  const TECLAS_DE_SCROLL = new Set([' ', 'Spacebar', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);

  function saltar(evento) {
    if (evento.type === 'keydown' && TECLAS_DE_SCROLL.has(evento.key)) evento.preventDefault();
    salir(true);
  }

  EVENTOS.forEach((evento) => window.addEventListener(evento, saltar, { capture: true, passive: evento !== 'keydown' }));
  temporizadores.push(setTimeout(terminar, SEGURIDAD));

  // ---------- Preparar: logo + tipografía + página lista ----------
  const logoListo = new Promise((resolver, rechazar) => {
    const script = document.createElement('script');
    script.src = 'js/intro-logo.js';
    script.onload = resolver;
    script.onerror = rechazar;
    document.head.appendChild(script);
  });

  const paginaLista = new Promise((resolver) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolver);
    else resolver();
  });

  // Se espera a la letra fina (peso 300) para que el texto no cambie de aspecto en mitad de la animación
  const fuenteLista = Promise.race([
    document.fonts ? document.fonts.load('300 82px "Atkinson Hyperlegible Next"').catch(() => {}) : Promise.resolve(),
    new Promise((resolver) => setTimeout(resolver, FUENTE_MAX)),
  ]);

  Promise.all([logoListo, paginaLista, fuenteLista]).then(montar).catch(terminar);

  function montar() {
    if (terminado || saliendo) return;
    overlay = document.createElement('div');
    overlay.className = 'intro';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = window.INTRO_LOGO;
    document.body.appendChild(overlay);
    paginaInerte(true);

    // Longitud de cada trazo, para que el CSS pueda «dibujarlo» (--largo)
    overlay.querySelectorAll('.tq-aro, .tq-espiral, .tq-barrido').forEach((trazo) => {
      trazo.style.setProperty('--largo', trazo.getTotalLength());
    });
    // Estrellas y puntos se encienden escalonados entre los 4,5 y los 5,3 s (siempre igual: no es aleatorio)
    overlay.querySelectorAll('.tq-estrellas path, .tq-puntos circle').forEach((brillo, i) => {
      brillo.style.setProperty('--retraso', `${(4.5 + ((i * 37) % 100) / 100 * 0.8).toFixed(2)}s`);
    });

    // Dos fotogramas de margen para que el navegador pinte el estado inicial antes de animar
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (terminado || saliendo) return;
      overlay.classList.add('intro--dibujando');
      temporizadores.push(setTimeout(() => overlay.classList.add('intro--brillo'), BRILLO));
      temporizadores.push(setTimeout(() => salir(false), SALIDA));
    }));
  }
})();
