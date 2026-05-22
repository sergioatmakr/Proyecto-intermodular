/* ============================================================
   sopa.js — Juego "Sopa de Letras"
   - Genera grid colocando palabras en 4 direcciones "hacia delante"
     (→ ↓ ↘ ↗), con choque permitido si las letras coinciden
   - Selección por arrastre (pointer events, funciona en mouse y touch)
   ============================================================ */

(function () {
  'use strict';

  // ── Config inyectada desde Laravel ─────────────────────
  const SP_INICIALES = window.SP_CONFIG ? window.SP_CONFIG.palabras : [];
  const SP_CONFIG    = window.SP_CONFIG ? window.SP_CONFIG.config   : {
    tam_grid_min: 10, tam_grid_max: 15, palabras_recomendadas: 8,
  };

  // 4 direcciones permitidas, todas se leen "hacia delante" (más fácil
  // de leer para personas mayores): [deltaFila, deltaCol]
  const SP_DIRECCIONES = [
    [0,  1],   // horizontal →  (izquierda → derecha)
    [1,  0],   // vertical   ↓  (arriba → abajo)
    [1,  1],   // diagonal   ↘  (arriba-izquierda → abajo-derecha)
    [-1, 1],   // diagonal   ↗  (abajo-izquierda → arriba-derecha)
  ];

  const SP_ALFABETO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

  // ── Estado ──────────────────────────────────────────────
  let spPool        = spCargarPool();    // todas las palabras almacenadas
  let spSelecPool   = new Set();          // palabras seleccionadas para la partida
  let spGrid        = [];                  // matriz de letras del juego activo
  let spUbicaciones = [];                  // { palabra, celdas:[[r,c]...] }
  let spEncontradas = new Set();           // palabras ya encontradas
  let spTiempoIni   = 0;
  let spIntervalo   = null;

  // Estado de la selección por arrastre
  let spArrastrando = false;
  let spIni         = null;  // { r, c }
  let spFin         = null;  // { r, c }

  // ── Refs DOM ────────────────────────────────────────────
  const spPantallaConfig    = document.getElementById('sp-pantalla-config');
  const spPantallaJuego     = document.getElementById('sp-pantalla-juego');
  const spPantallaVictoria  = document.getElementById('sp-pantalla-victoria');
  const spListaEl           = document.getElementById('sp-palabras-lista');
  const spInputPalabra      = document.getElementById('sp-input-palabra');
  const spBtnAñadir         = document.getElementById('sp-btn-añadir');
  const spBtnSelTodas       = document.getElementById('sp-btn-sel-todas');
  const spBtnSelNinguna     = document.getElementById('sp-btn-sel-ninguna');
  const spBtnSelAleatoria   = document.getElementById('sp-btn-sel-aleatoria');
  const spContadorEl        = document.getElementById('sp-contador');
  const spBtnJugar          = document.getElementById('sp-btn-jugar');
  const spBtnVolver         = document.getElementById('sp-btn-volver');
  const spGridEl            = document.getElementById('sp-grid');
  const spObjetivoEl        = document.getElementById('sp-objetivo');
  const spTiempoEl          = document.getElementById('sp-tiempo');
  const spEncontradasEl     = document.getElementById('sp-encontradas');
  const spTotalEl           = document.getElementById('sp-total');
  const spVictoriaTiempo    = document.getElementById('sp-victoria-tiempo');
  const spVictoriaPalabras  = document.getElementById('sp-victoria-palabras');
  const spBtnOtra           = document.getElementById('sp-btn-otra');
  const spBtnCambiar        = document.getElementById('sp-btn-cambiar');

  if (!spGridEl) return;

  // ── Persistencia del pool de palabras en BD (window.MentActiva) ──
  function spCargarPool() {
    const e = window.MentActiva && window.MentActiva.cargarEstado
      ? window.MentActiva.cargarEstado() : null;
    if (e && Array.isArray(e) && e.length) return e;
    return [...SP_INICIALES];
  }
  function spGuardarPool() {
    if (window.MentActiva && window.MentActiva.guardarEstado) {
      window.MentActiva.guardarEstado(spPool);
    }
  }

  // ── Normalizar palabras (mayúsculas, sin tildes ni símbolos) ──
  function spNormalizar(s) {
    return s.toUpperCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')   // quita acentos
      .replace(/[^A-ZÑ]/g, '');                              // solo letras
  }

  // ── Pantalla de configuración ──────────────────────────
  function spRenderLista() {
    spListaEl.innerHTML = '';
    if (spPool.length === 0) {
      spListaEl.innerHTML = '<p style="color: var(--sp-subtexto); grid-column: 1/-1; text-align: center; padding: 14px 0; font-style: italic;">Pool vacío. Añade palabras abajo.</p>';
      spActualizarContador();
      return;
    }
    spPool.forEach(palabra => {
      const item = document.createElement('div');
      item.className = 'sp-palabra-item' + (spSelecPool.has(palabra) ? ' sp-palabra-item--activa' : '');
      item.innerHTML = `
        <span class="sp-palabra-item__check"></span>
        <span class="sp-palabra-item__texto">${palabra}</span>
        <button class="sp-palabra-item__borrar" title="Eliminar del pool">✕</button>
      `;
      item.addEventListener('click', e => {
        if (e.target.closest('.sp-palabra-item__borrar')) return;
        if (spSelecPool.has(palabra)) spSelecPool.delete(palabra);
        else spSelecPool.add(palabra);
        spRenderLista();
      });
      item.querySelector('.sp-palabra-item__borrar').addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm(`¿Eliminar "${palabra}" del pool?`)) return;
        spPool = spPool.filter(p => p !== palabra);
        spSelecPool.delete(palabra);
        spGuardarPool();
        spRenderLista();
      });
      spListaEl.appendChild(item);
    });
    spActualizarContador();
  }

  function spActualizarContador() {
    const n = spSelecPool.size;
    spContadorEl.textContent = n === 0
      ? '0 palabras seleccionadas'
      : `${n} palabra${n !== 1 ? 's' : ''} seleccionada${n !== 1 ? 's' : ''}`;
    spBtnJugar.disabled = n < 3;
    if (n < 3 && n > 0) {
      spContadorEl.textContent += ' (mínimo 3)';
    }
  }

  spBtnSelTodas.addEventListener('click', () => {
    spPool.forEach(p => spSelecPool.add(p));
    spRenderLista();
  });
  spBtnSelNinguna.addEventListener('click', () => {
    spSelecPool.clear();
    spRenderLista();
  });
  spBtnSelAleatoria.addEventListener('click', () => {
    spSelecPool.clear();
    const mezclado = [...spPool].sort(() => Math.random() - 0.5);
    mezclado.slice(0, Math.min(SP_CONFIG.palabras_recomendadas, mezclado.length))
            .forEach(p => spSelecPool.add(p));
    spRenderLista();
  });

  // ── Añadir palabra al pool ─────────────────────────────
  spBtnAñadir.addEventListener('click', spAñadirPalabra);
  spInputPalabra.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); spAñadirPalabra(); }
  });

  function spAñadirPalabra() {
    const txt = spNormalizar(spInputPalabra.value);
    if (txt.length < 3) { alert('La palabra debe tener al menos 3 letras.'); return; }
    if (txt.length > 15) { alert('Máximo 15 letras por palabra.'); return; }
    if (spPool.includes(txt)) { alert('Ya está en el pool.'); spInputPalabra.value = ''; return; }
    spPool.push(txt);
    spGuardarPool();
    spSelecPool.add(txt);
    spInputPalabra.value = '';
    spRenderLista();
  }

  // ── Iniciar partida ────────────────────────────────────
  spBtnJugar.addEventListener('click', () => spIniciarPartida());

  function spIniciarPartida() {
    // Cuadrícula FIJA de 7×7 (letras grandes, mejor visibilidad para mayores)
    const TAM = 7;

    // En un grid de 7×7 solo caben palabras de hasta 7 letras
    let palabras    = [...spSelecPool].filter(p => p.length <= TAM);
    const muyLargas = [...spSelecPool].filter(p => p.length > TAM);

    if (palabras.length < 3) {
      alert('Para la cuadrícula 7×7 necesitas al menos 3 palabras de 7 letras o menos.');
      return;
    }

    // Ordenar por longitud descendente: las largas se colocan primero
    palabras.sort((a, b) => b.length - a.length);

    const resultado = spGenerarSopa(palabras, TAM);
    spGrid = resultado.grid;
    spUbicaciones = resultado.ubicaciones;

    const fallidas = [...muyLargas, ...resultado.fallidas];
    if (fallidas.length > 0) {
      alert(`Estas palabras no caben en la cuadrícula 7×7: ${fallidas.join(', ')}.`);
      if (resultado.ubicaciones.length < 3) return;
    }

    spEncontradas = new Set();
    spRenderGridJuego();
    spRenderObjetivo();

    spEncontradasEl.textContent = '0';
    spTotalEl.textContent       = spUbicaciones.length;
    spTiempoIni = Date.now();
    clearInterval(spIntervalo);
    spIntervalo = setInterval(spTickTiempo, 1000);
    spTiempoEl.textContent = '00:00';

    spPantallaConfig.classList.add('sp-oculta');
    spPantallaVictoria.classList.add('sp-oculta');
    spPantallaJuego.classList.remove('sp-oculta');
  }

  // ── Generación de la sopa ──────────────────────────────
  function spGenerarSopa(palabras, tam) {
    const grid = Array.from({ length: tam }, () => Array(tam).fill(null));
    const ubicaciones = [];
    const fallidas    = [];

    for (const palabra of palabras) {
      const ubicacion = spIntentarColocar(palabra, grid, tam);
      if (ubicacion) ubicaciones.push(ubicacion);
      else           fallidas.push(palabra);
    }

    // Rellenar huecos con letras aleatorias
    for (let r = 0; r < tam; r++) {
      for (let c = 0; c < tam; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = SP_ALFABETO[Math.floor(Math.random() * SP_ALFABETO.length)];
        }
      }
    }
    return { grid, ubicaciones, fallidas };
  }

  function spIntentarColocar(palabra, grid, tam) {
    // 200 intentos: dirección y posición de inicio aleatoria
    for (let intento = 0; intento < 200; intento++) {
      const [dr, dc] = SP_DIRECCIONES[Math.floor(Math.random() * SP_DIRECCIONES.length)];
      const r = Math.floor(Math.random() * tam);
      const c = Math.floor(Math.random() * tam);

      // Comprobar que cabe
      const finR = r + dr * (palabra.length - 1);
      const finC = c + dc * (palabra.length - 1);
      if (finR < 0 || finR >= tam || finC < 0 || finC >= tam) continue;

      // Comprobar que no choca (o que choca solo donde la letra coincide)
      let cabe = true;
      for (let i = 0; i < palabra.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        if (grid[rr][cc] !== null && grid[rr][cc] !== palabra[i]) { cabe = false; break; }
      }
      if (!cabe) continue;

      // Colocar
      const celdas = [];
      for (let i = 0; i < palabra.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        grid[rr][cc] = palabra[i];
        celdas.push([rr, cc]);
      }
      return { palabra, celdas };
    }
    return null;
  }

  // ── Renderizar grid del juego ──────────────────────────
  function spRenderGridJuego() {
    const tam = spGrid.length;
    spGridEl.innerHTML = '';
    spGridEl.style.gridTemplateColumns = `repeat(${tam}, 1fr)`;

    for (let r = 0; r < tam; r++) {
      for (let c = 0; c < tam; c++) {
        const celda = document.createElement('div');
        celda.className = 'sp-celda';
        celda.dataset.r = r;
        celda.dataset.c = c;
        celda.textContent = spGrid[r][c];
        spGridEl.appendChild(celda);
      }
    }

    // Pointer events: funcionan en mouse y touch
    spGridEl.addEventListener('pointerdown', spOnPointerDown);
    spGridEl.addEventListener('pointermove', spOnPointerMove);
    document.addEventListener('pointerup',   spOnPointerUp);
    document.addEventListener('pointercancel', spOnPointerUp);
  }

  function spRenderObjetivo() {
    spObjetivoEl.innerHTML = `
      <div class="sp-objetivo__titulo">Palabras a encontrar (${spUbicaciones.length})</div>
      <div class="sp-objetivo__lista" id="sp-objetivo-lista"></div>
    `;
    const lista = spObjetivoEl.querySelector('#sp-objetivo-lista');
    spUbicaciones.forEach(u => {
      const s = document.createElement('span');
      s.className = 'sp-objetivo__palabra';
      s.dataset.palabra = u.palabra;
      s.textContent = u.palabra;
      lista.appendChild(s);
    });
  }

  // ── Selección por arrastre ─────────────────────────────
  function spCeldaDesdeEvento(e) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target || !target.classList.contains('sp-celda')) return null;
    return { r: +target.dataset.r, c: +target.dataset.c, el: target };
  }

  function spOnPointerDown(e) {
    const cel = spCeldaDesdeEvento(e);
    if (!cel) return;
    e.preventDefault();
    spArrastrando = true;
    spIni = cel;
    spFin = cel;
    spActualizarResaltado();
  }

  function spOnPointerMove(e) {
    if (!spArrastrando) return;
    const cel = spCeldaDesdeEvento(e);
    if (cel) {
      spFin = cel;
      spActualizarResaltado();
    }
  }

  function spOnPointerUp() {
    if (!spArrastrando) return;
    spArrastrando = false;
    spValidarSeleccion();
    spLimpiarSeleccion();
  }

  // Calcula la lista de celdas que forman una línea recta entre Ini y Fin.
  // Devuelve null si no es línea recta válida.
  function spCeldasLinea(ini, fin) {
    const dr = fin.r - ini.r;
    const dc = fin.c - ini.c;
    if (dr === 0 && dc === 0) return [{ r: ini.r, c: ini.c }];

    const esRecta = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (!esRecta) return null;

    const pasos = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = Math.sign(dr);
    const stepC = Math.sign(dc);
    const celdas = [];
    for (let i = 0; i <= pasos; i++) {
      celdas.push({ r: ini.r + stepR * i, c: ini.c + stepC * i });
    }
    return celdas;
  }

  function spActualizarResaltado() {
    spLimpiarSeleccion();
    const celdas = spCeldasLinea(spIni, spFin);
    if (!celdas) return;
    celdas.forEach(({ r, c }) => {
      const el = spGridEl.querySelector(`.sp-celda[data-r="${r}"][data-c="${c}"]`);
      if (el) el.classList.add('sp-celda--seleccionada');
    });
  }

  function spLimpiarSeleccion() {
    spGridEl.querySelectorAll('.sp-celda--seleccionada')
      .forEach(el => el.classList.remove('sp-celda--seleccionada'));
  }

  // ── Validación: ¿la selección forma una palabra objetivo? ──
  function spValidarSeleccion() {
    const celdas = spCeldasLinea(spIni, spFin);
    if (!celdas || celdas.length < 3) return;

    const palabraAdelante = celdas.map(({ r, c }) => spGrid[r][c]).join('');
    const palabraReversa  = palabraAdelante.split('').reverse().join('');

    const ubic = spUbicaciones.find(u =>
      !spEncontradas.has(u.palabra) &&
      (u.palabra === palabraAdelante || u.palabra === palabraReversa)
    );
    if (!ubic) return;

    // Validar también que las celdas coincidan con las de la ubicación real
    // (evita falsos positivos por solapamientos)
    const setSel = new Set(celdas.map(c => `${c.r},${c.c}`));
    const setUbi = new Set(ubic.celdas.map(([r, c]) => `${r},${c}`));
    if (setSel.size !== setUbi.size) return;
    for (const k of setSel) if (!setUbi.has(k)) return;

    // ¡Encontrada!
    spEncontradas.add(ubic.palabra);
    ubic.celdas.forEach(([r, c]) => {
      const el = spGridEl.querySelector(`.sp-celda[data-r="${r}"][data-c="${c}"]`);
      if (el) el.classList.add('sp-celda--encontrada');
    });
    const tag = spObjetivoEl.querySelector(`.sp-objetivo__palabra[data-palabra="${ubic.palabra}"]`);
    if (tag) tag.classList.add('sp-objetivo__palabra--encontrada');

    spEncontradasEl.textContent = spEncontradas.size;

    if (spEncontradas.size === spUbicaciones.length) {
      clearInterval(spIntervalo);
      setTimeout(spMostrarVictoria, 400);
    }
  }

  // ── Cronómetro ─────────────────────────────────────────
  function spTickTiempo() {
    const seg = Math.floor((Date.now() - spTiempoIni) / 1000);
    const m = String(Math.floor(seg / 60)).padStart(2, '0');
    const s = String(seg % 60).padStart(2, '0');
    spTiempoEl.textContent = `${m}:${s}`;
  }

  // ── Victoria ───────────────────────────────────────────
  function spMostrarVictoria() {
    spVictoriaTiempo.textContent  = spTiempoEl.textContent;
    spVictoriaPalabras.textContent = spUbicaciones.length;
    spPantallaJuego.classList.add('sp-oculta');
    spPantallaVictoria.classList.remove('sp-oculta');

    // ── Nivel 2: guardar partida si hay sesión ──
    const segs = Math.floor((Date.now() - spTiempoIni) / 1000);
    if (window.MentActiva?.guardarPartida) {
      window.MentActiva.guardarPartida({
        puntos:       spUbicaciones.length * 10,
        duracion_seg: segs,
        datos:        { palabras: spUbicaciones.length },
      });
    }
  }

  // ── Navegación ─────────────────────────────────────────
  spBtnVolver.addEventListener('click', () => {
    clearInterval(spIntervalo);
    spPantallaJuego.classList.add('sp-oculta');
    spPantallaConfig.classList.remove('sp-oculta');
  });

  spBtnOtra.addEventListener('click', () => {
    spPantallaVictoria.classList.add('sp-oculta');
    spIniciarPartida();
  });

  spBtnCambiar.addEventListener('click', () => {
    spPantallaVictoria.classList.add('sp-oculta');
    spPantallaConfig.classList.remove('sp-oculta');
  });

  // ── Arranque ───────────────────────────────────────────
  // Seleccionar 8 palabras aleatorias al cargar por primera vez
  if (spPool.length > 0) {
    const mezcla = [...spPool].sort(() => Math.random() - 0.5);
    mezcla.slice(0, Math.min(SP_CONFIG.palabras_recomendadas, mezcla.length))
          .forEach(p => spSelecPool.add(p));
  }
  spRenderLista();

})();
