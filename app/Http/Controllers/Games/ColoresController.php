<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class ColoresController extends Controller
{
    public function index()
    {
        $colores = [
            ['nombre' => 'Rojo',     'hex' => '#d40000'],
            ['nombre' => 'Azul',     'hex' => '#0055cc'],
            ['nombre' => 'Verde',    'hex' => '#008a00'],
            ['nombre' => 'Amarillo', 'hex' => '#f5c800'],
            ['nombre' => 'Naranja',  'hex' => '#e86000'],
            ['nombre' => 'Morado',   'hex' => '#7200c8'],
            ['nombre' => 'Rosa',     'hex' => '#e0006e'],
            ['nombre' => 'Negro',    'hex' => '#1a1a1a'],
        ];

        $config = [
            'max_rondas' => 8,
            'opciones'   => 4,
        ];

        return view('games.colores', compact('colores', 'config'));
    }
}
