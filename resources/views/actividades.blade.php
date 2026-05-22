@extends('layouts.app')

@section('title', 'Actividades')

@section('content')

  <!-- HERO -->
  <section class="hero">
    <div class="hero-insignia">✦ Estimulación Cognitiva</div>
    <h1>Actividades disponibles</h1>
    <p>Elige una actividad para empezar a entrenar tu mente.</p>
  </section>

  <!-- ACTIVIDADES (leídas dinámicamente de la BD vía Eloquent) -->
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

  <!-- BARRA DE PROGRESO DIARIA (real) -->
  <section class="progress-section">
    <div class="progress-box">
      <div class="prog-label">
        Progreso de hoy
        @if($logueado)
          <span class="prog-sub">{{ $puntosHoy }} / {{ $meta }} pts</span>
        @endif
      </div>
      <div class="prog-bar-wrap">
        <div class="prog-bar" id="bar" data-pct="{{ $porcentaje }}"></div>
      </div>
      <div class="prog-value" id="barVal">0%</div>
    </div>

    @if(!$logueado)
      <p class="prog-aviso">
        <a href="{{ route('login') }}">Inicia sesión</a> para registrar tu progreso diario.
      </p>
    @elseif($porcentaje >= 100)
      <p class="prog-aviso prog-aviso--ok">🎉 ¡Meta diaria completada! ¡Buen trabajo!</p>
    @else
      <p class="prog-aviso">Te faltan <strong>{{ $meta - $puntosHoy }}</strong> puntos para tu meta de hoy.</p>
    @endif
  </section>

@endsection

@push('scripts')
<script src="{{ asset('js/eventos.js') }}" defer></script>
@endpush
