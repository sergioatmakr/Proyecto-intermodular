@extends('layouts.app')

@section('title', 'Tres en Raya')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/tres-raya.css') }}">
@endpush

@section('content')

<main class="tr-area">

  {{-- ① Pantalla de inicio --}}
  <div class="tr-pantalla-inicio" id="tr-pantalla-inicio">
    <div class="tr-inicio-card">
      <div class="tr-inicio-titulo">🎯 Tres en Raya</div>
      <p class="tr-inicio-subtitulo">
        Juega contra la máquina.<br>
        Tú eres las <strong>X</strong>, ella las <strong>O</strong>.
      </p>
      <button class="tr-btn-grande" id="tr-btn-empezar">¡Empezar!</button>
    </div>
  </div>

  {{-- ② Pantalla de juego --}}
  <div class="tr-pantalla-juego tr-oculta" id="tr-pantalla-juego">
    <div class="tr-contenedor">

      <div class="tr-marcador">
        <div class="tr-marcador__item tr-marcador__item--jugador">
          <span class="tr-marcador__valor" id="tr-mark-jugador">0</span>
          <span class="tr-marcador__label">Tú (X)</span>
        </div>
        <div class="tr-marcador__item">
          <span class="tr-marcador__valor" id="tr-mark-empates">0</span>
          <span class="tr-marcador__label">Empates</span>
        </div>
        <div class="tr-marcador__item tr-marcador__item--ia">
          <span class="tr-marcador__valor" id="tr-mark-ia">0</span>
          <span class="tr-marcador__label">IA (O)</span>
        </div>
      </div>

      <div class="tr-tablero" id="tr-tablero">
        {{-- 9 casillas generadas por JS --}}
      </div>

      <div class="tr-mensaje" id="tr-mensaje">Tu turno</div>

      <div class="tr-acciones">
        <button class="tr-btn-grande" id="tr-btn-nueva">↻ Nueva partida</button>
        <button class="tr-btn-secundario" id="tr-btn-reset">🗑️ Reset marcador</button>
      </div>

    </div>
  </div>

</main>

@endsection

@push('scripts')
<script>
  window.TR_CONFIG = @json($config);
</script>
@include('games._partial_guardar_partida', ['slug' => 'tres-raya'])
@include('games._partial_estado', ['slug' => 'tres-raya'])

<script src="{{ asset('js/tres-raya.js') }}" defer></script>
@endpush
