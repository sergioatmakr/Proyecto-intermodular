<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ActividadesController;
use App\Http\Controllers\ProgresoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PartidaController;
use App\Http\Controllers\EstadoController;
use App\Http\Controllers\Games\ColoresController;
use App\Http\Controllers\Games\MatematicasController;
use App\Http\Controllers\Games\ImagenesController;
use App\Http\Controllers\Games\SecuenciasController;
use App\Http\Controllers\Games\PuzzleController;
use App\Http\Controllers\Games\TresRayaController;
use App\Http\Controllers\Games\SopaController;

/*
|--------------------------------------------------------------------------
| Rutas de MentActiva (Nivel 2: con autenticación)
|--------------------------------------------------------------------------
*/

// ── Públicas (accesibles sin login) ─────────────────────────
Route::get('/',            [HomeController::class,        'index'])->name('home');
Route::get('/actividades', [ActividadesController::class, 'index'])->name('actividades');

// Juegos: jugables sin login, pero si estás logueado se guarda tu puntuación
Route::get('/juego/colores',     [ColoresController::class,     'index'])->name('juego.colores');
Route::get('/juego/matematicas', [MatematicasController::class, 'index'])->name('juego.matematicas');
Route::get('/juego/imagenes',    [ImagenesController::class,    'index'])->name('juego.imagenes');
Route::get('/juego/secuencias',  [SecuenciasController::class,  'index'])->name('juego.secuencias');
Route::get('/juego/puzzle',      [PuzzleController::class,      'index'])->name('juego.puzzle');
Route::get('/juego/tres-raya',   [TresRayaController::class,    'index'])->name('juego.tres-raya');
Route::get('/juego/sopa',        [SopaController::class,        'index'])->name('juego.sopa');

// ── Solo para invitados (sin sesión) ────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',     [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login',    [AuthController::class, 'login']);
    Route::get('/register',  [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// ── Solo para usuarios logueados ────────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout'])->name('logout');
    Route::get('/progreso', [ProgresoController::class, 'index'])->name('progreso');

    // Endpoint API que reciben los juegos para guardar puntuación
    Route::post('/api/partida', [PartidaController::class, 'store'])->name('api.partida');

    // Estado de cada juego por usuario (temas, palabras, secuencias, fotos…)
    Route::get('/api/estado/{slug}',  [EstadoController::class, 'show'])->name('api.estado.show');
    Route::post('/api/estado/{slug}', [EstadoController::class, 'store'])->name('api.estado.store');
});
