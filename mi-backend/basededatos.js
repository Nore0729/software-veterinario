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


// select * from propietarios;