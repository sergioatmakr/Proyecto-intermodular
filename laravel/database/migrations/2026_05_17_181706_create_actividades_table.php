<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla de actividades (juegos) disponibles en MentActiva.
     *
     * Cada juego se registra como una fila aquí mediante un seeder.
     * Eso evita que todos toquéis los mismos archivos
     * (home.blade.php, ActividadesController.php) y reduce los conflictos
     * de merge a casi cero.
     */
    public function up(): void
    {
        Schema::create('actividades', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique();                       // identificador único: 'colores', 'tres-raya'
            $table->string('icono', 10);                                // emoji
            $table->string('tag', 50);                                  // 'Visual', 'Lógica', 'Lenguaje'...
            $table->string('titulo', 100);
            $table->text('descripcion');
            $table->string('tiempo', 20)->default('~5 min');
            $table->string('nivel', 30)->default('Nivel básico');
            $table->string('ruta_nombre', 100);                         // nombre de la ruta Laravel: 'juego.colores'
            $table->string('btn_clase', 30)->default('btn-naranja');    // 'btn-naranja' o 'btn-verde'
            $table->unsignedInteger('orden')->default(0);               // para ordenarlas en la home
            $table->boolean('activa')->default(true);                   // permite ocultar sin borrar
            $table->timestamps();

            $table->index(['activa', 'orden']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actividades');
    }
};
