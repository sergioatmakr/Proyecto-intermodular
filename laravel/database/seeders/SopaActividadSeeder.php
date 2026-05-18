<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class SopaActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'sopa'],
            [
                'icono'       => '🔤',
                'tag'         => 'Lenguaje',
                'titulo'      => 'Sopa de Letras',
                'descripcion' => 'Encuentra palabras escondidas entre las letras. Personaliza la lista con tus propias palabras.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Adaptable',
                'ruta_nombre' => 'juego.sopa',
                'btn_clase'   => 'btn-naranja',
                'orden'       => 70,
                'activa'      => true,
            ]
        );
    }
}
