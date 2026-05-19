<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class MatematicasController extends Controller
{
    public function index()
    {
        $config = [
            'max_rondas' => 8,
        ];

        return view('games.matematicas', compact('config'));
    }
}
