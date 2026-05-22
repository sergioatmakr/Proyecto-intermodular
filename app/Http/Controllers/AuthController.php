<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ── Mostrar formularios ──────────────────────────────────
    public function showLogin()
    {
        return view('auth.login');
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    // ── Procesar login ───────────────────────────────────────
    public function login(Request $request)
    {
        $credenciales = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credenciales, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('home'));
        }

        return back()
            ->withErrors(['email' => 'Email o contraseña incorrectos.'])
            ->onlyInput('email');
    }

    // ── Procesar registro ────────────────────────────────────
    public function register(Request $request)
    {
        $datos = $request->validate([
            'name'     => 'required|string|max:60',
            'email'    => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'email.unique'       => 'Ya hay una cuenta con ese email.',
            'password.min'       => 'La contraseña debe tener al menos 6 caracteres.',
        ]);

        $user = User::create([
            'name'     => $datos['name'],
            'email'    => $datos['email'],
            'password' => Hash::make($datos['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home')->with('bienvenida', "¡Bienvenido, {$user->name}!");
    }

    // ── Cerrar sesión ────────────────────────────────────────
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}
