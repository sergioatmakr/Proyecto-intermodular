<?php

namespace App\Http\Controllers;

class ActividadesController extends Controller
{
    public function index()
    {
        $actividades = [
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
        ];

        return view('actividades', compact('actividades'));
    }
}
