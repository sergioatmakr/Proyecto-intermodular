<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Meta de puntos a alcanzar cada día (el 100% de la barra).
     * Cámbiala aquí si quieres que la meta diaria sea más alta o más baja.
     */
    private const META_DIARIA = 500;

    public function index()
    {
        // La home ya no lista las actividades (solo muestra la bienvenida y la
        // barra de progreso); las actividades viven ahora en /actividades.
        $logueado  = Auth::check();
        $puntosHoy = 0;

        if ($logueado) {
            // Suma de puntos de las partidas jugadas HOY por el usuario.
            // Lo envolvemos en try/catch para que, si la tabla `partidas`
            // tuviese algún problema, la home siga cargando (barra a 0)
            // en vez de mostrar un error 500.
            try {
                $puntosHoy = (int) Auth::user()->partidas()
                    ->whereDate('created_at', today())
                    ->sum('puntos');
            } catch (\Throwable $e) {
                $puntosHoy = 0;
            }
        }

        $meta       = self::META_DIARIA;
        $porcentaje = $meta > 0
            ? min(100, (int) round($puntosHoy / $meta * 100))
            : 0;

        return view('home', compact(
            'logueado',
            'puntosHoy',
            'meta',
            'porcentaje'
        ));
    }
}
