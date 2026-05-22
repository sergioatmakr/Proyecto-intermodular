@extends('layouts.app')

@section('title', 'MentActiva')

@section('content')

  <!-- HERO -->
  <section class="hero">
    <div class="hero-insignia">✦ Estimulación Cognitiva</div>
    <h1>Entrena tu mente<br/>cada <em>día</em></h1>
    <p>Ejercicios diseñados para mantener activas las capacidades cognitivas de forma sencilla y entretenida.</p>
  </section>

  <!-- ACTIVIDADES (leídas dinámicamente de la BD) -->
  {{--
    Las tarjetas se generan automáticamente a partir de la tabla `actividades`.
    Para añadir un juego, crea un seeder específico (ver
    database/seeders/ColoresActividadSeeder.php.example).
  --}}
  <section class="actividades">
    @forelse($actividades as $actividad)
      <div class="card">
        <div class="card-icon">{{ $actividad->icono }}</div>
        <span class="card-tag">{{ $actividad->tag }}</span>
        <h2>{{ $actividad->titulo }}</h2>
        <p>{{ $actividad->descripcion }}</p>
        <div class="card-meta">
          <span>⏱ {{ $actividad->tiempo }}</span>
          <span>⭐ {{ $actividad->nivel }}</span>
        </div>
        <a href="{{ $actividad->url }}" class="btn {{ $actividad->btn_clase }}">
          Empezar <span>→</span>
        </a>
      </div>
    @empty
      <p class="actividades-vacio">
        Aún no hay juegos registrados. Cuando un compañero añada el suyo
        aparecerá aquí automáticamente.
      </p>
    @endforelse
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
