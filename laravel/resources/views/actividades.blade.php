@extends('layouts.app')

@section('title', 'Actividades')

@section('content')

  <!-- HERO -->
  <section class="hero">
    <div class="hero-insignia">✦ Estimulación Cognitiva</div>
    <h1><em>PRÓXIMAMENTE...</em></h1>
    <p></p>
  </section>

  <!-- ACTIVIDADES dinámicas desde el controlador -->
  <section class="actividades">
    @foreach($actividades as $actividad)
    <div class="card">
      <div class="card-icon">{{ $actividad['icono'] }}</div>
      <span class="card-tag">{{ $actividad['tag'] }}</span>
      <h2>{{ $actividad['titulo'] }}</h2>
      <p>{{ $actividad['descripcion'] }}</p>
      <div class="card-meta">
        <span>⏱ {{ $actividad['tiempo'] }}</span>
        <span>⭐ {{ $actividad['nivel'] }}</span>
      </div>
      <a href="{{ $actividad['ruta'] }}" class="btn {{ $actividad['btn_clase'] }}">Empezar <span>→</span></a>
    </div>
    @endforeach
  </section>

@endsection
