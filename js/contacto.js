// Botón "Copiar email" de Contacto. Sin JavaScript solo queda el botón "Escríbeme" (mailto),
// por eso el botón de copiar viene oculto en el HTML y se muestra desde aquí.
// Depende de js/main.js (función t de traducciones).

(function () {
  const boton = document.querySelector('.contacto__copiar');
  const enlaceCorreo = document.querySelector('a.contacto__boton[href^="mailto:"]');
  const aviso = document.querySelector('.contacto__aviso');
  if (!boton || !enlaceCorreo || !aviso) return;

  const direccion = enlaceCorreo.getAttribute('href').replace('mailto:', '');
  let temporizador;

  // Copia con la API moderna; si el navegador la niega (p. ej. en file://), usa un campo temporal
  async function copiar(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (error) {
      const campo = document.createElement('textarea');
      campo.value = texto;
      campo.className = 'solo-lectores';
      campo.setAttribute('readonly', '');
      document.body.appendChild(campo);
      campo.select();
      let copiado = false;
      try {
        copiado = document.execCommand('copy');
      } catch (errorRespaldo) {
        copiado = false;
      }
      campo.remove();
      return copiado;
    }
  }

  boton.hidden = false;
  boton.addEventListener('click', async () => {
    const copiado = await copiar(direccion);
    aviso.textContent = t(copiado ? 'contacto.copiado' : 'contacto.errorCopiar');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      aviso.textContent = '';
    }, 3000);
  });
})();
