// Barra de progreso animada decorativa al cargar
    window.addEventListener('load', () => {
      const bar = document.getElementById('bar');
      const val = document.getElementById('barVal');
      let pct = 0;
      const target = 40; // decorativo por ejemplo: 40% completado hoy
      const step = () => {
        if (pct < target) {
          pct++;
          bar.style.width = pct + '%';
          val.textContent = pct + '%';
          requestAnimationFrame(step);
        }
      };
      setTimeout(step, 600);
    });