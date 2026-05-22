# MentActiva

**MentActiva** es una aplicación web de **estimulación cognitiva** pensada para
personas mayores o con algún grado de dependencia. Reúne siete juegos sencillos y
accesibles que ayudan a mantener activas la memoria, la atención, el razonamiento y
la coordinación, registrando además el progreso diario de cada usuario.

## Equipo

| Desarrollador | Responsabilidades principales |
|---|---|
| **Hugo Pérez** | Estructura base de la web, sopa de letras y tres en raya |
| **Sergio Canseco** | Login/registro, guardado de partidas, matemáticas e imágenes |
| **Fernando Gómez** | Estado de los juegos en BD, página de progreso, colores, secuencias y puzzle |

## Características

- Siete juegos de estimulación cognitiva, cada uno con su propia mecánica.
- Interfaz accesible: botones y textos grandes, diseño limpio y **responsive**
  (móvil, tablet y escritorio).
- Registro e inicio de sesión de usuarios.
- Barra de **progreso diario** con una meta de 500 puntos: empieza vacía y se va
  llenando según las partidas jugadas en el día.
- Las puntuaciones se guardan en base de datos por usuario y se validan en el
  servidor (no se pueden falsear desde el navegador).
- El catálogo de juegos se gestiona desde la base de datos: añadir un juego nuevo
  no obliga a tocar el código de las vistas.

## Los juegos

| Juego | Descripción |
|---|---|
| **Colores** | Se muestra el nombre de un color y varias opciones; hay que pulsar el color correcto. |
| **Matemáticas** | Operaciones de cálculo mental con distintos niveles de dificultad. |
| **Imágenes** | Una palabra y cuatro imágenes: hay que elegir la que corresponde. Permite crear temas y subir imágenes propias arrastrándolas, con previsualización. |
| **Puzzle** | Una imagen se divide en 6, 9 o 12 piezas desordenadas que hay que recomponer. |
| **Secuencias** | Muestra los pasos de una tarea mediante pictogramas, usando la API pública de ARASAAC. |
| **Tres en raya** | Partida contra una IA de jugadas aleatorias, pensada para que el usuario pueda ganar. |
| **Sopa de letras** | Cuadrícula 7×7 con palabras configurables; las palabras se leen en 4 direcciones (horizontal, vertical y dos diagonales, siempre hacia delante). |

## Tecnologías

- **Backend:** Laravel 13 (PHP 8.3+), Eloquent ORM y plantillas Blade.
- **Frontend:** HTML5, CSS3 propio (sin frameworks, con variables CSS y diseño
  responsive) y JavaScript puro (un módulo independiente por juego).
