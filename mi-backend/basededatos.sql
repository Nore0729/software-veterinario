DROP DATABASE IF EXISTS veterinaria;
CREATE DATABASE veterinaria;
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

CREATE TABLE propietarios (
    id_prop INT PRIMARY KEY,
    FOREIGN KEY (id_prop) REFERENCES usuarios(id) ON DELETE CASCADE
);

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
    vet_id INT NOT NULL,
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
    vet_id INT NOT NULL,
    fecha_consulta DATETIME NOT NULL,
    motivo_consulta TEXT NOT NULL,
    signos_vitales JSON NULL,
    examen_fisico TEXT,
    diagnostico TEXT,
    tratamiento TEXT,
    medicamentos JSON NULL,
    observaciones TEXT,
    recomendaciones TEXT,
    proxima_cita DATE NULL,
    archivos_adjuntos JSON NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
    FOREIGN KEY (vet_id) REFERENCES veterinarios(vet_id) ON DELETE CASCADE,
    INDEX idx_mascota (mascota_id),
    INDEX idx_fecha_consulta (fecha_consulta)
);



DELIMITER $$
CREATE PROCEDURE insertar_servicio(
    IN p_nombre VARCHAR(100), IN p_descripcion TEXT, IN p_precio DECIMAL(10,2),
    IN p_duracion_estimada INT, IN p_estado ENUM('Activo', 'Inactivo')
)
BEGIN
    INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada, estado)
    VALUES (p_nombre, p_descripcion, p_precio, p_duracion_estimada, p_estado);
END$$

CREATE PROCEDURE ActualizarServicio(
    IN p_id INT, IN p_nombre VARCHAR(100), IN p_descripcion TEXT,
    IN p_precio DECIMAL(10,2), IN p_duracion_estimada INT, IN p_estado ENUM('Activo', 'Inactivo')
)
BEGIN
    UPDATE servicios SET nombre = p_nombre, descripcion = p_descripcion, precio = p_precio,
    duracion_estimada = p_duracion_estimada, estado = p_estado WHERE id = p_id;
END$$

CREATE PROCEDURE borrar_servicio(IN servicio_id INT)
BEGIN
    DELETE FROM servicios WHERE id = servicio_id;
END$$

CREATE PROCEDURE ModifyPassword(IN user_email VARCHAR(255), IN p_password VARCHAR(255))
BEGIN
    DECLARE user_exists INT;
    DECLARE user_id INT;
    SELECT COUNT(*), u.id INTO user_exists, user_id FROM usuarios u
    INNER JOIN propietarios p ON u.id = p.id_prop WHERE u.email = user_email;
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado o no es propietario';
    ELSE
        UPDATE usuarios SET password = p_password WHERE id = user_id;
    END IF;
END$$
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE historias_clinicas;
TRUNCATE TABLE citas;
TRUNCATE TABLE mascotas;
TRUNCATE TABLE veterinarios;
TRUNCATE TABLE propietarios;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE servicios;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserción de servicios
INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada, estado) VALUES
('Consulta General', 'Revisión completa de la mascota, diagnóstico y plan de tratamiento inicial.', 50000, 30, 'Activo'),
('Vacunación Anual', 'Aplicación de vacunas correspondientes al plan anual de la mascota.', 80000, 20, 'Activo'),
('Limpieza Dental', 'Profilaxis dental bajo sedación para eliminar sarro y placa.', 150000, 60, 'Activo'),
('Corte de Pelo y Baño', 'Servicio completo de grooming, incluye corte de uñas y limpieza de oídos.', 70000, 90, 'Activo');

-- Inserción de usuarios
INSERT INTO `usuarios` (`id`, `tipo_Doc`, `doc`, `nombre`, `fecha_Nac`, `tel`, `email`, `direccion`, `password`) VALUES
(1, 'CC', '10101010', 'Ana García', '1990-05-15', '3001112233', 'ana.garcia@email.com', 'Calle Falsa 123', 'pass123'),
(2, 'CC', '20202020', 'Carlos Martinez', '1985-11-20', '3104445566', 'carlos.martinez@email.com', 'Avenida Siempre Viva 742', 'pass123'),
(3, 'CC', '30303030', 'Dr. Ricardo Sanchez', '1988-02-10', '3207778899', 'ricardo.sanchez.vet@email.com', 'Consultorio 101', 'passVet1'),
(4, 'CC', '40404040', 'Dra. Laura Torres', '1992-09-01', '3019998877', 'laura.torres.vet@email.com', 'Consultorio 102', 'passVet1');

-- Asignación de roles
INSERT INTO `propietarios` (`id_prop`) VALUES (1), (2);
INSERT INTO `veterinarios` (`vet_id`, `especialidad`) VALUES (3, 'Cirugía General'), (4, 'Medicina Interna');

