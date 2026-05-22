<?php $__env->startSection('title', 'Mente Matemática'); ?>

<?php $__env->startPush('styles'); ?>
<link rel="stylesheet" href="<?php echo e(asset('css/matematicas.css')); ?>">
<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>

<main class="mg-area">

  <!-- Pantalla de inicio -->
  <div class="mg-pantalla-inicio" id="mg-pantalla-inicio">
    <div class="mg-titulo">🔢 Mente<br>Matemática</div>
    <p style="color: white; text-align: center; margin: 20px;">Resuelve las operaciones lo más rápido que puedas.</p>
    <button class="mg-pantalla-inicio__boton" id="mg-btn-empezar">¡Empezar!</button>
  </div>

  <!-- Pantalla de fin -->
  <div class="mg-pantalla-fin mg-oculto" id="mg-pantalla-fin">
    <div class="mg-titulo">¡Completado!</div>
    <div style="font-size: 4rem; color: #ffd166;" id="mg-fin-puntos">0</div>
    <button id="mg-btn-reiniciar" style="background: var(--mg-primario); color:white; border:none; padding: 15px 40px; border-radius: 50px; font-family: 'Fredoka One'; cursor:pointer;">
      Jugar de nuevo
    </button>
  </div>

  <!-- Contenido del juego -->
  <div class="mg-contenedor">
    <h1 class="mg-titulo">Mente Matemática</h1>

    <div class="cg-estadisticas">
      <div class="cg-estadistica">
        <span class="cg-estadistica__valor" id="mg-puntos">0</span>
        <span class="cg-estadistica__etiqueta">Puntos</span>
      </div>
      <div class="cg-estadistica-separador"></div>
      <div class="cg-estadistica">
        <span class="cg-estadistica__valor" id="mg-ronda">1 / <?php echo e($config['max_rondas']); ?></span>
        <span class="cg-estadistica__etiqueta">Ronda</span>
      </div>
    </div>

    <div class="mg-operacion-container">
      <div class="mg-pregunta" id="mg-pregunta">0 + 0</div>
      <button id="mg-btnSiguiente" class="cg-boton-siguiente" style="display:none">Siguiente →</button>
    </div>
  </div>

  <!-- Teclado de respuesta -->
  <div class="mg-tarjeta-juego">
    <div class="mg-display-respuesta">
      <input type="text" id="mg-input" class="mg-input-resultado" readonly placeholder="?">

      <div class="mg-teclado">
        <button class="mg-tecla" onclick="mgEscribir(1)">1</button>
        <button class="mg-tecla" onclick="mgEscribir(2)">2</button>
        <button class="mg-tecla" onclick="mgEscribir(3)">3</button>
        <button class="mg-tecla" onclick="mgEscribir(4)">4</button>
        <button class="mg-tecla" onclick="mgEscribir(5)">5</button>
        <button class="mg-tecla" onclick="mgEscribir(6)">6</button>
        <button class="mg-tecla" onclick="mgEscribir(7)">7</button>
        <button class="mg-tecla" onclick="mgEscribir(8)">8</button>
        <button class="mg-tecla" onclick="mgEscribir(9)">9</button>
        <button class="mg-tecla" onclick="mgEscribir(0)">0</button>
        <button class="mg-tecla mg-tecla--accion" onclick="mgBorrar()">⌫</button>
        <button class="mg-tecla mg-tecla--accion" onclick="mgComprobar()">ok</button>
      </div>

      <button id="mg-btn-comprobar" class="mg-boton-comprobar" onclick="mgComprobar()">¡Comprobar!</button>

      <button id="mg-btn-siguiente" class="cg-boton-siguiente" onclick="mgSiguiente()" style="display:none; margin-top: 15px;">
        Siguiente ronda →
      </button>
    </div>
  </div>

</main>

<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
<script>
  window.MG_CONFIG = {
    maxRondas: <?php echo e($config['max_rondas']); ?>,
  };
</script>
<script src="<?php echo e(asset('js/matematicas.js')); ?>" defer></script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\wamp64\www\Proyecto-intermodular\laravel\resources\views/games/matematicas.blade.php ENDPATH**/ ?>