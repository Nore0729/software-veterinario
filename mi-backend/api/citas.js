// api/citas.js (Express Router)

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post('/', (req, res) => {
    const {
      propietario_doc,
      mascota_id,
      servicio,
      veterinario_id,
      fecha,
      hora,
      notas,
      estado,
    } = req.body;

    if (!propietario_doc || !mascota_id  || !servicio || !veterinario_id  || !fecha || !hora) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const sql = `INSERT INTO citas 
      (propietario_doc, mascota_id, servicio, veterinario_id, fecha, hora, notas, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      propietario_doc,
      mascota_id,
      servicio,
      veterinario_id,
      fecha,
      hora,
      notas || null,
      estado || 'programada'
    ], (err, results) => {
      if (err) {
        console.error('Error al insertar cita:', err);
        console.log(err)
        return res.status(500).json({ error: 'Error en el servidor al crear la cita' });
      }
      res.status(201).json({ message: 'Cita creada', id: results.insertId });
    });
  });

  return router;
};
