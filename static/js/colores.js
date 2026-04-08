/* ============================================================
   colores.js — Juego "¿Qué Color Escuchas?"
   Variables y funciones con prefijo "cg" para no contaminar
   el scope global junto a otros scripts del proyecto.
   ============================================================ */

(function () {
  'use strict';

  // ── Datos ──────────────────────────────────────────────────
  const CG_COLORES = [
    { nombre: 'Rojo',     hex: '#e63946' },
    { nombre: 'Azul',     hex: '#457b9d' },
    { nombre: 'Verde',    hex: '#2a9d8f' },
    { nombre: 'Amarillo', hex: '#e9c46a' },
    { nombre: 'Naranja',  hex: '#f4a261' },
    { nombre: 'Morado',   hex: '#8338ec' },
    { nombre: 'Rosa',     hex: '#e07ab1' },
    { nombre: 'Marrón',   hex: '#8B5E3C' },
    { nombre: 'Blanco',   hex: '#f1faee' },
    { nombre: 'Gris',     hex: '#6d6875' },
    { nombre: 'Turquesa', hex: '#06d6a0' },
    { nombre: 'Lima',     hex: '#90be6d' },
  ];

  const CG_TEXTOS = {
    escuchar:            'Escuchar',
    escuchando:          'Escuchando…',
    instruccion:         'Haz clic en "Escuchar" y luego selecciona el color.',
    instruccionDespues:  'Selecciona el cuadrado del color que escuchaste.',
    respuestasCorrectas: ['¡Correcto! 🎉', '¡Genial! ✨', '¡Exacto! 🔥', '¡Perfecto! 💯'],
    respuestasIncorrectas: ['¡Incorrecto! ❌', 'Casi… ❌', 'No era ese ❌'],
    siguienteRonda:      'Siguiente ronda →',
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

  // Si algún elemento no existe (página diferente), salir sin errores
  if (!cgBotonEmpezar) return;

  // ── Arranque ───────────────────────────────────────────────
  cgBotonEmpezar.addEventListener('click', () => {
    cgPantallaInicio.classList.add('cg-pantalla-inicio--oculta');
    cgNuevaRonda();
  });

  // ── Síntesis de voz ────────────────────────────────────────
  function cgHablar(texto, alTerminar) {
    if (!window.speechSynthesis) { alTerminar && alTerminar(); return; }
    window.speechSynthesis.cancel();
    const enunciado  = new SpeechSynthesisUtterance(texto);
    enunciado.lang   = 'es-ES';
    enunciado.rate   = 0.85;
    enunciado.pitch  = 1.05;
    const vozEspanol = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
    if (vozEspanol) enunciado.voice = vozEspanol;
    enunciado.onend  = alTerminar || null;
    enunciado.onerror = alTerminar || null;
    window.speechSynthesis.speak(enunciado);
  }

  // ── Elegir 6 colores aleatorios ────────────────────────────
  function cgElegirColores() {
    const bolsa    = [...CG_COLORES];
    const elegidos = [];
    while (elegidos.length < 6) {
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
    cgBotonSiguiente.textContent   = CG_TEXTOS.siguienteRonda;
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
    cgElRonda.textContent  = cgRondaActual;
    cgElRacha.textContent  = cgRacha;
    cgElRacha.classList.toggle('cg-estadistica__valor--racha-fuego', cgRacha >= 3);
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
    cgRondaActual++;
    cgNuevaRonda();
  });

  // Precargar voces del navegador
  window.speechSynthesis.onvoiceschanged = () => {};
  window.speechSynthesis.getVoices();

})();
