(function () {
    'use strict';

    const MAX_RONDAS = 8;
    let puntos = 0;
    let rondaActual = 1;
    let respuestaCorrecta = 0;
    let respondido = false;

    const elPregunta = document.getElementById('mg-pregunta');
    const elInput = document.getElementById('mg-input');
    const elBtnComprobar = document.getElementById('mg-btn-comprobar');
    const elBtnSiguiente = document.getElementById('mg-btn-siguiente');
    const elPuntos = document.getElementById('mg-puntos');
    const elRonda = document.getElementById('mg-ronda');

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
        elInput.classList.remove('mg-input-resultado--foco');
        respondido = false;
        elBtnComprobar.disabled = false;
        elBtnSiguiente.style.display = 'none';
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
        elBtnComprobar.disabled = true;

        const userAns = parseInt(elInput.value);
        if (userAns === respuestaCorrecta) {
            elInput.style.borderColor = "#06d6a0";
            puntos += 10;
            // Animación de éxito opcional aquí
        } else {
            elInput.style.borderColor = "#ff4757";
            elInput.value = `${userAns} ➔ ${respuestaCorrecta}`; // Muestra la correcta
        }

        elPuntos.textContent = puntos;
        elBtnSiguiente.style.display = 'block';
        if(rondaActual === MAX_RONDAS) elBtnSiguiente.textContent = "Finalizar";
    };

    window.mgSiguiente = function() {
        if (rondaActual < MAX_RONDAS) {
            rondaActual++;
            elRonda.textContent = `${rondaActual} / ${MAX_RONDAS}`;
            elInput.style.borderColor = "var(--mg-subtexto)";
            nuevaOperacion();
        } else {
            document.getElementById('mg-pantalla-fin').classList.remove('mg-oculto');
            document.getElementById('mg-fin-puntos').textContent = puntos;
        }
    };

    // Inicializar
    document.getElementById('mg-btn-empezar').onclick = () => {
        document.getElementById('mg-pantalla-inicio').classList.add('mg-oculto');
        nuevaOperacion();
    };
})();

