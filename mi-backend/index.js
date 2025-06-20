// index.js (Versión Final Organizada y Corregida)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Configuración de la conexión a la base de datos (Cambiado a Pool para mayor estabilidad)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'veterinaria',
  port: '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificamos que el pool de conexiones se configure correctamente
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error fatal al configurar el pool de la base de datos:', err);
        process.exit(1);
    }
    console.log('✅ Pool de conexiones a la base de datos listo.');
    connection.release();
});


// --- IMPORTAR Y MONTAR RUTAS (SECCIÓN CORREGIDA) ---
console.log("Cargando rutas...");

// Corregimos las rutas para que apunten a la carpeta './api/' y usen los nombres de archivo correctos
const adminRoutes = require('./api/administrador'); // Se llamaba 'admin' y ahora es 'administrador'
const authRoutes = require('./api/auth');
const mascotaRoutes = require('./api/mascotas');
const propietarioRoutes = require('./api/propietario'); // Se llamaba 'propietarios' y ahora es 'propietario'
// const veterinarioRoutes = require('./api/veterinario');


// Montamos los routers en la aplicación principal
app.use('/api/admin', adminRoutes(db));
app.use('/api/auth', authRoutes(db));
app.use('/api/mascotas', mascotaRoutes(db));
app.use('/api/propietarios', propietarioRoutes(db));
// app.use('/api/veterinarios', veterinarioRoutes(db));


console.log("✅ Todas las rutas han sido cargadas.");


// --- INICIO DEL SERVIDOR ---
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});