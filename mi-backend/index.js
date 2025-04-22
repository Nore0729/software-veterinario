const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

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
          userName: user.nombre 
        });
      } else {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      }
    } else {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos o no registrados' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

