<?php

namespace App\Http\Controllers;

use App\Models\GameState;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EstadoController extends Controller
{
    // Slugs de juego permitidos (evita guardar basura)
    private const SLUGS = ['imagenes', 'sopa', 'secuencias', 'puzzle', 'tres-raya'];

    /**
     * Devuelve el estado guardado del juego para el usuario logueado.
     */
    public function show(string $slug): JsonResponse
    {
        abort_unless(in_array($slug, self::SLUGS, true), 404);

        $gs = GameState::where('user_id', Auth::id())
            ->where('slug', $slug)
            ->first();

        return response()->json(['datos' => $gs?->datos]);
    }

    /**
     * Guarda (crea o actualiza) el estado del juego para el usuario logueado.
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        abort_unless(in_array($slug, self::SLUGS, true), 404);

        $request->validate([
            'datos' => 'present',   // puede ser array u objeto JSON
        ]);

        GameState::updateOrCreate(
            ['user_id' => Auth::id(), 'slug' => $slug],
            ['datos' => $request->input('datos')]
        );

        return response()->json(['ok' => true]);
    }
}
