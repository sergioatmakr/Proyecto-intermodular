<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Partida;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PartidaController extends Controller
{
    /**
     * Guarda una partida finalizada del usuario logueado.
     * Lo llaman los juegos al terminar (con fetch desde JS).
     */
    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'slug'         => 'required|string|max:60',
            'puntos'       => 'required|integer|min:0|max:9999',
            'duracion_seg' => 'nullable|integer|min:0|max:7200',
            'datos'        => 'nullable|array',
        ]);

        $actividad = Actividad::where('slug', $datos['slug'])->first();

        $partida = Partida::create([
            'user_id'      => Auth::id(),
            'actividad_id' => $actividad?->id,
            'slug'         => $datos['slug'],
            'puntos'       => $datos['puntos'],
            'duracion_seg' => $datos['duracion_seg'] ?? null,
            'datos'        => $datos['datos'] ?? null,
        ]);

        return response()->json([
            'ok'      => true,
            'partida' => [
                'id'     => $partida->id,
                'puntos' => $partida->puntos,
                'fecha'  => $partida->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }
}
