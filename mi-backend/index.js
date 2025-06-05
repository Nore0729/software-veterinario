const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

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


// Registrar mascota
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

  if (!documento || !nombre) {
    return res.status(400).send('Documento del propietario y nombre de la mascota son obligatorios');
  }

  const query = `
    INSERT INTO mascotas (
      documento, nombre, especie, raza, genero, color,
      fechaNacimiento, peso, tamano, estadoReproductivo, vacunado, observaciones
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
    (err) => {
      if (err) {
        console.error('Error al registrar la mascota:', err);
        return res.status(500).send('Hubo un problema al registrar la mascota');
      }
      res.status(201).send('Mascota registrada exitosamente');
    }
  );
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
  const { telefono, email, direccion, password } = req.body;

  if (!telefono || !email || !direccion || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      UPDATE usuarios
      SET tel = ?, email = ?, direccion = ?, password = ?
      WHERE email = ? AND id IN (SELECT id_prop FROM propietarios)
    `;

    db.query(query, [telefono, email, direccion, hashedPassword, emailOriginal], (err, result) => {
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

// Servidor escuchando
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
