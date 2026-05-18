<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ── Detección automática de URL base ────────────────────────────────
        // Permite que el proyecto funcione desde cualquier ruta de WAMP/XAMPP
        // sin tener que ajustar APP_URL manualmente.
        // Solo aplica si estamos sirviendo una petición HTTP (no en consola).
        if ($this->app->runningInConsole()) {
            return;
        }

        $request = request();
        if (! $request->server('HTTP_HOST')) {
            return;
        }

        $base = $request->getSchemeAndHttpHost() . $request->getBaseUrl();

        // Quita /index.php si el rewrite no lo ocultó (caso sin mod_rewrite)
        $base = preg_replace('#/index\.php$#', '', $base);

        URL::forceRootUrl($base);
        config(['app.url' => $base]);
    }
}