-- Inserción de mascotas
INSERT INTO `mascotas` (`doc_pro`, `nombre`, `especie`, `raza`, `genero`, `color`, `fecha_nac`, `peso`, `tamano`, `estado_reproductivo`, `vacunado`) VALUES
('10101010', 'Max', 'Perro', 'Golden Retriever', 'Macho', 'Dorado', '2021-03-10', 28.5, 'Grande', 'Intacto', 1),
('10101010', 'Luna', 'Gato', 'Siamés', 'Hembra', 'Crema', '2022-01-20', 4.2, 'Pequeño', 'Esterilizado', 1),
('20202020', 'Rocky', 'Perro', 'Bulldog Francés', 'Macho', 'Negro', '2020-07-30', 12.0, 'Mediano', 'Intacto', 1);

INSERT INTO `citas` (`mascota_id`, `vet_id`, `servicio_id`, `fecha_hora`, `motivo`, `estado`) VALUES
(1, 3, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), 'Revisión general anual', 'Programada')
(3, 4, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'Vacuna de refuerzo', 'Confirmada');


INSERT INTO `historias_clinicas` (`mascota_id`, `vet_id`, `fecha_consulta`, `motivo_consulta`, `signos_vitales`, `diagnostico`, `tratamiento`, `medicamentos`, `observaciones`, `proxima_cita`) VALUES
(1, 3, '2024-05-20 10:30:00', 'Control anual y revisión de piel.', '{"peso": "28.5 kg", "temperatura": "38.5°C"}', 'Dermatitis alérgica leve por pulgas.', 'Aplicar pipeta antipulgas mensual.', '[{"nombre": "Bravecto", "dosis": "1 pipeta"}]', 'El paciente se muestra alerta y con buen apetito.', '2025-05-20');


DELIMITER $$

CREATE PROCEDURE `GetOwnersWithDetails`(IN p_doc VARCHAR(15))
BEGIN
    SELECT
        u.id AS id,
        u.nombre AS name,
        u.tel AS phone,
        u.email,
        u.direccion AS address,
        u.fecha_Regis AS registrationDate,
        MIN(citas.fecha_hora) as nextAppointmentDate,
        -- Usamos JSON_ARRAYAGG para agrupar todas las mascotas de un propietario en un solo campo JSON
        JSON_ARRAYAGG(
            -- Usamos IF para evitar errores si un propietario no tiene mascotas
            IF(m.id IS NULL, NULL,
                -- JSON_OBJECT crea un objeto JSON para cada mascota
                JSON_OBJECT(
                    'id', m.id,
                    'name', m.nombre,
                    'species', m.especie,
                    'breed', m.raza,
                    'age', CONCAT(TIMESTAMPDIFF(YEAR, m.fecha_nac, CURDATE()), ' años'),
                    'weight', m.peso,
                    'gender', m.genero,
                    'photo', '/placeholder.svg?height=80&width=80',
                    'pendingAppointments', (SELECT COUNT(*) FROM citas c WHERE c.mascota_id = m.id AND c.estado IN ('Programada', 'Confirmada') AND c.fecha_hora >= NOW()),
                    'lastVisit', (SELECT MAX(fecha_consulta) FROM historias_clinicas hc WHERE hc.mascota_id = m.id),
                    'nextAppointment', ( -- Subconsulta para obtener la próxima cita específica de esta mascota
                        SELECT JSON_OBJECT('date', DATE_FORMAT(c.fecha_hora, '%Y-%m-%d'), 'time', DATE_FORMAT(c.fecha_hora, '%H:%i'), 'service', s.nombre, 'status', LOWER(c.estado))
                        FROM citas c JOIN servicios s ON c.servicio_id = s.id
                        WHERE c.mascota_id = m.id AND c.estado IN ('Programada', 'Confirmada') AND c.fecha_hora >= NOW()
                        ORDER BY c.fecha_hora ASC LIMIT 1
                    )
                )
            )
        ) as pets
    FROM
        usuarios u
    JOIN
        propietarios p ON u.id = p.id_prop
    LEFT JOIN
        mascotas m ON u.doc = m.doc_pro
    LEFT JOIN
        citas ON m.id = citas.mascota_id AND citas.estado IN ('Programada', 'Confirmada') AND citas.fecha_hora >= NOW()
    -- El WHERE maneja la búsqueda: si p_doc es NULL o vacío, los trae a todos. Si no, busca por el documento.
    WHERE
        (p_doc IS NULL OR p_doc = '' OR u.doc LIKE CONCAT('%', p_doc, '%'))
    GROUP BY
        u.id
    -- Ordena por la fecha de la cita más próxima. Los que no tienen cita van al final.
    ORDER BY
        nextAppointmentDate IS NULL, nextAppointmentDate ASC;
END$$

DELIMITER ;