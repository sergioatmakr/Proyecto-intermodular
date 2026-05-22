/* ============================================================
   puzzle.js — Juego "Puzzle"
   Variables/funciones con prefijo "pz". Cada pieza se renderiza
   con CSS background-image desplazado para mostrar solo su
   porción de la imagen (sin necesidad de canvas en tiempo real).
   ============================================================ */

(function () {
  'use strict';

  // ── Config inyectada desde Laravel ─────────────────────
  const PZ_INICIALES = window.PZ_CONFIG ? window.PZ_CONFIG.imagenes : [];
  const PZ_LAYOUTS   = window.PZ_CONFIG ? window.PZ_CONFIG.layouts  : {
    6:  { cols: 3, rows: 2 },
    9:  { cols: 3, rows: 3 },
    12: { cols: 4, rows: 3 },
  };

  // Al subir imágenes propias, se redimensionan/recortan a este tamaño
  const PZ_TAMANIO    = 600;
  const PZ_CALIDAD    = 0.85;

  // ── Estado ──────────────────────────────────────────────
  let pzImagenes    = pzCargarImagenes();
  let pzImagenSelec = null;
  let pzCantidad    = 9;
  let pzMovs        = 0;
  let pzTiempoIni   = 0;
  let pzIntervalo   = null;
  let pzGanado      = false;

  // ── Persistencia en BD (vía window.MentActiva) ─────────
  function pzCargarImagenes() {
    const e = window.MentActiva && window.MentActiva.cargarEstado
      ? window.MentActiva.cargarEstado() : null;
    if (e && Array.isArray(e) && e.length) return e;
    return JSON.parse(JSON.stringify(PZ_INICIALES));
  }

  function pzGuardarImagenes() {
    if (window.MentActiva && window.MentActiva.guardarEstado) {
      window.MentActiva.guardarEstado(pzImagenes);
    }
  }

  // ── Refs DOM ────────────────────────────────────────────
  const pzPantallaGaleria  = document.getElementById('pz-pantalla-galeria');
  const pzPantallaJuego    = document.getElementById('pz-pantalla-juego');
  const pzPantallaVictoria = document.getElementById('pz-pantalla-victoria');

  const pzGaleria          = document.getElementById('pz-galeria');
  const pzGaleriaEstado    = document.getElementById('pz-galeria-estado');
  const pzBtnJugar         = document.getElementById('pz-btn-jugar');
  const pzPiezasBotones    = document.querySelectorAll('.pz-piezas-btn');

  const pzDropzone         = document.getElementById('pz-dropzone');
  const pzDropzoneInput    = document.getElementById('pz-dropzone-input');

  const pzBtnVolver        = document.getElementById('pz-btn-volver');
  const pzBtnPista         = document.getElementById('pz-btn-pista');
  const pzPistaImg         = document.getElementById('pz-pista-img');
  const pzTablero          = document.getElementById('pz-tablero');
  const pzBandeja          = document.getElementById('pz-bandeja');
  const pzTiempoEl         = document.getElementById('pz-tiempo');
  const pzMovsEl           = document.getElementById('pz-movs');

  const pzVictoriaTiempo   = document.getElementById('pz-victoria-tiempo');
  const pzVictoriaMovs     = document.getElementById('pz-victoria-movs');
  const pzVictoriaImg      = document.getElementById('pz-victoria-img');
  const pzBtnJugarOtro     = document.getElementById('pz-btn-jugar-otro');
  const pzBtnVolverGaleria = document.getElementById('pz-btn-volver-galeria');

  if (!pzGaleria) return;

  // ── Galería ────────────────────────────────────────────
  function pzRenderGaleria() {
    pzGaleria.innerHTML = '';
    pzImagenes.forEach(img => {
      const card = document.createElement('div');
      card.className = 'pz-img-card' + (pzImagenSelec && pzImagenSelec.id === img.id ? ' pz-img-card--activa' : '');
      card.dataset.id = img.id;
      card.innerHTML = `
        <img src="${pzEscaparAtrib(img.src)}" alt="${pzEscaparAtrib(img.titulo || '')}" loading="lazy">
        ${img.titulo ? `<div class="pz-img-card__titulo">${pzEscapar(img.titulo)}</div>` : ''}
        ${!img.predefinida ? `<button class="pz-img-card__borrar" title="Eliminar">✕</button>` : ''}
      `;
      card.addEventListener('click', e => {
        if (e.target.closest('.pz-img-card__borrar')) return;
        pzImagenSelec = img;
        pzRenderGaleria();
        pzActualizarEstado();
      });
      const btnBorrar = card.querySelector('.pz-img-card__borrar');
      if (btnBorrar) {
        btnBorrar.addEventListener('click', e => {
          e.stopPropagation();
          pzImagenes = pzImagenes.filter(x => x.id !== img.id);
          if (pzImagenSelec && pzImagenSelec.id === img.id) pzImagenSelec = null;
          pzGuardarImagenes();
          pzRenderGaleria();
          pzActualizarEstado();
        });
      }
      pzGaleria.appendChild(card);
    });
  }

  function pzActualizarEstado() {
    if (!pzImagenSelec) {
      pzGaleriaEstado.textContent = 'Selecciona una imagen para jugar';
      pzBtnJugar.disabled = true;
    } else {
      pzGaleriaEstado.textContent = `${pzImagenSelec.titulo || 'Imagen'} · ${pzCantidad} piezas`;
      pzBtnJugar.disabled = false;
    }
  }

  // ── Selector de piezas ─────────────────────────────────
  pzPiezasBotones.forEach(btn => {
    btn.addEventListener('click', () => {
      pzPiezasBotones.forEach(b => b.classList.remove('pz-piezas-btn--activa'));
      btn.classList.add('pz-piezas-btn--activa');
      pzCantidad = parseInt(btn.dataset.piezas, 10);
      pzActualizarEstado();
    });
  });

  // ── Subir imagen propia ────────────────────────────────
  pzDropzone.addEventListener('click', () => pzDropzoneInput.click());

  pzDropzone.addEventListener('dragover', e => {
    e.preventDefault();
    pzDropzone.classList.add('pz-dropzone--activa');
  });
  pzDropzone.addEventListener('dragleave', e => {
    if (e.target === pzDropzone) pzDropzone.classList.remove('pz-dropzone--activa');
  });
  pzDropzone.addEventListener('drop', e => {
    e.preventDefault();
    pzDropzone.classList.remove('pz-dropzone--activa');
    const file = e.dataTransfer.files[0];
    if (file) pzProcesarArchivo(file);
  });

  pzDropzoneInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) pzProcesarArchivo(file);
    pzDropzoneInput.value = '';
  });

  // Pegar imagen del portapapeles (solo en pantalla galería)
  document.addEventListener('paste', e => {
    if (pzPantallaGaleria.classList.contains('pz-oculta')) return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) {
          e.preventDefault();
          pzProcesarArchivo(f);
          return;
        }
      }
    }
  });

  // Recorta al cuadrado central y redimensiona a PZ_TAMANIO×PZ_TAMANIO
  function pzProcesarArchivo(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const lado = Math.min(img.width, img.height);
        const sx   = (img.width  - lado) / 2;
        const sy   = (img.height - lado) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = PZ_TAMANIO;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, PZ_TAMANIO, PZ_TAMANIO);
        ctx.drawImage(img, sx, sy, lado, lado, 0, 0, PZ_TAMANIO, PZ_TAMANIO);

        const dataUrl = canvas.toDataURL('image/jpeg', PZ_CALIDAD);
        const nuevo = {
          id:     'custom_' + Date.now(),
          titulo: file.name.replace(/\.[^.]+$/, '').slice(0, 30) || 'Foto',
          src:    dataUrl,
          predefinida: false,
        };
        pzImagenes.push(nuevo);
        pzImagenSelec = nuevo;       // seleccionarla automáticamente
        pzGuardarImagenes();
        pzRenderGaleria();
        pzActualizarEstado();
      };
      img.onerror = () => alert('No se pudo leer la imagen.');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── Iniciar partida ────────────────────────────────────
  pzBtnJugar.addEventListener('click', () => pzIniciarJuego());

  function pzIniciarJuego() {
    if (!pzImagenSelec) return;
    pzGanado = false;

    const { cols, rows } = PZ_LAYOUTS[pzCantidad];

    // Crear piezas con su posición correcta (col, row)
    const piezas = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        piezas.push({ id: `p_${r}_${c}`, correctCol: c, correctRow: r });
      }
    }

    // Renderizar tablero (slots vacíos)
    pzTablero.innerHTML = '';
    pzTablero.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    pzTablero.style.aspectRatio = `${cols} / ${rows}`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const slot = document.createElement('div');
        slot.className = 'pz-slot';
        slot.dataset.row = r;
        slot.dataset.col = c;
        pzHabilitarDrop(slot);
        pzTablero.appendChild(slot);
      }
    }

    // Renderizar bandeja con piezas mezcladas
    const mezcladas = [...piezas].sort(() => Math.random() - 0.5);
    pzBandeja.innerHTML = '';
    // Aspect ratio de la pieza en la bandeja: rows/cols del tablero
    const aspectPieza = `${cols} / ${rows}`;
    mezcladas.forEach(p => {
      const el = pzCrearPieza(p, cols, rows, aspectPieza);
      pzBandeja.appendChild(el);
    });
    pzHabilitarDrop(pzBandeja);

    // Pista (imagen completa, oculta por defecto)
    pzPistaImg.src = pzImagenSelec.src;
    pzPistaImg.classList.add('pz-oculta');

    // Reset stats + cronómetro
    pzMovs = 0;
    pzMovsEl.textContent = '0';
    pzTiempoEl.textContent = '00:00';
    pzTiempoIni = Date.now();
    clearInterval(pzIntervalo);
    pzIntervalo = setInterval(pzTickTiempo, 1000);

    // Cambiar pantalla
    pzPantallaGaleria.classList.add('pz-oculta');
    pzPantallaJuego.classList.remove('pz-oculta');
    pzPantallaVictoria.classList.add('pz-oculta');
  }

  function pzCrearPieza(piezaData, cols, rows, aspectPieza) {
    const el = document.createElement('div');
    el.className = 'pz-pieza';
    el.dataset.id         = piezaData.id;
    el.dataset.correctCol = piezaData.correctCol;
    el.dataset.correctRow = piezaData.correctRow;
    el.draggable = true;
    el.style.aspectRatio = aspectPieza;

    // El truco: background-image con tamaño = (cols×100%) × (rows×100%)
    // y background-position desplazado a la celda correspondiente.
    // background-position 0% = mostrar columna 0; 100% = mostrar última columna
    el.style.backgroundImage = `url("${piezaData_src(pzImagenSelec.src)}")`;
    el.style.backgroundSize  = `${cols * 100}% ${rows * 100}%`;
    const xPct = cols > 1 ? (piezaData.correctCol / (cols - 1)) * 100 : 0;
    const yPct = rows > 1 ? (piezaData.correctRow / (rows - 1)) * 100 : 0;
    el.style.backgroundPosition = `${xPct}% ${yPct}%`;

    pzHabilitarDrag(el);
    return el;
  }

  // Helper para escapar comillas dentro de url() (data URLs son seguras,
  // pero por si acaso)
  function piezaData_src(src) {
    return src.replace(/"/g, '\\"');
  }

  // ── Drag & drop ────────────────────────────────────────
  function pzHabilitarDrag(pieza) {
    pieza.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', pieza.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      pieza.classList.add('pz-pieza--arrastrando');
    });
    pieza.addEventListener('dragend', () => {
      pieza.classList.remove('pz-pieza--arrastrando');
    });
  }

  function pzHabilitarDrop(zona) {
    zona.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (zona.classList.contains('pz-slot')) zona.classList.add('pz-slot--objetivo');
      if (zona === pzBandeja)                  zona.classList.add('pz-bandeja--objetivo');
    });
    zona.addEventListener('dragleave', () => {
      zona.classList.remove('pz-slot--objetivo');
      zona.classList.remove('pz-bandeja--objetivo');
    });
    zona.addEventListener('drop', e => {
      e.preventDefault();
      zona.classList.remove('pz-slot--objetivo');
      zona.classList.remove('pz-bandeja--objetivo');

      const id = e.dataTransfer.getData('text/plain');
      if (!id) return;
      const pieza = document.querySelector(`.pz-pieza[data-id="${id}"]`);
      if (!pieza) return;

      const origenPadre = pieza.parentNode;

      if (zona.classList.contains('pz-slot')) {
        // Soltar en un slot del tablero
        if (zona === origenPadre) return; // misma posición, ignorar
        if (zona.children.length > 0) {
          // Slot ocupado: intercambiar piezas
          const existente = zona.children[0];
          if (origenPadre.classList.contains('pz-slot')) {
            origenPadre.appendChild(existente);
          } else {
            // origen era la bandeja
            pzBandeja.appendChild(existente);
          }
        }
        zona.appendChild(pieza);
      } else if (zona === pzBandeja || zona.classList.contains('pz-bandeja-wrapper')) {
        // Soltar en la bandeja: liberar slot de origen
        pzBandeja.appendChild(pieza);
      }

      pzMovs++;
      pzMovsEl.textContent = pzMovs;
      pzComprobarVictoria();
    });
  }

  // ── Comprobar victoria ─────────────────────────────────
  function pzComprobarVictoria() {
    const slots = pzTablero.querySelectorAll('.pz-slot');
    for (const slot of slots) {
      const pieza = slot.firstElementChild;
      if (!pieza) return;
      if (pieza.dataset.correctRow !== slot.dataset.row) return;
      if (pieza.dataset.correctCol !== slot.dataset.col) return;
    }
    pzGanado = true;
    clearInterval(pzIntervalo);
    setTimeout(pzMostrarVictoria, 350);
  }

  function pzMostrarVictoria() {
    pzVictoriaTiempo.textContent = pzTiempoEl.textContent;
    pzVictoriaMovs.textContent   = pzMovs;
    pzVictoriaImg.src            = pzImagenSelec.src;
    pzPantallaJuego.classList.add('pz-oculta');
    pzPantallaVictoria.classList.remove('pz-oculta');

    // ── Nivel 2: guardar partida si hay sesión ──
    // Puntos = inversamente proporcional al número de movimientos
    const segs   = Math.floor((Date.now() - pzTiempoIni) / 1000);
    const puntos = Math.max(10, 200 - pzMovs * 2 - segs);
    if (window.MentActiva?.guardarPartida) {
      window.MentActiva.guardarPartida({
        puntos:       puntos,
        duracion_seg: segs,
        datos:        { piezas: pzCantidad, movimientos: pzMovs },
      });
    }
  }

  // ── Cronómetro ─────────────────────────────────────────
  function pzTickTiempo() {
    const seg = Math.floor((Date.now() - pzTiempoIni) / 1000);
    const m = String(Math.floor(seg / 60)).padStart(2, '0');
    const s = String(seg % 60).padStart(2, '0');
    pzTiempoEl.textContent = `${m}:${s}`;
  }

  // ── Botón pista (mostrar/ocultar imagen completa) ──────
  let pzPistaTimeout = null;
  pzBtnPista.addEventListener('mousedown',  pzMostrarPista);
  pzBtnPista.addEventListener('touchstart', pzMostrarPista);
  pzBtnPista.addEventListener('mouseup',    pzOcultarPista);
  pzBtnPista.addEventListener('mouseleave', pzOcultarPista);
  pzBtnPista.addEventListener('touchend',   pzOcultarPista);
  function pzMostrarPista(e) {
    e.preventDefault();
    pzPistaImg.classList.remove('pz-oculta');
    clearTimeout(pzPistaTimeout);
    pzPistaTimeout = setTimeout(pzOcultarPista, 4000);  // auto-ocultar a los 4s
  }
  function pzOcultarPista() {
    pzPistaImg.classList.add('pz-oculta');
    clearTimeout(pzPistaTimeout);
  }

  // ── Navegación ─────────────────────────────────────────
  pzBtnVolver.addEventListener('click', () => {
    clearInterval(pzIntervalo);
    pzPantallaJuego.classList.add('pz-oculta');
    pzPantallaGaleria.classList.remove('pz-oculta');
  });

  pzBtnJugarOtro.addEventListener('click', () => {
    pzPantallaVictoria.classList.add('pz-oculta');
    pzIniciarJuego();
  });

  pzBtnVolverGaleria.addEventListener('click', () => {
    pzPantallaVictoria.classList.add('pz-oculta');
    pzPantallaGaleria.classList.remove('pz-oculta');
  });

  // ── Utilidades ─────────────────────────────────────────
  function pzEscapar(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function pzEscaparAtrib(s) {
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── Arranque ───────────────────────────────────────────
  pzRenderGaleria();
  pzActualizarEstado();

})();
