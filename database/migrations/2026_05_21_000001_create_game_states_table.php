<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Estado de cada juego por usuario (lo que antes vivía en localStorage):
     * temas de imágenes, palabras de sopa, secuencias custom, fotos del
     * puzzle, marcador de tres en raya, etc.
     *
     * Se guarda como JSON: un blob por (usuario, juego).
     */
    public function up(): void
    {
        Schema::create('game_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug', 60);          // 'imagenes', 'sopa', 'secuencias', 'puzzle', 'tres-raya'
            $table->json('datos')->nullable();
            $table->timestamps();

            // Un único registro por usuario y juego
            $table->unique(['user_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_states');
    }
};
