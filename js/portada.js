// Portada (solo index.html):
//  1. Pausa el fondo animado cuando la portada no se ve (css/portada.css lo anima con .portada--fuera).
//  2. Aparición del nombre: las letras salen una a una, en orden mezclado y difuminadas, cuando se abre
//     el telón de la entrada (js/intro.js). Al terminar, el nombre vuelve a ser texto normal.
// Sin JavaScript, con «reducir movimiento» o cuando no hay entrada (se llega a una sección concreta o
// se vuelve atrás), el nombre se ve directamente.

(function () {
  const raiz = document.documentElement;
  const portada = document.querySelector('.seccion--portada');
  const nombre = document.querySelector('.portada__nombre');

  // ---------- Fondo: se pausa fuera de pantalla ----------
  if (portada && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      portada.classList.toggle('portada--fuera', !entrada.isIntersecting);
    }).observe(portada);
  }

  // ---------- Nombre: letras mezcladas ----------
  // js/intro.js pone data-intro="si" cuando la entrada se va a ver
  if (!nombre || raiz.dataset.intro !== 'si') return;

  const DURACION_TOTAL = 2300; // ms hasta devolver el nombre a texto normal (1,0 s de reparto + 0,6 s de cada letra + margen)
  const REPARTO = 1.0;         // segundos en los que van saliendo las letras
  const original = nombre.innerHTML;
  const letras = [];

  // Cada palabra va en un span que no se parte por línea (si no, un salto de línea podría caer dentro de la palabra)
  function partir(nodo) {
    [...nodo.childNodes].forEach((hijo) => {
      if (hijo.nodeType === Node.TEXT_NODE) {
        const fragmento = document.createDocumentFragment();
        hijo.textContent.split(/(\s+)/).forEach((trozo) => {
          if (!trozo) return;
          if (/^\s+$/.test(trozo)) {
            fragmento.append(trozo);
            return;
          }
          const palabra = document.createElement('span');
          palabra.className = 'portada__palabra';
          [...trozo].forEach((caracter) => {
            const letra = document.createElement('span');
            letra.className = 'portada__letra';
            letra.textContent = caracter;
            palabra.append(letra);
            letras.push(letra);
          });
          fragmento.append(palabra);
        });
        hijo.replaceWith(fragmento);
      } else if (hijo.nodeType === Node.ELEMENT_NODE) {
        partir(hijo);
      }
    });
  }

  // El nombre completo para lectores de pantalla mientras las letras están partidas
  nombre.setAttribute('aria-label', nombre.textContent.trim());
  partir(nombre);

  // Orden mezclado pero siempre el mismo (generador sencillo con semilla fija: no es aleatorio de verdad)
  let semilla = 7;
  const azar = () => {
    semilla = (semilla * 16807) % 2147483647;
    return semilla / 2147483647;
  };
  const orden = letras.map((_, i) => i);
  for (let i = orden.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  orden.forEach((indice, posicion) => {
    const retraso = (posicion / Math.max(1, orden.length - 1)) * REPARTO;
    letras[indice].style.setProperty('--retraso', `${retraso.toFixed(2)}s`);
  });

  function restaurar() {
    nombre.innerHTML = original;
    nombre.removeAttribute('aria-label');
    nombre.classList.remove('portada__nombre--escribiendo');
  }

  function empezar() {
    nombre.classList.add('portada__nombre--escribiendo');
    setTimeout(restaurar, DURACION_TOTAL);
  }

  // Las letras empiezan a salir cuando se abre el telón (la entrada quita la clase intro-activa)
  if (!raiz.classList.contains('intro-activa')) {
    empezar();
  } else {
    const espera = new MutationObserver(() => {
      if (!raiz.classList.contains('intro-activa')) {
        espera.disconnect();
        empezar();
      }
    });
    espera.observe(raiz, { attributes: true, attributeFilter: ['class'] });
  }
})();
