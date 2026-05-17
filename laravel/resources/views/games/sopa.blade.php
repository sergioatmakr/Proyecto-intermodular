@extends('layouts.app')

@section('title', 'Sopa de Letras')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/sopa.css') }}">
@endpush

@section('content')

<main class="sp-area">

  {{-- ① Pantalla de configuración: gestor de palabras y selección --}}
  <div class="sp-pantalla-config" id="sp-pantalla-config">
    <div class="sp-contenedor">

      <h2 class="sp-titulo">🔤 Sopa de letras</h2>
      <p class="sp-subtitulo">
        Selecciona las palabras que quieres encontrar en la sopa.
      </p>

      <div class="sp-acciones-rapidas">
        <button class="sp-btn-mini" id="sp-btn-sel-todas">✓ Todas</button>
        <button class="sp-btn-mini" id="sp-btn-sel-ninguna">✕ Ninguna</button>
        <button class="sp-btn-mini" id="sp-btn-sel-aleatoria">🎲 Aleatorias (8)</button>
      </div>

      <div class="sp-palabras-lista" id="sp-palabras-lista"></div>

      {{-- Añadir nueva palabra al pool --}}
      <div class="sp-añadir">
        <input type="text" class="sp-input" id="sp-input-palabra"
          placeholder="Añadir palabra nueva (ej: TELEVISIÓN)" maxlength="15">
        <button class="sp-btn-añadir" id="sp-btn-añadir">+ Añadir</button>
      </div>
      <p class="sp-añadir-hint">
        Las tildes y caracteres especiales se eliminan automáticamente.
        Mínimo 3 letras, máximo 15.
      </p>

      <div class="sp-config-pie">
        <p class="sp-contador" id="sp-contador">0 palabras seleccionadas</p>
        <button class="sp-btn-jugar" id="sp-btn-jugar" disabled>🎮 Jugar</button>
      </div>

    </div>
  </div>

  {{-- ② Pantalla de juego --}}
  <div class="sp-pantalla-juego sp-oculta" id="sp-pantalla-juego">
    <div class="sp-contenedor sp-contenedor--juego">

      <div class="sp-cabecera">
        <button class="sp-btn-volver" id="sp-btn-volver">← Volver</button>
        <div class="sp-stats">
          <span class="sp-stat">⏱ <span id="sp-tiempo">00:00</span></span>
          <span class="sp-stat">🔤 <span id="sp-encontradas">0</span> / <span id="sp-total">0</span></span>
        </div>
      </div>

      <div class="sp-juego-cuerpo">
        <div class="sp-grid" id="sp-grid"></div>
        <div class="sp-objetivo" id="sp-objetivo"></div>
      </div>

    </div>
  </div>

  {{-- ③ Pantalla de victoria --}}
  <div class="sp-pantalla-victoria sp-oculta" id="sp-pantalla-victoria">
    <div class="sp-victoria-card">
      <div class="sp-victoria-emoji">🎉</div>
      <div class="sp-victoria-titulo">¡Sopa completada!</div>
      <div class="sp-victoria-stats">
        <div class="sp-victoria-stat">
          <span class="sp-victoria-stat__valor" id="sp-victoria-tiempo">00:00</span>
          <span class="sp-victoria-stat__label">Tiempo</span>
        </div>
        <div class="sp-victoria-stat">
          <span class="sp-victoria-stat__valor" id="sp-victoria-palabras">0</span>
          <span class="sp-victoria-stat__label">Palabras</span>
        </div>
      </div>
      <div class="sp-victoria-botones">
        <button class="sp-btn-primario" id="sp-btn-otra">🔄 Otra partida</button>
        <button class="sp-btn-secundario" id="sp-btn-cambiar">📝 Cambiar palabras</button>
      </div>
    </div>
  </div>

</main>

@endsection

@push('scripts')
<script>
  window.SP_CONFIG = {
    palabras: @json($palabras),
    config:   @json($config),
  };
</script>
<script src="{{ asset('js/sopa.js') }}" defer></script>
@endpush
