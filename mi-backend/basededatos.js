// CREATE DATABASE veterinaria;
// drop database veterinaria;
// USE veterinaria;

// CREATE TABLE propietarios (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   tipoDocumento VARCHAR(10) NOT NULL,
//   documento VARCHAR(15) NOT NULL UNIQUE,
//   nombre VARCHAR(100) NOT NULL,
//   fechaNacimiento DATE,
//   telefono VARCHAR(15),
//   email VARCHAR(100) NOT NULL UNIQUE,
//   direccion VARCHAR(255),
//   password VARCHAR(255) NOT NULL,
//   fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// INSERT INTO propietarios (
//   tipoDocumento,documento, nombre,fechaNacimiento,  telefono, email, direccion,password 
// ) VALUES
// ('c.c','11223344', 'Carlos','1982-11-05', '3209876543', 'carlos.ramirez@example.com', 'Carrera 10 #20-30','Alejandra18*');


// CREATE TABLE mascotas (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   documento VARCHAR(15) NOT NULL, -- documento del propietario
//   nombre VARCHAR(100) NOT NULL,
//   especie VARCHAR(50),
//   raza VARCHAR(50),
//   genero VARCHAR(10),
//   color VARCHAR(30),
//   fechaNacimiento DATE,
//   peso DECIMAL(5,2),
//   tamano VARCHAR(20),
//   estadoReproductivo VARCHAR(30),
//   vacunado BOOLEAN DEFAULT FALSE,
//   observaciones TEXT,
//   fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (documento) REFERENCES propietarios(documento)
// );

// INSERT INTO  mascotas (
//   documento, nombre,especie,raza,genero,color,fechaNacimiento,peso,tamano,estadoReproductivo,vacunado,observaciones
// ) VALUES
// ('11223344', 'lazi','perro', 'pincher', 'hembra', 'blanca', '1982-11-05','4','6','castrado','1','vsdfgdjbckjsdgfuibcvbd');



// DELIMITER $$

// CREATE PROCEDURE veterinaria.ModifyPassword(
//   IN user_email VARCHAR(255),
//   IN p_password VARCHAR(255)
// )
// BEGIN
//     -- Verificamos si el email existe en la tabla de propietarios
//     DECLARE user_exists INT;

//     -- Verificamos si el email existe en la tabla de propietarios
//     SELECT COUNT(*) INTO user_exists
//     FROM propietarios
//     WHERE email = user_email;

//     -- Si el usuario no existe, lanzamos un error
//     IF user_exists = 0 THEN
//         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
//     ELSE
//         -- Si el usuario existe, recuperamos la contraseña
//         UPDATE
//           propietarios p
//         SET 
//           p.password = p_password
//         WHERE 



        
//           email = user_email;
//     END IF;
// END $$

// DELIMITER ;

// SELECT p.nombre AS propietario, p.documento, m.nombre AS mascota, m.especie, m.raza, m.genero, m.color, m.fechaNacimiento, m.peso, m.tamano, m.estadoReproductivo, m.vacunado, m.observaciones
// FROM mascotas m
// JOIN propietarios p ON m.documento = p.documento
// WHERE p.documento = '11223344';


// select * from mascotas;
// select * from propietarios;