# MentActiva

Aplicación de estimulación cognitiva en Laravel 11 + PHP 8.3.

## Requisitos

- PHP **8.2 o superior** (8.3 recomendado)
- Composer 2.x
- WAMP, XAMPP, MAMP o similar (opcional, se puede usar `php artisan serve`)

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario>/Proyecto-intermodular.git
cd Proyecto-intermodular/laravel

# 2. Instalar dependencias PHP (descarga el motor de Laravel y librerías)
composer install

# 3. Crear el archivo de entorno a partir de la plantilla
cp .env.example .env          # en Linux/Mac
copy .env.example .env        # en Windows CMD

# 4. Generar la clave de la aplicación
php artisan key:generate

# 5. Crear la base de datos SQLite vacía y aplicar migraciones
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate

# 6. Arrancar el servidor
php artisan serve
```

Abre **http://127.0.0.1:8000** en el navegador.

> Si tu PHP por defecto es < 8.2, en Windows con WAMP puedes lanzar artisan con
> la ruta completa:
> `C:\wamp64\bin\php\php8.3.14\php.exe artisan serve`

## Estructura del proyecto

```
laravel/
├── app/Http/Controllers/
│   ├── HomeController.php           ← Inicio (/)
│   ├── ActividadesController.php    ← Listado de juegos (/actividades)
│   ├── ProgresoController.php       ← Progreso (/progreso)
│   └── Games/                       ← AQUÍ van tus controladores de juego
│
├── resources/views/
│   ├── layouts/app.blade.php        ← Layout maestro (header, footer, nav)
│   ├── home.blade.php
│   ├── actividades.blade.php
│   ├── progreso.blade.php
│   └── games/                       ← AQUÍ van tus vistas Blade de juego
│
├── public/
│   ├── index.php                    ← Punto de entrada Laravel (NO TOCAR)
│   ├── css/
│   │   └── estilos.css              ← Estilos globales (header, cards, hero)
│   └── js/
│       └── eventos.js               ← JS de la barra de progreso
│
└── routes/
    └── web.php                      ← Definición de rutas
```

## Cómo añadir un juego nuevo

Cada juego tiene **4 archivos exclusivos** + tocas **3 archivos compartidos**.

### 1. Crear los 4 archivos exclusivos (no chocan con otros)

| Archivo | Plantilla |
|---|---|
| `app/Http/Controllers/Games/MiJuegoController.php` | Devuelve la vista con los datos iniciales |
| `resources/views/games/mi-juego.blade.php` | HTML de la vista, extiende `layouts.app` |
| `public/css/mi-juego.css` | Estilos del juego, **prefija todas las clases** (ej. `mj-`) |
| `public/js/mi-juego.js` | Lógica del juego, **prefija variables/funciones** (ej. `mj`) |

### 2. Registrar la ruta en `routes/web.php`

```php
use App\Http\Controllers\Games\MiJuegoController;

Route::get('/juego/mi-juego', [MiJuegoController::class, 'index'])
     ->name('juego.mi-juego');
```

### 3. Añadir la tarjeta en `home.blade.php`

```blade
<div class="card">
  <div class="card-icon">🎯</div>
  <span class="card-tag">Categoría</span>
  <h2>Mi Juego</h2>
  <p>Descripción corta del juego.</p>
  <div class="card-meta">
    <span>⏱ ~5 min</span>
    <span>⭐ Nivel básico</span>
  </div>
  <a href="{{ route('juego.mi-juego') }}" class="btn btn-naranja">Empezar <span>→</span></a>
</div>
```

### 4. Añadir la entrada en `ActividadesController.php`

```php
[
    'icono'       => '🎯',
    'tag'         => 'Categoría',
    'titulo'      => 'Mi Juego',
    'descripcion' => 'Descripción del juego.',
    'tiempo'      => '~5 min',
    'nivel'       => 'Nivel básico',
    'ruta'        => route('juego.mi-juego'),
    'btn_clase'   => 'btn-naranja',
],
```

## Convenciones

- **CSS**: cada juego usa un prefijo único (ej. `cg-`, `mg-`, `ig-`, `pz-`). Esto evita choques entre estilos.
- **JS**: el código va dentro de una IIFE `(function () { 'use strict'; ... })()` con variables prefijadas, para no contaminar el scope global.
- **Datos PHP → JS**: se pasan vía `window.XX_CONFIG = @json($datos);` en la vista, antes del `<script>` que carga el JS.

## Flujo de trabajo con Git

1. Crear rama por juego: `git checkout -b feature/juego-mi-juego`
2. Desarrollar y commit: `git commit -m "feat(mi-juego): controlador, vista, css, js"`
3. Subir: `git push -u origin feature/juego-mi-juego`
4. Abrir Pull Request hacia `main` en GitHub
5. Resolver conflictos en `routes/web.php`, `home.blade.php` y `ActividadesController.php` si los hay (aceptar ambos bloques)
6. Mergear

## Convención de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(juego): añade nuevo juego de X`
- `fix(juego): corrige bug Y`
- `docs: actualiza README`
- `refactor(juego): extrae función Z`
- `style(juego): ajusta espaciado de tarjetas`

## Tecnologías

- **Backend**: Laravel 11, PHP 8.3
- **Frontend**: Blade + HTML/CSS/JS vanilla (sin frameworks JS)
- **Persistencia local**: `localStorage` para datos de usuario
- **APIs externas**: [ARASAAC](https://arasaac.org) para pictogramas (en algunos juegos)

## Licencia

Proyecto académico — Proyecto Intermodular.
