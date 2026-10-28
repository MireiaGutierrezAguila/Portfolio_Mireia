// Formación como mapa de habilidades: un camino de nodos (de la formación más antigua a la
// más reciente) con un panel de detalle. Al pasar el cursor cerca, los nodos se iluminan.
// Los datos salen de la lista <ul class="formacion"> del HTML, que se queda oculta y es lo que
// ve quien no tenga JavaScript. Depende de js/main.js (idioma) y del sprite SVG del HTML.

(function () {
  const lista = document.querySelector('.formacion');
  if (!lista) return;

  // Nombres de marca que se muestran bajo cada logo (no se traducen). Los iconos propios no llevan
  const NOMBRES = {
    'logo-claudecode': 'Claude Code',
    'logo-unity': 'Unity',
    'logo-unrealengine': 'Unreal Engine',
    'logo-godotengine': 'Godot',
    'logo-selenium': 'Selenium',
    'logo-cypress': 'Cypress',
    'logo-php': 'PHP',
  };
  const DISTANCIA_BRILLO = 170; // px a los que el cursor empieza a iluminar un nodo
  const NS = 'http://www.w3.org/2000/svg';

  // Del más antiguo al más reciente: es la lista del HTML, al revés
  const estudios = [...lista.children].reverse();
  let actual = estudios.length - 1; // empieza en la formación más reciente

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pantallaEstrecha = window.matchMedia('(max-width: 1023.98px)');

  function crear(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;
    return elemento;
  }

  function icono(id, clase) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', clase);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const uso = document.createElementNS(NS, 'use');
    uso.setAttribute('href', '#' + id);
    svg.appendChild(uso);
    return svg;
  }

  const leer = (estudio, selector) => estudio.querySelector(selector).textContent.trim();

  // ---------- Construcción ----------
  const mapa = crear('div', 'mapa');
  const camino = crear('div', 'mapa__camino');
  camino.setAttribute('role', 'tablist');

  const trazado = document.createElementNS(NS, 'svg');
  trazado.setAttribute('class', 'mapa__trazado');
  trazado.setAttribute('aria-hidden', 'true');
  const lineaBase = document.createElementNS(NS, 'polyline');
  lineaBase.setAttribute('class', 'mapa__linea');
  const lineaActiva = document.createElementNS(NS, 'polyline');
  lineaActiva.setAttribute('class', 'mapa__linea mapa__linea--activa');
  trazado.append(lineaBase, lineaActiva);
  camino.appendChild(trazado);

  const panel = crear('div', 'mapa__panel');
  panel.id = 'mapa-panel';
  panel.setAttribute('role', 'tabpanel');

  const items = [];
  estudios.forEach((estudio, i) => {
    const item = crear('div', 'mapa__item');
    item.setAttribute('role', 'presentation'); // solo agrupa el nodo y, en móvil, su panel
    const nodo = crear('button', 'mapa__nodo');
    nodo.type = 'button';
    nodo.id = 'mapa-nodo-' + i;
    nodo.setAttribute('role', 'tab');
    nodo.setAttribute('aria-controls', panel.id);

    const circulo = crear('span', 'mapa__circulo');
    circulo.appendChild(icono(estudio.dataset.icono, 'mapa__icono'));
    const anio = crear('span', 'mapa__anio');
    const nombre = crear('span', 'solo-lectores'); // el título completo, solo para lectores de pantalla
    nodo.append(circulo, anio, nombre);
    item.appendChild(nodo);
    camino.appendChild(item);
    items.push({ item, nodo, circulo, anio, nombre, estudio });

    // Con ratón basta con pasar por encima, pero solo en el camino horizontal: en el vertical el
    // panel se abre bajo el nodo y empuja a los demás, y el cursor acabaría eligiendo otro nodo
    // sin querer. Ahí, y con táctil o teclado, se elige con clic, toque o flechas
    nodo.addEventListener('pointerenter', (evento) => {
      if (evento.pointerType === 'mouse' && !pantallaEstrecha.matches) seleccionar(i);
    });
    nodo.addEventListener('click', () => seleccionar(i));
    nodo.addEventListener('keydown', (evento) => teclado(evento, i));
  });

  mapa.append(camino, panel);
  lista.after(mapa);
  lista.hidden = true;

  // ---------- Contenido (se repite al cambiar de idioma) ----------
  function pintarTextos() {
    camino.setAttribute('aria-label', lista.getAttribute('aria-label'));
    items.forEach(({ anio, nombre, estudio }) => {
      anio.textContent = leer(estudio, '.estudio__anio');
      nombre.textContent = ', ' + leer(estudio, '.estudio__titulo');
    });
    pintarPanel();
  }

  function pintarPanel() {
    const { estudio } = items[actual];
    panel.setAttribute('aria-labelledby', 'mapa-nodo-' + actual);
    panel.replaceChildren(
      crear('p', 'mapa__panel-anio', leer(estudio, '.estudio__anio')),
      crear('h3', 'mapa__panel-titulo', leer(estudio, '.estudio__titulo')),
      crear('p', 'mapa__panel-centro', leer(estudio, '.estudio__centro'))
    );
    const logos = crear('ul', 'mapa__panel-logos');
    estudio.dataset.logos.split(' ').forEach((id) => {
      const li = crear('li', 'mapa__panel-logo');
      li.appendChild(icono(id, 'logo'));
      if (NOMBRES[id]) li.appendChild(crear('span', '', NOMBRES[id]));
      logos.appendChild(li);
    });
    panel.appendChild(logos);
  }

  // ---------- Selección ----------
  function seleccionar(indice) {
    if (indice === actual) return;
    actual = indice;
    marcar();
    pintarPanel();
    colocarPanel();
  }

  function marcar() {
    items.forEach(({ nodo }, i) => {
      const estado = i === actual ? 'activo' : i < actual ? 'alcanzado' : 'pendiente';
      nodo.dataset.estado = estado;
      nodo.setAttribute('aria-selected', String(i === actual));
      nodo.tabIndex = i === actual ? 0 : -1;
    });
    encenderCamino();
  }

  // En pantallas estrechas el panel se abre justo bajo el nodo elegido; en anchas va bajo el camino
  function colocarPanel() {
    if (pantallaEstrecha.matches) items[actual].item.appendChild(panel);
    else mapa.appendChild(panel);
  }

  function teclado(evento, i) {
    const ultimo = items.length - 1;
    const destino = {
      ArrowRight: Math.min(i + 1, ultimo),
      ArrowDown: Math.min(i + 1, ultimo),
      ArrowLeft: Math.max(i - 1, 0),
      ArrowUp: Math.max(i - 1, 0),
      Home: 0,
      End: ultimo,
    }[evento.key];
    if (destino === undefined) return;
    evento.preventDefault();
    seleccionar(destino);
    items[destino].nodo.focus();
  }

  // ---------- Camino (línea entre los centros de los nodos) ----------
  let puntos = [];
  let tramos = []; // longitud acumulada hasta cada nodo

  function trazar() {
    const caja = camino.getBoundingClientRect();
    puntos = items.map(({ circulo }) => {
      const c = circulo.getBoundingClientRect();
      return [c.left - caja.left + c.width / 2, c.top - caja.top + c.height / 2];
    });
    tramos = puntos.map((p, i) => (i === 0 ? 0 : Math.hypot(p[0] - puntos[i - 1][0], p[1] - puntos[i - 1][1])));
    for (let i = 1; i < tramos.length; i++) tramos[i] += tramos[i - 1];
    const cadena = puntos.map((p) => p.join(',')).join(' ');
    lineaBase.setAttribute('points', cadena);
    lineaActiva.setAttribute('points', cadena);
    encenderCamino();
  }

  function encenderCamino() {
    if (!tramos.length) return;
    const total = tramos[tramos.length - 1];
    lineaActiva.style.strokeDasharray = tramos[actual] + ' ' + (total + 1);
  }

  // ---------- Brillo de los nodos según la cercanía del cursor ----------
  let esperando = false;
  let ultimoEvento = null;

  function iluminar() {
    esperando = false;
    items.forEach(({ circulo, nodo }) => {
      let cerca = 0;
      if (ultimoEvento) {
        const c = circulo.getBoundingClientRect();
        const d = Math.hypot(ultimoEvento.clientX - (c.left + c.width / 2), ultimoEvento.clientY - (c.top + c.height / 2));
        cerca = Math.max(0, 1 - d / DISTANCIA_BRILLO);
      }
      nodo.style.setProperty('--cerca', cerca.toFixed(2));
    });
  }

  camino.addEventListener('pointermove', (evento) => {
    if (evento.pointerType !== 'mouse' || movimientoReducido.matches) return;
    ultimoEvento = evento;
    if (!esperando) {
      esperando = true;
      requestAnimationFrame(iluminar);
    }
  });
  camino.addEventListener('pointerleave', () => {
    ultimoEvento = null;
    iluminar();
  });

  // ---------- Arranque ----------
  pintarTextos();
  marcar();
  colocarPanel();
  trazar();

  new ResizeObserver(trazar).observe(camino);
  pantallaEstrecha.addEventListener('change', () => {
    colocarPanel();
    trazar();
  });
  // main.js cambia el atributo lang cuando cambia el idioma, después de actualizar los textos
  new MutationObserver(pintarTextos).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
  // Las fuentes web cambian el tamaño de las cajas al cargar
  if (document.fonts) document.fonts.ready.then(trazar);
})();
