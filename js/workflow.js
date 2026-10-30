// Flujo de trabajo de "Cómo hice esta web": cada carta tiene un detalle que se abre al pasar el
// ratón (solo con ratón y en pantalla ancha), al enfocar con el teclado o al pulsar/tocar; si se
// pulsa queda fijo hasta volver a pulsar. Esc y pulsar fuera lo cierran.
// Sin JavaScript el HTML ya es una lista vertical con todo el texto visible: este script solo
// activa el diagrama (.flujo--activo) y convierte el título de cada carta en un botón.
// Depende de js/main.js (los textos se traducen allí; aquí solo se mueven los mismos nodos).

(function () {
  const flujo = document.querySelector('.flujo');
  if (!flujo) return;

  const escritorio = window.matchMedia('(min-width: 1100px)');
  const cartas = [...flujo.querySelectorAll('.flujo__carta')].filter((c) => c.querySelector('.flujo__detalle'));

  flujo.classList.add('flujo--activo');

  function cerrar(carta) {
    carta.classList.remove('flujo__carta--abierta');
    delete carta.dataset.fijo;
    carta.querySelector('.flujo__detalle').hidden = true;
    carta.querySelector('button').setAttribute('aria-expanded', 'false');
  }

  function abrir(carta) {
    cartas.forEach((otra) => {
      if (otra !== carta) cerrar(otra);
    });
    carta.classList.add('flujo__carta--abierta');
    carta.querySelector('.flujo__detalle').hidden = false;
    carta.querySelector('button').setAttribute('aria-expanded', 'true');
  }

  cartas.forEach((carta) => {
    // El título pasa a ser un botón (su ::after cubre toda la carta). Se mueven los mismos nodos,
    // así que main.js sigue traduciéndolos al cambiar de idioma
    const titulo = carta.querySelector('.flujo__titulo');
    const detalle = carta.querySelector('.flujo__detalle');
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', detalle.id);
    boton.append(...titulo.childNodes);
    titulo.append(boton);
    detalle.hidden = true;

    carta.addEventListener('pointerenter', (evento) => {
      if (evento.pointerType === 'mouse' && escritorio.matches) abrir(carta);
    });
    carta.addEventListener('pointerleave', (evento) => {
      if (evento.pointerType === 'mouse' && escritorio.matches && !carta.dataset.fijo) cerrar(carta);
    });
    // Con teclado se abre al enfocar (solo en el diagrama; en la lista se abre con Intro o espacio)
    boton.addEventListener('focus', () => {
      if (escritorio.matches) abrir(carta);
    });
    boton.addEventListener('blur', () => {
      if (escritorio.matches && !carta.dataset.fijo) cerrar(carta);
    });
    boton.addEventListener('click', () => {
      if (carta.dataset.fijo) {
        cerrar(carta);
      } else {
        abrir(carta);
        carta.dataset.fijo = '1';
      }
    });
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cartas.forEach(cerrar);
  });
  // pointerdown y no click: Safari en iPhone no lanza "click" en document al tocar una zona vacía
  document.addEventListener('pointerdown', (evento) => {
    if (!evento.target.closest('.flujo__carta')) cartas.forEach(cerrar);
  });

  // Al cambiar entre diagrama y lista se cierra todo, para no dejar un detalle abierto fuera de sitio
  escritorio.addEventListener('change', () => cartas.forEach(cerrar));
})();
