@extends('layouts.app')

@section('title', 'Crear cuenta')

@section('content')

<main class="auth-area">
  <div class="auth-card">
    <div class="auth-card__titulo">✨ Crear cuenta</div>
    <p class="auth-card__subtitulo">Solo necesitas un email y una contraseña. Tu progreso se guardará automáticamente.</p>

    <form method="POST" action="{{ route('register') }}" class="auth-form">
      @csrf

      <label class="auth-label">
        <span>Nombre</span>
        <input type="text" name="name" value="{{ old('name') }}" required autofocus maxlength="60"
               class="auth-input" placeholder="Cómo te llamas">
      </label>

      <label class="auth-label">
        <span>Email</span>
        <input type="email" name="email" value="{{ old('email') }}" required maxlength="255"
               class="auth-input" placeholder="tu@email.com">
      </label>

      <label class="auth-label">
        <span>Contraseña</span>
        <input type="password" name="password" required minlength="6"
               class="auth-input" placeholder="Mínimo 6 caracteres">
      </label>

      <label class="auth-label">
        <span>Repite la contraseña</span>
        <input type="password" name="password_confirmation" required minlength="6"
               class="auth-input" placeholder="Repítela">
      </label>

      @if($errors->any())
        <div class="auth-error">
          @foreach($errors->all() as $error)
            <p>⚠️ {{ $error }}</p>
          @endforeach
        </div>
      @endif

      <button type="submit" class="auth-btn auth-btn--primary">Crear cuenta →</button>
    </form>

    <p class="auth-link">
      ¿Ya tienes cuenta?
      <a href="{{ route('login') }}">Inicia sesión</a>
    </p>
  </div>
</main>

@endsection
