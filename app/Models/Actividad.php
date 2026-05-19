<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Route;

/**
 * Una actividad (juego) registrada en MentActiva.
 *
 * Cada juego se registra como una fila en la tabla `actividades`
 * mediante un seeder específico (ej: ColoresActividadSeeder).
 *
 * @property int    $id
 * @property string $slug          Identificador único ('colores', 'tres-raya'...)
 * @property string $icono         Emoji
 * @property string $tag           Categoría ('Visual', 'Lógica'...)
 * @property string $titulo        Nombre visible
 * @property string $descripcion
 * @property string $tiempo        '~5 min'
 * @property string $nivel         'Nivel básico'
 * @property string $ruta_nombre   Nombre de la ruta Laravel ('juego.colores')
 * @property string $btn_clase     'btn-naranja' o 'btn-verde'
 * @property int    $orden
 * @property bool   $activa
 */
class Actividad extends Model
{
    protected $table = 'actividades';

    protected $fillable = [
        'slug', 'icono', 'tag', 'titulo', 'descripcion',
        'tiempo', 'nivel', 'ruta_nombre', 'btn_clase',
        'orden', 'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
        'orden'  => 'integer',
    ];

    /**
     * URL absoluta del juego, generada a partir del nombre de la ruta.
     * Devuelve '#' si la ruta no está registrada todavía (juego en desarrollo).
     *
     * Uso en Blade: {{ $actividad->url }}
     */
    public function getUrlAttribute(): string
    {
        if (! Route::has($this->ruta_nombre)) {
            return '#';
        }
        return route($this->ruta_nombre);
    }

    /**
     * ¿La ruta del juego está registrada y por tanto la actividad es jugable?
     */
    public function getDisponibleAttribute(): bool
    {
        return Route::has($this->ruta_nombre);
    }

    /**
     * Scope: actividades activas y con ruta registrada, ordenadas.
     *
     * Uso: Actividad::accesibles()->get()
     */
    public function scopeAccesibles($query)
    {
        return $query->where('activa', true)->orderBy('orden')->orderBy('id');
    }
}
