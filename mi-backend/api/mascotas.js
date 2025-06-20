// routes/mascotas.js
const express = require('express');
const router = express.Router();

module.exports = function(db) {
  // RUTA: POST /api/mascotas/registro
  router.post('/registro', (req, res) => {
    const { documento, nombre, especie, raza, genero, color, fechaNacimiento, peso, tamano, estadoReproductivo, vacunado, observaciones } = req.body;
    if (!documento || !nombre) return res.status(400).send('Documento del propietario y nombre de la mascota son obligatorios');

    const query = `INSERT INTO mascotas (doc_pro, nombre, especie, raza, genero, color, fecha_nac, peso, tamano, estado_reproductivo, vacunado, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [documento, nombre, especie, raza, genero, color, fechaNacimiento, peso, tamano, estadoReproductivo, vacunado === true || vacunado === "true" ? 1 : 0, observaciones];

    db.query(query, params, (err) => {
      if (err) return res.status(500).send('Hubo un problema al registrar la mascota');
      res.status(201).send('Mascota registrada exitosamente');
    });
  });

  // RUTA: GET /api/mascotas/propietario/:doc_pro
  // Unifica las dos rutas que tenías para obtener mascotas por documento
  router.get('/propietario/:doc_pro', (req, res) => {
    const { doc_pro } = req.params;
    if (!doc_pro) return res.status(400).json({ error: 'Documento del propietario es obligatorio' });
    
    const query = 'SELECT * FROM mascotas WHERE doc_pro = ?';
    db.query(query, [doc_pro], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor al obtener las mascotas' });
      res.json(results);
    });
  });
  
  return router;
};