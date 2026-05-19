<?php

namespace App\Http\Controllers;

use App\Models\Actividad;

class ActividadesController extends Controller
{
    /**
     * Lista las actividades activas leídas de la BD.
     *
     * Cada juego se registra en la tabla `actividades` a través de un seeder
     * (ver ColoresActividadSeeder.php.example como plantilla).
     * Así nadie tiene que editar este controlador al añadir un juego nuevo.
     */
    public function index()
    {
        $actividades = Actividad::accesibles()->get();
        return view('actividades', compact('actividades'));
    }
}
