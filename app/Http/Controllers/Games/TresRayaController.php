<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class TresRayaController extends Controller
{
    public function index()
    {
        // Configuración mínima del juego
        $config = [
            'simbolo_jugador' => 'X',
            'simbolo_ia'      => 'O',
            'delay_ia_ms'     => 500, // pausa antes del movimiento de la IA para que parezca que "piensa"
        ];

        return view('games.tres-raya', compact('config'));
    }
}
