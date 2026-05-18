<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class SecuenciasController extends Controller
{
    public function index()
    {
        // Secuencias predefinidas. Cada paso lleva un id de ARASAAC (verificado
        // mediante https://api.arasaac.org/api/pictograms/es/search/...) y la
        // palabra que se mostrará bajo el pictograma.
        // La imagen se descarga directamente de:
        //   https://static.arasaac.org/pictograms/{id}/{id}_500.png
        $secuencias = [
            [
                'id'          => 'lavarse_manos',
                'nombre'      => 'Lavarse las manos',
                'icono'       => '🧼',
                'predefinida' => true,
                'pasos' => [
                    ['id_arasaac' => 36265, 'palabra' => 'Abrir el grifo'],
                    ['id_arasaac' => 6149,  'palabra' => 'Mojar las manos'],
                    ['id_arasaac' => 29034, 'palabra' => 'Echar jabón'],
                    ['id_arasaac' => 8251,  'palabra' => 'Frotar'],
                    ['id_arasaac' => 32464, 'palabra' => 'Aclarar con agua'],
                    ['id_arasaac' => 2566,  'palabra' => 'Secar'],
                ],
            ],
            [
                'id'          => 'cepillar_dientes',
                'nombre'      => 'Cepillarse los dientes',
                'icono'       => '🦷',
                'predefinida' => true,
                'pasos' => [
                    ['id_arasaac' => 2737, 'palabra' => 'Dientes'],
                    ['id_arasaac' => 5425, 'palabra' => 'Cepillar'],
                    ['id_arasaac' => 8560, 'palabra' => 'Enjuagar'],
                ],
            ],
            [
                'id'          => 'vestirse',
                'nombre'      => 'Vestirse',
                'icono'       => '👕',
                'predefinida' => true,
                'pasos' => [
                    ['id_arasaac' => 2522, 'palabra' => 'Pijama'],
                    ['id_arasaac' => 2309, 'palabra' => 'Camiseta'],
                    ['id_arasaac' => 2565, 'palabra' => 'Pantalón'],
                    ['id_arasaac' => 2298, 'palabra' => 'Calcetines'],
                    ['id_arasaac' => 2622, 'palabra' => 'Zapatos'],
                ],
            ],
            [
                'id'          => 'desayuno',
                'nombre'      => 'Empezar el día',
                'icono'       => '☀️',
                'predefinida' => true,
                'pasos' => [
                    ['id_arasaac' => 8988, 'palabra' => 'Despertar'],
                    ['id_arasaac' => 2370, 'palabra' => 'Ducharse'],
                    ['id_arasaac' => 2781, 'palabra' => 'Vestirse'],
                    ['id_arasaac' => 4626, 'palabra' => 'Desayunar'],
                ],
            ],
        ];

        // Configuración para la API de ARASAAC, expuesta al JS
        $arasaac = [
            'api_base'     => 'https://api.arasaac.org/api',
            'static_base'  => 'https://static.arasaac.org/pictograms',
            'locale'       => 'es',
            'resolucion'   => 500,
        ];

        return view('games.secuencias', compact('secuencias', 'arasaac'));
    }
}
