<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ActividadesController;
use App\Http\Controllers\ProgresoController;
use App\Http\Controllers\Games\ColoresController;
use App\Http\Controllers\Games\MatematicasController;
use App\Http\Controllers\Games\ImagenesController;
use App\Http\Controllers\Games\SecuenciasController;
use App\Http\Controllers\Games\PuzzleController;
use App\Http\Controllers\Games\TresRayaController;
use App\Http\Controllers\Games\SopaController;

/*
|--------------------------------------------------------------------------
| Rutas de MentActiva
|--------------------------------------------------------------------------
|
| Cuando añadáis un juego nuevo:
|   1. Crear el controlador en app/Http/Controllers/Games/
|   2. Registrar la ruta aquí con ->name('juego.slug')
|   3. Crear un seeder en database/seeders/XxxActividadSeeder.php
|   4. Añadirlo a ActividadSeeder.php
|   5. php artisan db:seed
|
*/

Route::get('/',             [HomeController::class,        'index'])->name('home');
Route::get('/actividades',  [ActividadesController::class, 'index'])->name('actividades');
Route::get('/progreso',     [ProgresoController::class,    'index'])->name('progreso');

// ── Juegos ──────────────────────────────────────────────────
Route::get('/juego/colores',     [ColoresController::class,     'index'])->name('juego.colores');
Route::get('/juego/matematicas', [MatematicasController::class, 'index'])->name('juego.matematicas');
Route::get('/juego/imagenes',    [ImagenesController::class,    'index'])->name('juego.imagenes');
Route::get('/juego/secuencias',  [SecuenciasController::class,  'index'])->name('juego.secuencias');
Route::get('/juego/puzzle',      [PuzzleController::class,      'index'])->name('juego.puzzle');
Route::get('/juego/tres-raya',   [TresRayaController::class,    'index'])->name('juego.tres-raya');
Route::get('/juego/sopa',        [SopaController::class,        'index'])->name('juego.sopa');
