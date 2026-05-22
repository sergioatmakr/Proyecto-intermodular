<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed principal: se ejecuta con `php artisan db:seed`.
     *
     * Llama a los seeders específicos. ActividadSeeder a su vez
     * llama a un seeder por cada juego registrado.
     */
    public function run(): void
    {
        $this->call([
            ActividadSeeder::class,
        ]);
    }
}
