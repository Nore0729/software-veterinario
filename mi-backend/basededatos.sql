-- Active: 1748032356831@@localhost@3306@veterinaria
drop database IF EXISTS veterinaria;
CREATE DATABASE  veterinaria;
USE veterinaria;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_Doc VARCHAR(10) NOT NULL,
    doc VARCHAR(15) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    fecha_Nac DATE,
    tel VARCHAR(15),
    email VARCHAR(100) NOT NULL UNIQUE,
    direccion VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    fecha_Regis TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 select*from usuarios; 
 SELECT COUNT(*) AS total_usuarios FROM usuarios;


CREATE TABLE propietarios (
    id_prop INT PRIMARY KEY,
    FOREIGN KEY (id_prop) REFERENCES usuarios(id) ON DELETE CASCADE
);

SELECT 
    u.id,
    u.tipo_Doc,
    u.doc,
    u.nombre,
    u.fecha_Nac,
    u.tel,
    u.email,
    u.direccion,
    u.fecha_Regis
FROM propietarios p
INNER JOIN usuarios u ON p.id_prop = u.id;

select * from propietarios; 


CREATE TABLE veterinarios (
    vet_id INT PRIMARY KEY,
    especialidad VARCHAR(50) NOT NULL,
    FOREIGN KEY (vet_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


CREATE TABLE administradores (
    admin_id INT PRIMARY KEY,
    nivel_acceso ENUM('basico', 'medio', 'alto') DEFAULT 'medio',
    FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE asignacion_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usu_id INT NOT NULL,
    rol_id INT NOT NULL,
    asignado_por INT COMMENT 'ID del admin que asignó el rol',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usu_id) REFERENCES usuarios(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (asignado_por) REFERENCES usuarios(id),
    UNIQUE (usu_id, rol_id)
);



CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doc_pro VARCHAR(15) NOT NULL, 
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50) NOT NULL,
    genero ENUM('Macho', 'Hembra') NOT NULL,
    color VARCHAR(30),
    fecha_nac DATE NOT NULL,
    peso DECIMAL(5,2) COMMENT 'Peso en kg',
    tamano ENUM('Pequeño', 'Mediano', 'Grande') NOT NULL,
    estado_reproductivo ENUM('Intacto', 'Esterilizado', 'Castrado') NOT NULL,
    vacunado BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doc_pro) REFERENCES usuarios(doc) ON DELETE CASCADE
);

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion_estimada INT COMMENT 'Duración en minutos',
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
);
use veterinaria; 
select * from servicios; 
--****************************************************
--*procedimiento almacenado para registrar servicios *
--****************************************************
DELIMITER $$

CREATE PROCEDURE insertar_servicio(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_duracion_estimada INT,
    IN p_estado ENUM('Activo', 'Inactivo')
)
BEGIN
    INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada, estado)
    VALUES (p_nombre, p_descripcion, p_precio, p_duracion_estimada, p_estado);
END $$

DELIMITER ;

--****************************************************
--*procedimiento almacenado para actualizar servicios *
--****************************************************

DELIMITER $$


CREATE PROCEDURE ActualizarServicio(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_duracion_estimada INT,
    IN p_estado ENUM('Activo', 'Inactivo')
)
BEGIN
    UPDATE servicios
    SET
        nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio,
        duracion_estimada = p_duracion_estimada,
        estado = p_estado
    WHERE id = p_id;
END $$

DELIMITER ;

--****************************************************
--*procedimiento almacenado para borrar servicios *
--****************************************************
DELIMITER $$
CREATE PROCEDURE borrar_servicio(IN servicio_id INT)
BEGIN
    DELETE FROM servicios WHERE id = servicio_id;
END$$
DELIMITER ;


CREATE TABLE citas ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    vet_id INT NOT NULL,  
    servicio_id INT,
    fecha_hora DATETIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    estado ENUM('Programada', 'Confirmada', 'Completada', 'Cancelada') DEFAULT 'Programada',
    notas TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (vet_id) REFERENCES veterinarios(vet_id) ON DELETE CASCADE,  
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE SET NULL,
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_estado (estado)
);


CREATE TABLE servicios_realizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    servicio_id INT NOT NULL,
    vet_id INT NOT NULL,  -- Columna declarada como vet_id
    fecha_hora DATETIME NOT NULL,
    notas TEXT,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    FOREIGN KEY (vet_id) REFERENCES veterinarios(vet_id) ON DELETE CASCADE,  
    INDEX idx_fecha_hora (fecha_hora)
);


CREATE TABLE historias_clinicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    cita_id INT,
    vet_id INT NOT NULL,  -- Columna declarada como vet_id
    fecha_consulta DATETIME NOT NULL,
    motivo_consulta TEXT NOT NULL,
    examen_fisico TEXT,
    diagnostico TEXT,
    tratamiento TEXT,
    medicamentos TEXT,
    observaciones TEXT,
    recomendaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
    FOREIGN KEY (vet_id) REFERENCES veterinarios(vet_id) ON DELETE CASCADE, 
    INDEX idx_mascota (mascota_id),
    INDEX idx_fecha_consulta (fecha_consulta)
);


DELIMITER $$

CREATE PROCEDURE veterinaria.ModifyPassword(
  IN user_email VARCHAR(255),
  IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT;
    DECLARE user_id INT;

    SELECT COUNT(*), u.id INTO user_exists, user_id
    FROM usuarios u
    INNER JOIN propietarios p ON u.id = p.id_prop
    WHERE u.email = user_email;

    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario no encontrado o no es propietario';
    ELSE
        
        UPDATE usuarios
        SET password = p_password
        WHERE id = user_id;
    END IF;
END$$

DELIMITER ;

SELECT 
    m.id AS id_mascota,
    m.nombre AS nombre_mascota,
    m.especie,
    m.raza,
    m.genero,
    m.color,
    m.fecha_nac,
    m.peso,
    m.tamano,
    m.estado_reproductivo,
    m.vacunado,
    m.observaciones,
    m.fecha_registro,
    u.nombre AS nombre_propietario,
    u.doc AS documento_propietario,
    u.tel,
    u.email,
    u.direccion
FROM mascotas m
INNER JOIN usuarios u ON m.doc_pro = u.doc
ORDER BY m.fecha_registro DESC;
