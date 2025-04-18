// Importamos las dependencias necesarias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Creamos una instancia de Express
const app = express();
const port = 3000; // El puerto donde escuchará el servidor

// Usamos middleware para manejar el cuerpo de las solicitudes (formato JSON) y CORS
app.use(bodyParser.json());
app.use(cors());

// Configuramos la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'veterinaria',
    port: '3306' // Asegúrate de tener esta base de datos creada
});

// Conectamos a la base de datos MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

// Ruta que maneja el registro de propietarios
app.post('/api/registro-propietario', (req, res) => {
  const { tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password } = req.body;

  // Consulta SQL para insertar los datos del propietario en la base de datos
  const query = `INSERT INTO propietarios (tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Ejecutamos la consulta con los valores recibidos del formulario
  db.query(query, [tipoDocumento, documento, nombre, fechaNacimiento, telefono, email, direccion, password], (err, results) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).send('Hubo un problema al registrar al propietario');
    }
    res.status(201).send('Propietario registrado exitosamente');
  });
});

// Iniciamos el servidor en el puerto 5000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
