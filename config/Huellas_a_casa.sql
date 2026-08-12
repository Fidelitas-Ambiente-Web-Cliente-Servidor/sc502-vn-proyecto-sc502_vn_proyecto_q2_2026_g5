CREATE DATABASE huellas_a_casa;

USE huellas_a_casa;


-- =========================================
-- TABLA: ORGANIZACIONES
-- =========================================

CREATE TABLE organizaciones (
    id_organizacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo ENUM('Fundacion', 'Rescatista', 'Refugio') NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    direccion VARCHAR(200),
    canton VARCHAR(100),
    verificada BOOLEAN DEFAULT FALSE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- TABLA: USUARIOS
-- =========================================

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_organizacion INT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM(
        'Ciudadano',
        'Rescatista',
        'Organizacion',
        'Admin'
    ) DEFAULT 'Ciudadano',
    canton VARCHAR(100),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_usuario_organizacion
        FOREIGN KEY (id_organizacion)
        REFERENCES organizaciones(id_organizacion)
);


-- =========================================
-- TABLA: MASCOTAS
-- =========================================

CREATE TABLE mascotas (
    id_mascota INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    especie ENUM('Perro', 'Gato', 'Otro') NOT NULL,
    raza VARCHAR(100),
    sexo ENUM('Macho', 'Hembra'),
    edad_aproximada VARCHAR(50),
    tamano ENUM('Pequeño', 'Mediano', 'Grande'),
    estado_salud VARCHAR(150),
    vacunas VARCHAR(255),
    descripcion TEXT,
    foto VARCHAR(255),
    estado ENUM(
        'Disponible',
        'Adoptado',
        'No disponible'
    ) DEFAULT 'Disponible',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mascota_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);


-- =========================================
-- TABLA: CONTENIDO EDUCATIVO
-- =========================================

CREATE TABLE contenido_educativo (
    id_contenido INT AUTO_INCREMENT PRIMARY KEY,
    id_organizacion INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    url_imagen VARCHAR(255),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_contenido_organizacion
        FOREIGN KEY (id_organizacion)
        REFERENCES organizaciones(id_organizacion)
);


-- =========================================
-- TABLA: SOLICITUDES DE ADOPCIÓN
-- =========================================

CREATE TABLE solicitudes_adopcion (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(
        'Pendiente',
        'En revisión',
        'Aprobada',
        'Rechazada',
        'Completada',
        'Cancelada'
    ) DEFAULT 'Pendiente',

    observaciones TEXT,

    CONSTRAINT fk_solicitud_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota),

    CONSTRAINT fk_solicitud_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);


-- =========================================
-- TABLA: REPORTES
-- =========================================

CREATE TABLE reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,

    tipo ENUM(
        'Perdida',
        'Encontrada'
    ) NOT NULL,

    descripcion TEXT,

    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),

    lugar_referencia VARCHAR(200),
    foto VARCHAR(255),

    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(
        'Activo',
        'Resuelto',
        'Cancelado'
    ) DEFAULT 'Activo',

    CONSTRAINT fk_reporte_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);


-- =========================================
-- TABLA: NOTIFICACIONES
-- =========================================

CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reporte INT NULL,

    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,

    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,

    leida BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_notificacion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_notificacion_reporte
        FOREIGN KEY (id_reporte)
        REFERENCES reportes(id_reporte)
);

-- =========================================
-- Usuarios de prueba
-- =========================================

INSERT INTO usuarios (
    nombre,
    apellido,
    correo,
    contraseña,
    telefono,
    rol,
    canton,
    estado
)
VALUES (
    'Usuario',
    'Prueba',
    'prueba@huellasacasa.com',
    '123456',
    '88888888',
    'Ciudadano',
    'San Jose',
    1
);