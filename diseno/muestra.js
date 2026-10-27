// Muestra de estilo (fase 1): selector de tipografía y vídeo que solo se reproduce cuando se ve

// --- Selector de opción tipográfica A / B ---
const botonesOpcion = document.querySelectorAll('.selector__boton');

botonesOpcion.forEach((boton) => {
  boton.addEventListener('click', () => {
    document.documentElement.dataset.tipografia = boton.dataset.opcion;
    botonesOpcion.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));

    // Repite la animación del nombre para ver cómo queda con la nueva fuente
    const nombre = document.querySelector('.portada__nombre');
    nombre.style.animation = 'none';
    void nombre.offsetWidth; // fuerza al navegador a reiniciar la animación
    nombre.style.animation = '';
  });
});

// --- Vídeos de tarjeta: reproducir solo cuando están en pantalla ---
const videos = document.querySelectorAll('.tarjeta video');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.play().catch(() => {}); // el navegador puede bloquearlo; no es un error
    } else {
      entrada.target.pause();
    }
  });
}, { threshold: 0.4 });

videos.forEach((video) => observador.observe(video));
