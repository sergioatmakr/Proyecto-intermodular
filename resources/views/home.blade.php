@extends('layouts.app')

@section('title', 'MentActiva')

@section('content')

  <!-- HERO -->
  <section class="hero">
    <div class="hero-insignia">✦ Estimulación Cognitiva</div>
    <h1>Entrena tu mente<br/>cada <em>día</em></h1>
    <p>Ejercicios diseñados para mantener activas las capacidades cognitivas de forma sencilla y entretenida.</p>
  </section>

  <!-- TEXTO DE BIENVENIDA: explica para qué sirve la aplicación -->
  <section class="bienvenida">
    <div class="bienvenida-card">
      <h2>¿Qué es MentActiva?</h2>
      <p>
        <strong>MentActiva</strong> es una aplicación de <em>estimulación cognitiva</em>
        pensada para personas mayores o con algún grado de dependencia. A través de
        juegos sencillos y entretenidos ayuda a mantener activas capacidades como la
        <em>memoria</em>, la <em>atención</em>, el <em>razonamiento</em> y la
        <em>coordinación</em>, dedicándole solo unos minutos al día.
      </p>

      <ul class="bienvenida-lista">
        <li>🎨 Juegos variados: colores, cálculo, imágenes, secuencias, puzzles y más.</li>
        <li>🔠 Diseñados para ser fáciles de usar, con botones y letras grandes.</li>
        <li>⭐ Cada partida suma puntos a tu <strong>progreso diario</strong>.</li>
        <li>📅 Entrena un poco cada día para convertirlo en una rutina saludable.</li>
      </ul>

      <a href="{{ route('actividades') }}" class="btn btn-naranja bienvenida-cta">
        Ver actividades <span>→</span>
      </a>
    </div>
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
