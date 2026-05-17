<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ActividadesController;
use App\Http\Controllers\ProgresoController;
use App\Http\Controllers\Games\ColoresController;
use App\Http\Controllers\Games\MatematicasController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/actividades', [ActividadesController::class, 'index'])->name('actividades');
Route::get('/progreso', [ProgresoController::class, 'index'])->name('progreso');
Route::get('/juego/colores', [ColoresController::class, 'index'])->name('juego.colores');
Route::get('/juego/matematicas', [MatematicasController::class, 'index'])->name('juego.matematicas');
