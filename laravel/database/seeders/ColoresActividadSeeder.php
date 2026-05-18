<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class ColoresActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'colores'],
            [
                'icono'       => '🎨',
                'tag'         => 'Visual',
                'titulo'      => 'Reconocimiento de Colores',
                'descripcion' => 'Identifica colores, asocia nombres y entrena la percepción visual con ejercicios progresivos y divertidos.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta_nombre' => 'juego.colores',
                'btn_clase'   => 'btn-naranja',
                'orden'       => 10,
                'activa'      => true,
            ]
        );
    }
}
