const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query('SELECT * FROM servicios WHERE estado = "Activo"', (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener los servicios' });
      res.json(results);
    });
  });

  return router;
};
