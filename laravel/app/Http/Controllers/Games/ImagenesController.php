<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class ImagenesController extends Controller
{
    public function index()
    {
        // Temas predefinidos. El JS los toma como punto de partida y permite
        // al usuario añadir/quitar temas e imágenes (persistido en localStorage).
        $temas = [
            [
                'id'           => 'animales',
                'nombre'       => 'Animales',
                'icono'        => '🐾',
                'predefinido'  => true,
                'elementos'    => [
                    ['id' => 'a1', 'palabra' => 'Perro',    'src' => '🐕'],
                    ['id' => 'a2', 'palabra' => 'Gato',     'src' => '🐈'],
                    ['id' => 'a3', 'palabra' => 'Pájaro',   'src' => '🐦'],
                    ['id' => 'a4', 'palabra' => 'Pez',      'src' => '🐟'],
                    ['id' => 'a5', 'palabra' => 'Caballo',  'src' => '🐴'],
                    ['id' => 'a6', 'palabra' => 'Vaca',     'src' => '🐄'],
                    ['id' => 'a7', 'palabra' => 'Elefante', 'src' => '🐘'],
                    ['id' => 'a8', 'palabra' => 'Conejo',   'src' => '🐰'],
                ],
            ],
            [
                'id'           => 'frutas',
                'nombre'       => 'Frutas',
                'icono'        => '🍎',
                'predefinido'  => true,
                'elementos'    => [
                    ['id' => 'f1', 'palabra' => 'Manzana', 'src' => '🍎'],
                    ['id' => 'f2', 'palabra' => 'Plátano', 'src' => '🍌'],
                    ['id' => 'f3', 'palabra' => 'Naranja', 'src' => '🍊'],
                    ['id' => 'f4', 'palabra' => 'Uvas',    'src' => '🍇'],
                    ['id' => 'f5', 'palabra' => 'Fresa',   'src' => '🍓'],
                    ['id' => 'f6', 'palabra' => 'Pera',    'src' => '🍐'],
                    ['id' => 'f7', 'palabra' => 'Sandía',  'src' => '🍉'],
                    ['id' => 'f8', 'palabra' => 'Limón',   'src' => '🍋'],
                ],
            ],
            [
                'id'           => 'transportes',
                'nombre'       => 'Transportes',
                'icono'        => '🚗',
                'predefinido'  => true,
                'elementos'    => [
                    ['id' => 't1', 'palabra' => 'Coche',       'src' => '🚗'],
                    ['id' => 't2', 'palabra' => 'Autobús',     'src' => '🚌'],
                    ['id' => 't3', 'palabra' => 'Tren',        'src' => '🚂'],
                    ['id' => 't4', 'palabra' => 'Barco',       'src' => '🚢'],
                    ['id' => 't5', 'palabra' => 'Avión',       'src' => '✈️'],
                    ['id' => 't6', 'palabra' => 'Bicicleta',   'src' => '🚲'],
                    ['id' => 't7', 'palabra' => 'Moto',        'src' => '🏍️'],
                    ['id' => 't8', 'palabra' => 'Helicóptero', 'src' => '🚁'],
                ],
            ],
            [
                'id'           => 'comida',
                'nombre'       => 'Comida',
                'icono'        => '🍕',
                'predefinido'  => true,
                'elementos'    => [
                    ['id' => 'c1', 'palabra' => 'Pizza',       'src' => '🍕'],
                    ['id' => 'c2', 'palabra' => 'Hamburguesa', 'src' => '🍔'],
                    ['id' => 'c3', 'palabra' => 'Pasta',       'src' => '🍝'],
                    ['id' => 'c4', 'palabra' => 'Sopa',        'src' => '🍲'],
                    ['id' => 'c5', 'palabra' => 'Pan',         'src' => '🍞'],
                    ['id' => 'c6', 'palabra' => 'Ensalada',    'src' => '🥗'],
                    ['id' => 'c7', 'palabra' => 'Helado',      'src' => '🍦'],
                    ['id' => 'c8', 'palabra' => 'Tarta',       'src' => '🎂'],
                ],
            ],
        ];

        $config = [
            'max_rondas' => 8,
            'opciones'   => 4,
        ];

        return view('games.imagenes', compact('temas', 'config'));
    }
}
