<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class MatematicasActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'matematicas'],
            [
                'icono'       => '🔢',
                'tag'         => 'Lógica',
                'titulo'      => 'Operaciones Matemáticas',
                'descripcion' => 'Resuelve sumas, restas y más. Ejercita el razonamiento numérico con retos adaptados a tu ritmo.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta_nombre' => 'juego.matematicas',
                'btn_clase'   => 'btn-verde',
                'orden'       => 20,
                'activa'      => true,
            ]
        );
    }
}
