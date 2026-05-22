/* ============================================================
   colores.js — Juego "¿Qué Color Escuchas?"
   ============================================================ */

(function () {
  'use strict';

  // ── Datos desde Laravel (inyectados en la vista Blade) ──────
  const CG_COLORES    = window.CG_CONFIG ? window.CG_CONFIG.colores    : [];
  const CG_MAX_RONDAS = window.CG_CONFIG ? window.CG_CONFIG.maxRondas  : 8;
  const CG_OPCIONES   = window.CG_CONFIG ? window.CG_CONFIG.opciones   : 4;

  const CG_TEXTOS = {
    escuchar:            'Escuchar',
    escuchando:          'Escuchando…',
    instruccion:         'Haz clic en "Escuchar" y luego selecciona el color.',
    instruccionDespues:  'Selecciona el cuadrado del color que escuchaste.',
    respuestasCorrectas:   ['¡Correcto! 🎉', '¡Genial! ✨', '¡Exacto! 🔥', '¡Perfecto! 💯'],
    respuestasIncorrectas: ['¡Incorrecto! ❌', 'Casi… ❌', 'No era ese ❌'],
    siguienteRonda:      'Siguiente ronda →',
    ultimaRonda:         'Ver resultado →',
  };

  // ── Estado ─────────────────────────────────────────────────
  let cgPuntos      = 0;
  let cgRondaActual = 1;
  let cgRacha       = 0;
  let cgObjetivo    = null;
  let cgRespondido  = false;
  let cgYaEscucho   = false;

  // ── Referencias al DOM ─────────────────────────────────────
  const cgBotonEscuchar   = document.getElementById('cg-boton-escuchar');
  const cgTextoEscuchar   = document.getElementById('cg-texto-escuchar');
  const cgCuadricula      = document.getElementById('cg-cuadricula');
  const cgBannerRespuesta = document.getElementById('cg-banner-respuesta');
  const cgBotonSiguiente  = document.getElementById('cg-boton-siguiente');
  const cgInstruccion     = document.getElementById('cg-instruccion');
  const cgElPuntos        = document.getElementById('cg-puntos');
  const cgElRonda         = document.getElementById('cg-ronda');
  const cgElRacha         = document.getElementById('cg-racha');
  const cgPantallaInicio  = document.getElementById('cg-pantalla-inicio');
  const cgBotonEmpezar    = document.getElementById('cg-boton-empezar');
  const cgPantallaFin     = document.getElementById('cg-pantalla-fin');
  const cgFinPuntos       = document.getElementById('cg-fin-puntos');
  const cgFinMensaje      = document.getElementById('cg-fin-mensaje');
  const cgBotonReiniciar  = document.getElementById('cg-boton-reiniciar');

  if (!cgBotonEmpezar) return;

  // ── Arranque ───────────────────────────────────────────────
  cgBotonEmpezar.addEventListener('click', () => {
    cgPantallaInicio.classList.add('cg-pantalla-inicio--oculta');
    cgNuevaRonda();
  });

  // ── Reinicio ───────────────────────────────────────────────
  cgBotonReiniciar.addEventListener('click', () => {
    cgPuntos      = 0;
    cgRondaActual = 1;
    cgRacha       = 0;
    cgPantallaFin.classList.add('cg-pantalla-inicio--oculta');
    cgNuevaRonda();
  });

  // ── Síntesis de voz ────────────────────────────────────────
  function cgHablar(texto, alTerminar) {
    if (!window.speechSynthesis) { alTerminar && alTerminar(); return; }
    window.speechSynthesis.cancel();
    const enunciado  = new SpeechSynthesisUtterance(texto);
    enunciado.lang   = 'es-ES';
    enunciado.rate   = 0.78;
    enunciado.pitch  = 1.0;
    const vozEspanol = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
    if (vozEspanol) enunciado.voice = vozEspanol;
    enunciado.onend  = alTerminar || null;
    enunciado.onerror = alTerminar || null;
    window.speechSynthesis.speak(enunciado);
  }

  // ── Elegir N colores aleatorios ────────────────────────────
  function cgElegirColores() {
    const bolsa    = [...CG_COLORES];
    const elegidos = [];
    while (elegidos.length < CG_OPCIONES) {
      const indice = Math.floor(Math.random() * bolsa.length);
      elegidos.push(bolsa.splice(indice, 1)[0]);
    }
    return elegidos;
  }

  // ── Renderizar cuadrícula ──────────────────────────────────
  function cgRenderizarCuadricula(colores) {
    cgCuadricula.innerHTML = '';
    colores.forEach(color => {
      const boton = document.createElement('button');
      boton.className        = 'cg-boton-color';
      boton.dataset.cgNombre = color.nombre;
      boton.style.background = color.hex;
      boton.style.boxShadow  = `0 4px 16px ${color.hex}55`;
      boton.setAttribute('aria-label', color.nombre);

      const icono = document.createElement('span');
      icono.className = 'cg-boton-color__icono';
      icono.setAttribute('aria-hidden', 'true');
      boton.appendChild(icono);

      boton.addEventListener('click', () => cgResponder(boton, color));
      cgCuadricula.appendChild(boton);
    });
  }

  // ── Gestionar respuesta ────────────────────────────────────
  function cgResponder(boton, color) {
    if (cgRespondido || !cgYaEscucho) return;
    cgRespondido = true;

    const esCorrecta = color.nombre === cgObjetivo.nombre;
    document.querySelectorAll('.cg-boton-color').forEach(b => (b.disabled = true));

    if (esCorrecta) {
      boton.classList.add('cg-boton-color--correcto');
      boton.querySelector('.cg-boton-color__icono').textContent = '✓';
      const puntosGanados = cgRacha >= 2 ? 15 : 10;
      cgPuntos += puntosGanados;
      cgRacha  += 1;
      const mensaje = CG_TEXTOS.respuestasCorrectas[
        Math.floor(Math.random() * CG_TEXTOS.respuestasCorrectas.length)
      ];
      cgMostrarBanner(`${mensaje} +${puntosGanados}`, 'bien');
    } else {
      boton.classList.add('cg-boton-color--incorrecto');
      boton.querySelector('.cg-boton-color__icono').textContent = '✗';
      cgRacha = 0;
      document.querySelectorAll('.cg-boton-color').forEach(b => {
        if (b.dataset.cgNombre === cgObjetivo.nombre) {
          b.classList.add('cg-boton-color--revelar');
          b.querySelector('.cg-boton-color__icono').textContent = '✓';
        }
      });
      const mensaje = CG_TEXTOS.respuestasIncorrectas[
        Math.floor(Math.random() * CG_TEXTOS.respuestasIncorrectas.length)
      ];
      cgMostrarBanner(mensaje, 'mal');
    }

    cgActualizarEstadisticas();
    cgBotonEscuchar.disabled       = true;
    cgBotonSiguiente.style.display = 'block';

    const esUltima = cgRondaActual >= CG_MAX_RONDAS;
    cgBotonSiguiente.textContent = esUltima
      ? CG_TEXTOS.ultimaRonda
      : CG_TEXTOS.siguienteRonda;
  }

  // ── Banner de resultado ────────────────────────────────────
  function cgMostrarBanner(mensaje, tipo) {
    cgBannerRespuesta.textContent = mensaje;
    cgBannerRespuesta.className   =
      `cg-banner-respuesta cg-banner-respuesta--visible cg-banner-respuesta--${tipo}`;
  }

  function cgOcultarBanner() {
    cgBannerRespuesta.className = 'cg-banner-respuesta';
  }

  // ── Actualizar marcadores ──────────────────────────────────
  function cgActualizarEstadisticas() {
    cgElPuntos.textContent = cgPuntos;
    cgElRonda.textContent  = `${cgRondaActual} / ${CG_MAX_RONDAS}`;
    cgElRacha.textContent  = cgRacha;
    cgElRacha.classList.toggle('cg-estadistica__valor--racha-fuego', cgRacha >= 3);
  }

  // ── Pantalla de fin ────────────────────────────────────────
  function cgMostrarFin() {
    const maxPuntos  = CG_MAX_RONDAS * 15;
    const porcentaje = Math.round((cgPuntos / maxPuntos) * 100);

    let mensaje;
    if (porcentaje >= 80)      mensaje = '¡Excelente trabajo! 🏆 Tu memoria es fantástica.';
    else if (porcentaje >= 50) mensaje = '¡Muy bien! 👏 Sigue practicando cada día.';
    else                       mensaje = '¡Buen intento! 💪 Con práctica mejorarás.';

    cgFinPuntos.textContent  = cgPuntos;
    cgFinMensaje.textContent = mensaje;
    cgPantallaFin.classList.remove('cg-pantalla-inicio--oculta');

    // ── Nivel 2: guardar partida si hay sesión ──
    if (window.MentActiva?.guardarPartida) {
      window.MentActiva.guardarPartida({
        puntos: cgPuntos,
        datos:  { rondas: CG_MAX_RONDAS, porcentaje },
      });
    }
  }

  // ── Nueva ronda ────────────────────────────────────────────
  function cgNuevaRonda() {
    cgRespondido = false;
    cgYaEscucho  = false;

    const colores = cgElegirColores();
    cgObjetivo    = colores[Math.floor(Math.random() * colores.length)];

    cgRenderizarCuadricula(colores);
    cgOcultarBanner();
    cgBotonSiguiente.style.display    = 'none';
    cgBotonEscuchar.disabled          = false;
    cgBotonEscuchar.classList.remove('cg-boton-escuchar--hablando');
    cgTextoEscuchar.textContent       = CG_TEXTOS.escuchar;
    cgInstruccion.textContent         = CG_TEXTOS.instruccion;
    cgActualizarEstadisticas();
  }

  // ── Botón escuchar ─────────────────────────────────────────
  cgBotonEscuchar.addEventListener('click', () => {
    if (!cgObjetivo) return;

    cgBotonEscuchar.classList.add('cg-boton-escuchar--hablando');
    cgTextoEscuchar.textContent = CG_TEXTOS.escuchando;
    cgBotonEscuchar.disabled    = true;

    if (!cgYaEscucho) {
      document.querySelectorAll('.cg-boton-color').forEach(b => (b.disabled = true));
    }

    cgHablar(cgObjetivo.nombre, () => {
      cgBotonEscuchar.classList.remove('cg-boton-escuchar--hablando');
      cgTextoEscuchar.textContent = CG_TEXTOS.escuchar;
      cgBotonEscuchar.disabled    = cgRespondido;

      if (!cgRespondido) {
        cgYaEscucho               = true;
        cgInstruccion.textContent = CG_TEXTOS.instruccionDespues;
        document.querySelectorAll('.cg-boton-color').forEach(b => (b.disabled = false));
      }
    });
  });

  // ── Botón siguiente ────────────────────────────────────────
  cgBotonSiguiente.addEventListener('click', () => {
    if (cgRondaActual >= CG_MAX_RONDAS) {
      cgMostrarFin();
    } else {
      cgRondaActual++;
      cgNuevaRonda();
    }
  });

  window.speechSynthesis.onvoiceschanged = () => {};
  window.speechSynthesis.getVoices();

})();
