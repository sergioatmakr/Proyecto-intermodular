<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class TresRayaActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'tres-raya'],
            [
                'icono'       => '🎯',
                'tag'         => 'Estrategia',
                'titulo'      => 'Tres en Raya',
                'descripcion' => 'Juega contra la máquina al clásico tres en raya. Ideal para una partida rápida.',
                'tiempo'      => '~2 min',
                'nivel'       => 'Nivel básico',
                'ruta_nombre' => 'juego.tres-raya',
                'btn_clase'   => 'btn-verde',
                'orden'       => 60,
                'activa'      => true,
            ]
        );
    }
}
