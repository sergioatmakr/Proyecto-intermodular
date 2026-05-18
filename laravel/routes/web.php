<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ActividadesController;
use App\Http\Controllers\ProgresoController;
use App\Http\Controllers\Games\TresRayaController;
use App\Http\Controllers\Games\ColoresController;
use App\Http\Controllers\Games\MatematicasController;
use App\Http\Controllers\Games\ImagenesController;
use App\Http\Controllers\Games\PuzzleController;
use App\Http\Controllers\Games\SopaController;
use App\Http\Controllers\Games\SecuenciasController;

/*
|--------------------------------------------------------------------------
| Rutas de MentActiva
|--------------------------------------------------------------------------
|
| Rutas base de la aplicación. Cuando añadáis un juego nuevo, registradlo
| aquí con la convención:
|
|   use App\Http\Controllers\Games\NombreJuegoController;
|   Route::get('/juego/slug', [NombreJuegoController::class, 'index'])
|        ->name('juego.slug');
|
*/

Route::get('/',             [HomeController::class,        'index'])->name('home');
Route::get('/actividades',  [ActividadesController::class, 'index'])->name('actividades');
Route::get('/progreso',     [ProgresoController::class,    'index'])->name('progreso');
Route::get('/juego/tres-raya', [TresRayaController::class, 'index'])->name('juego.tres-raya');
Route::get('/juego/colores', [ColoresController::class, 'index'])->name('juego.colores');
Route::get('/juego/matematicas', [MatematicasController::class, 'index'])->name('juego.matematicas');
Route::get('/juego/imagenes', [ImagenesController::class, 'index'])->name('juego.imagenes');
Route::get('/juego/puzzle', [PuzzleController::class, 'index'])->name('juego.puzzle');
Route::get('/juego/sopa', [SopaController::class, 'index'])->name('juego.sopa');
Route::get('/juego/secuencias', [SecuenciasController::class, 'index'])->name('juego.secuencias');
// ── Juegos ──────────────────────────────────────────────────
// Añade aquí la ruta de tu juego cuando lo desarrolles.
// Ejemplo:
// Route::get('/juego/colores', [ColoresController::class, 'index'])->name('juego.colores');
