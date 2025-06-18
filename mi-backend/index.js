const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { routerApi } = require('./server/server');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'veterinaria',
  port: '3306',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Salir si no conecta
  }
  console.log('Conexión a la base de datos exitosa');
});

// Registrar propietario
app.post('/api/registro-propietario', (req, res) => {
  const { tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password } = req.body;

  if (!tipo_Doc || !doc || !nombre || !fecha_Nac || !tel || !email || !direccion || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar que el email no esté duplicado
  const checkEmailQuery = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error al validar email:', err);
      return res.status(500).json({ message: 'Error al validar email' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    try {
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUsuarioQuery = `
        INSERT INTO usuarios
        (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertUsuarioQuery,
        [tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword],
        (err2, results2) => {
          if (err2) {
            console.error('Error al insertar en usuarios:', err2);
            return res.status(500).json({ message: 'Hubo un problema al registrar el usuario' });
          }

          const usuarioId = results2.insertId;

          const insertPropietarioQuery = 'INSERT INTO propietarios (id_prop) VALUES (?)';
          db.query(insertPropietarioQuery, [usuarioId], (err3) => {
            if (err3) {
              console.error('Error al insertar en propietarios:', err3);
              return res.status(500).json({
                message: 'Usuario creado pero hubo un problema al asignar como propietario',
              });
            }

            return res.status(201).json({ message: 'Propietario registrado exitosamente' });
          });
        }
      );
    } catch (error) {
      console.error('Error al encriptar la contraseña:', error);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  const query = `
    SELECT u.*
    FROM usuarios u
    INNER JOIN propietarios p ON u.id = p.id_prop
    WHERE u.email = ?
  `;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      // No encontró usuario con ese email en propietarios
      return res.status(401).json({ message: 'Correo o contraseña incorrectos o no registrados como propietario' });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      }

      return res.status(200).json({
        message: 'Login exitoso',
        nombre: user.nombre,
        doc: user.doc,
        email: user.email,
        rol: 'propietario',
      });
    } catch (bcryptError) {
      console.error('Error al comparar contraseñas:', bcryptError);
      return res.status(500).json({ message: 'Error al verificar la contraseña' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


// registro de la mascota 
app.post('/api/registro-mascota', (req, res) => {
  const {
    documento,
    nombre,
    especie,
    raza,
    genero,
    color,
    fechaNacimiento,
    peso,
    tamano,
    estadoReproductivo,
    vacunado,
    observaciones
  } = req.body;

  // Validar campos obligatorios
  if (!documento || !nombre) {
    return res.status(400).send('Documento del propietario y nombre de la mascota son obligatorios');
  }

  const query = `
    INSERT INTO mascotas (
      doc_pro, nombre, especie, raza, genero, color,
      fecha_nac, peso, tamano, estado_reproductivo, vacunado, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      documento,
      nombre,
      especie || null,
      raza || null,
      genero || null,
      color || null,
      fechaNacimiento || null,
      peso || null,
      tamano || null,
      estadoReproductivo || null,
      vacunado === true || vacunado === "true" ? 1 : 0,
      observaciones || null
    ],
    (err, results) => {
      if (err) {
        console.error('Error al registrar la mascota:', err);
        return res.status(500).send('Hubo un problema al registrar la mascota');
      }
      res.status(201).send('Mascota registrada exitosamente');
    }
  );
});

// mascotas logueadas
app.get('/api/mis-mascotas/:doc_pro', (req, res) => {
  const { doc_pro } = req.params;
  console.log('Buscando mascotas para el doc:', doc_pro);
 

  const query = 'SELECT * FROM mascotas WHERE doc_pro = ?';

  db.query(query, [doc_pro], (err, results) => {
    if (err) {
      console.error('Error al obtener mascotas:', err);
      return res.status(500).json({ message: 'Hubo un problema al obtener las mascotas' });
    }
    res.status(200).json(results);
  });
});






// Listar mascotas de un propietario
app.get('/api/mascotas/:doc_pro', (req, res) => {
  const { doc_pro } = req.params;

  if (!doc_pro) {
    return res.status(400).json({ error: 'Documento del propietario es obligatorio' });
  }

  const query = 'SELECT * FROM mascotas WHERE doc_pro = ?';

  db.query(query, [doc_pro], (err, results) => {
    if (err) {
      console.error('Error al obtener las mascotas:', err);
      return res.status(500).json({ error: 'Error en el servidor al obtener las mascotas' });
    }

    res.json(results); // Devuelve la lista de mascotas en formato JSON
  });
});


// Restablecer contraseña
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email y nueva contraseña son requeridos',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query("CALL ModifyPassword(?, ?)", [email, hashedPassword], (err) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return res.status(500).json({
          success: false,
          message: 'Error en el servidor al actualizar la contraseña',
        });
      } else {
        res.status(200).json({
          message: 'Tu contraseña fue cambiada correctamente'
        });
      }
    });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al restablecer la contraseña',
      error: error.message,
    });
  }
});

