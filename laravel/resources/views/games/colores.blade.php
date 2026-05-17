@extends('layouts.app')

@section('title', 'Reconocimiento de Colores')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/colores.css') }}">
@endpush

@section('content')

<main class="cg-area">

  <!-- Pantalla de inicio -->
  <div class="cg-pantalla-inicio" id="cg-pantalla-inicio">
    <div class="cg-pantalla-inicio__titulo">🎨 ¿Qué Color<br>Escuchas?</div>
    <div class="cg-pantalla-inicio__subtitulo">
      Escucha el color que se anuncia y haz clic en el cuadrado correcto.<br>
      <strong>{{ $config['max_rondas'] }} rondas</strong> · {{ $config['opciones'] }} colores por ronda.
    </div>
    <button class="cg-pantalla-inicio__boton" id="cg-boton-empezar">¡Empezar!</button>
  </div>

  <!-- Pantalla de fin -->
  <div class="cg-pantalla-fin cg-pantalla-inicio--oculta" id="cg-pantalla-fin">
    <div class="cg-fin__titulo">🏁 ¡Juego terminado!</div>
    <p class="cg-fin__puntos-label">Puntuación final</p>
    <div class="cg-fin__puntos" id="cg-fin-puntos">0</div>
    <p class="cg-fin__mensaje" id="cg-fin-mensaje"></p>
    <button class="cg-fin__boton" id="cg-boton-reiniciar">🔄 Jugar de nuevo</button>
  </div>

  <!-- Contenido del juego -->
  <div class="cg-contenedor">

    <h1 class="cg-titulo">🎨 ¿Qué Color Escuchas?</h1>

    <div class="cg-estadisticas">
      <div class="cg-estadistica">
        <span class="cg-estadistica__valor" id="cg-puntos">0</span>
        <span class="cg-estadistica__etiqueta">Puntos</span>
      </div>
      <div class="cg-estadistica-separador"></div>
      <div class="cg-estadistica">
        <span class="cg-estadistica__valor" id="cg-ronda">1 / {{ $config['max_rondas'] }}</span>
        <span class="cg-estadistica__etiqueta">Ronda</span>
      </div>
      <div class="cg-estadistica-separador"></div>
      <div class="cg-estadistica">
        <span class="cg-estadistica__valor" id="cg-racha">0</span>
        <span class="cg-estadistica__etiqueta">Racha 🔥</span>
      </div>
    </div>

    <div class="cg-tarjeta-juego">

      <button class="cg-boton-escuchar" id="cg-boton-escuchar" disabled>
        <span class="cg-icono-altavoz">🔊</span>
        <span id="cg-texto-escuchar">Escuchar</span>
        <div class="cg-onda" aria-hidden="true">
          <span class="cg-onda__barra"></span>
          <span class="cg-onda__barra"></span>
          <span class="cg-onda__barra"></span>
          <span class="cg-onda__barra"></span>
          <span class="cg-onda__barra"></span>
        </div>
      </button>

      <p class="cg-instruccion" id="cg-instruccion">
        Haz clic en "Escuchar" y luego selecciona el color.
      </p>

      <div class="cg-cuadricula" id="cg-cuadricula"></div>

      <div class="cg-banner-respuesta" id="cg-banner-respuesta"></div>

      <button class="cg-boton-siguiente" id="cg-boton-siguiente" style="display:none">
        Siguiente ronda →
      </button>

    </div>

  </div>
</main>

@endsection

@push('scripts')
{{-- Pasamos la configuración PHP al JS de forma segura --}}
<script>
  window.CG_CONFIG = {
    colores:   @json($colores),
    maxRondas: {{ $config['max_rondas'] }},
    opciones:  {{ $config['opciones'] }},
  };
</script>
<script src="{{ asset('js/colores.js') }}" defer></script>
@endpush
