<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Support\Facades\Auth;

class ActividadesController extends Controller
{
    /**
     * Meta diaria de puntos (el 100% de la barra de progreso).
     * IMPORTANTE: debe coincidir con HomeController::META_DIARIA.
     */
    private const META_DIARIA = 500;

    /**
     * Lista las actividades activas leídas de la BD y calcula el progreso
     * diario del usuario (para mostrar la misma barra que en la home).
     *
     * Cada juego se registra en la tabla `actividades` a través de un seeder
     * (ver ColoresActividadSeeder.php.example como plantilla).
     * Así nadie tiene que editar este controlador al añadir un juego nuevo.
     */
    public function index()
    {
        $actividades = Actividad::accesibles()->get();

        $logueado  = Auth::check();
        $puntosHoy = 0;

        if ($logueado) {
            // Suma de puntos de las partidas jugadas HOY (try/catch para que la
            // página siga cargando aunque la tabla `partidas` diese problemas).
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

        return view('actividades', compact(
            'actividades',
            'logueado',
            'puntosHoy',
            'meta',
            'porcentaje'
        ));
    }
}
