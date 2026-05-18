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

@endsection