// Obtener propietario por email
app.get('/api/propietarios/:email', (req, res) => {
  const email = req.params.email;
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND id IN (SELECT id_prop FROM propietarios)';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Error al consultar propietario:', err);
      res.status(500).json({ error: 'Error al consultar' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'No se encontró el propietario' });
    } else {
      res.json(result[0]);
    }
  });
});


// Actualizar datos del propietario
app.put('/api/propietarios/:email', async (req, res) => {
  const emailOriginal = req.params.email;
  const { tel, email, direccion, password } = req.body; 

  if (!tel || !email || !direccion || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      UPDATE usuarios
      SET tel = ?, email = ?, direccion = ?, password = ?
      WHERE email = ? AND id IN (SELECT id_prop FROM propietarios)
    `;

    db.query(query, [tel, email, direccion, hashedPassword, emailOriginal], (err, result) => {
      if (err) {
        console.error('Error al actualizar propietario:', err);
        return res.status(500).json({ message: 'Error en el servidor al actualizar datos' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Propietario no encontrado o no es un usuario válido' });
      }

      res.json({ message: 'Datos actualizados correctamente' });
    });
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Registrar usuario general
app.post('/api/registro-usuario', async (req, res) => {
  const { tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password } = req.body;

  if (!tipo_Doc || !doc || !nombre || !fecha_Nac || !tel || !email || !direccion || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Validar que no se repita el email
  const checkEmail = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(checkEmail, [email], async (err, results) => {
    if (err) {
      console.error('Error al validar email:', err);
      return res.status(500).json({ message: "Error al validar email" });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO usuarios
        (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(query, [tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword], (err2) => {
        if (err2) {
          console.error('Error al insertar usuario:', err2);
          return res.status(500).json({ message: 'Hubo un problema al registrar el usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      });
    } catch (error) {
      console.error('Error al encriptar la contraseña:', error);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  });
});


// conexion de registrar usuario por parte de administrador
// por favor no tocar la conexion 

app.post("/api/usuarios", async (req, res) => {
  const { tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password } = req.body;
  if (!tipo_Doc || !doc || !nombre || !fecha_Nac || !tel || !email || !direccion || !password) {
    return res.status(400).send("Todos los campos son obligatorios")
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const query = `
      INSERT INTO usuarios
      (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    db.query(query,[tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword],
      (err, results) => {
        if (err) {
          console.error("Error al insertar los datos:", err)
          return res.status(500).json({ message: "Hubo un problema al registrar al usuario"})
        }
        res.status(201).json({ message: "usuario registrado exitosamente"})
      },
    )
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error)
    return res.status(500).json({ message: "Error del servidor"})
  }
})


// conexion de registrar roles por parte de administrador
// por favor no tocar la conexion 

