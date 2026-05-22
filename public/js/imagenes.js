/* ============================================================
   imagenes.js — Juego "¿Qué Imagen Es Esta?"
   Variables y funciones con prefijo "ig" para no contaminar
   el scope global junto a otros scripts del proyecto.
   ============================================================ */

(function () {
  'use strict';

  // ── Datos desde Laravel (inyectados en la vista Blade) ─────
  const IG_TEMAS_INICIALES = window.IG_CONFIG ? window.IG_CONFIG.temas      : [];
  const IG_MAX_RONDAS      = window.IG_CONFIG ? window.IG_CONFIG.maxRondas  : 8;
  const IG_OPCIONES        = window.IG_CONFIG ? window.IG_CONFIG.opciones   : 4;

  // Tamaño máximo y calidad para imágenes redimensionadas (control del peso en localStorage)
  const IG_MAX_TAMANIO  = 360;
  const IG_CALIDAD_JPEG = 0.82;

  // ── Estado ──────────────────────────────────────────────────
  let igTemas        = igCargarTemas();
  let igTemasActivos = [];
  let igPool         = [];
  let igPuntos       = 0;
  let igRondaActual  = 1;
  let igRacha        = 0;
  let igObjetivo     = null;
  let igRespondido   = false;
  let igTemaEditando = null;
  let igCurrentSrc   = '';   // src en preparación (data URL, URL o emoji)

  // ── Persistencia en BD (vía window.MentActiva) ─────────────
  function igCargarTemas() {
    const e = window.MentActiva && window.MentActiva.cargarEstado
      ? window.MentActiva.cargarEstado() : null;
    if (e && Array.isArray(e) && e.length) return e;
    return JSON.parse(JSON.stringify(IG_TEMAS_INICIALES));
  }

  function igGuardarTemas() {
    if (window.MentActiva && window.MentActiva.guardarEstado) {
      window.MentActiva.guardarEstado(igTemas);
    }
  }

  function igGuardarTemasSeguro() {
    igGuardarTemas();
  }

  // ── Detección de tipo de src ───────────────────────────────
  function igEsImagen(src) {
    return !!src && (src.startsWith('http') || src.startsWith('data:image'));
  }

  // ── Referencias al DOM ──────────────────────────────────────
  const igPantallaTemas    = document.getElementById('ig-pantalla-temas');
  const igPantallaInicio   = document.getElementById('ig-pantalla-inicio');
  const igPantallaFin      = document.getElementById('ig-pantalla-fin');
  const igBotonEmpezar     = document.getElementById('ig-boton-empezar');
  const igBotonReiniciar   = document.getElementById('ig-boton-reiniciar');
  const igBotonCambiarTema = document.getElementById('ig-boton-cambiar-tema');
  const igListaTemas       = document.getElementById('ig-lista-temas');
  const igContadorTemas    = document.getElementById('ig-contador-temas');
  const igBotonJugar       = document.getElementById('ig-boton-jugar');
  const igBotonNuevoTema   = document.getElementById('ig-boton-nuevo-tema');
  const igFormNuevoTema    = document.getElementById('ig-form-nuevo-tema');
  const igInputNombreTema  = document.getElementById('ig-input-nombre-tema');
  const igInputIconoTema   = document.getElementById('ig-input-icono-tema');
  const igBotonGuardarTema = document.getElementById('ig-boton-guardar-tema');
  const igBotonCancelarTema= document.getElementById('ig-boton-cancelar-tema');
  const igModalTema        = document.getElementById('ig-modal-tema');
  const igModalTitulo      = document.getElementById('ig-modal-titulo');
  const igModalGrid        = document.getElementById('ig-modal-grid');
  const igModalCerrar      = document.getElementById('ig-modal-cerrar');
  const igInputPalabra     = document.getElementById('ig-input-palabra');
  const igInputSrc         = document.getElementById('ig-input-src');
  const igBotonAddImg      = document.getElementById('ig-boton-add-img');
  const igDropzone         = document.getElementById('ig-dropzone');
  const igDropzoneInput    = document.getElementById('ig-dropzone-input');
  const igPreviewCard      = document.getElementById('ig-preview-card');
  const igPreviewPalabra   = document.getElementById('ig-preview-palabra');
  const igCuadricula       = document.getElementById('ig-cuadricula');
  const igBannerRespuesta  = document.getElementById('ig-banner-respuesta');
  const igBotonSiguiente   = document.getElementById('ig-boton-siguiente');
  const igPalabraObjetivo  = document.getElementById('ig-palabra-objetivo');
  const igElPuntos         = document.getElementById('ig-puntos');
  const igElRonda          = document.getElementById('ig-ronda');
  const igElRacha          = document.getElementById('ig-racha');
  const igFinPuntos        = document.getElementById('ig-fin-puntos');
  const igFinMensaje       = document.getElementById('ig-fin-mensaje');

  if (!igBotonEmpezar) return;

  // ── PANTALLA DE TEMAS: renderizado ─────────────────────────
  function igRenderizarTemas() {
    igListaTemas.innerHTML = '';

    igTemas.forEach(tema => {
      const activo = igTemasActivos.includes(tema.id);
      const card = document.createElement('div');
      card.className = `ig-tema-card${activo ? ' ig-tema-card--activo' : ''}`;
      card.dataset.igId = tema.id;

      card.innerHTML = `
        <div class="ig-tema-card__check">✓</div>
        <div class="ig-tema-card__icono">${tema.icono}</div>
        <div class="ig-tema-card__nombre">${igEscaparHtml(tema.nombre)}</div>
        <div class="ig-tema-card__cuenta">${tema.elementos.length} imágenes</div>
        <button class="ig-tema-card__editar" title="Gestionar imágenes">✏️</button>
        ${!tema.predefinido ? `<button class="ig-tema-card__borrar" title="Eliminar tema">🗑️</button>` : ''}
      `;

      card.addEventListener('click', e => {
        if (e.target.closest('.ig-tema-card__editar, .ig-tema-card__borrar')) return;
        igToggleTema(tema.id);
      });

      card.querySelector('.ig-tema-card__editar').addEventListener('click', e => {
        e.stopPropagation();
        igAbrirModal(tema.id);
      });

      const btnBorrar = card.querySelector('.ig-tema-card__borrar');
      if (btnBorrar) {
        btnBorrar.addEventListener('click', e => {
          e.stopPropagation();
          igBorrarTema(tema.id);
        });
      }

      igListaTemas.appendChild(card);
    });

    igActualizarContador();
  }

  function igToggleTema(id) {
    const idx = igTemasActivos.indexOf(id);
    if (idx === -1) igTemasActivos.push(id);
    else igTemasActivos.splice(idx, 1);
    igRenderizarTemas();
  }

  function igGetPool() {
    return igTemas
      .filter(t => igTemasActivos.includes(t.id))
      .flatMap(t => t.elementos);
  }

  function igActualizarContador() {
    const n    = igTemasActivos.length;
    const pool = igGetPool();
    let msg    = n === 0
      ? 'Selecciona al menos un tema'
      : `${n} tema${n !== 1 ? 's' : ''} seleccionado${n !== 1 ? 's' : ''} · ${pool.length} imágenes`;

    if (n > 0 && pool.length < IG_OPCIONES) {
      msg += ` (se necesitan al menos ${IG_OPCIONES} imágenes en total)`;
    }

    igContadorTemas.textContent = msg;
    igBotonJugar.disabled = pool.length < IG_OPCIONES;
  }

  // ── Nuevo tema ──────────────────────────────────────────────
  igBotonNuevoTema.addEventListener('click', () => {
    igFormNuevoTema.classList.toggle('ig-form--oculto');
    if (!igFormNuevoTema.classList.contains('ig-form--oculto')) igInputNombreTema.focus();
  });

  igBotonCancelarTema.addEventListener('click', () => {
    igFormNuevoTema.classList.add('ig-form--oculto');
    igInputNombreTema.value = '';
    igInputIconoTema.value  = '';
  });

  igBotonGuardarTema.addEventListener('click', () => {
    const nombre = igInputNombreTema.value.trim();
    if (!nombre) { igInputNombreTema.focus(); return; }
    const icono  = igInputIconoTema.value.trim() || '📁';
    const id     = 'custom_' + Date.now();

    igTemas.push({ id, nombre, icono, predefinido: false, elementos: [] });
    igGuardarTemasSeguro();
    igRenderizarTemas();

    igFormNuevoTema.classList.add('ig-form--oculto');
    igInputNombreTema.value = '';
    igInputIconoTema.value  = '';
  });

  // ── Borrar tema ─────────────────────────────────────────────
  function igBorrarTema(id) {
    igTemas        = igTemas.filter(t => t.id !== id);
    igTemasActivos = igTemasActivos.filter(i => i !== id);
    igGuardarTemasSeguro();
    igRenderizarTemas();
  }

  // ── Modal: abrir / cerrar ───────────────────────────────────
  function igAbrirModal(temaId) {
    igTemaEditando = temaId;
    const tema = igTemas.find(t => t.id === temaId);
    igModalTitulo.textContent = `${tema.icono} ${tema.nombre}`;
    igRenderizarModalGrid(tema);
    igResetearFormulario();
    igModalTema.classList.remove('ig-modal--oculto');
  }

  function igRenderizarModalGrid(tema) {
    igModalGrid.innerHTML = '';
    if (tema.elementos.length === 0) {
      igModalGrid.innerHTML = '<p class="ig-modal-vacio">Sin imágenes. Añade una abajo.</p>';
      return;
    }
    tema.elementos.forEach(el => {
      const item = document.createElement('div');
      item.className = 'ig-modal-item';
      const esImg = igEsImagen(el.src);
      item.innerHTML = `
        <div class="ig-modal-item__img">
          ${esImg
            ? `<img src="${igEscaparAtrib(el.src)}" alt="${igEscaparAtrib(el.palabra)}" onerror="this.parentElement.innerHTML='❓'">`
            : `<span class="ig-modal-emoji">${el.src}</span>`}
        </div>
        <div class="ig-modal-item__palabra">${igEscaparHtml(el.palabra)}</div>
        <button class="ig-modal-item__borrar" title="Eliminar">✕</button>
      `;
      item.querySelector('.ig-modal-item__borrar').addEventListener('click', () => {
        igBorrarElemento(igTemaEditando, el.id);
      });
      igModalGrid.appendChild(item);
    });
  }

  function igBorrarElemento(temaId, elId) {
    const tema = igTemas.find(t => t.id === temaId);
    if (!tema) return;
    tema.elementos = tema.elementos.filter(e => e.id !== elId);
    igGuardarTemasSeguro();
    igRenderizarModalGrid(tema);
    igRenderizarTemas();
  }

  igModalCerrar.addEventListener('click', igCerrarModal);

  igModalTema.addEventListener('click', e => {
    if (e.target === igModalTema) igCerrarModal();
  });

  function igCerrarModal() {
    igModalTema.classList.add('ig-modal--oculto');
    igTemaEditando = null;
    igResetearFormulario();
  }

  function igResetearFormulario() {
    igInputPalabra.value = '';
    igInputSrc.value     = '';
    igCurrentSrc         = '';
    igDropzone.classList.remove('ig-dropzone--cargada');
    igActualizarPreview();
  }

  // ── Vista previa estilo juego ──────────────────────────────
  function igActualizarPreview() {
    const palabra = igInputPalabra.value.trim();
    igPreviewPalabra.textContent = palabra ? palabra.toUpperCase() : '—';

    igPreviewCard.innerHTML = '';
    if (!igCurrentSrc) {
      igPreviewCard.innerHTML = '<div class="ig-preview-card__placeholder">Sin imagen</div>';
      return;
    }
    if (igEsImagen(igCurrentSrc)) {
      const img = document.createElement('img');
      img.src     = igCurrentSrc;
      img.alt     = 'Vista previa';
      img.onerror = () => {
        igPreviewCard.innerHTML = '<div class="ig-preview-card__placeholder">URL no válida</div>';
      };
      igPreviewCard.appendChild(img);
    } else {
      const span = document.createElement('span');
      span.className   = 'ig-preview-card__emoji-grande';
      span.textContent = igCurrentSrc;
      igPreviewCard.appendChild(span);
    }
  }

  // ── Procesado de archivos: redimensionar a JPEG ────────────
  function igProcesarArchivo(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > IG_MAX_TAMANIO || height > IG_MAX_TAMANIO) {
          if (width >= height) {
            height = Math.round(height * IG_MAX_TAMANIO / width);
            width  = IG_MAX_TAMANIO;
          } else {
            width  = Math.round(width * IG_MAX_TAMANIO / height);
            height = IG_MAX_TAMANIO;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Fondo blanco para que los PNG transparentes no salgan en negro al pasar a JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        igCurrentSrc = canvas.toDataURL('image/jpeg', IG_CALIDAD_JPEG);
        igInputSrc.value = '';
        igDropzone.classList.add('ig-dropzone--cargada');
        igActualizarPreview();
      };
      img.onerror = () => alert('No se pudo leer la imagen.');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── Drag & drop ─────────────────────────────────────────────
  igDropzone.addEventListener('click', () => igDropzoneInput.click());

  igDropzone.addEventListener('dragover', e => {
    e.preventDefault();
    igDropzone.classList.add('ig-dropzone--activa');
  });
  igDropzone.addEventListener('dragleave', e => {
    if (e.target === igDropzone) igDropzone.classList.remove('ig-dropzone--activa');
  });
  igDropzone.addEventListener('drop', e => {
    e.preventDefault();
    igDropzone.classList.remove('ig-dropzone--activa');
    const file = e.dataTransfer.files[0];
    if (file) igProcesarArchivo(file);
  });

  igDropzoneInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) igProcesarArchivo(file);
    igDropzoneInput.value = '';   // permite reelegir el mismo archivo
  });

  // Pegar imagen desde portapapeles (Ctrl+V) cuando el modal está abierto
  document.addEventListener('paste', e => {
    if (igModalTema.classList.contains('ig-modal--oculto')) return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          igProcesarArchivo(file);
          return;
        }
      }
    }
  });

  // Inputs de texto: actualizan preview en tiempo real
  igInputPalabra.addEventListener('input', igActualizarPreview);

  igInputSrc.addEventListener('input', () => {
    igCurrentSrc = igInputSrc.value.trim();
    igDropzone.classList.remove('ig-dropzone--cargada');
    igActualizarPreview();
  });

  // ── Botón añadir imagen ─────────────────────────────────────
  igBotonAddImg.addEventListener('click', () => {
    const palabra = igInputPalabra.value.trim();
    if (!palabra)     { igInputPalabra.focus(); return; }
    if (!igCurrentSrc) {
      alert('Añade una imagen, un emoji o una URL antes de continuar.');
      return;
    }

    const tema = igTemas.find(t => t.id === igTemaEditando);
    if (!tema) return;

    tema.elementos.push({ id: 'el_' + Date.now(), palabra, src: igCurrentSrc });

    try {
      igGuardarTemas();
    } catch (e) {
      tema.elementos.pop();   // rollback si localStorage está lleno
      alert('No se pudo guardar la imagen: el almacenamiento del navegador está lleno. Borra algunas imágenes y vuelve a intentarlo.');
      return;
    }

    igRenderizarModalGrid(tema);
    igRenderizarTemas();
    igResetearFormulario();
    igInputPalabra.focus();
  });

  // ── Navegación entre pantallas ──────────────────────────────
  igBotonJugar.addEventListener('click', () => {
    igPool = igGetPool();
    igPantallaTemas.classList.add('ig-pantalla--oculta');
    igPantallaInicio.classList.remove('ig-pantalla--oculta');
  });

  igBotonEmpezar.addEventListener('click', () => {
    igPantallaInicio.classList.add('ig-pantalla--oculta');
    igPuntos = 0; igRondaActual = 1; igRacha = 0;
    igNuevaRonda();
  });

  igBotonReiniciar.addEventListener('click', () => {
    igPuntos = 0; igRondaActual = 1; igRacha = 0;
    igPantallaFin.classList.add('ig-pantalla--oculta');
    igNuevaRonda();
  });

  igBotonCambiarTema.addEventListener('click', () => {
    igPantallaFin.classList.add('ig-pantalla--oculta');
    igPantallaTemas.classList.remove('ig-pantalla--oculta');
    igRenderizarTemas();
  });

  // ── Lógica de juego ─────────────────────────────────────────
  function igElegirElementos() {
    const bolsa    = [...igPool];
    const elegidos = [];
    while (elegidos.length < IG_OPCIONES && bolsa.length > 0) {
      const i = Math.floor(Math.random() * bolsa.length);
      elegidos.push(bolsa.splice(i, 1)[0]);
    }
    return elegidos;
  }

  function igNuevaRonda() {
    igRespondido = false;

    const elementos = igElegirElementos();
    igObjetivo = elementos[Math.floor(Math.random() * elementos.length)];

    igPalabraObjetivo.textContent = igObjetivo.palabra.toUpperCase();
    igRenderizarCuadricula(elementos);
    igOcultarBanner();
    igBotonSiguiente.style.display = 'none';
    igActualizarEstadisticas();
  }

  function igRenderizarCuadricula(elementos) {
    igCuadricula.innerHTML = '';
    elementos.forEach(el => {
      const boton = document.createElement('button');
      boton.className    = 'ig-boton-imagen';
      boton.dataset.igId = el.id;
      boton.setAttribute('aria-label', el.palabra);

      const contenido = document.createElement('div');
      contenido.className = 'ig-imagen-contenido';

      if (igEsImagen(el.src)) {
        const img   = document.createElement('img');
        img.src     = el.src;
        img.alt     = el.palabra;
        img.className = 'ig-img';
        img.onerror = () => { contenido.innerHTML = '<span class="ig-emoji">❓</span>'; };
        contenido.appendChild(img);
      } else {
        const span = document.createElement('span');
        span.className   = 'ig-emoji';
        span.textContent = el.src;
        contenido.appendChild(span);
      }

      const icono = document.createElement('span');
      icono.className = 'ig-boton-imagen__icono';
      icono.setAttribute('aria-hidden', 'true');

      boton.appendChild(contenido);
      boton.appendChild(icono);
      boton.addEventListener('click', () => igResponder(boton, el));
      igCuadricula.appendChild(boton);
    });
  }

  function igResponder(boton, elemento) {
    if (igRespondido) return;
    igRespondido = true;

    const correcto = elemento.id === igObjetivo.id;
    document.querySelectorAll('.ig-boton-imagen').forEach(b => (b.disabled = true));

    if (correcto) {
      boton.classList.add('ig-boton-imagen--correcto');
      boton.querySelector('.ig-boton-imagen__icono').textContent = '✓';
      const pts = igRacha >= 2 ? 15 : 10;
      igPuntos += pts;
      igRacha  += 1;
      const msgs = ['¡Correcto! 🎉', '¡Genial! ✨', '¡Exacto! 🔥', '¡Perfecto! 💯'];
      igMostrarBanner(`${msgs[Math.floor(Math.random() * msgs.length)]} +${pts}`, 'bien');
    } else {
      boton.classList.add('ig-boton-imagen--incorrecto');
      boton.querySelector('.ig-boton-imagen__icono').textContent = '✗';
      igRacha = 0;
      document.querySelectorAll('.ig-boton-imagen').forEach(b => {
        if (b.dataset.igId === igObjetivo.id) {
          b.classList.add('ig-boton-imagen--revelar');
          b.querySelector('.ig-boton-imagen__icono').textContent = '✓';
        }
      });
      const msgs = ['¡Incorrecto! ❌', 'Casi… ❌', 'No era esa ❌'];
      igMostrarBanner(msgs[Math.floor(Math.random() * msgs.length)], 'mal');
    }

    igActualizarEstadisticas();
    igBotonSiguiente.style.display = 'block';
    igBotonSiguiente.textContent = igRondaActual >= IG_MAX_RONDAS
      ? 'Ver resultado →'
      : 'Siguiente ronda →';
  }

  function igMostrarBanner(msg, tipo) {
    igBannerRespuesta.textContent = msg;
    igBannerRespuesta.className =
      `ig-banner-respuesta ig-banner-respuesta--visible ig-banner-respuesta--${tipo}`;
  }

  function igOcultarBanner() {
    igBannerRespuesta.className = 'ig-banner-respuesta';
  }

  function igActualizarEstadisticas() {
    igElPuntos.textContent = igPuntos;
    igElRonda.textContent  = `${igRondaActual} / ${IG_MAX_RONDAS}`;
    igElRacha.textContent  = igRacha;
    igElRacha.classList.toggle('ig-estadistica__valor--racha-fuego', igRacha >= 3);
  }

  igBotonSiguiente.addEventListener('click', () => {
    if (igRondaActual >= IG_MAX_RONDAS) {
      igMostrarFin();
    } else {
      igRondaActual++;
      igNuevaRonda();
    }
  });

  function igMostrarFin() {
    const pct = Math.round((igPuntos / (IG_MAX_RONDAS * 15)) * 100);
    let msg;
    if (pct >= 80)      msg = '¡Excelente trabajo! 🏆 Tu memoria es fantástica.';
    else if (pct >= 50) msg = '¡Muy bien! 👏 Sigue practicando cada día.';
    else                msg = '¡Buen intento! 💪 Con práctica mejorarás.';

    igFinPuntos.textContent  = igPuntos;
    igFinMensaje.textContent = msg;
    igPantallaFin.classList.remove('ig-pantalla--oculta');

    // ── Nivel 2: guardar partida si hay sesión ──
    if (window.MentActiva?.guardarPartida) {
      window.MentActiva.guardarPartida({
        puntos: igPuntos,
        datos:  { rondas: IG_MAX_RONDAS, porcentaje: pct },
      });
    }
  }

  // ── Utilidades de escape ───────────────────────────────────
  function igEscaparHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function igEscaparAtrib(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── Arranque ────────────────────────────────────────────────
  igRenderizarTemas();

})();
