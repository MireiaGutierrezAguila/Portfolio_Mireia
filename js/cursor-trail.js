// Estela del cursor: partículas pequeñas que siguen al ratón y se desvanecen, dibujadas en un canvas.
// Solo se activa con ratón (no en pantallas táctiles) y sin prefers-reduced-motion. El canvas no recibe
// clics (pointer-events: none en .estela) y no hace trabajo mientras no haya partículas en pantalla.

(function () {
  const consultaRaton = window.matchMedia('(hover: hover) and (pointer: fine)');
  const consultaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Colores del proyecto (RGB): magenta claro, cian y verde turquesa
  const COLORES = ['235, 75, 166', '18, 220, 240', '43, 217, 168'];
  const MAX_PARTICULAS = 60;
  const DURACION = 700;   // milisegundos que tarda una partícula en desvanecerse
  const SEPARACION = 9;   // píxeles de recorrido del ratón entre una partícula y la siguiente
  const MAX_POR_EVENTO = 4;

  let canvas = null;
  let ctx = null;
  let ancho = 0;
  let alto = 0;
  let particulas = [];
  let fotograma = 0;      // id del requestAnimationFrame en curso (0 = parado)
  let ultimoTiempo = 0;
  let ultimoX = null;     // posición de la última partícula creada
  let ultimoY = null;
  let turnoColor = 0;

  function ajustarTamano() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // más de 2× no se nota y cuesta rendimiento
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function crearParticula(x, y) {
    if (particulas.length >= MAX_PARTICULAS) particulas.shift();
    particulas.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.03,        // deriva suave, en píxeles por milisegundo
      vy: (Math.random() - 0.5) * 0.03 - 0.008,
      radio: 1.5 + Math.random() * 2,
      color: COLORES[turnoColor++ % COLORES.length],
      edad: 0,
    });
  }

  function alMoverRaton(evento) {
    if (evento.pointerType && evento.pointerType !== 'mouse') return;
    if (ultimoX === null) {
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      return;
    }
    const dx = evento.clientX - ultimoX;
    const dy = evento.clientY - ultimoY;
    const pasos = Math.min(MAX_POR_EVENTO, Math.floor(Math.hypot(dx, dy) / SEPARACION));
    if (pasos < 1) return;
    // si el ratón fue muy rápido, las partículas se reparten por el trayecto para que no queden saltos
    for (let i = 1; i <= pasos; i++) {
      crearParticula(ultimoX + (dx * i) / pasos, ultimoY + (dy * i) / pasos);
    }
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
    if (!fotograma) {
      ultimoTiempo = performance.now();
      fotograma = requestAnimationFrame(bucle);
    }
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);
    ctx.globalCompositeOperation = 'lighter'; // las partículas solapadas se suman y brillan
    for (const p of particulas) {
      const vida = 1 - p.edad / DURACION; // de 1 (recién nacida) a 0 (desaparecida)
      const opacidad = vida * vida;
      // halo suave y núcleo más pequeño
      ctx.fillStyle = `rgba(${p.color}, ${(0.16 * opacidad).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio * 3.2 * vida + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${p.color}, ${(0.75 * opacidad).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio * (0.4 + 0.6 * vida), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function bucle(tiempo) {
    const dt = Math.min(tiempo - ultimoTiempo, 50); // si la pestaña estuvo parada no se da un salto enorme
    ultimoTiempo = tiempo;
    for (const p of particulas) {
      p.edad += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    particulas = particulas.filter((p) => p.edad < DURACION);
    dibujar();
    // sin partículas el bucle se detiene y no gasta nada hasta que el ratón vuelva a moverse
    fotograma = particulas.length ? requestAnimationFrame(bucle) : 0;
  }

  function alSalirElRaton() {
    ultimoX = null; // al volver a entrar no se dibuja una línea de partículas desde donde salió
    ultimoY = null;
  }

  function alCambiarVisibilidad() {
    if (document.hidden) {
      particulas = [];
      ultimoX = null;
      ultimoY = null;
    }
  }

  function activar() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'estela';
    canvas.setAttribute('aria-hidden', 'true');
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);
    window.addEventListener('pointermove', alMoverRaton, { passive: true });
    document.documentElement.addEventListener('mouseleave', alSalirElRaton);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
  }

  function desactivar() {
    if (!canvas) return;
    cancelAnimationFrame(fotograma);
    fotograma = 0;
    particulas = [];
    ultimoX = null;
    ultimoY = null;
    window.removeEventListener('resize', ajustarTamano);
    window.removeEventListener('pointermove', alMoverRaton);
    document.documentElement.removeEventListener('mouseleave', alSalirElRaton);
    document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    canvas.remove();
    canvas = null;
    ctx = null;
  }

  // Se vuelve a decidir si cambia el tipo de puntero o el ajuste de movimiento reducido (p. ej. al
  // acoplar un ratón a una tableta o al activar el ajuste del sistema con la página abierta)
  function actualizar() {
    if (consultaRaton.matches && !consultaMovimiento.matches) activar();
    else desactivar();
  }

  consultaRaton.addEventListener('change', actualizar);
  consultaMovimiento.addEventListener('change', actualizar);
  actualizar();
})();
