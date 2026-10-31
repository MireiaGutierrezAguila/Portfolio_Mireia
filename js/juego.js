// Páginas de detalle de los juegos (juegos/*.html): vídeo de YouTube con carga diferida y
// visor de capturas. Sin JavaScript la miniatura es un enlace a YouTube y cada captura enlaza
// a su imagen grande, así que la página sigue siendo útil.
// Depende de js/main.js (función t de traducciones, que se carga antes).

(function () {
  const nombreJuego = () => document.querySelector('.jp-hero__titulo')?.textContent.trim() ?? '';

  // ---------- Vídeo de YouTube: el iframe no existe hasta que se pulsa ----------
  // Hasta entonces la página no hace ninguna petición a YouTube (la miniatura es una imagen propia)
  document.querySelectorAll('[data-youtube]').forEach((caja) => {
    const enlace = caja.querySelector('.gameplay__enlace');
    if (!enlace) return;

    enlace.addEventListener('click', (evento) => {
      evento.preventDefault();
      const iframe = document.createElement('iframe');
      // youtube-nocookie.com: no deja cookies de seguimiento hasta que se reproduce
      iframe.src = `https://www.youtube-nocookie.com/embed/${caja.dataset.youtube}?autoplay=1&rel=0&playsinline=1`;
      iframe.title = t('juego.ytTitulo');
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      caja.classList.add('gameplay--activo');
      caja.replaceChildren(iframe);
      iframe.focus();
      // el aviso de "se carga desde YouTube" ya no tiene sentido
      document.querySelector('.gameplay__aviso')?.setAttribute('hidden', '');
    });
  });

  // ---------- Visor de capturas ----------
  const enlaces = [...document.querySelectorAll('.galeria__enlace')];
  const visor = document.createElement('dialog');
  const visorCompatible = typeof visor.showModal === 'function';
  let actual = 0;
  let origen = null; // el enlace que abrió el visor, para devolverle el foco al cerrar

  const imagen = document.createElement('img');
  const contador = document.createElement('span');
  const anterior = document.createElement('button');
  const siguiente = document.createElement('button');
  const cerrar = document.createElement('button');

  // Textos que dependen del idioma (se repite al cambiarlo)
  function pintarTextos() {
    const total = enlaces.length;
    enlaces.forEach((enlace, i) => {
      const alt = t('juego.captura')
        .replace('{juego}', nombreJuego())
        .replace('{n}', i + 1)
        .replace('{total}', total);
      enlace.querySelector('img').alt = alt;
    });
    document.querySelectorAll('iframe[title]').forEach((f) => { f.title = t('juego.ytTitulo'); });
    if (!visorCompatible || !total) return;
    visor.setAttribute('aria-label', t('juego.visor'));
    anterior.setAttribute('aria-label', t('juego.capAnterior'));
    siguiente.setAttribute('aria-label', t('juego.capSiguiente'));
    cerrar.setAttribute('aria-label', t('juego.cerrar'));
    imagen.alt = enlaces[actual].querySelector('img').alt;
  }

  function mostrar(indice) {
    const total = enlaces.length;
    actual = (indice + total) % total;
    imagen.src = enlaces[actual].href;
    imagen.alt = enlaces[actual].querySelector('img').alt;
    contador.textContent = `${actual + 1} / ${total}`;
    // se van cargando las vecinas para que pasar de una a otra sea instantáneo
    [actual - 1, actual + 1].forEach((i) => { new Image().src = enlaces[(i + total) % total].href; });
  }

  if (enlaces.length && visorCompatible) {
    visor.className = 'visor';
    imagen.className = 'visor__img';
    const barra = document.createElement('div');
    barra.className = 'visor__barra';
    contador.className = 'visor__contador';
    contador.setAttribute('aria-live', 'polite');
    [[anterior, '‹'], [siguiente, '›'], [cerrar, '✕']].forEach(([boton, signo]) => {
      boton.type = 'button';
      boton.className = 'visor__boton';
      boton.textContent = signo;
    });
    barra.append(contador, anterior, siguiente, cerrar);
    visor.append(imagen, barra);
    document.body.appendChild(visor);

    enlaces.forEach((enlace, i) => {
      enlace.addEventListener('click', (evento) => {
        evento.preventDefault();
        origen = enlace;
        mostrar(i);
        visor.showModal();
        document.body.classList.add('visor-abierto');
      });
    });

    anterior.addEventListener('click', () => mostrar(actual - 1));
    siguiente.addEventListener('click', () => mostrar(actual + 1));
    cerrar.addEventListener('click', () => visor.close());
    visor.addEventListener('keydown', (evento) => {
      if (evento.key === 'ArrowLeft') mostrar(actual - 1);
      else if (evento.key === 'ArrowRight') mostrar(actual + 1);
    });
    // Pulsar el fondo (fuera de la imagen y la barra) lo cierra
    visor.addEventListener('click', (evento) => {
      if (evento.target === visor) visor.close();
    });
    visor.addEventListener('close', () => {
      document.body.classList.remove('visor-abierto');
      origen?.focus();
    });

    // Deslizar con el dedo: izquierda = siguiente, derecha = anterior
    let inicioX = null;
    imagen.addEventListener('pointerdown', (evento) => { inicioX = evento.clientX; });
    imagen.addEventListener('pointerup', (evento) => {
      if (inicioX === null) return;
      const dx = evento.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
    });
    imagen.addEventListener('dragstart', (evento) => evento.preventDefault());
  }

  pintarTextos();
  // main.js cambia el atributo lang al cambiar de idioma, después de actualizar los textos
  new MutationObserver(pintarTextos).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
})();
