<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class SecuenciasActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'secuencias'],
            [
                'icono'       => '📋',
                'tag'         => 'Secuenciación',
                'titulo'      => 'Secuencias de Tareas',
                'descripcion' => 'Aprende a hacer tareas paso a paso con pictogramas. Crea tus propias secuencias usando ARASAAC.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta_nombre' => 'juego.secuencias',
                'btn_clase'   => 'btn-verde',
                'orden'       => 40,
                'activa'      => true,
            ]
        );
    }
}
