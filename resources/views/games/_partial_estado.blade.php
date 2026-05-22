{{--
  Helper de persistencia de estado del juego en BD (sustituye a localStorage).

  Uso desde un juego:
    @include('games._partial_estado', ['slug' => 'imagenes'])

  Y en el JS:
    const estado = window.MentActiva.cargarEstado();   // null si no hay
    window.MentActiva.guardarEstado(objeto);           // guarda en BD (o local si invitado)

  - Si el usuario está LOGUEADO: el estado inicial se inyecta desde la BD
    (carga síncrona), y guardarEstado() hace POST al servidor.
  - Si es INVITADO: usa localStorage como respaldo para no romper el juego.
--}}

@php
  $estadoInicialJuego = null;
  if (\Illuminate\Support\Facades\Auth::check()) {
      $gs = \App\Models\GameState::where('user_id', \Illuminate\Support\Facades\Auth::id())
            ->where('slug', $slug)
            ->first();
      $estadoInicialJuego = $gs?->datos;
  }
@endphp

<script>
  window.MentActiva = window.MentActiva || {};
  (function () {
    const SLUG     = @json($slug);
    const LOGUEADO = @json(\Illuminate\Support\Facades\Auth::check());
    const ESTADO   = @json($estadoInicialJuego);
    const URL_BASE = @json(url('/api/estado'));
    const CSRF     = document.querySelector('meta[name="csrf-token"]')?.content;
    const LS_KEY   = 'mentactiva_' + SLUG;   // respaldo local para invitados

    // ── Cargar estado inicial ──────────────────────────────
    window.MentActiva.cargarEstado = function () {
      if (LOGUEADO) {
        return ESTADO ?? null;              // viene de la BD (ya inyectado, síncrono)
      }
      try {
        const g = localStorage.getItem(LS_KEY);
        return g ? JSON.parse(g) : null;
      } catch (e) { return null; }
    };

    // ── Guardar estado ─────────────────────────────────────
    window.MentActiva.guardarEstado = function (datos) {
      if (LOGUEADO) {
        fetch(URL_BASE + '/' + SLUG, {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
            'X-CSRF-TOKEN': CSRF,
          },
          body: JSON.stringify({ datos: datos }),
        }).catch(function () { /* silencioso */ });
      } else {
        try { localStorage.setItem(LS_KEY, JSON.stringify(datos)); } catch (e) {}
      }
    };
  })();
</script>
