# MentActiva — Versión para InfinityFree

Esta carpeta contiene la versión del proyecto preparada para **subir a
InfinityFree** (o cualquier hosting compartido con PHP 8.2+ y MySQL).

> Diferencia con el repo de desarrollo: aquí está incluido `vendor/` y
> el dump SQL listo para importar.

## Despliegue paso a paso

### 1. Crear la base de datos en InfinityFree

1. Entra al **Control Panel** de InfinityFree
2. Busca **MySQL Databases**
3. Click **Create Database**:
   - Database name: `mentactiva` (te quedará `epiz_xxxxxxxx_mentactiva`)
4. **Anota los datos** que te muestra el panel:
   - **Host** (ejemplo: `sqlxxx.infinityfree.com`)
   - **Database name** (`epiz_xxxxxxxx_mentactiva`)
   - **Username** (`epiz_xxxxxxxx`)
   - **Password** (la que estableciste)

### 2. Importar el dump SQL

1. En el panel, click **phpMyAdmin** de la BD recién creada
2. Selecciona tu BD en la izquierda
3. Pestaña **Import** (arriba)
4. **Choose File** → sube `database/install.sql` de este proyecto
5. **Go** (abajo)

Se crean las 9 tablas y se insertan los 7 juegos. ✅

### 3. Subir los archivos del proyecto

Usa cualquier cliente FTP (FileZilla, WinSCP) o el **File Manager** del
panel de InfinityFree.

- Conecta con los datos FTP que te dio InfinityFree
- Sube **todo el contenido de esta carpeta** dentro de `htdocs/`
  (Es decir, tu `htdocs/app/`, `htdocs/vendor/`, `htdocs/public/`, etc.)

> ⚠️ La subida tarda 5-15 min porque `vendor/` pesa ~76 MB y son
> miles de archivos. Si FileZilla muestra "Stalled", reduce las
> conexiones simultáneas a 1 o 2.

### 4. Configurar el `.env` en el servidor

1. Renombra `htdocs/.env.example` a `htdocs/.env` (desde el File Manager)
2. Edita `htdocs/.env` y rellena los datos de la BD:

```env
APP_NAME=MentActiva
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://tu-subdominio.infinityfreeapp.com

DB_CONNECTION=mysql
DB_HOST=sqlxxx.infinityfree.com           ← el que te dio el panel
DB_PORT=3306
DB_DATABASE=epiz_xxxxxxxx_mentactiva      ← el nombre completo
DB_USERNAME=epiz_xxxxxxxx
DB_PASSWORD=tu_password_real
```

### 5. Generar APP_KEY

InfinityFree no tiene terminal SSH. Tienes dos opciones:

**Opción A — desde tu PC local**: ejecuta
```bash
php artisan key:generate --show
```
Copia el resultado (`base64:xxxxx...`) y pégalo en `APP_KEY=` del `.env`.

**Opción B — endpoint temporal**: visita una vez
`https://tu-subdominio.infinityfreeapp.com/?generate-key=1` (requiere
añadir esa ruta primero al `routes/web.php`).

> 💡 Es más sencillo la Opción A. Solo tienes que hacerlo una vez.

### 6. Permisos de carpetas (importante)

Desde el File Manager, click derecho en estas carpetas y asegúrate de
que tienen permisos **755** o **775**:

- `htdocs/storage/` (y todas sus subcarpetas)
- `htdocs/bootstrap/cache/`

Si no, Laravel no puede escribir logs ni cache y dará error 500.

### 7. Probar

Abre **https://tu-subdominio.infinityfreeapp.com/public/**

Deberías ver MentActiva con los 7 juegos. Si funciona, ¡listo! 🎉

## URL: ¿con `/public/` o sin?

InfinityFree no permite cambiar el **document root**. Por defecto:

- URL del proyecto: `tudominio.infinityfreeapp.com/public/`

Esto funciona pero queda feo. Hay dos formas de quitarlo:

### Opción A — `.htaccess` redirect (la simple, ya incluida)

El `.htaccess` de la raíz que viene con este proyecto redirige
automáticamente de `tudominio.com/` a `tudominio.com/public/`.

