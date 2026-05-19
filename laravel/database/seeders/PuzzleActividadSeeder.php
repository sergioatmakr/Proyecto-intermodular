<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class PuzzleActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'puzzle'],
            [
                'icono'       => '🧩',
                'tag'         => 'Espacial',
                'titulo'      => 'Puzzle',
                'descripcion' => 'Arma rompecabezas con tus propias fotos. Elige 6, 9 o 12 piezas según la dificultad.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Adaptable',
                'ruta_nombre' => 'juego.puzzle',
                'btn_clase'   => 'btn-naranja',
                'orden'       => 50,
                'activa'      => true,
            ]
        );
    }
}
