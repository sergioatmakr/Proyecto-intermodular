<?php $__env->startSection('title', 'MentActiva'); ?>

<?php $__env->startSection('content'); ?>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-insignia">✦ Estimulación Cognitiva</div>
    <h1>Entrena tu mente<br/>cada <em>día</em></h1>
    <p>Ejercicios diseñados para mantener activas las capacidades cognitivas de forma sencilla y entretenida.</p>
  </section>

  <!-- ACTIVIDADES -->
  
  <section class="actividades">

    <div class="card">
      <div class="card-icon">🎨</div>
      <span class="card-tag">Visual</span>
      <h2>Reconocimiento de Colores</h2>
      <p>Identifica colores, asocia nombres y entrena la percepción visual con ejercicios progresivos y divertidos.</p>
      <div class="card-meta">
        <span>⏱ ~5 min</span>
        <span>⭐ Nivel básico</span>
      </div>
      <a href="<?php echo e(route('juego.colores')); ?>" class="btn btn-naranja">Empezar <span>→</span></a>
    </div>

    <div class="card">
      <div class="card-icon">🎯</div>
      <span class="card-tag">Estrategia</span>
      <h2>Tres en Raya</h2>
      <p>Juega contra la máquina al clásico tres en raya. Ideal para una partida rápida.</p>
      <div class="card-meta">
        <span>⏱ ~2 min</span>
        <span>⭐ Nivel básico</span>
      </div>
      <a href="<?php echo e(route('juego.tres-raya')); ?>" class="btn btn-verde">Empezar <span>→</span></a>
    </div>

    <div class="card">
      <div class="card-icon">🧩</div>
      <span class="card-tag">Espacial</span>
      <h2>Puzzle</h2>
      <p>Arma rompecabezas con tus propias fotos. Elige 6, 9 o 12 piezas según la dificultad.</p>
      <div class="card-meta">
        <span>⏱ ~5 min</span>
        <span>⭐ Adaptable</span>
      </div>
      <a href="<?php echo e(route('juego.puzzle')); ?>" class="btn btn-naranja">Empezar <span>→</span></a>
    </div>
    
    <div class="card">
      <div class="card-icon">🔢</div>
      <span class="card-tag">Lógica</span>
      <h2>Operaciones Matemáticas</h2>
      <p>Resuelve sumas, restas y más. Ejercita el razonamiento numérico con retos adaptados a tu ritmo.</p>
      <div class="card-meta">
        <span>⏱ ~5 min</span>
        <span>⭐ Nivel básico</span>
      </div>
      <a href="<?php echo e(route('juego.matematicas')); ?>" class="btn btn-verde">Empezar <span>→</span></a>
    </div>

    <div class="card">
      <div class="card-icon">🖼️</div>
      <span class="card-tag">Visual</span>
      <h2>Reconocimiento de Imágenes</h2>
      <p>Lee la palabra y selecciona la imagen correcta. Personaliza los temas y añade tus propias imágenes.</p>
      <div class="card-meta">
        <span>⏱ ~5 min</span>
        <span>⭐ Nivel básico</span>
      </div>
      <a href="<?php echo e(route('juego.imagenes')); ?>" class="btn btn-naranja">Empezar <span>→</span></a>
    </div>

    <div class="card">
      <div class="card-icon">🔤</div>
      <span class="card-tag">Lenguaje</span>
      <h2>Sopa de Letras</h2>
      <p>Encuentra palabras escondidas entre las letras. Personaliza la lista con tus propias palabras.</p>
      <div class="card-meta">
        <span>⏱ ~5 min</span>
        <span>⭐ Adaptable</span>
      </div>
      <a href="<?php echo e(route('juego.sopa')); ?>" class="btn btn-naranja">Empezar <span>→</span></a>
    </div>
  </section>

  <!-- BARRA DE PROGRESO DECORATIVA -->
  <section class="progress-section">
    <div class="progress-box">
      <div class="prog-label">Progreso de hoy</div>
      <div class="prog-bar-wrap">
        <div class="prog-bar" id="bar"></div>
      </div>
      <div class="prog-value" id="barVal">0%</div>
    </div>
  </section>

<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
<script src="<?php echo e(asset('js/eventos.js')); ?>" defer></script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\wamp64\www\Proyecto-intermodular\laravel\resources\views/home.blade.php ENDPATH**/ ?>