/* ============================================================
   tres-raya.js — Juego "Tres en Raya"
   IA con movimiento aleatorio: sin estrategia, vencible.
   ============================================================ */

(function () {
  'use strict';

  const TR_CONFIG = window.TR_CONFIG || { simbolo_jugador: 'X', simbolo_ia: 'O', delay_ia_ms: 500 };

  // 8 líneas posibles de victoria en el tablero 3x3
  const TR_LINEAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columnas
    [0, 4, 8], [2, 4, 6],              // diagonales
  ];

  // ── Estado ──────────────────────────────────────────────
  let trTablero = Array(9).fill(null); // null | 'X' | 'O'
  let trTurno   = 'X';                  // siempre empieza el jugador
  let trFin     = false;
  let trMarcador = trCargarMarcador();

  // ── Refs DOM ────────────────────────────────────────────
  const trPantallaInicio = document.getElementById('tr-pantalla-inicio');
  const trPantallaJuego  = document.getElementById('tr-pantalla-juego');
  const trBtnEmpezar     = document.getElementById('tr-btn-empezar');
  const trBtnNueva       = document.getElementById('tr-btn-nueva');
  const trBtnReset       = document.getElementById('tr-btn-reset');
  const trTableroEl      = document.getElementById('tr-tablero');
  const trMensajeEl      = document.getElementById('tr-mensaje');
  const trMarkJugador    = document.getElementById('tr-mark-jugador');
  const trMarkEmpates    = document.getElementById('tr-mark-empates');
  const trMarkIA         = document.getElementById('tr-mark-ia');

  if (!trBtnEmpezar) return;

  // ── Persistencia del marcador en BD (vía window.MentActiva) ──
  function trCargarMarcador() {
    const e = window.MentActiva && window.MentActiva.cargarEstado
      ? window.MentActiva.cargarEstado() : null;
    if (e && typeof e === 'object' && 'jugador' in e) return e;
    return { jugador: 0, ia: 0, empates: 0 };
  }
  function trGuardarMarcador() {
    if (window.MentActiva && window.MentActiva.guardarEstado) {
      window.MentActiva.guardarEstado(trMarcador);
    }
  }
  function trActualizarMarcador() {
    trMarkJugador.textContent = trMarcador.jugador;
    trMarkIA.textContent      = trMarcador.ia;
    trMarkEmpates.textContent = trMarcador.empates;
  }

  // ── Iniciar / reiniciar partida ────────────────────────
  function trNuevaPartida() {
    trTablero = Array(9).fill(null);
    trTurno   = 'X';
    trFin     = false;
    trRenderTablero();
    trMostrarMensaje('Tu turno', '');
  }

  function trRenderTablero() {
    trTableroEl.innerHTML = '';
    trTablero.forEach((valor, idx) => {
      const btn = document.createElement('button');
      btn.className = 'tr-casilla';
      btn.dataset.idx = idx;
      if (valor) {
        btn.textContent = valor;
        btn.classList.add(`tr-casilla--${valor.toLowerCase()}`);
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => trJugarHumano(idx));
      }
      trTableroEl.appendChild(btn);
    });
  }

  // ── Turno del humano ───────────────────────────────────
  function trJugarHumano(idx) {
    if (trFin || trTurno !== 'X' || trTablero[idx] !== null) return;

    trTablero[idx] = 'X';
    trRenderTablero();

    if (trComprobarFin()) return;

    trTurno = 'O';
    trMostrarMensaje('Turno de la IA…', '');
    setTimeout(trJugarIA, TR_CONFIG.delay_ia_ms);
  }

  // ── Turno de la IA: 100% aleatoria entre las casillas libres ─
  function trJugarIA() {
    if (trFin) return;
    const libres = trTablero
      .map((v, i) => (v === null ? i : -1))
      .filter(i => i >= 0);
    if (libres.length === 0) return;

    const elegida = libres[Math.floor(Math.random() * libres.length)];
    trTablero[elegida] = 'O';
    trRenderTablero();

    if (trComprobarFin()) return;

    trTurno = 'X';
    trMostrarMensaje('Tu turno', '');
  }

  // ── Comprobación de victoria / empate ──────────────────
  function trComprobarFin() {
    for (const linea of TR_LINEAS) {
      const [a, b, c] = linea;
      if (trTablero[a] && trTablero[a] === trTablero[b] && trTablero[a] === trTablero[c]) {
        trMarcarLineaGanadora(linea);
        trFin = true;
        let resultado;
        if (trTablero[a] === 'X') {
          trMostrarMensaje('🎉 ¡Has ganado!', 'ganaste');
          trMarcador.jugador++;
          resultado = 'gana';
        } else {
          trMostrarMensaje('😔 Ha ganado la IA', 'perdiste');
          trMarcador.ia++;
          resultado = 'pierde';
        }
        trGuardarMarcador();
        trActualizarMarcador();
        trGuardarPartida(resultado);
        return true;
      }
    }
    if (trTablero.every(v => v !== null)) {
      trMostrarMensaje('🤝 Empate', 'empate');
      trFin = true;
      trMarcador.empates++;
      trGuardarMarcador();
      trActualizarMarcador();
      trGuardarPartida('empate');
      return true;
    }
    return false;
  }

  // ── Nivel 2: guardar partida si hay sesión ──
  function trGuardarPartida(resultado) {
    if (!window.MentActiva?.guardarPartida) return;
    const puntos = resultado === 'gana' ? 10 : (resultado === 'empate' ? 5 : 0);
    window.MentActiva.guardarPartida({
      puntos: puntos,
      datos:  { resultado },
    });
  }

  function trMarcarLineaGanadora(linea) {
    linea.forEach(idx => {
      const c = trTableroEl.querySelector(`.tr-casilla[data-idx="${idx}"]`);
      if (c) c.classList.add('tr-casilla--ganadora');
    });
  }

  function trMostrarMensaje(texto, tipo) {
    trMensajeEl.textContent = texto;
    trMensajeEl.className = 'tr-mensaje' + (tipo ? ` tr-mensaje--${tipo}` : '');
  }

  // ── Eventos ────────────────────────────────────────────
  trBtnEmpezar.addEventListener('click', () => {
    trPantallaInicio.classList.add('tr-oculta');
    trPantallaJuego.classList.remove('tr-oculta');
    trActualizarMarcador();
    trNuevaPartida();
  });

  trBtnNueva.addEventListener('click', trNuevaPartida);

  trBtnReset.addEventListener('click', () => {
    if (!confirm('¿Reiniciar el marcador?')) return;
    trMarcador = { jugador: 0, ia: 0, empates: 0 };
    trGuardarMarcador();
    trActualizarMarcador();
  });

  // Inicialización
  trActualizarMarcador();

})();
