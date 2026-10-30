// Carrusel circular de Proyectos: una tarjeta grande en el centro y las otras asomando a los lados.
// Se cambia de juego con flechas, puntos, teclado, tocando una tarjeta lateral o deslizando.
// Sin JavaScript las tarjetas quedan apiladas (el HTML ya trae todo el contenido).
// Depende de js/main.js (función t de traducciones). Solo se reproduce el vídeo de la tarjeta central.

(function () {
  const carrusel = document.querySelector('.carrusel');
  if (!carrusel) return;

  const pista = carrusel.querySelector('.carrusel__pista');
  const juegos = [...pista.querySelectorAll('.juego')];
  const total = juegos.length;
  const videos = juegos.map((juego) => juego.querySelector('video'));
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  // La tarjeta en primer plano al cargar es la que lleva data-inicial en el HTML (la primera si ninguna)
  let actual = Math.max(0, juegos.findIndex((juego) => juego.hasAttribute('data-inicial')));
  let visible = false; // si el carrusel está en pantalla
  // Con "reducir movimiento" los vídeos arrancan en pausa: se ve el póster y se reproduce a petición
  const pausadoPorUsuario = juegos.map(() => movimientoReducido.matches);

  carrusel.classList.add('carrusel--activo');

  function crear(etiqueta, clase) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    return elemento;
  }

  // ---------- Controles: flechas, puntos y aviso para lectores de pantalla ----------
  const controles = crear('div', 'carrusel__controles');
  const anterior = crear('button', 'carrusel__flecha carrusel__flecha--anterior');
  const siguiente = crear('button', 'carrusel__flecha carrusel__flecha--siguiente');
  anterior.type = siguiente.type = 'button';
  const puntos = crear('div', 'carrusel__puntos');
  const botonesPunto = juegos.map((_, i) => {
    const punto = crear('button', 'carrusel__punto');
    punto.type = 'button';
    punto.addEventListener('click', () => ir(i));
    puntos.appendChild(punto);
    return punto;
  });
  const aviso = crear('p', 'solo-lectores');
  aviso.setAttribute('aria-live', 'polite');
  controles.append(anterior, puntos, siguiente, aviso);
  carrusel.appendChild(controles);

  anterior.addEventListener('click', () => ir(actual - 1));
  siguiente.addEventListener('click', () => ir(actual + 1));

  // ---------- Botón de pausa de cada vídeo (WCAG 2.2.2: todo movimiento largo se puede parar) ----------
  const botonesPausa = juegos.map((juego, i) => {
    const boton = crear('button', 'juego__pausa');
    boton.type = 'button';
    boton.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path class="juego__pausa-pausa" d="M6 5h4v14H6zM14 5h4v14h-4z"/>' +
      '<path class="juego__pausa-play" d="M7 4l13 8-13 8z"/></svg>';
    boton.addEventListener('click', () => {
      pausadoPorUsuario[i] = !pausadoPorUsuario[i];
      sincronizarVideos();
    });
    juego.querySelector('.juego__video').appendChild(boton);
    return boton;
  });

  // ---------- Posición de cada tarjeta ----------
  function colocar() {
    juegos.forEach((juego, i) => {
      const distancia = (i - actual + total) % total;
      const posicion = distancia === 0 ? 'centro' : distancia === 1 ? 'der' : distancia === total - 1 ? 'izq' : 'oculta';
      juego.dataset.pos = posicion;
      // Las tarjetas laterales son solo un adelanto: su contenido no se puede enfocar ni leer.
      // Pulsar la tarjeta entera sí cambia de juego (el clic llega al <article>, no a lo de dentro)
      juego.querySelector('.juego__contenido').inert = posicion !== 'centro';
    });
  }

  function ir(indice, avisar = true) {
    actual = (indice + total) % total;
    colocar();
    sincronizarVideos();
    pintarEstado();
    if (avisar) aviso.textContent = textoEstado();
  }

  const tituloDe = (i) => juegos[i].querySelector('.juego__titulo').textContent.trim();
  const textoEstado = () =>
    t('proy.estado').replace('{n}', actual + 1).replace('{total}', total).replace('{titulo}', tituloDe(actual));

  // Etiquetas y estado de los controles (se repite al cambiar de idioma)
  function pintarEstado() {
    anterior.setAttribute('aria-label', t('proy.anterior'));
    siguiente.setAttribute('aria-label', t('proy.siguiente'));
    botonesPunto.forEach((punto, i) => {
      punto.setAttribute('aria-label', t('proy.irA').replace('{n}', i + 1) + ': ' + tituloDe(i));
      if (i === actual) punto.setAttribute('aria-current', 'true');
      else punto.removeAttribute('aria-current');
    });
    botonesPausa.forEach((boton, i) => {
      boton.dataset.pausado = String(pausadoPorUsuario[i]);
      boton.setAttribute('aria-label', t(pausadoPorUsuario[i] ? 'proy.reproducir' : 'proy.pausar'));
    });
  }

  // ---------- Vídeos: solo el de la tarjeta central, con el carrusel a la vista ----------
  const debeReproducir = (i) => i === actual && visible && !pausadoPorUsuario[i] && !document.hidden;

  function sincronizarVideos() {
    videos.forEach((video, i) => {
      if (debeReproducir(i)) {
        const promesa = video.play();
        if (promesa) {
          promesa
            // WebKit y Firefox pueden ignorar un pause() pedido mientras el play() aún carga:
            // al terminar de cargar se vuelve a comprobar si ese vídeo debe seguir sonando
            .then(() => {
              if (!debeReproducir(i)) video.pause();
            })
            .catch(() => {}); // el navegador puede negar la reproducción automática
        }
      } else {
        video.pause();
      }
    });
    pintarEstado();
  }

  new IntersectionObserver(
    (entradas) => {
      visible = entradas[0].isIntersecting;
      sincronizarVideos();
    },
    { threshold: 0.35 }
  ).observe(carrusel);
  document.addEventListener('visibilitychange', sincronizarVideos);

  // ---------- Deslizar (táctil y ratón) y tocar una tarjeta lateral ----------
  let inicio = null;
  let arrastrando = false;

  pista.addEventListener('pointerdown', (evento) => {
    if (evento.button !== 0) return;
    inicio = { x: evento.clientX, y: evento.clientY };
    arrastrando = false;
  });
  pista.addEventListener('pointermove', (evento) => {
    if (inicio && Math.abs(evento.clientX - inicio.x) > 10) arrastrando = true;
  });
  pista.addEventListener('pointerup', (evento) => {
    if (!inicio) return;
    const dx = evento.clientX - inicio.x;
    const dy = evento.clientY - inicio.y;
    inicio = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) ir(actual + (dx < 0 ? 1 : -1));
  });
  pista.addEventListener('pointercancel', () => {
    inicio = null;
  });
  // Firefox y WebKit inician su arrastre nativo de enlaces e imágenes y cancelan el deslizamiento
  pista.addEventListener('dragstart', (evento) => evento.preventDefault());
  // Tras un deslizamiento no debe saltar el clic (ni abrir un enlace ni elegir una tarjeta)
  pista.addEventListener(
    'click',
    (evento) => {
      if (arrastrando) {
        evento.preventDefault();
        evento.stopPropagation();
        arrastrando = false;
        return;
      }
      const juego = evento.target.closest('.juego');
      if (juego && juego.dataset.pos !== 'centro' && juego.dataset.pos !== 'oculta') {
        ir(juegos.indexOf(juego));
      }
    },
    true
  );

  carrusel.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') ir(actual - 1);
    else if (evento.key === 'ArrowRight') ir(actual + 1);
    else return;
    evento.preventDefault();
  });

  // ---------- Arranque ----------
  colocar();
  pintarEstado();
  // main.js cambia el atributo lang al cambiar de idioma, después de actualizar los textos
  new MutationObserver(pintarEstado).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
})();
