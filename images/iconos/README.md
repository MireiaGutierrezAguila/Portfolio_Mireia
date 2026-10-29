# Iconos propios

Siluetas de un solo color dibujadas para este proyecto con ayuda de Claude Code. No proceden de ningún catálogo ni tienen un logo oficial detrás: se usan para las habilidades que no tienen marca asociada.

| Archivo | Se usa en |
|---|---|
| `bug.svg` | Testing manual |
| `matraz.svg` | Planes de prueba |
| `ciclo.svg` | Agile |
| `lista-comprobacion.svg` | Gestión de producto |
| `equipo.svg` | Coordinación entre equipos (tres figuras iguales) |
| `liderazgo.svg` | Liderazgo de QA |
| `docencia.svg` | Formación y docencia |
| `calendario.svg` | Tiempo invertido en cada juego (tarjetas de Proyectos) |
| `correo.svg` | Botón "Escríbeme" de Contacto |
| `copiar.svg` | Botón "Copiar email" de Contacto |
| `persona.svg` | LinkedIn (Contacto y pie): Simple Icons ya no incluye el logo de LinkedIn, así que se usa un icono genérico con su nombre al lado |
| `descargar.svg` | Descargar el CV (Contacto) |

- **Formato:** SVG con `viewBox="0 0 24 24"` y sin color propio. Se recolorean con CSS (`fill`). Algunos llevan varios `<path>` y `fill-rule="evenodd"` para los huecos (burbujas del matraz, aro de la lupa).
- **Dónde van:** igual que los logos de `images/logos/`, están incrustados en el bloque `<svg class="sprite">` de `index.html` con id `icono-<nombre>`.
