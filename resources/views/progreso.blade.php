@extends('layouts.app')

@section('title', 'Mi progreso')

@section('content')

<main class="auth-area">
  <div class="progreso-wrapper">

    <section class="hero">
      <div class="hero-insignia">✦ Tu progreso</div>
      <h1>Hola, <em>{{ $user->name }}</em></h1>
      <p>Esto es lo que has conseguido hasta ahora.</p>
    </section>

    <section class="progreso-stats">
      <div class="progreso-stat">
        <div class="progreso-stat__valor">{{ $stats['total_partidas'] }}</div>
        <div class="progreso-stat__label">Partidas</div>
      </div>
      <div class="progreso-stat">
        <div class="progreso-stat__valor">{{ $stats['puntos_totales'] }}</div>
        <div class="progreso-stat__label">Puntos totales</div>
      </div>
      <div class="progreso-stat">
        <div class="progreso-stat__valor">{{ $stats['mejor_puntos'] }}</div>
        <div class="progreso-stat__label">Mejor partida</div>
      </div>
    </section>

    @if($porJuego->isNotEmpty())
      <section class="progreso-bloque">
        <h2 class="progreso-titulo">Por juego</h2>
        <div class="progreso-juegos">
          @foreach($porJuego as $j)
            <div class="progreso-juego">
              <div class="progreso-juego__icono">{{ $j->icono }}</div>
              <div class="progreso-juego__nombre">{{ $j->titulo }}</div>
              <div class="progreso-juego__datos">
                <span><strong>{{ $j->n_partidas }}</strong> partidas</span>
                <span><strong>{{ $j->total_puntos }}</strong> puntos</span>
                <span>Máx: <strong>{{ $j->max_puntos }}</strong></span>
              </div>
            </div>
          @endforeach
        </div>
      </section>

      <section class="progreso-bloque">
        <h2 class="progreso-titulo">Últimas 20 partidas</h2>
        <table class="progreso-tabla">
          <thead>
            <tr>
              <th>Juego</th>
              <th>Puntos</th>
              <th>Tiempo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            @foreach($partidas as $p)
              <tr>
                <td>
                  @if($p->actividad)
                    {{ $p->actividad->icono }} {{ $p->actividad->titulo }}
                  @else
                    🎮 {{ ucfirst($p->slug) }}
                  @endif
                </td>
                <td><strong>{{ $p->puntos }}</strong></td>
                <td>{{ $p->duracion_formateada }}</td>
                <td>{{ $p->created_at->diffForHumans() }}</td>
              </tr>
            @endforeach
          </tbody>
        </table>
      </section>
    @else
      <div class="progreso-vacio">
        <div class="progreso-vacio__emoji">🎯</div>
        <h2>Aún no has jugado ninguna partida</h2>
        <p>Juega alguna actividad y aparecerá aquí tu progreso.</p>
        <a href="{{ route('actividades') }}" class="auth-btn auth-btn--primary">Ver actividades →</a>
      </div>
    @endif

  </div>
</main>

@endsection
