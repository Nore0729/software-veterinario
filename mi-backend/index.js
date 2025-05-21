const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'veterinaria',
  port: '3306'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

// Ruta para registrar propietarios
app.post('/api/registro-propietario', async (req, res) => {
  const { tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password } = req.body;

  if (!tipoDocumento || !documento || !nombre || !fechaNacimiento || !telefono || !email || !direccion || !password) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO propietarios 
      (tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error al insertar los datos:', err);
        return res.status(500).send('Hubo un problema al registrar al propietario');
      }
      res.status(201).send('Propietario registrado exitosamente');
    });

  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    return res.status(500).send('Error del servidor');
  }
});

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM propietarios WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length > 0) {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Devolvemos el nombre del propietario
        return res.status(200).json({ 
          message: 'Login exitoso', 
          name: user.nombre,
          userEmail: user.email
        });
      } else {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      }
    } else {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos o no registrados' });
    }
  });
});

// Endpoint para restablecer la contraseña
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email,newPassword)

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email y nueva contraseña son requeridos',
    });
  }

  try {
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Usar el procedimiento almacenado ActualizarContrasena
    db.query("CALL ModifyPassword(?, ?)", [email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return res.status(500).json({
          success: false,
          message: 'Error en el servidor al actualizar la contraseña',
        });
      }
      else res.status(200).json({
        message:'tu contraseña fue cambiada correctamente'
      })
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

// app.get('/Propietarios/:email', (req, res) => {
//   const email = req.params.email;
//   const sql = 'SELECT * FROM propietarios WHERE email = ?';
//   db.query(sql, [email], (err, result) => {
//     if (err) {
//       console.error('Error al consultar propietario:', err);
//       res.status(500).json({ error: 'Error al consultar' });
//     } else if (result.length === 0) {
//       res.status(404).json({ error: 'No se encontró el propietario' });
//     } else {
//       res.json(result[0]);
//     }
//   });
// });

// Ruta para registrar mascota con documento del propietario
app.post('/api/registro-mascota', async (req, res) => {
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

  // Validar que todos los campos requeridos estén presentes
  if (
    !documento ||
    !nombre ||
    !especie ||
    !raza ||
    !genero ||
    !fechaNacimiento ||
    !tamano ||
    !estadoReproductivo
  ) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // Preparar la consulta para insertar los datos en la base de datos
    const query = `
      INSERT INTO mascotas 
      (documento, nombre, especie, raza, genero, color, fechaNacimiento, peso, tamano, estadoReproductivo, vacunado, observaciones) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Ejecutar la consulta con los valores recibidos
    db.query(
      query,
      [
        documento,
        nombre,
        especie,
        raza,
        genero,
        color || null, // Color es opcional, se permite que sea nulo
        fechaNacimiento,
        peso || null, // Peso es opcional, se permite que sea nulo
        tamano,
        estadoReproductivo,
        vacunado || false, // Vacunado es opcional y por defecto es false
        observaciones || null // Observaciones es opcional, se permite que sea nulo
      ],
      (err, results) => {
        if (err) {
          console.error('Error al insertar los datos:', err);
          return res.status(500).send('Hubo un problema al registrar la mascota');
        }
        res.status(201).send('Mascota registrada exitosamente');
      }
    );

  } catch (error) {
    console.error('Error en el proceso de registro de la mascota:', error);
    return res.status(500).send('Error del servidor');
  }
});


