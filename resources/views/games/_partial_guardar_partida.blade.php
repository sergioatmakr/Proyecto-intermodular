{{--
  Helper partial: expone window.MentActiva.guardarPartida() para que el JS
  de cada juego pueda guardar la puntuación al finalizar.

  Uso desde un juego:
    @include('games._partial_guardar_partida', ['slug' => 'matematicas'])

  Y luego desde el JS del juego al terminar:
    MentActiva.guardarPartida({ puntos: 80, duracion_seg: 45, datos: {...} });

  Si el usuario no está logueado, la función NO falla — simplemente devuelve
  un Promise que resuelve con { ok: false, reason: 'guest' }, así que el
  juego funciona igual aunque no haya nadie autenticado.
--}}

<script>
  window.MentActiva = window.MentActiva || {};
  window.MentActiva.guardarPartida = (function () {
    const SLUG     = @json($slug);
    const URL      = @json(route('api.partida'));
    const LOGUEADO = @json(Auth::check());
    const CSRF     = document.querySelector('meta[name="csrf-token"]')?.content;

    return async function (datos) {
      if (!LOGUEADO) return { ok: false, reason: 'guest' };

      try {
        const resp = await fetch(URL, {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
            'X-CSRF-TOKEN': CSRF,
          },
          body: JSON.stringify({
            slug:         SLUG,
            puntos:       datos.puntos ?? 0,
            duracion_seg: datos.duracion_seg ?? null,
            datos:        datos.datos ?? null,
          }),
        });
        if (!resp.ok) return { ok: false, reason: 'http_' + resp.status };
        return await resp.json();
      } catch (e) {
        return { ok: false, reason: 'network', error: e.message };
      }
    };
  })();
</script>