- **Base de datos:** MySQL / MariaDB en producción; SQLite opcional en local.
- **API externa:** [ARASAAC](https://arasaac.org) para los pictogramas del juego de
  secuencias.
- **Autenticación:** sesiones de Laravel con contraseñas cifradas (bcrypt).

## Requisitos

- PHP 8.3 o superior
- Composer
- MySQL 5.7+ / MariaDB (o SQLite para pruebas rápidas en local)
- (Opcional) Node.js, solo si se quieren recompilar los assets con Vite

## Instalación en local (WAMP / XAMPP)

1. Clona el repositorio y entra en la carpeta de la aplicación:
   ```bash
   git clone https://github.com/sergioatmakr/Proyecto-intermodular.git
   cd Proyecto-intermodular/laravel
   ```

2. Instala las dependencias de PHP:
   ```bash
   composer install
   ```

3. Crea el archivo de entorno y la clave de la aplicación
   (en Windows, usa `copy` en lugar de `cp`):
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Configura la base de datos en `.env`:

   **Opción A — MySQL:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mentactiva
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   **Opción B — SQLite (más rápido para probar):**
   ```env
   DB_CONNECTION=sqlite
   ```
   y crea el archivo vacío `database/database.sqlite`.

5. Crea las tablas y los datos iniciales (elige una opción):
   - **Con migraciones y seeders** (recomendado en local):
     ```bash
     php artisan migrate --seed
     ```
   - **Importando el SQL** (útil en hosting sin consola): importa
     `database/install.sql` desde phpMyAdmin.

6. Arranca el servidor:
   ```bash
   php artisan serve
   ```
   y abre `http://localhost:8000`.

   > Si usas WAMP directamente, el `.htaccess` de la raíz redirige a `/public`,
   > así que también funciona desde `http://localhost/Proyecto-intermodular/laravel/`.

> Atajo: `composer setup` ejecuta de una vez la instalación de dependencias, la
> copia del `.env`, la generación de la clave y las migraciones.

## Base de datos

| Tabla | Para qué sirve |
|---|---|
| `actividades` | Catálogo de juegos (icono, título, descripción, URL, nivel…). |
| `users` | Usuarios registrados. |
| `partidas` | Una fila por partida terminada: usuario, juego (`slug`), puntos, duración y datos extra en JSON. |
| `game_states` | Estado configurable de cada juego por usuario (temas, palabras, secuencias…) en JSON. |

El resto de tablas (`cache`, `jobs`, `sessions`…) son las estándar de Laravel.

## Cómo se guarda la puntuación

Cada vista de juego incluye un *partial* que define
`window.MentActiva.guardarPartida(datos)`. Al terminar una partida, el JavaScript
del juego lo llama:

```javascript
window.MentActiva.guardarPartida({
  puntos: 80,
  duracion_seg: 45,
  datos: { rondas: 8 },
});
```

La función envía un `fetch` a `POST /api/partida` (con token CSRF). Esa ruta usa el
middleware `auth`, de modo que:

- Si el usuario **ha iniciado sesión**, `PartidaController` valida los datos y crea
  la fila en `partidas`.
- Si **no** ha iniciado sesión, la función no hace nada y el juego sigue
  funcionando con normalidad.

La barra de "Progreso de hoy" suma los puntos de las partidas del día y los compara
con la meta diaria (500 puntos).

## Estructura del proyecto

```
laravel/
├── app/
│   ├── Http/Controllers/        # Home, Actividades, Auth, Partida, Estado, Progreso
│   │   └── Games/               # Un controlador por juego
│   └── Models/                  # Actividad, User, Partida, GameState
├── database/
│   ├── migrations/              # Esquema de las tablas
│   ├── seeders/                 # Datos iniciales (una actividad por juego)
│   └── install.sql              # Volcado SQL para importar en el hosting
├── public/
│   ├── css/                     # Estilos (uno por juego + estilos.css comunes)
│   ├── js/                      # Lógica de cada juego (JavaScript puro)
│   └── index.php                # Front controller de Laravel
├── resources/views/
│   ├── games/                   # Vistas de los 7 juegos + partials
│   ├── auth/                    # Login y registro
│   ├── layouts/app.blade.php    # Plantilla común
│   ├── home.blade.php           # Inicio (bienvenida + progreso)
│   ├── actividades.blade.php    # Listado de juegos + progreso
│   └── progreso.blade.php       # Estadísticas del usuario
└── routes/web.php               # Todas las rutas
```

## Despliegue en InfinityFree

1. Crea una base de datos MySQL en el panel y anota host, nombre, usuario y contraseña.
2. En phpMyAdmin, importa `database/install.sql`.
3. Sube el contenido del proyecto a `htdocs/` (por FTP o File Manager).
4. Renombra `.env.example` a `.env` y rellena las credenciales de MySQL.
5. Genera la clave en local con `php artisan key:generate --show` y pégala en `APP_KEY`.
6. Pon `APP_DEBUG=false` y `APP_ENV=production`.
7. Comprueba que la base de datos usa el juego de caracteres `utf8mb4`, para que se
   vean bien los emojis de los iconos de los juegos.

## Créditos

- Pictogramas: [ARASAAC](https://arasaac.org) — Gobierno de Aragón (autor: Sergio
  Palao). Licencia CC BY-NC-SA.
- Tipografías: Nunito y Baloo 2 (Google Fonts).

## Licencia

Proyecto académico desarrollado con fines educativos.
