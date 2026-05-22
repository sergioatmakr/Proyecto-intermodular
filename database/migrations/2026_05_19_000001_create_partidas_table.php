<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla de partidas: registra cada juego completado por un usuario.
     * Permite mostrar historial, estadísticas y ranking.
     */
    public function up(): void
    {
        Schema::create('partidas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug', 60);                              // 'colores', 'sopa', 'matematicas'…
            $table->foreignId('actividad_id')->nullable()
                  ->constrained('actividades')->nullOnDelete();
            $table->integer('puntos')->default(0);
            $table->integer('duracion_seg')->nullable();
            $table->json('datos')->nullable();                        // extras opcionales (rondas, fallos…)
            $table->timestamps();

            $table->index(['user_id', 'slug']);
            $table->index(['slug', 'puntos']);                        // para ranking por juego
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partidas');
    }
};
