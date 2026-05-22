/* ============================================================
   secuencias.js — Juego "Secuencias de Tareas"
   Integración con la API pública de ARASAAC para buscar
   pictogramas. Atribución obligatoria (CC BY-NC-SA).
   ============================================================ */

(function () {
  'use strict';

  // ── Configuración desde Laravel ─────────────────────────
  const SQ_INICIALES = window.SQ_CONFIG ? window.SQ_CONFIG.secuencias : [];
  const SQ_ARASAAC   = window.SQ_CONFIG ? window.SQ_CONFIG.arasaac    : {
    api_base:    'https://api.arasaac.org/api',
    static_base: 'https://static.arasaac.org/pictograms',
    locale:      'es',
    resolucion:  500,
  };

  // ── Estado ──────────────────────────────────────────────
  let sqSecuencias    = sqCargarSecuencias();
  let sqSecuenciaActiva = null;     // secuencia actualmente en pantalla de juego
  let sqEdicion       = null;       // borrador de la secuencia en el modal {id?, nombre, icono, pasos[]}
  let sqEditandoId    = null;       // si es edición de una existente, su id
  let sqPracticaOrden = [];         // orden elegido por el usuario en modo práctica
  let sqPracticaMezclados = [];     // los pasos mezclados (referencias)

  // ── Persistencia en BD (vía window.MentActiva) ──────────
  function sqCargarSecuencias() {
    const e = window.MentActiva && window.MentActiva.cargarEstado
      ? window.MentActiva.cargarEstado() : null;
    if (e && Array.isArray(e) && e.length) return e;
    return JSON.parse(JSON.stringify(SQ_INICIALES));
  }

  function sqGuardarSecuencias() {
    if (window.MentActiva && window.MentActiva.guardarEstado) {
      window.MentActiva.guardarEstado(sqSecuencias);
    }
  }

  // ── Helpers ARASAAC ─────────────────────────────────────
  function sqUrlImagen(idArasaac) {
    return `${SQ_ARASAAC.static_base}/${idArasaac}/${idArasaac}_${SQ_ARASAAC.resolucion}.png`;
  }

  async function sqBuscarPictogramas(termino) {
    const url = `${SQ_ARASAAC.api_base}/pictograms/${SQ_ARASAAC.locale}/bestsearch/${encodeURIComponent(termino)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Error ${resp.status} al consultar ARASAAC`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  }

  // ── Refs DOM ────────────────────────────────────────────
  const sqGrid             = document.getElementById('sq-grid');
  const sqBtnNueva         = document.getElementById('sq-btn-nueva');
  const sqPantallaLista    = document.getElementById('sq-pantalla-lista');
  const sqPantallaJuego    = document.getElementById('sq-pantalla-juego');
  const sqPantallaPractica = document.getElementById('sq-pantalla-practica');

  const sqJuegoIcono       = document.getElementById('sq-juego-icono');
  const sqJuegoTitulo      = document.getElementById('sq-juego-titulo');
  const sqPasos            = document.getElementById('sq-pasos');
  const sqBtnVolver        = document.getElementById('sq-btn-volver');
  const sqBtnModoPracticar = document.getElementById('sq-btn-modo-practicar');

  const sqPracticaTitulo   = document.getElementById('sq-practica-titulo');
  const sqPracticaMezcladosEl = document.getElementById('sq-practica-mezclados');
  const sqPracticaProgreso = document.getElementById('sq-practica-progreso');
  const sqPracticaResultado= document.getElementById('sq-practica-resultado');
  const sqBtnVolverPractica= document.getElementById('sq-btn-volver-practica');
  const sqBtnModoVer       = document.getElementById('sq-btn-modo-ver');
  const sqBtnReiniciarPractica = document.getElementById('sq-btn-reiniciar-practica');

  const sqModal            = document.getElementById('sq-modal');
  const sqModalTitulo      = document.getElementById('sq-modal-titulo');
  const sqModalCerrar      = document.getElementById('sq-modal-cerrar');
  const sqInputNombre      = document.getElementById('sq-input-nombre');
  const sqInputIcono       = document.getElementById('sq-input-icono');
  const sqPasosEdicion     = document.getElementById('sq-pasos-edicion');
  const sqInputBuscar      = document.getElementById('sq-input-buscar');
  const sqBtnBuscar        = document.getElementById('sq-btn-buscar');
  const sqResultados       = document.getElementById('sq-resultados');
  const sqBtnCancelar      = document.getElementById('sq-btn-cancelar');
  const sqBtnGuardar       = document.getElementById('sq-btn-guardar');

  if (!sqGrid) return;

  // ── Pantalla de lista ───────────────────────────────────
  function sqRenderizarLista() {
    sqGrid.innerHTML = '';
    if (sqSecuencias.length === 0) {
      sqGrid.innerHTML = '<p class="sq-vacio" style="grid-column:1/-1">Aún no hay secuencias. Crea una con el botón de abajo.</p>';
      return;
    }

    sqSecuencias.forEach(s => {
      const card = document.createElement('div');
      card.className = 'sq-secuencia-card';
      card.innerHTML = `
        <div class="sq-secuencia-card__icono">${s.icono || '📋'}</div>
        <div class="sq-secuencia-card__nombre">${sqEscapar(s.nombre)}</div>
        <div class="sq-secuencia-card__cuenta">${s.pasos.length} paso${s.pasos.length !== 1 ? 's' : ''}</div>
        <button class="sq-secuencia-card__editar" title="Editar">✏️</button>
        ${!s.predefinida ? `<button class="sq-secuencia-card__borrar" title="Eliminar">🗑️</button>` : ''}
      `;

      card.addEventListener('click', e => {
        if (e.target.closest('.sq-secuencia-card__editar, .sq-secuencia-card__borrar')) return;
        sqAbrirJuego(s.id);
      });

      card.querySelector('.sq-secuencia-card__editar').addEventListener('click', e => {
        e.stopPropagation();
        sqAbrirModal(s.id);
      });

      const btnBorrar = card.querySelector('.sq-secuencia-card__borrar');
      if (btnBorrar) {
        btnBorrar.addEventListener('click', e => {
          e.stopPropagation();
          if (confirm(`¿Eliminar la secuencia "${s.nombre}"?`)) {
            sqSecuencias = sqSecuencias.filter(x => x.id !== s.id);
            sqGuardarSecuencias();
            sqRenderizarLista();
          }
        });
      }

      sqGrid.appendChild(card);
    });
  }

  // ── Pantalla de juego (modo ver) ────────────────────────
  function sqAbrirJuego(secuenciaId) {
    const s = sqSecuencias.find(x => x.id === secuenciaId);
    if (!s) return;
    sqSecuenciaActiva = s;

    sqJuegoIcono.textContent  = s.icono || '📋';
    sqJuegoTitulo.textContent = s.nombre;

    sqPasos.innerHTML = '';
    s.pasos.forEach((paso, idx) => {
      const div = document.createElement('div');
      div.className = 'sq-paso';
      div.setAttribute('role', 'listitem');
      div.innerHTML = `
        <span class="sq-paso__numero">${idx + 1}</span>
        <div class="sq-paso__img"><span class="sq-paso__cargando">…</span></div>
        <div class="sq-paso__palabra">${sqEscapar(paso.palabra)}</div>
      `;
      sqCargarImagen(div.querySelector('.sq-paso__img'), paso.id_arasaac, paso.palabra);
      sqPasos.appendChild(div);
    });

    sqPantallaLista.classList.add('sq-oculta');
    sqPantallaJuego.classList.remove('sq-oculta');
    sqPantallaPractica.classList.add('sq-oculta');
  }

  function sqCargarImagen(contenedor, idArasaac, alt) {
    const img = new Image();
    img.src = sqUrlImagen(idArasaac);
    img.alt = alt || '';
    img.onload  = () => { contenedor.innerHTML = ''; contenedor.appendChild(img); };
    img.onerror = () => { contenedor.innerHTML = '<span class="sq-paso__cargando">❌</span>'; };
  }

  sqBtnVolver.addEventListener('click', () => {
    sqPantallaJuego.classList.add('sq-oculta');
    sqPantallaLista.classList.remove('sq-oculta');
    sqSecuenciaActiva = null;
  });

  // ── Modo practicar ──────────────────────────────────────
  sqBtnModoPracticar.addEventListener('click', () => {
    if (!sqSecuenciaActiva) return;
    sqIniciarPractica(sqSecuenciaActiva);
  });

  sqBtnModoVer.addEventListener('click', () => {
    if (!sqSecuenciaActiva) return;
    sqPantallaPractica.classList.add('sq-oculta');
    sqPantallaJuego.classList.remove('sq-oculta');
  });

  sqBtnVolverPractica.addEventListener('click', () => {
    sqPantallaPractica.classList.add('sq-oculta');
    sqPantallaLista.classList.remove('sq-oculta');
    sqSecuenciaActiva = null;
  });

  sqBtnReiniciarPractica.addEventListener('click', () => {
    if (sqSecuenciaActiva) sqIniciarPractica(sqSecuenciaActiva);
  });

  function sqIniciarPractica(s) {
    sqPracticaTitulo.textContent = s.nombre;
    sqPracticaResultado.textContent = '';
    sqPracticaResultado.className   = 'sq-practica-resultado';
    sqPracticaOrden = [];

    // Mezclar pasos
    sqPracticaMezclados = [...s.pasos].sort(() => Math.random() - 0.5);

    sqPracticaMezcladosEl.innerHTML = '';
    sqPracticaMezclados.forEach((paso) => {
      const div = document.createElement('div');
      div.className = 'sq-paso sq-paso--mezclado';
      div.dataset.idArasaac = paso.id_arasaac;
      div.innerHTML = `
        <span class="sq-paso__numero sq-paso__numero--practica"></span>
        <div class="sq-paso__img"><span class="sq-paso__cargando">…</span></div>
        <div class="sq-paso__palabra">${sqEscapar(paso.palabra)}</div>
      `;
      sqCargarImagen(div.querySelector('.sq-paso__img'), paso.id_arasaac, paso.palabra);

      div.addEventListener('click', () => sqMarcarPaso(div, paso));
      sqPracticaMezcladosEl.appendChild(div);
    });

    sqActualizarProgreso();

    sqPantallaJuego.classList.add('sq-oculta');
    sqPantallaPractica.classList.remove('sq-oculta');
  }

  function sqMarcarPaso(div, paso) {
    if (div.classList.contains('sq-paso--marcado')) return;
    sqPracticaOrden.push(paso);
    const idx = sqPracticaOrden.length;
    div.classList.add('sq-paso--marcado');
    div.querySelector('.sq-paso__numero--practica').textContent = idx;
    sqActualizarProgreso();

    if (sqPracticaOrden.length === sqSecuenciaActiva.pasos.length) {
      sqComprobarPractica();
    }
  }

  function sqActualizarProgreso() {
    const total = sqSecuenciaActiva.pasos.length;
    const hechos = sqPracticaOrden.length;
    sqPracticaProgreso.textContent = `${hechos} / ${total}`;
  }

  function sqComprobarPractica() {
    const correctos = sqSecuenciaActiva.pasos;
    let aciertos = 0;

    sqPracticaOrden.forEach((paso, idx) => {
      const ok = correctos[idx].id_arasaac === paso.id_arasaac;
      if (ok) aciertos++;
      // Marcar visualmente el paso correspondiente
      const div = [...sqPracticaMezcladosEl.children]
        .find(d => +d.dataset.idArasaac === paso.id_arasaac);
      if (div) div.classList.add(ok ? 'sq-paso--correcto-final' : 'sq-paso--incorrecto-final');
    });

    if (aciertos === correctos.length) {
      sqPracticaResultado.textContent = `🎉 ¡Perfecto! ${aciertos}/${correctos.length}`;
      sqPracticaResultado.className   = 'sq-practica-resultado sq-practica-resultado--bien';
    } else {
      sqPracticaResultado.textContent = `${aciertos}/${correctos.length} en su sitio. ¡Sigue intentando!`;
      sqPracticaResultado.className   = 'sq-practica-resultado sq-practica-resultado--mal';
    }

    // ── Nivel 2: guardar partida si hay sesión ──
    if (window.MentActiva?.guardarPartida) {
      window.MentActiva.guardarPartida({
        puntos: aciertos * 10,
        datos:  {
          secuencia: sqSecuenciaActiva.nombre,
          aciertos,
          total: correctos.length,
        },
      });
    }
  }

  // ── Modal de edición ────────────────────────────────────
  sqBtnNueva.addEventListener('click', () => sqAbrirModal(null));

  function sqAbrirModal(secuenciaId) {
    if (secuenciaId) {
      const s = sqSecuencias.find(x => x.id === secuenciaId);
      if (!s) return;
      sqEditandoId = s.id;
      sqEdicion = {
        nombre: s.nombre,
        icono:  s.icono,
        pasos:  s.pasos.map(p => ({ ...p })),
      };
      sqModalTitulo.textContent = 'Editar secuencia';
    } else {
      sqEditandoId = null;
      sqEdicion = { nombre: '', icono: '📋', pasos: [] };
      sqModalTitulo.textContent = 'Nueva secuencia';
    }

    sqInputNombre.value = sqEdicion.nombre;
    sqInputIcono.value  = sqEdicion.icono;
    sqInputBuscar.value = '';
    sqResultados.innerHTML = '<p class="sq-resultados-hint">Escribe una palabra y pulsa "Buscar". Haz clic en un pictograma para añadirlo como nuevo paso.</p>';

    sqRenderizarPasosEdicion();
    sqModal.classList.remove('sq-oculta');
    setTimeout(() => sqInputNombre.focus(), 50);
  }

  sqModalCerrar.addEventListener('click', sqCerrarModal);
  sqBtnCancelar.addEventListener('click', sqCerrarModal);
  sqModal.addEventListener('click', e => { if (e.target === sqModal) sqCerrarModal(); });

  function sqCerrarModal() {
    sqModal.classList.add('sq-oculta');
    sqEdicion = null;
    sqEditandoId = null;
  }

  function sqRenderizarPasosEdicion() {
    sqPasosEdicion.innerHTML = '';
    if (sqEdicion.pasos.length === 0) {
      sqPasosEdicion.innerHTML = '<p class="sq-vacio">Aún no hay pasos. Búscalos abajo y añádelos.</p>';
      return;
    }
    sqEdicion.pasos.forEach((paso, idx) => {
      const div = document.createElement('div');
      div.className = 'sq-paso-edit';
      div.innerHTML = `
        <span class="sq-paso-edit__numero">${idx + 1}</span>
        <div class="sq-paso-edit__img"><img src="${sqUrlImagen(paso.id_arasaac)}" alt="${sqEscapar(paso.palabra)}"></div>
        <div class="sq-paso-edit__palabra">${sqEscapar(paso.palabra)}</div>
        <div class="sq-paso-edit__acciones">
          <button class="sq-paso-edit__btn" data-act="up"     title="Subir">↑</button>
          <button class="sq-paso-edit__btn" data-act="down"   title="Bajar">↓</button>
          <button class="sq-paso-edit__btn sq-paso-edit__btn--borrar" data-act="del" title="Quitar">✕</button>
        </div>
      `;
      div.querySelectorAll('.sq-paso-edit__btn').forEach(btn => {
        btn.addEventListener('click', () => sqAccionPaso(idx, btn.dataset.act));
      });
      sqPasosEdicion.appendChild(div);
    });
  }

  function sqAccionPaso(idx, accion) {
    if (accion === 'del') {
      sqEdicion.pasos.splice(idx, 1);
    } else if (accion === 'up' && idx > 0) {
      [sqEdicion.pasos[idx - 1], sqEdicion.pasos[idx]] = [sqEdicion.pasos[idx], sqEdicion.pasos[idx - 1]];
    } else if (accion === 'down' && idx < sqEdicion.pasos.length - 1) {
      [sqEdicion.pasos[idx + 1], sqEdicion.pasos[idx]] = [sqEdicion.pasos[idx], sqEdicion.pasos[idx + 1]];
    }
    sqRenderizarPasosEdicion();
  }

  // ── Búsqueda ARASAAC ────────────────────────────────────
  async function sqEjecutarBusqueda() {
    const termino = sqInputBuscar.value.trim();
    if (!termino) { sqInputBuscar.focus(); return; }

    sqBtnBuscar.disabled = true;
    sqResultados.innerHTML = '<p class="sq-resultados-hint">Buscando en ARASAAC…</p>';

    try {
      const data = await sqBuscarPictogramas(termino);
      sqRenderizarResultados(data);
    } catch (e) {
      sqResultados.innerHTML = `<p class="sq-resultados-error">No se pudo conectar con ARASAAC. ${sqEscapar(e.message)}</p>`;
    } finally {
      sqBtnBuscar.disabled = false;
    }
  }

  sqBtnBuscar.addEventListener('click', sqEjecutarBusqueda);
  sqInputBuscar.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sqEjecutarBusqueda(); }
  });

  function sqRenderizarResultados(pictogramas) {
    sqResultados.innerHTML = '';
    if (!pictogramas.length) {
      sqResultados.innerHTML = '<p class="sq-resultados-hint">Sin resultados. Prueba otra palabra.</p>';
      return;
    }
    // Limitar a los primeros 24 para no abrumar
    pictogramas.slice(0, 24).forEach(p => {
      const kw = (p.keywords && p.keywords[0] && p.keywords[0].keyword) || `#${p._id}`;
      const item = document.createElement('div');
      item.className = 'sq-resultado-item';
      item.title = `Añadir "${kw}" como paso`;
      item.innerHTML = `
        <img src="${sqUrlImagen(p._id)}" alt="${sqEscapar(kw)}" loading="lazy">
        <div class="sq-resultado-item__kw">${sqEscapar(kw)}</div>
      `;
      item.addEventListener('click', () => {
        sqEdicion.pasos.push({ id_arasaac: p._id, palabra: sqCapitalizar(kw) });
        sqRenderizarPasosEdicion();
      });
      sqResultados.appendChild(item);
    });
  }

  // ── Guardar secuencia ───────────────────────────────────
  sqBtnGuardar.addEventListener('click', () => {
    const nombre = sqInputNombre.value.trim();
    if (!nombre) { alert('Pon un nombre a la secuencia.'); sqInputNombre.focus(); return; }
    if (sqEdicion.pasos.length < 2) {
      alert('Añade al menos 2 pasos antes de guardar.');
      return;
    }
    sqEdicion.nombre = nombre;
    sqEdicion.icono  = sqInputIcono.value.trim() || '📋';

    if (sqEditandoId) {
      // Editar existente
      const idx = sqSecuencias.findIndex(x => x.id === sqEditandoId);
      if (idx !== -1) {
        sqSecuencias[idx] = {
          ...sqSecuencias[idx],
          nombre: sqEdicion.nombre,
          icono:  sqEdicion.icono,
          pasos:  sqEdicion.pasos,
        };
      }
    } else {
      // Crear nueva
      sqSecuencias.push({
        id:          'custom_' + Date.now(),
        nombre:      sqEdicion.nombre,
        icono:       sqEdicion.icono,
        predefinida: false,
        pasos:       sqEdicion.pasos,
      });
    }
    sqGuardarSecuencias();
    sqCerrarModal();
    sqRenderizarLista();
  });

  // ── Utilidades ──────────────────────────────────────────
  function sqEscapar(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function sqCapitalizar(s) {
    s = String(s).trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ── Arranque ────────────────────────────────────────────
  sqRenderizarLista();

})();
