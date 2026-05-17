@extends('layouts.app')

@section('title', 'MentActiva')

@section('content')

  <!-- HERO -->
  <section class="hero">
    <div class="hero-insignia">✦ Estimulación Cognitiva</div>
    <h1>Entrena tu mente<br/>cada <em>día</em></h1>
    <p>Ejercicios diseñados para mantener activas las capacidades cognitivas de forma sencilla y entretenida.</p>
  </section>

  <!-- ACTIVIDADES -->
  {{-- Cuando añadáis un juego, copiad esta plantilla de tarjeta dentro de la sección:

  <div class="card">
    <div class="card-icon">🎨</div>
    <span class="card-tag">Categoría</span>
    <h2>Nombre del juego</h2>
    <p>Descripción corta del juego.</p>
    <div class="card-meta">
      <span>⏱ ~5 min</span>
      <span>⭐ Nivel básico</span>
    </div>
    <a href="{{ route('juego.slug') }}" class="btn btn-naranja">Empezar <span>→</span></a>
  </div>

  --}}
  <section class="actividades">
    {{-- Las tarjetas de los juegos se añaden aquí. --}}
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

@endsection

@push('scripts')
<script src="{{ asset('js/eventos.js') }}" defer></script>
@endpush
