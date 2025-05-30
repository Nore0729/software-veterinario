-- Crear base de datos
CREATE DATABASE IF NOT EXISTS veterinaria;
USE veterinaria;

-- Tabla de propietarios (ya existente, mejorada)
CREATE TABLE IF NOT EXISTS propietarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipoDocumento VARCHAR(10) NOT NULL,
  documento VARCHAR(15) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  fechaNacimiento DATE,
  telefono VARCHAR(15),
  email VARCHAR(100) NOT NULL UNIQUE,
  direccion VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mascotas (ya existente, mejorada)
CREATE TABLE IF NOT EXISTS mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  documento VARCHAR(15) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50),
  raza VARCHAR(50),
  genero VARCHAR(10),
  color VARCHAR(30),
  fechaNacimiento DATE,
  peso DECIMAL(5,2),
  tamano VARCHAR(20),
  estadoReproductivo VARCHAR(30),
  vacunado BOOLEAN DEFAULT FALSE,
  observaciones TEXT,
  fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (documento) REFERENCES propietarios(documento)
);

-- Nueva tabla para citas
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  propietario_id INT NOT NULL,
  mascota_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo TEXT NOT NULL,
  estado ENUM('programada', 'completada', 'cancelada') DEFAULT 'programada',
  observaciones TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (propietario_id) REFERENCES propietarios(id),
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

-- Nueva tabla para consultas médicas
CREATE TABLE IF NOT EXISTS consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  propietario_id INT NOT NULL,
  mascota_id INT NOT NULL,
  fecha DATETIME NOT NULL,
  diagnostico TEXT NOT NULL,
  tratamiento TEXT,
  observaciones TEXT,
  peso_actual DECIMAL(5,2),
  temperatura DECIMAL(4,1),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propietario_id) REFERENCES propietarios(id),
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);

-- Tabla para usuarios del sistema (veterinarios, administradores)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipoDoc VARCHAR(10) NOT NULL,
  numDoc VARCHAR(15) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  rol ENUM('veterinario', 'administrador', 'asistente') DEFAULT 'veterinario',
  activo BOOLEAN DEFAULT TRUE,
  fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO propietarios (tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password) VALUES
('C.C', '12345678', 'Juan Pérez', '1985-03-15', '3001234567', 'juan.perez@email.com', 'Calle 123 #45-67', '$2b$10$example'),
('C.C', '87654321', 'María García', '1990-07-22', '3009876543', 'maria.garcia@email.com', 'Carrera 89 #12-34', '$2b$10$example'),
('C.C', '11223344', 'Carlos Ramírez', '1982-11-05', '3209876543', 'carlos.ramirez@email.com', 'Carrera 10 #20-30', '$2b$10$example');

INSERT INTO mascotas (documento, nombre, especie, raza, genero, color, fechaNacimiento, peso, tamano, estadoReproductivo, vacunado, observaciones) VALUES
('12345678', 'Max', 'Perro', 'Golden Retriever', 'Macho', 'Dorado', '2020-05-10', 25.5, 'Grande', 'Entero', TRUE, 'Muy activo y juguetón'),
('12345678', 'Luna', 'Gato', 'Siamés', 'Hembra', 'Crema', '2021-02-14', 4.2, 'Mediano', 'Esterilizada', TRUE, 'Tranquila y cariñosa'),
('87654321', 'Rocky', 'Perro', 'Bulldog', 'Macho', 'Blanco', '2019-08-30', 18.0, 'Mediano', 'Castrado', TRUE, 'Problemas respiratorios leves'),
('11223344', 'Lazi', 'Perro', 'Pincher', 'Hembra', 'Blanca', '2022-01-15', 4.0, 'Pequeño', 'Castrada', TRUE, 'Muy energética');

INSERT INTO usuarios (tipoDoc, numDoc, nombre, apellido, email, telefono, password, rol) VALUES
('C.C', '98765432', 'Dr. Ana', 'Veterinaria', 'ana.vet@petlovers.com', '3001112233', '$2b$10$example', 'veterinario'),
('C.C', '11111111', 'Admin', 'Sistema', 'admin@petlovers.com', '3004445566', '$2b$10$example', 'administrador');

-- Insertar algunas citas de ejemplo
INSERT INTO citas (propietario_id, mascota_id, fecha, hora, motivo, estado) VALUES
(1, 1, '2024-01-15', '09:00:00', 'Consulta de rutina y vacunación', 'programada'),
(1, 2, '2024-01-15', '10:30:00', 'Control post-esterilización', 'programada'),
(2, 3, '2024-01-16', '14:00:00', 'Revisión problemas respiratorios', 'programada');

-- Insertar algunas consultas de ejemplo
INSERT INTO consultas (propietario_id, mascota_id, fecha, diagnostico, tratamiento, observaciones, peso_actual) VALUES
(1, 1, '2024-01-10 09:30:00', 'Estado de salud excelente', 'Continuar con dieta actual y ejercicio regular', 'Mascota muy activa, sin problemas detectados', 25.5),
(2, 3, '2024-01-08 15:00:00', 'Dificultad respiratoria leve', 'Medicamento broncodilatador, evitar ejercicio intenso', 'Mejoría notable desde última consulta', 18.2);
