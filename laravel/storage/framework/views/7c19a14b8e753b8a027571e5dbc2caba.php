<?php $__env->startSection('title', 'Tres en Raya'); ?>

<?php $__env->startPush('styles'); ?>
<link rel="stylesheet" href="<?php echo e(asset('css/tres-raya.css')); ?>">
<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>

<main class="tr-area">

  
  <div class="tr-pantalla-inicio" id="tr-pantalla-inicio">
    <div class="tr-inicio-card">
      <div class="tr-inicio-titulo">🎯 Tres en Raya</div>
      <p class="tr-inicio-subtitulo">
        Juega contra la máquina.<br>
        Tú eres las <strong>X</strong>, ella las <strong>O</strong>.
      </p>
      <button class="tr-btn-grande" id="tr-btn-empezar">¡Empezar!</button>
    </div>
  </div>

  
  <div class="tr-pantalla-juego tr-oculta" id="tr-pantalla-juego">
    <div class="tr-contenedor">

      <div class="tr-marcador">
        <div class="tr-marcador__item tr-marcador__item--jugador">
          <span class="tr-marcador__valor" id="tr-mark-jugador">0</span>
          <span class="tr-marcador__label">Tú (X)</span>
        </div>
        <div class="tr-marcador__item">
          <span class="tr-marcador__valor" id="tr-mark-empates">0</span>
          <span class="tr-marcador__label">Empates</span>
        </div>
        <div class="tr-marcador__item tr-marcador__item--ia">
          <span class="tr-marcador__valor" id="tr-mark-ia">0</span>
          <span class="tr-marcador__label">IA (O)</span>
        </div>
      </div>

      <div class="tr-tablero" id="tr-tablero">
        
      </div>

      <div class="tr-mensaje" id="tr-mensaje">Tu turno</div>

      <div class="tr-acciones">
        <button class="tr-btn-grande" id="tr-btn-nueva">↻ Nueva partida</button>
        <button class="tr-btn-secundario" id="tr-btn-reset">🗑️ Reset marcador</button>
      </div>

    </div>
  </div>

</main>

<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
<script>
  window.TR_CONFIG = <?php echo json_encode($config, 15, 512) ?>;
</script>
<script src="<?php echo e(asset('js/tres-raya.js')); ?>" defer></script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\wamp64\www\Proyecto-intermodular\laravel\resources\views/games/tres-raya.blade.php ENDPATH**/ ?>