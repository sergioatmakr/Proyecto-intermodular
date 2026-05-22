<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partida extends Model
{
    protected $table = 'partidas';

    protected $fillable = [
        'user_id',
        'actividad_id',
        'slug',
        'puntos',
        'duracion_seg',
        'datos',
    ];

    protected $casts = [
        'datos'        => 'array',
        'puntos'       => 'integer',
        'duracion_seg' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function actividad(): BelongsTo
    {
        return $this->belongsTo(Actividad::class);
    }

    /**
     * Duración formateada como mm:ss
     */
    public function getDuracionFormateadaAttribute(): string
    {
        if (!$this->duracion_seg) return '—';
        $m = floor($this->duracion_seg / 60);
        $s = $this->duracion_seg % 60;
        return sprintf('%02d:%02d', $m, $s);
    }
}
