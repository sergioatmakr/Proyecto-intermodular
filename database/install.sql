-- ============================================================
-- Dump de instalación para InfinityFree (MySQL/MariaDB)
-- ============================================================
--
-- Importa este archivo en phpMyAdmin de InfinityFree:
--   1. Panel > MySQL Databases > crear BD (anota nombre, user, password)
--   2. Panel > phpMyAdmin > seleccionar tu BD > pestaña "Import"
--   3. Choose File > seleccionar este install.sql > Go
--   4. Editar el .env del proyecto con las credenciales que te dio el panel
-- ============================================================

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ── Tabla `migrations`: histórico de migraciones aplicadas ─────────
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2026_05_17_181706_create_actividades_table', 1),
('2026_05_19_000001_create_partidas_table', 1),
('2026_05_21_000001_create_game_states_table', 1);

-- ── Tabla `users` (Laravel base) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Tabla `cache` y `cache_locks` ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `cache` (
  `key` VARCHAR(255) NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Tabla `jobs`, `job_batches`, `failed_jobs` ─────────────────────
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED DEFAULT NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT,
  `cancelled_at` INT DEFAULT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Tabla `actividades` (la nuestra: lista de juegos) ──────────────
CREATE TABLE IF NOT EXISTS `actividades` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(60) NOT NULL,
  `icono` VARCHAR(10) NOT NULL,
  `tag` VARCHAR(50) NOT NULL,
  `titulo` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `tiempo` VARCHAR(20) NOT NULL DEFAULT '~5 min',
  `nivel` VARCHAR(30) NOT NULL DEFAULT 'Nivel básico',
  `ruta_nombre` VARCHAR(100) NOT NULL,
  `btn_clase` VARCHAR(30) NOT NULL DEFAULT 'btn-naranja',
  `orden` INT UNSIGNED NOT NULL DEFAULT 0,
  `activa` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `actividades_slug_unique` (`slug`),
  KEY `actividades_activa_orden_index` (`activa`, `orden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Datos: los 7 juegos sembrados ──────────────────────────────────
INSERT INTO `actividades` (`slug`, `icono`, `tag`, `titulo`, `descripcion`, `tiempo`, `nivel`, `ruta_nombre`, `btn_clase`, `orden`, `activa`, `created_at`, `updated_at`) VALUES
('colores',     '🎨', 'Visual',         'Reconocimiento de Colores',   'Identifica colores, asocia nombres y entrena la percepción visual con ejercicios progresivos y divertidos.',                     '~5 min', 'Nivel básico', 'juego.colores',     'btn-naranja', 10, 1, NOW(), NOW()),
('matematicas', '🔢', 'Lógica',         'Operaciones Matemáticas',     'Resuelve sumas, restas y más. Ejercita el razonamiento numérico con retos adaptados a tu ritmo.',                                 '~5 min', 'Nivel básico', 'juego.matematicas', 'btn-verde',   20, 1, NOW(), NOW()),
('imagenes',    '🖼️', 'Visual',         'Reconocimiento de Imágenes',  'Lee la palabra y selecciona la imagen correcta. Personaliza los temas y añade tus propias imágenes.',                            '~5 min', 'Nivel básico', 'juego.imagenes',    'btn-naranja', 30, 1, NOW(), NOW()),
('secuencias',  '📋', 'Secuenciación',  'Secuencias de Tareas',        'Aprende a hacer tareas paso a paso con pictogramas. Crea tus propias secuencias usando ARASAAC.',                                '~5 min', 'Nivel básico', 'juego.secuencias',  'btn-verde',   40, 1, NOW(), NOW()),
('puzzle',      '🧩', 'Espacial',       'Puzzle',                      'Arma rompecabezas con tus propias fotos. Elige 6, 9 o 12 piezas según la dificultad.',                                            '~5 min', 'Adaptable',    'juego.puzzle',      'btn-naranja', 50, 1, NOW(), NOW()),
('tres-raya',   '🎯', 'Estrategia',     'Tres en Raya',                'Juega contra la máquina al clásico tres en raya. Ideal para una partida rápida.',                                                 '~2 min', 'Nivel básico', 'juego.tres-raya',   'btn-verde',   60, 1, NOW(), NOW()),
('sopa',        '🔤', 'Lenguaje',       'Sopa de Letras',              'Encuentra palabras escondidas entre las letras. Personaliza la lista con tus propias palabras.',                                  '~5 min', 'Adaptable',    'juego.sopa',        'btn-naranja', 70, 1, NOW(), NOW());

-- ── Tabla `partidas` (Nivel 2: registro de juegos por usuario) ─────
CREATE TABLE IF NOT EXISTS `partidas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(60) NOT NULL,
  `actividad_id` BIGINT UNSIGNED DEFAULT NULL,
  `puntos` INT NOT NULL DEFAULT 0,
  `duracion_seg` INT DEFAULT NULL,
  `datos` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `partidas_user_id_slug_index` (`user_id`, `slug`),
  KEY `partidas_slug_puntos_index` (`slug`, `puntos`),
  KEY `partidas_actividad_id_foreign` (`actividad_id`),
  CONSTRAINT `partidas_user_id_foreign` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `partidas_actividad_id_foreign` FOREIGN KEY (`actividad_id`)
    REFERENCES `actividades` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Tabla `game_states` (estado de cada juego por usuario) ─────────
-- Sustituye al localStorage: temas de imágenes, palabras de sopa,
-- secuencias custom, fotos del puzzle, marcador de tres en raya.
CREATE TABLE IF NOT EXISTS `game_states` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(60) NOT NULL,
  `datos` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_states_user_id_slug_unique` (`user_id`, `slug`),
  CONSTRAINT `game_states_user_id_foreign` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;

-- ============================================================
-- Listo. Ahora actualiza el .env del servidor con los datos de
-- conexión que te dio el panel de InfinityFree y la aplicación
-- funcionará.
-- ============================================================
