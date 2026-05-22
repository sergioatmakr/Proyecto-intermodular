@extends('layouts.app')

@section('title', 'Iniciar sesión')

@section('content')

<main class="auth-area">
  <div class="auth-card">
    <div class="auth-card__titulo">🔑 Iniciar sesión</div>
    <p class="auth-card__subtitulo">Entra para guardar tu progreso entre partidas.</p>

    <form method="POST" action="{{ route('login') }}" class="auth-form">
      @csrf

      <label class="auth-label">
        <span>Email</span>
        <input type="email" name="email" value="{{ old('email') }}" required autofocus
               class="auth-input" placeholder="tu@email.com">
      </label>

      <label class="auth-label">
        <span>Contraseña</span>
        <input type="password" name="password" required class="auth-input" placeholder="••••••••">
      </label>

      <label class="auth-checkbox">
        <input type="checkbox" name="remember" value="1">
        <span>Recordarme</span>
      </label>

      @if($errors->any())
        <div class="auth-error">
          @foreach($errors->all() as $error)
            <p>⚠️ {{ $error }}</p>
          @endforeach
        </div>
      @endif

      <button type="submit" class="auth-btn auth-btn--primary">Entrar →</button>
    </form>

    <p class="auth-link">
      ¿No tienes cuenta?
      <a href="{{ route('register') }}">Regístrate aquí</a>
    </p>
  </div>
</main>

@endsection
