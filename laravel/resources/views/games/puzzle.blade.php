@extends('layouts.app')

@section('title', 'Puzzle')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/puzzle.css') }}">
@endpush

@section('content')

<main class="pz-area">

  {{-- ① Galería de imágenes + selector de piezas --}}
  <div class="pz-pantalla-galeria" id="pz-pantalla-galeria">
    <div class="pz-contenedor">

      <h2 class="pz-titulo-pantalla">🧩 Puzzle</h2>
      <p class="pz-subtitulo-pantalla">
        Elige una imagen, el nivel de dificultad y arma el rompecabezas.
      </p>

      <div class="pz-galeria" id="pz-galeria"></div>

      {{-- Zona de drag & drop para subir imagen --}}
      <div class="pz-dropzone" id="pz-dropzone">
        <div class="pz-dropzone__icono">📁</div>
        <strong>Arrastra una imagen aquí</strong>
        <span>o haz clic para seleccionarla · también puedes pegar (Ctrl+V)</span>
        <input type="file" id="pz-dropzone-input" accept="image/*" hidden>
      </div>

      <div class="pz-piezas-selector">
        <span class="pz-label">Piezas:</span>
        <div class="pz-piezas-botones" role="radiogroup">
          <button class="pz-piezas-btn" data-piezas="6">6</button>
          <button class="pz-piezas-btn pz-piezas-btn--activa" data-piezas="9">9</button>
          <button class="pz-piezas-btn" data-piezas="12">12</button>
        </div>
      </div>

      <div class="pz-galeria-pie">
        <p class="pz-galeria-estado" id="pz-galeria-estado">Selecciona una imagen para jugar</p>
        <button class="pz-btn-jugar" id="pz-btn-jugar" disabled>🎮 Jugar</button>
      </div>

    </div>
  </div>

  {{-- ② Pantalla de juego --}}
  <div class="pz-pantalla-juego pz-oculta" id="pz-pantalla-juego">
    <div class="pz-contenedor pz-contenedor--juego">

      <div class="pz-juego-cabecera">
        <button class="pz-btn-volver" id="pz-btn-volver">← Volver</button>
        <div class="pz-stats">
          <span class="pz-stat">⏱ <span id="pz-tiempo">00:00</span></span>
          <span class="pz-stat">↔ <span id="pz-movs">0</span> movs</span>
        </div>
        <button class="pz-btn-pista" id="pz-btn-pista" title="Ver imagen completa">👁️ Pista</button>
      </div>

      <div class="pz-juego-cuerpo">

        {{-- Tablero --}}
        <div class="pz-tablero-wrapper">
          <div class="pz-tablero" id="pz-tablero"></div>
          <img class="pz-pista-img pz-oculta" id="pz-pista-img" alt="Pista">
        </div>

        {{-- Bandeja de piezas mezcladas --}}
        <div class="pz-bandeja-wrapper">
          <h3 class="pz-bandeja-titulo">Piezas</h3>
          <div class="pz-bandeja" id="pz-bandeja"></div>
        </div>

      </div>

    </div>
  </div>

  {{-- ③ Pantalla de victoria --}}
  <div class="pz-pantalla-victoria pz-oculta" id="pz-pantalla-victoria">
    <div class="pz-victoria-card">
      <div class="pz-victoria-emoji">🎉</div>
      <div class="pz-victoria-titulo">¡Puzzle completado!</div>
      <div class="pz-victoria-stats">
        <div class="pz-victoria-stat">
          <span class="pz-victoria-stat__valor" id="pz-victoria-tiempo">00:00</span>
          <span class="pz-victoria-stat__label">Tiempo</span>
        </div>
        <div class="pz-victoria-stat">
          <span class="pz-victoria-stat__valor" id="pz-victoria-movs">0</span>
          <span class="pz-victoria-stat__label">Movimientos</span>
        </div>
      </div>
      <img class="pz-victoria-img" id="pz-victoria-img" alt="">
      <div class="pz-victoria-botones">
        <button class="pz-btn-primario" id="pz-btn-jugar-otro">🔄 Otra partida</button>
        <button class="pz-btn-secundario" id="pz-btn-volver-galeria">🖼️ Cambiar imagen</button>
      </div>
    </div>
  </div>

</main>

@endsection

@push('scripts')
<script>
  window.PZ_CONFIG = {
    imagenes: @json($imagenes),
    layouts:  @json($layouts),
  };
</script>
<script src="{{ asset('js/puzzle.js') }}" defer></script>
@endpush
