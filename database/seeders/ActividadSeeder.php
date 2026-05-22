<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeder coordinador de actividades.
 *
 * Cuando añadas un juego nuevo:
 *   1. Crea un seeder específico: `php artisan make:seeder XxxActividadSeeder`
 *      (mira ColoresActividadSeeder.php como ejemplo)
 *   2. Registra ahí la fila de tu juego con `Actividad::updateOrCreate(...)`
 *   3. Añade tu seeder a la lista del array `$seeders` de abajo
 *   4. Ejecuta `php artisan db:seed`
 *
 * Así cada compañero modifica solo SU archivo y los conflictos en este
 * coordinador son mínimos (una línea por juego).
 */
class ActividadSeeder extends Seeder
{
    public function run(): void
    {
        $seeders = [
            ColoresActividadSeeder::class,
            MatematicasActividadSeeder::class,
            ImagenesActividadSeeder::class,
            SecuenciasActividadSeeder::class,
            PuzzleActividadSeeder::class,
            TresRayaActividadSeeder::class,
            SopaActividadSeeder::class,
        ];

        foreach ($seeders as $seeder) {
            $this->call($seeder);
        }
    }
}
