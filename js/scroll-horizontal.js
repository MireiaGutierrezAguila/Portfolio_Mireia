// Scroll horizontal de la sección Habilidades.
// En pantallas medianas y grandes, la sección se queda fija mientras el scroll vertical
// desplaza sus tarjetas hacia la derecha. Después las tarjetas siguen saliendo por la izquierda
// mientras se desvanecen y aparece el vídeo grande; tras una pausa, la página sigue bajando.
// En móvil, con movimiento reducido o sin JavaScript, todo va uno debajo de otro.
//
// Cómo funciona: la sección se hace más alta (alto de pantalla + todo lo que hay que recorrer)
// y su contenido queda fijo (position: sticky) mientras se baja por ese espacio extra.
// Este script solo calcula unos valores y los pasa al CSS, que mueve y desvanece las piezas:
//   --recorrido: píxeles hasta que la última tarjeta llega al margen derecho
//   --alto-extra: espacio de scroll total que se añade a la sección
//   --x:         píxeles que se han desplazado las tarjetas
//   --progreso:  de 0 a 1 mientras se recorren las tarjetas (barra de avance)
//   --salida:    de 0 a 1, las tarjetas y el indicador se desvanecen
//   --video:     de 0 a 1, el vídeo aparece

const seccionHorizontal = document.querySelector('.seccion--horizontal');

if (seccionHorizontal) {
  const marco = seccionHorizontal.querySelector('.horizontal__marco');
  const carril = seccionHorizontal.querySelector('.horizontal__carril');
  const paneles = [...carril.children];
  const contador = seccionHorizontal.querySelector('.horizontal__contador');
  const video = seccionHorizontal.querySelector('video');
  const cabecera = document.querySelector('.cabecera');

  // Solo se activa con pantalla suficiente (no en móvil ni en horizontal con poca altura)
  // y si la persona no ha pedido menos movimiento
  const condiciones = window.matchMedia(
    '(min-width: 768px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'
  );

  let activo = false;
  let recorrido = 0;       // hasta que la última tarjeta llega al margen derecho
  let salida = 0;          // lo que siguen desplazándose hasta que todas las tarjetas han salido
  let pausa = 0;           // scroll con el vídeo ya visible y quieto
  let actualizacionPendiente = false;
  let videoEnMarcha = false;

  const limitar = (valor) => Math.min(1, Math.max(0, valor));

  function medir() {
    // Se mide desde el último panel y no desde el ancho del contenedor, porque Safari y Firefox
    // calculan ese ancho con unos 1700 px de más y los paneles se pasarían de largo
    const ultimo = paneles[paneles.length - 1];
    const margenDerecho = parseFloat(getComputedStyle(carril).paddingRight);
    recorrido = Math.max(0, ultimo.offsetLeft + ultimo.offsetWidth + margenDerecho - marco.clientWidth);
    // Las tarjetas se desvanecen mientras salen, así que no hace falta que recorran todo el ancho:
    // con 60 % basta y se ahorra scroll antes de que aparezca el vídeo
    salida = Math.round(marco.clientWidth * 0.6);
    pausa = Math.round(marco.clientHeight * 0.1);

    seccionHorizontal.style.setProperty('--recorrido', `${recorrido}px`);
    seccionHorizontal.style.setProperty('--alto-extra', `${recorrido + salida + pausa}px`);
  }

  // El vídeo solo se reproduce mientras se ve. Con el scroll horizontal activo lo decide este
  // script (main.js lo ignora en ese caso), porque aquí "estar en pantalla" no basta:
  // el vídeo ocupa su sitio desde el principio, pero es invisible hasta el final
  function controlarVideo(debeReproducir) {
    if (!video || debeReproducir === videoEnMarcha) return;
    videoEnMarcha = debeReproducir;
    if (debeReproducir) {
      video.play().catch(() => {}); // el navegador puede bloquearlo; no es un error
    } else {
      video.pause();
    }
  }

  function marcoALaVista() {
    const caja = marco.getBoundingClientRect();
    return caja.bottom > cabecera.offsetHeight && caja.top < window.innerHeight;
  }

  // Convierte la posición del scroll en los valores que usa el CSS
  function actualizar() {
    actualizacionPendiente = false;
    if (!activo) return;

    // Todo empieza cuando la sección llega justo bajo la cabecera fija
    const avance = Math.max(0, cabecera.offsetHeight - seccionHorizontal.getBoundingClientRect().top);
    const progreso = recorrido > 0 ? limitar(avance / recorrido) : 1;
    const despuesDelUltimo = avance - recorrido;

    // Las tarjetas se desvanecen en los primeros 60 % de su salida; el vídeo aparece entre el 35 % y el 85 %
    const tarjetasFuera = limitar(despuesDelUltimo / (salida * 0.6));
    const videoVisible = limitar((despuesDelUltimo - salida * 0.35) / (salida * 0.5));

    seccionHorizontal.style.setProperty('--x', `${Math.min(avance, recorrido + salida).toFixed(1)}px`);
    seccionHorizontal.style.setProperty('--progreso', progreso.toFixed(4));
    seccionHorizontal.style.setProperty('--salida', tarjetasFuera.toFixed(4));
    seccionHorizontal.style.setProperty('--video', videoVisible.toFixed(4));

    contador.textContent = `${Math.round(progreso * (paneles.length - 1)) + 1} / ${paneles.length}`;
    controlarVideo(videoVisible > 0.3 && marcoALaVista());
  }

  // El scroll se dispara muchas veces por segundo: se actualiza como mucho una vez por fotograma
  function programarActualizacion() {
    if (!activo || actualizacionPendiente) return;
    actualizacionPendiente = true;
    requestAnimationFrame(actualizar);
  }

  function remedir() {
    if (!activo) return;
    medir();
    programarActualizacion();
  }

  function activar(debeEstarActivo) {
    activo = debeEstarActivo;
    seccionHorizontal.classList.toggle('horizontal-activo', activo);

    if (activo) {
      medir();
      actualizar();
    } else {
      ['--recorrido', '--alto-extra', '--x', '--progreso', '--salida', '--video'].forEach((nombre) => {
        seccionHorizontal.style.removeProperty(nombre);
      });
      controlarVideo(false);
    }
  }

  // Con el teclado: si el foco llega a un elemento que está fuera de la vista,
  // se baja la página hasta el punto en que esa tarjeta queda visible
  carril.addEventListener('focusin', (evento) => {
    if (!activo) return;

    marco.scrollLeft = 0; // el navegador intenta mover el contenido por su cuenta: lo evitamos
    const panel = evento.target.closest('.panel');
    if (!panel) return;

    const margenIzquierdo = parseFloat(getComputedStyle(carril).paddingLeft);
    const desplazamiento = Math.min(recorrido, Math.max(0, panel.offsetLeft - margenIzquierdo));
    const inicio = window.scrollY + seccionHorizontal.getBoundingClientRect().top - cabecera.offsetHeight;
    window.scrollTo({ top: inicio + desplazamiento, behavior: 'instant' });
  });

  condiciones.addEventListener('change', () => activar(condiciones.matches));
  window.addEventListener('scroll', programarActualizacion, { passive: true });

  // Si cambia el tamaño de la ventana o de las letras al cargar, se vuelve a medir
  new ResizeObserver(remedir).observe(marco);
  new ResizeObserver(remedir).observe(carril);
  document.fonts?.ready.then(remedir);

  activar(condiciones.matches);
}
