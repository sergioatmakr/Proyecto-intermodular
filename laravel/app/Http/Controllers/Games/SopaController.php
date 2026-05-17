<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class SopaController extends Controller
{
    public function index()
    {
        // Pool inicial de palabras (en mayúsculas, sin tildes).
        // El JS lo carga, el usuario puede añadir/quitar y se guarda en localStorage.
        $palabras = [
            'PERRO', 'GATO', 'CABALLO', 'ELEFANTE', 'LEON', 'TIGRE',
            'MANZANA', 'PLATANO', 'NARANJA', 'FRESA', 'UVA',
            'ROJO', 'AZUL', 'VERDE', 'AMARILLO',
            'SILLA', 'MESA', 'CAMA', 'PUERTA', 'VENTANA',
            'CUCHARA', 'TENEDOR', 'PLATO', 'VASO',
            'SOL', 'LUNA', 'NUBE', 'LLUVIA',
            'CASA', 'LIBRO', 'TELEFONO', 'RELOJ',
        ];

        $config = [
            'tam_grid_min'  => 10,
            'tam_grid_max'  => 15,
            'palabras_recomendadas' => 8,
        ];

        return view('games.sopa', compact('palabras', 'config'));
    }
}
