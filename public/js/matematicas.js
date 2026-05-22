(function () {
  'use strict';

  const MAX_RONDAS = window.MG_CONFIG ? window.MG_CONFIG.maxRondas : 8;

  let puntos       = 0;
  let rondaActual  = 1;
  let respCorrecta = 0;
  let respondido   = false;

  const elPregunta  = document.getElementById('mg-pregunta');
  const elInput     = document.getElementById('mg-input');
  const elBtnSig    = document.getElementById('mg-btn-siguiente');
  const elPuntos    = document.getElementById('mg-puntos');
  const elRonda     = document.getElementById('mg-ronda');
  const pantallaFin = document.getElementById('mg-pantalla-fin');
  const pantallaIni = document.getElementById('mg-pantalla-inicio');
  const finPuntos   = document.getElementById('mg-fin-puntos');

  function nuevaOperacion() {
    const n1     = Math.floor(Math.random() * 12) + 1;
    const n2     = Math.floor(Math.random() * 10) + 1;
    const esSuma = Math.random() > 0.5;

    if (esSuma) {
      respCorrecta           = n1 + n2;
      elPregunta.textContent = `${n1} + ${n2}`;
    } else {
      const mayor            = Math.max(n1, n2);
      const menor            = Math.min(n1, n2);
      respCorrecta           = mayor - menor;
      elPregunta.textContent = `${mayor} - ${menor}`;
    }

    respondido                = false;
    elInput.value             = '';
    elInput.style.borderColor = '';
    elInput.style.color       = '';
    elBtnSig.style.display    = 'none';
    document.querySelectorAll('.mg-tecla').forEach(b => b.disabled = false);
  }

  window.mgEscribir = function(num) {
    if (respondido || elInput.value.length >= 3) return;
    elInput.value += String(num);
  };

  window.mgBorrar = function() {
    if (respondido) return;
    elInput.value = elInput.value.slice(0, -1);
  };

  window.mgComprobar = function() {
    if (elInput.value === '' || respondido) return;
    respondido = true;
    document.querySelectorAll('.mg-tecla').forEach(b => b.disabled = true);

    const userAns  = parseInt(elInput.value);
    const correcto = userAns === respCorrecta;

    if (correcto) {
      puntos += 10;
      elInput.style.borderColor = '#06d6a0';
      elInput.style.color       = '#06d6a0';
    } else {
      elInput.value             = `${userAns} → ${respCorrecta}`;
      elInput.style.borderColor = '#ff4757';
      elInput.style.color       = '#ff4757';
    }

    if (elPuntos) elPuntos.textContent = puntos;
    elBtnSig.style.display = 'block';
    elBtnSig.textContent   = rondaActual >= MAX_RONDAS ? 'Ver resultado →' : 'Siguiente ronda →';
  };

  window.mgSiguiente = function() {
    if (rondaActual < MAX_RONDAS) {
      rondaActual++;
      if (elRonda) elRonda.textContent = `${rondaActual} / ${MAX_RONDAS}`;
      nuevaOperacion();
    } else {
      if (finPuntos) finPuntos.textContent = puntos;
      pantallaFin?.classList.remove('mg-oculto');
    }
  };

  document.getElementById('mg-btn-empezar')?.addEventListener('click', () => {
    pantallaIni?.classList.add('mg-oculto');
    nuevaOperacion();
  });

  document.getElementById('mg-btn-reiniciar')?.addEventListener('click', () => {
    puntos      = 0;
    rondaActual = 1;
    if (elPuntos) elPuntos.textContent = 0;
    if (elRonda)  elRonda.textContent  = `1 / ${MAX_RONDAS}`;
    pantallaFin?.classList.add('mg-oculto');
    nuevaOperacion();
  });

})();