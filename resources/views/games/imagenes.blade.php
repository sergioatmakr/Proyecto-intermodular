@extends('layouts.app')

@section('title', 'Reconocimiento de Imágenes')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/imagenes.css') }}">
@endpush

@section('content')

<main class="ig-area">

  {{-- ① Selección de temas --}}
  <div class="ig-pantalla-temas" id="ig-pantalla-temas">
    <div class="ig-temas-contenedor">

      <h2 class="ig-temas-titulo">🖼️ Elige los temas</h2>
      <p class="ig-temas-subtitulo">Selecciona uno o más temas para jugar</p>

      <div class="ig-lista-temas" id="ig-lista-temas"></div>

      <button class="ig-boton-nuevo-tema" id="ig-boton-nuevo-tema">
        + Añadir nuevo tema
      </button>
      <div class="ig-form-nuevo-tema ig-form--oculto" id="ig-form-nuevo-tema">
        <div class="ig-form-fila">
          <input type="text" class="ig-input ig-input--flex" id="ig-input-nombre-tema"
            placeholder="Nombre del tema (ej: Deportes)" maxlength="30">
          <input type="text" class="ig-input ig-input--icono" id="ig-input-icono-tema"
            placeholder="🗂️" maxlength="4" title="Emoji del tema">
        </div>
        <div class="ig-form-botones">
          <button class="ig-btn ig-btn--primario" id="ig-boton-guardar-tema">Guardar tema</button>
          <button class="ig-btn ig-btn--secundario" id="ig-boton-cancelar-tema">Cancelar</button>
        </div>
      </div>

      <div class="ig-temas-pie">
        <p class="ig-contador-temas" id="ig-contador-temas">Selecciona al menos un tema</p>
        <button class="ig-boton-jugar" id="ig-boton-jugar" disabled>🎮 Jugar</button>
      </div>

    </div>
  </div>

  {{-- ② Pantalla de inicio --}}
  <div class="ig-pantalla-inicio ig-pantalla--oculta" id="ig-pantalla-inicio">
    <div class="ig-pantalla-inicio__titulo">🖼️ ¿Qué Imagen<br>Es Esta?</div>
    <div class="ig-pantalla-inicio__subtitulo">
      Lee la palabra y selecciona la imagen correcta.<br>
      <strong>{{ $config['max_rondas'] }} rondas</strong> · {{ $config['opciones'] }} imágenes por ronda.
    </div>
    <button class="ig-pantalla-inicio__boton" id="ig-boton-empezar">¡Empezar!</button>
  </div>

  {{-- ③ Pantalla de fin --}}
  <div class="ig-pantalla-fin ig-pantalla--oculta" id="ig-pantalla-fin">
    <div class="ig-fin__titulo">🏁 ¡Juego terminado!</div>
    <p class="ig-fin__puntos-label">Puntuación final</p>
    <div class="ig-fin__puntos" id="ig-fin-puntos">0</div>
    <p class="ig-fin__mensaje" id="ig-fin-mensaje"></p>
    <div class="ig-fin__botones">
      <button class="ig-fin__boton ig-fin__boton--reiniciar" id="ig-boton-reiniciar">
        🔄 Jugar de nuevo
      </button>
      <button class="ig-fin__boton ig-fin__boton--temas" id="ig-boton-cambiar-tema">
        🖼️ Cambiar temas
      </button>
    </div>
  </div>

  {{-- ④ Contenido del juego --}}
  <div class="ig-contenedor">

    <h1 class="ig-titulo">🖼️ ¿Qué Imagen Es Esta?</h1>

    <div class="ig-estadisticas">
      <div class="ig-estadistica">
        <span class="ig-estadistica__valor" id="ig-puntos">0</span>
        <span class="ig-estadistica__etiqueta">Puntos</span>
      </div>
      <div class="ig-estadistica-separador"></div>
      <div class="ig-estadistica">
        <span class="ig-estadistica__valor" id="ig-ronda">1 / {{ $config['max_rondas'] }}</span>
        <span class="ig-estadistica__etiqueta">Ronda</span>
      </div>
      <div class="ig-estadistica-separador"></div>
      <div class="ig-estadistica">
        <span class="ig-estadistica__valor" id="ig-racha">0</span>
        <span class="ig-estadistica__etiqueta">Racha 🔥</span>
      </div>
    </div>

    <div class="ig-tarjeta-juego">

      <div class="ig-palabra-contenedor">
        <span class="ig-palabra-texto" id="ig-palabra-objetivo">—</span>
      </div>

      <p class="ig-instruccion">Selecciona la imagen que corresponde a la palabra.</p>

      <div class="ig-cuadricula" id="ig-cuadricula"></div>

      <div class="ig-banner-respuesta" id="ig-banner-respuesta"></div>

      <button class="ig-boton-siguiente" id="ig-boton-siguiente" style="display:none">
        Siguiente ronda →
      </button>

    </div>

  </div>

  {{-- Modal de gestión de imágenes --}}
  <div class="ig-modal-backdrop ig-modal--oculto" id="ig-modal-tema">
    <div class="ig-modal" role="dialog" aria-labelledby="ig-modal-titulo">

      <div class="ig-modal__cabecera">
        <h3 class="ig-modal__titulo" id="ig-modal-titulo">Tema</h3>
        <button class="ig-modal__cerrar" id="ig-modal-cerrar" aria-label="Cerrar">✕</button>
      </div>

      <div class="ig-modal__añadir">
        <h4 class="ig-modal__subtitulo">Añadir imagen</h4>
        <div class="ig-modal__form">

          <input type="text" class="ig-input" id="ig-input-palabra"
            placeholder="Palabra que aparecerá en el juego (ej: Perro)" maxlength="30">

          {{-- Zona de drag & drop --}}
          <div class="ig-dropzone" id="ig-dropzone">
            <div class="ig-dropzone__icono">📁</div>
            <strong>Arrastra una imagen aquí</strong>
            <span>o haz clic para seleccionarla · también puedes pegar (Ctrl+V)</span>
            <input type="file" id="ig-dropzone-input" accept="image/*" hidden>
          </div>

          {{-- Alternativa: emoji o URL --}}
          <details class="ig-modal__alt">
            <summary>O usa un emoji / URL</summary>
            <input type="text" class="ig-input" id="ig-input-src"
              placeholder="Emoji (🐕) o URL (https://...)">
          </details>

          {{-- Vista previa estilo juego --}}
          <div class="ig-preview-zona">
            <span class="ig-preview-zona__label">Vista previa</span>
            <div class="ig-preview-card" id="ig-preview-card">
              <div class="ig-preview-card__placeholder">Sin imagen</div>
            </div>
            <div class="ig-preview-card__palabra" id="ig-preview-palabra">—</div>
          </div>

          <button class="ig-btn ig-btn--primario ig-btn--full" id="ig-boton-add-img">
            + Añadir imagen
          </button>
        </div>
      </div>

      <h4 class="ig-modal__subtitulo ig-modal__subtitulo--grid">Imágenes del tema</h4>
      <div class="ig-modal__grid" id="ig-modal-grid"></div>

    </div>
  </div>

</main>

@endsection

@push('scripts')
{{-- Pasamos los temas predefinidos desde PHP al JS de forma segura --}}
<script>
  window.IG_CONFIG = {
    temas:     @json($temas),
    maxRondas: {{ $config['max_rondas'] }},
    opciones:  {{ $config['opciones'] }},
  };
</script>
<script src="{{ asset('js/imagenes.js') }}" defer></script>
@endpush
