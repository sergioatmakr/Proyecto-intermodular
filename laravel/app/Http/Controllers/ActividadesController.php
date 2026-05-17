<?php

namespace App\Http\Controllers;

class ActividadesController extends Controller
{
    /**
     * Lista de actividades disponibles. Cada vez que se añade un juego nuevo,
     * añadir aquí su entrada respetando la estructura:
     *
     *   [
     *     'icono'       => '🎨',
     *     'tag'         => 'Categoría',
     *     'titulo'      => 'Nombre del juego',
     *     'descripcion' => 'Descripción corta...',
     *     'tiempo'      => '~5 min',
     *     'nivel'       => 'Nivel básico',
     *     'ruta'        => route('juego.slug'),
     *     'btn_clase'   => 'btn-naranja',   // o 'btn-verde'
     *   ]
     */
    public function index()
    {
        $actividades = [
            // Añade aquí la tarjeta de tu juego.
        ];

        return view('actividades', compact('actividades'));
    }
}
