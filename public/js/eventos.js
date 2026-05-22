// Barra de progreso diaria: anima hasta el porcentaje real del usuario.
// El valor viene del backend en el atributo data-pct del elemento #bar.
window.addEventListener('load', () => {
  const bar = document.getElementById('bar');
  const val = document.getElementById('barVal');
  if (!bar || !val) return;

  const target = Math.max(0, Math.min(100, parseInt(bar.dataset.pct || '0', 10)));

  // Si la meta está completada, le damos un toque visual verde
  if (target >= 100) {
    bar.style.background = 'linear-gradient(90deg, #26c6a0, #43e8c8)';
  }

  let pct = 0;
  const step = () => {
    if (pct < target) {
      pct++;
      bar.style.width = pct + '%';
      val.textContent = pct + '%';
      requestAnimationFrame(step);
    } else {
      bar.style.width = target + '%';
      val.textContent = target + '%';
    }
  };
  setTimeout(step, 400);
});