Sigue mostrando `/public/` en la URL pero al menos el usuario solo
escribe la raíz. ✅ Esto **ya funciona** sin tocar nada.

### Opción B — Mover `index.php` a la raíz (URL totalmente limpia)

Es más laborioso pero deja la URL como `tudominio.com/actividades`:

1. Copia `htdocs/public/index.php` a `htdocs/index.php`
2. Copia `htdocs/public/.htaccess` a `htdocs/.htaccess` (sobrescribe el actual)
3. Edita `htdocs/index.php` y cambia:
   ```php
   require __DIR__.'/../vendor/autoload.php';
   ```
   por:
   ```php
   require __DIR__.'/vendor/autoload.php';
   ```
   Y cambia también la línea de `bootstrap/app.php`:
   ```php
   $app = require_once __DIR__.'/../bootstrap/app.php';
   ```
   por:
   ```php
   $app = require_once __DIR__.'/bootstrap/app.php';
   ```
4. Mueve los assets de `htdocs/public/css/` a `htdocs/css/` (igual con `js/`)

Es opcional. Solo hazlo si te molesta el `/public/` en la URL.

## Resolución de problemas

### Error 500 al abrir la web
- Comprueba que `APP_KEY` está rellenada en `.env`
- Comprueba permisos de `storage/` (755)
- Activa temporalmente `APP_DEBUG=true` para ver el error específico
- Mira `storage/logs/laravel.log` (puedes verlo desde el File Manager)

### Error de conexión BD ("could not find driver")
- Asegúrate de que `DB_CONNECTION=mysql` (no `sqlite`)
- Comprueba que los datos del `.env` son correctos
- Verifica en el panel que la BD existe

### "Site can't be reached"
- El subdominio de InfinityFree tarda unos minutos en propagarse tras crearse
- Asegúrate de que estás usando `https://` (no `http://`)

### Las tarjetas de los juegos no aparecen
- Comprueba que importaste `install.sql` en phpMyAdmin
- En phpMyAdmin, ejecuta `SELECT * FROM actividades;` — debe haber 7 filas

## Actualizar el proyecto en producción

Cuando hagas cambios en el código en tu PC:

1. Comprueba que funcionan localmente
2. Sube por FTP **solo los archivos cambiados** (no todo `vendor/`)
3. Si modificas algo de PHP o vistas, borra el contenido de:
   - `storage/framework/views/`
   - `storage/framework/cache/`
   - `bootstrap/cache/*.php` (deja el `.gitignore`)
4. Si cambias la estructura de la BD (nueva migración), exporta el nuevo SQL
   y reimpórtalo en phpMyAdmin

## Estructura

```
htdocs/                          ← la raíz tras subir todo
├── .env                          ← creas en el servidor con datos MySQL
├── .htaccess                     ← redirige a /public/
├── app/                          ← código de la aplicación
├── bootstrap/
├── config/
├── database/
│   └── install.sql               ← dump para phpMyAdmin (solo se usa una vez)
├── public/                       ← punto de entrada Laravel
│   ├── index.php
│   ├── .htaccess
│   ├── css/, js/                 ← tus assets
├── resources/views/              ← Blade
├── routes/
├── storage/                      ← logs, cache (debe ser escribible)
└── vendor/                       ← dependencias (~76 MB)
```

## Diferencias con la versión de desarrollo

| | Desarrollo (en tu PC) | Producción (InfinityFree) |
|---|---|---|
| BD | SQLite (archivo local) | MySQL (servicio del hosting) |
| `.env` | `APP_DEBUG=true` | `APP_DEBUG=false` |
| `vendor/` | NO en git (composer install) | SÍ subido por FTP |
| Cache | Limpia manualmente | Limpia tras cada deploy |
| Errores | Página amigable de Laravel | Página genérica + logs |

---

**¿Problemas?** Comprueba en este orden:
1. `storage/logs/laravel.log`
2. `APP_DEBUG=true` temporalmente para ver el error
3. Datos del `.env` (host, user, password)
4. Permisos de `storage/`
