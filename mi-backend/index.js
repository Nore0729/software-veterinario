const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'veterinaria',
  port: '3306'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});


app.post('/api/registro-propietario', (req, res) => {
  const { tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password } = req.body;

  const query = `
    INSERT INTO propietarios 
    (tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password], (err, results) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).send('Hubo un problema al registrar al propietario');
    }
    res.status(201).send('Propietario registrado exitosamente');
  });
});

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM propietarios WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: 'Login exitoso', user: results[0] });
    } else {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos o no registrados' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
