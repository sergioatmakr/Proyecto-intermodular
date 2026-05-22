@extends('layouts.app')

@section('title', 'Secuencias de Tareas')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/secuencias.css') }}">
@endpush

@section('content')

<main class="sq-area">

  {{-- ① Pantalla de lista de secuencias --}}
  <div class="sq-pantalla-lista" id="sq-pantalla-lista">
    <div class="sq-contenedor">

      <h2 class="sq-titulo-pantalla">📋 Secuencias de tareas</h2>
      <p class="sq-subtitulo-pantalla">
        Aprende a hacer una tarea siguiendo los pictogramas en orden.
      </p>

      <div class="sq-grid" id="sq-grid"></div>

      <button class="sq-btn-nueva" id="sq-btn-nueva">+ Nueva secuencia</button>

    </div>
  </div>

  {{-- ② Pantalla de juego (modo ver) --}}
  <div class="sq-pantalla-juego sq-oculta" id="sq-pantalla-juego">
    <div class="sq-contenedor sq-contenedor--ancho">

      <div class="sq-juego-cabecera">
        <button class="sq-btn-volver" id="sq-btn-volver">← Volver</button>
        <h2 class="sq-titulo-juego">
          <span id="sq-juego-icono">📋</span>
          <span id="sq-juego-titulo">Secuencia</span>
        </h2>
        <button class="sq-btn-modo" id="sq-btn-modo-practicar">
          🎯 Practicar
        </button>
      </div>

      <div class="sq-pasos" id="sq-pasos" role="list">
        {{-- Pictogramas en orden, generados por JS --}}
      </div>

    </div>
  </div>

  {{-- ③ Pantalla de práctica --}}
  <div class="sq-pantalla-practica sq-oculta" id="sq-pantalla-practica">
    <div class="sq-contenedor sq-contenedor--ancho">

      <div class="sq-juego-cabecera">
        <button class="sq-btn-volver" id="sq-btn-volver-practica">← Volver</button>
        <h2 class="sq-titulo-juego">
          🎯 <span id="sq-practica-titulo">Practicar</span>
        </h2>
        <button class="sq-btn-modo" id="sq-btn-modo-ver">
          👁️ Ver
        </button>
      </div>

      <p class="sq-practica-instruccion">
        Haz clic en los pictogramas en el <strong>orden correcto</strong>.
      </p>

      <div class="sq-practica-mezclados" id="sq-practica-mezclados"></div>

      <div class="sq-practica-progreso" id="sq-practica-progreso"></div>

      <div class="sq-practica-acciones">
        <button class="sq-btn-secundario" id="sq-btn-reiniciar-practica">↻ Reiniciar</button>
        <span class="sq-practica-resultado" id="sq-practica-resultado"></span>
      </div>

    </div>
  </div>

  {{-- Modal: crear/editar secuencia --}}
  <div class="sq-modal-backdrop sq-oculta" id="sq-modal">
    <div class="sq-modal" role="dialog" aria-labelledby="sq-modal-titulo">

      <div class="sq-modal__cabecera">
        <h3 class="sq-modal__titulo" id="sq-modal-titulo">Nueva secuencia</h3>
        <button class="sq-modal__cerrar" id="sq-modal-cerrar" aria-label="Cerrar">✕</button>
      </div>

      <div class="sq-modal__cuerpo">

        {{-- Nombre y emoji --}}
        <div class="sq-modal__seccion">
          <label class="sq-label">Nombre de la tarea</label>
          <div class="sq-modal__nombre-fila">
            <input type="text" class="sq-input sq-input--flex" id="sq-input-nombre"
              placeholder="Ej: Preparar la merienda" maxlength="40">
            <input type="text" class="sq-input sq-input--icono" id="sq-input-icono"
              placeholder="📋" maxlength="4" title="Emoji">
          </div>
        </div>

        {{-- Pasos actuales --}}
        <div class="sq-modal__seccion">
          <label class="sq-label">Pasos en orden</label>
          <div class="sq-pasos-edicion" id="sq-pasos-edicion">
            <p class="sq-vacio">Aún no hay pasos. Búscalos abajo y añádelos.</p>
          </div>
        </div>

        {{-- Buscador ARASAAC --}}
        <div class="sq-modal__seccion sq-modal__seccion--buscador">
          <label class="sq-label">Buscar pictograma en ARASAAC</label>
          <div class="sq-buscador">
            <input type="text" class="sq-input sq-input--flex" id="sq-input-buscar"
              placeholder="Ej: comer, lavar, dientes...">
            <button class="sq-btn-buscar" id="sq-btn-buscar">🔍 Buscar</button>
          </div>
          <div class="sq-resultados" id="sq-resultados">
            <p class="sq-resultados-hint">Escribe una palabra y pulsa "Buscar". Haz clic en un pictograma para añadirlo como nuevo paso.</p>
          </div>
        </div>

      </div>

      <div class="sq-modal__pie">
        <button class="sq-btn-secundario" id="sq-btn-cancelar">Cancelar</button>
        <button class="sq-btn-primario" id="sq-btn-guardar">💾 Guardar secuencia</button>
      </div>

    </div>
  </div>

  {{-- Atribución obligatoria de ARASAAC (CC BY-NC-SA) --}}
  <div class="sq-atribucion">
    Pictogramas: <strong>Sergio Palao</strong> · Origen:
    <a href="https://arasaac.org" target="_blank" rel="noopener">ARASAAC</a> ·
    Licencia: CC&nbsp;BY-NC-SA · Propiedad: Gobierno de Aragón
  </div>

</main>

@endsection

@push('scripts')
{{-- Inyectamos datos PHP en el JS --}}
<script>
  window.SQ_CONFIG = {
    secuencias: @json($secuencias),
    arasaac:    @json($arasaac),
  };
</script>
@include('games._partial_guardar_partida', ['slug' => 'secuencias'])
@include('games._partial_estado', ['slug' => 'secuencias'])

<script src="{{ asset('js/secuencias.js') }}" defer></script>
@endpush
