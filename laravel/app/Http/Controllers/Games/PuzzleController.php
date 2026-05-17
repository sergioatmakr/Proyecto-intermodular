<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class PuzzleController extends Controller
{
    public function index()
    {
        // Imágenes iniciales para que el juego no esté vacío.
        // Usamos picsum.photos con seeds estables: misma seed → misma imagen.
        // El usuario puede subir sus propias fotos desde la galería del juego.
        $imagenes = [
            ['id' => 'demo_1', 'titulo' => 'Paisaje 1', 'src' => 'https://picsum.photos/seed/mentactiva1/600/600', 'predefinida' => true],
            ['id' => 'demo_2', 'titulo' => 'Paisaje 2', 'src' => 'https://picsum.photos/seed/mentactiva2/600/600', 'predefinida' => true],
            ['id' => 'demo_3', 'titulo' => 'Paisaje 3', 'src' => 'https://picsum.photos/seed/mentactiva3/600/600', 'predefinida' => true],
            ['id' => 'demo_4', 'titulo' => 'Paisaje 4', 'src' => 'https://picsum.photos/seed/mentactiva4/600/600', 'predefinida' => true],
        ];

        // Layouts por cantidad de piezas: cuántas columnas y filas usar en el tablero.
        // Se mantiene el tablero cuadrado (1:1) por simplicidad, los pictogramas/piezas
        // pueden quedar rectangulares en 6 y 12 piezas.
        $layouts = [
            6  => ['cols' => 3, 'rows' => 2],
            9  => ['cols' => 3, 'rows' => 3],
            12 => ['cols' => 4, 'rows' => 3],
        ];

        return view('games.puzzle', compact('imagenes', 'layouts'));
    }
}
