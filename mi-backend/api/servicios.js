// rutas/servicios.js
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // GET /api/servicios
  router.get('/', (req, res) => {
    db.query('SELECT * FROM servicios WHERE estado = "Activo"', (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener los servicios' });
      res.json(results);
    });
  });

  // POST /api/servicios
  router.post('/', (req, res) => {
    const { nombre, descripcion, precio, duracion_estimada } = req.body;

    if (!nombre || !descripcion || !precio || !duracion_estimada) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = `
      INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada)
      VALUES (?, ?, ?, ?)
    `;
    const values = [nombre, descripcion, precio, duracion_estimada];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al insertar el servicio' });
      }
      res.status(201).json({ message: 'Servicio registrado correctamente' });
    });
  });

  // DELETE /api/servicios/:id
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE servicios SET estado = "Inactivo" WHERE id = ?';

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al eliminar el servicio' });
      }
      res.json({ message: 'Servicio eliminado correctamente' });
    });
  });

  return router;
};
