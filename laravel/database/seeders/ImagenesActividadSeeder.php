<?php

namespace Database\Seeders;

use App\Models\Actividad;
use Illuminate\Database\Seeder;

class ImagenesActividadSeeder extends Seeder
{
    public function run(): void
    {
        Actividad::updateOrCreate(
            ['slug' => 'imagenes'],
            [
                'icono'       => '🖼️',
                'tag'         => 'Visual',
                'titulo'      => 'Reconocimiento de Imágenes',
                'descripcion' => 'Lee la palabra y selecciona la imagen correcta. Personaliza los temas y añade tus propias imágenes.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta_nombre' => 'juego.imagenes',
                'btn_clase'   => 'btn-naranja',
                'orden'       => 30,
                'activa'      => true,
            ]
        );
    }
}
