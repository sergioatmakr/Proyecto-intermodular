(function () {
  'use strict';

  // ── Config desde Laravel ────────────────────────────────────
  const MAX_RONDAS = window.MG_CONFIG ? window.MG_CONFIG.maxRondas : 8;

  let puntos = 0;
  let rondaActual = 1;
  let respuestaCorrecta = 0;
  let respondido = false;

  const elPregunta     = document.getElementById('mg-pregunta');
  const elInput        = document.getElementById('mg-input');
  const elBtnComprobar = document.getElementById('mg-btn-comprobar');
  const elBtnSiguiente = document.getElementById('mg-btn-siguiente');
  const elPuntos       = document.getElementById('mg-puntos');
  const elRonda        = document.getElementById('mg-ronda');

  // -- Generar Operación --
  function nuevaOperacion() {
    const n1 = Math.floor(Math.random() * 12) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const esSuma = Math.random() > 0.5;

    if (esSuma) {
      respuestaCorrecta = n1 + n2;
      elPregunta.textContent = `${n1} + ${n2}`;
    } else {
      const mayor = Math.max(n1, n2);
      const menor = Math.min(n1, n2);
      respuestaCorrecta = mayor - menor;
      elPregunta.textContent = `${mayor} - ${menor}`;
    }
    elInput.value = '';
    elInput.style.borderColor = '';
    respondido = false;
    if (elBtnComprobar) elBtnComprobar.disabled = false;
    if (elBtnSiguiente) elBtnSiguiente.style.display = 'none';
  }

  // -- Manejar Teclado --
  window.mgEscribir = function(num) {
    if (respondido) return;
    if (elInput.value.length < 3) elInput.value += num;
  };

  window.mgBorrar = function() {
    if (respondido) return;
    elInput.value = elInput.value.slice(0, -1);
  };

  // -- Comprobar --
  window.mgComprobar = function() {
    if (elInput.value === '' || respondido) return;
    respondido = true;
    if (elBtnComprobar) elBtnComprobar.disabled = true;

    const userAns = parseInt(elInput.value);
    if (userAns === respuestaCorrecta) {
      elInput.style.borderColor = '#06d6a0';
      puntos += 10;
    } else {
      elInput.style.borderColor = '#ff4757';
      elInput.value = `${userAns} ➔ ${respuestaCorrecta}`;
    }

    if (elPuntos) elPuntos.textContent = puntos;
    if (elBtnSiguiente) {
      elBtnSiguiente.style.display = 'block';
      if (rondaActual === MAX_RONDAS) elBtnSiguiente.textContent = 'Finalizar';
    }
  };

  window.mgSiguiente = function() {
    if (rondaActual < MAX_RONDAS) {
      rondaActual++;
      if (elRonda) elRonda.textContent = `${rondaActual} / ${MAX_RONDAS}`;
      nuevaOperacion();
    } else {
      const fin = document.getElementById('mg-pantalla-fin');
      if (fin) fin.classList.remove('mg-oculto');
      const finPuntos = document.getElementById('mg-fin-puntos');
      if (finPuntos) finPuntos.textContent = puntos;
    }
  };

  // Inicializar botón empezar
  const btnEmpezar = document.getElementById('mg-btn-empezar');
  if (btnEmpezar) {
    btnEmpezar.onclick = () => {
      const inicio = document.getElementById('mg-pantalla-inicio');
      if (inicio) inicio.classList.add('mg-oculto');
      nuevaOperacion();
    };
  }

  // Reiniciar
  const btnReiniciar = document.getElementById('mg-btn-reiniciar');
  if (btnReiniciar) {
    btnReiniciar.onclick = () => {
      puntos = 0;
      rondaActual = 1;
      if (elPuntos) elPuntos.textContent = 0;
      if (elRonda)  elRonda.textContent  = `1 / ${MAX_RONDAS}`;
      const fin = document.getElementById('mg-pantalla-fin');
      if (fin) fin.classList.add('mg-oculto');
      nuevaOperacion();
    };
  }

})();
