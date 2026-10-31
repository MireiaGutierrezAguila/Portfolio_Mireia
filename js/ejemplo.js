// Página de ejemplo de documentación (ejemplos/*.html):
//  1. Botones "Expandir todo" y "Contraer todo". Los apartados son <details> nativos y funcionan sin
//     JavaScript; el script solo muestra los dos botones (vienen con hidden en el HTML).
//  2. Visor de imágenes: cada captura es un enlace a su imagen (sin JS se abre sola) y con JS se ve
//     ampliada en un <dialog> modal. Los estilos .visor* están en css/ejemplo.css.
// Depende de js/main.js (función t de traducciones, que se carga antes).

(function () {
  // ---------- Expandir / contraer todo ----------
  const botonExpandir = document.getElementById('doc-expandir');
  const botonContraer = document.getElementById('doc-contraer');

  if (botonExpandir && botonContraer) {
    const cambiarTodos = (abrir) => {
      document.querySelectorAll('.doc-desplegable').forEach((apartado) => {
        apartado.open = abrir;
      });
    };

    botonExpandir.addEventListener('click', () => cambiarTodos(true));
    botonContraer.addEventListener('click', () => cambiarTodos(false));
    botonExpandir.hidden = false;
    botonContraer.hidden = false;
  }

  // ---------- Visor de imágenes ----------
  const enlaces = [...document.querySelectorAll('.doc-ampliar')];
  const visor = document.createElement('dialog');
  if (!enlaces.length || typeof visor.showModal !== 'function') return;

  let actual = 0;
  let origen = null; // el enlace que abrió el visor, para devolverle el foco al cerrar

  const marco = document.createElement('div');
  const imagen = document.createElement('img');
  const pie = document.createElement('p');
  const contador = document.createElement('span');
  const anterior = document.createElement('button');
  const siguiente = document.createElement('button');
  const cerrar = document.createElement('button');

  visor.className = 'visor';
  marco.className = 'visor__marco';
  imagen.className = 'visor__img';
  imagen.lang = 'en'; // las descripciones de las capturas están en inglés, como el documento
  pie.className = 'visor__pie';
  pie.lang = 'en';
  const barra = document.createElement('div');
  barra.className = 'visor__barra';
  contador.className = 'visor__contador';
  contador.setAttribute('aria-live', 'polite');
  [[anterior, '‹'], [siguiente, '›'], [cerrar, '✕']].forEach(([boton, signo]) => {
    boton.type = 'button';
    boton.className = 'visor__boton';
    boton.textContent = signo;
  });
  marco.append(imagen);
  barra.append(contador, anterior, siguiente, cerrar);
  visor.append(marco, pie, barra);
  document.body.appendChild(visor);

  // Textos que dependen del idioma (se repite al cambiarlo)
  function pintarTextos() {
    visor.setAttribute('aria-label', t('juego.visor'));
    anterior.setAttribute('aria-label', t('juego.capAnterior'));
    siguiente.setAttribute('aria-label', t('juego.capSiguiente'));
    cerrar.setAttribute('aria-label', t('juego.cerrar'));
  }

  // Una imagen ancha (capturas de pantallas enteras) se muestra a 900 px como mínimo y el visor se
  // desplaza: en un móvil, encogida a 360 px no se podría leer
  imagen.addEventListener('load', () => {
    imagen.style.setProperty('--ancho-natural', `${imagen.naturalWidth}px`);
    imagen.classList.toggle('visor__img--ancha', imagen.naturalWidth > 900);
    marco.scrollTo(0, 0);
  });

  function mostrar(indice) {
    const total = enlaces.length;
    actual = (indice + total) % total;
    const enlace = enlaces[actual];
    imagen.src = enlace.href;
    imagen.alt = enlace.querySelector('img').alt;
    const texto = enlace.closest('figure')?.querySelector('figcaption')?.innerText ?? '';
    pie.textContent = texto.replace(/\s*\n\s*/g, ' · ').trim();
    pie.hidden = !pie.textContent;
    contador.textContent = `${actual + 1} / ${total}`;
    // se van cargando las vecinas para que pasar de una a otra sea instantáneo
    [actual - 1, actual + 1].forEach((i) => { new Image().src = enlaces[(i + total) % total].href; });
  }

  // Chromium deja enfocar con el teclado la zona desplazable cuando la imagen es más grande que la
  // ventana; al pasar a una imagen que cabe, esa zona pierde el foco, este cae a la página y las
  // flechas dejan de llegar al visor. Por eso el foco empieza en el botón de cerrar y, si se pierde,
  // se recoge ahí.
  function recogerFoco() {
    requestAnimationFrame(() => {
      if (visor.open && !visor.contains(document.activeElement)) cerrar.focus();
    });
  }

  enlaces.forEach((enlace, i) => {
    enlace.addEventListener('click', (evento) => {
      evento.preventDefault();
      origen = enlace;
      mostrar(i);
      visor.showModal();
      cerrar.focus();
      document.body.classList.add('visor-abierto');
    });
  });

  anterior.addEventListener('click', () => mostrar(actual - 1));
  siguiente.addEventListener('click', () => mostrar(actual + 1));
  cerrar.addEventListener('click', () => visor.close());
  visor.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') mostrar(actual - 1);
    else if (evento.key === 'ArrowRight') mostrar(actual + 1);
    else return;
    recogerFoco();
  });
  imagen.addEventListener('load', recogerFoco);
  // Pulsar el fondo (fuera de la imagen y la barra) lo cierra
  visor.addEventListener('click', (evento) => {
    if (evento.target === visor) visor.close();
  });
  visor.addEventListener('close', () => {
    document.body.classList.remove('visor-abierto');
    origen?.focus();
  });
  imagen.addEventListener('dragstart', (evento) => evento.preventDefault());

  pintarTextos();
  // main.js cambia el atributo lang al cambiar de idioma, después de actualizar los textos
  new MutationObserver(pintarTextos).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
})();
