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
            [
                'icono'       => '🎯',
                'tag'         => 'Estrategia',
                'titulo'      => 'Tres en Raya',
                'descripcion' => 'Juega contra la máquina al clásico tres en raya. Ideal para una partida rápida.',
                'tiempo'      => '~2 min',
                'nivel'       => 'Nivel básico',
                'ruta'        => route('juego.tres-raya'),
                'btn_clase'   => 'btn-verde',
            ],
            [
                'icono'       => '🎨',
                'tag'         => 'Visual',
                'titulo'      => 'Reconocimiento de Colores',
                'descripcion' => 'Identifica colores, asocia nombres y entrena la percepción visual con ejercicios progresivos y divertidos.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta'        => route('juego.colores'),
                'btn_clase'   => 'btn-naranja',
            ],
            [
                'icono'       => '🔢',
                'tag'         => 'Lógica',
                'titulo'      => 'Operaciones Matemáticas',
                'descripcion' => 'Resuelve sumas, restas y más. Ejercita el razonamiento numérico con retos adaptados a tu ritmo.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta'        => route('juego.matematicas'),
                'btn_clase'   => 'btn-verde',
            ],
            [
                'icono'       => '🖼️',
                'tag'         => 'Visual',
                'titulo'      => 'Reconocimiento de Imágenes',
                'descripcion' => 'Lee la palabra y selecciona la imagen correcta. Personaliza los temas y añade tus propias imágenes.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Nivel básico',
                'ruta'        => route('juego.imagenes'),
                'btn_clase'   => 'btn-naranja',
            ],
            [
                'icono'       => '🧩',
                'tag'         => 'Espacial',
                'titulo'      => 'Puzzle',
                'descripcion' => 'Arma rompecabezas con tus propias fotos. Elige 6, 9 o 12 piezas según la dificultad.',
                'tiempo'      => '~5 min',
                'nivel'       => 'Adaptable',
                'ruta'        => route('juego.puzzle'),
                'btn_clase'   => 'btn-naranja',
            ],
        ];

        return view('actividades', compact('actividades'));
    }
}
