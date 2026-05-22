<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProgresoController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Últimas 20 partidas
        $partidas = $user->partidas()
            ->with('actividad')
            ->latest()
            ->take(20)
            ->get();

        // Estadísticas agregadas
        $stats = [
            'total_partidas' => $user->partidas()->count(),
            'puntos_totales' => $user->partidas()->sum('puntos'),
            'mejor_puntos'   => $user->partidas()->max('puntos') ?? 0,
        ];

        // Resumen por juego: nº partidas, puntos totales y mejor puntuación
        $porJuego = $user->partidas()
            ->select('slug',
                DB::raw('COUNT(*) as n_partidas'),
                DB::raw('SUM(puntos) as total_puntos'),
                DB::raw('MAX(puntos) as max_puntos')
            )
            ->groupBy('slug')
            ->get()
            ->map(function ($fila) {
                $actividad = Actividad::where('slug', $fila->slug)->first();
                $fila->titulo = $actividad?->titulo ?? ucfirst($fila->slug);
                $fila->icono  = $actividad?->icono  ?? '🎮';
                return $fila;
            });

        return view('progreso', compact('user', 'partidas', 'stats', 'porJuego'));
    }
}
