<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title><?php echo $__env->yieldContent('title', 'MentActiva'); ?> — Estimulación Cognitiva</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&family=Fredoka+One&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="<?php echo e(asset('css/estilos.css')); ?>">
  <?php echo $__env->yieldPushContent('styles'); ?>
</head>
<body>

  <!-- HEADER -->
  <header>
    <div class="logo">
      <div class="logo-icono">🧠</div>
      <div class="logo-texto">Ment<span>Activa</span></div>
    </div>
    <nav>
      <a href="<?php echo e(route('home')); ?>" class="<?php echo \Illuminate\Support\Arr::toCssClasses(['active' => request()->routeIs('home')]); ?>">Inicio</a>
      <a href="<?php echo e(route('actividades')); ?>" class="<?php echo \Illuminate\Support\Arr::toCssClasses(['active' => request()->routeIs('actividades') || request()->routeIs('juego.*')]); ?>">Actividades</a>
      <a href="<?php echo e(route('progreso')); ?>" class="<?php echo \Illuminate\Support\Arr::toCssClasses(['active' => request()->routeIs('progreso')]); ?>">Progreso</a>
    </nav>
  </header>

  <?php echo $__env->yieldContent('content'); ?>

  <!-- FOOTER -->
  <footer>
    Proyecto Intermodular &nbsp;·&nbsp; <strong>MentActiva</strong> &nbsp;·&nbsp; Aplicación de apoyo a personas con dependencia
  </footer>

  <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH C:\wamp64\www\Proyecto-intermodular\laravel\resources\views/layouts/app.blade.php ENDPATH**/ ?>