app.post("/api/roles", async (req, res) => {
  const { nom_rol, descripcion } = req.body;
  if (!nom_rol || !descripcion) {
    return res.status(400).send("Todos los campos son obligatorios");
  }
  try {
    const query = `
      INSERT INTO roles
      (nom_rol, descripcion) 
      VALUES (?, ?)`;
    db.query(query, [nom_rol, descripcion],
      (err, results) => {
        if (err) {
          console.error("Error al insertar los datos:", err);
          return res.status(500).json({ message: "Hubo un problema al registrar el rol"});
        }
        // Devuelve el objeto completo del rol creado
        const nuevoRol = {
          id: results.insertId,  // Obtenemos el ID autogenerado
          nom_rol: nom_rol,
          descripcion: descripcion
        };
        res.status(201).json(nuevoRol);  // Enviamos el rol completo
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor"});
  }
});


// api para obtener todos los roles de la base de datos
app.get("/api/obtener_roles", async (req, res) => {
  try {
    const query = "SELECT id, nom_rol, descripcion FROM roles";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener los roles:", err);
        return res.status(500).json({ message: "Hubo un problema al obtener los roles" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
});

// api para actualizar todos los roles de la base de datos
app.put("/api/actualizar_rol/:id", async (req, res) => {
  const id = req.params.id;
  const { nom_rol, descripcion } = req.body;

  if (!nom_rol) {
    return res.status(400).json({ message: "El nombre del rol es obligatorio" });
  }

  try {
    const query = "UPDATE roles SET nom_rol = ?, descripcion = ? WHERE id = ?";
    db.query(query, [nom_rol, descripcion, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar el rol:", err);
        return res.status(500).json({ message: "Error al actualizar el rol" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Rol no encontrado" });
      }

      res.status(200).json({ message: "Rol actualizado correctamente" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
});

//***********************/
// Api para eliminar rol*/
//***********************/
app.delete("/api/roles/:id", (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM Roles WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "rol no encontrado" });
    }
    res.json({ message: "rol eliminado", id });
  });
});


//*********************************************************************************/
// api traer todos los usuarios registrados desde la base de datos para el dasboard*/
//******************************************************************************* */

app.get("/api/usuarios_registrados", async (req, res) => {
  try {
    const query = "SELECT COUNT(*) AS total_usuarios FROM usuarios;";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener la cantidad de usuarioss:", err);
        return res.status(500).json({ message: "Hubo un problema al obtener los usuarios" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
});


//************************************************/
// Api de registrar servicios desde administrador*/
//********************************************** */
app.post("/api/servicios", async (req, res) => {
  const { nombre, descripcion, precio,  duracion_estimada } = req.body;
  if (!nombre || !descripcion || !precio || !duracion_estimada) {
    return res.status(400).send("Todos los campos son obligatorios")
  }
  try {
    const query = `
      INSERT INTO servicios
      ( nombre, descripcion, precio, duracion_estimada) 
      VALUES (?, ?, ?, ?)`
    db.query(query,[nombre, descripcion, precio, duracion_estimada],
      (err, results) => {
        if (err) {
          console.error("Error al insertar los datos:", err)
          return res.status(500).json({ message: "Hubo un problema al registrar el servicio"})
        }
        res.status(201).json({ message: "servicio registrado exitosamente"})
      },
    )
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor"})
  }
})



//**************************************************************/
// traer todo los servicios registrados desde la base de datos */
//************************************************************ */

app.get("/api/obtener_servicios", async (req, res) => {
  try {
    const query = "SELECT id, nombre, descripcion, precio, duracion_estimada, estado FROM servicios";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener los servicios:", err);
        return res.status(500).json({ message: "Hubo un problema al obtener los servicios" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
});


// api para actualizar servicios 

// app.put("/api/servicios/:id", (req, res) => {
//   const { id } = req.params;
//   const { nombre, descripcion, precio, duracion_estimada, estado } = req.body;
//   if (!nombre || !descripcion || !precio || !duracion_estimada || !estado) {
//     return res.status(400).json({ error: "Todos los campos son obligatorios" });
//   }
//   const query = `
//     UPDATE servicios 
//     SET nombre = ?, descripcion = ?, precio = ?, duracion_estimada = ?, estado = ? 
//     WHERE id = ?
//   `;
//   // Ejecutar la consulta SQL
//   db.query(query, [nombre, descripcion, precio, duracion_estimada, estado, id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Servicio no encontrado" });
//     }
//     res.json({ message: "Servicio actualizado exitosamente", id });
//   });
// }); ctrl ]}


//*******************************/
// Api para eliminar servicio  */
//*************************** */

// Api para eliminar servicio 
app.delete("/api/servicios/:id", (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM servicios WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json({ message: "Servicio eliminado", id });
  });
});

routerApi(app)