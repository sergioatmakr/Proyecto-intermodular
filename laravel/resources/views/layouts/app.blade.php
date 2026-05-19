<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>@yield('title', 'MentActiva') — Estimulación Cognitiva</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&family=Fredoka+One&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
  @stack('styles')
</head>
<body>

  <!-- HEADER -->
  <header>
    <div class="logo">
      <div class="logo-icono">🧠</div>
      <div class="logo-texto">Ment<span>Activa</span></div>
    </div>
    <nav>
      <a href="{{ route('home') }}" @class(['active' => request()->routeIs('home')])>Inicio</a>
      <a href="{{ route('actividades') }}" @class(['active' => request()->routeIs('actividades') || request()->routeIs('juego.*')])>Actividades</a>
      <a href="{{ route('progreso') }}" @class(['active' => request()->routeIs('progreso')])>Progreso</a>
    </nav>
  </header>

  @yield('content')

  <!-- FOOTER -->
  <footer>
    Proyecto Intermodular &nbsp;·&nbsp; <strong>MentActiva</strong> &nbsp;·&nbsp; Aplicación de apoyo a personas con dependencia
  </footer>

  @stack('scripts')
</body>
</html>
