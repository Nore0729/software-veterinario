// mi-backend/api/veterinario.js
const express = require('express');
const router = express.Router();

module.exports = function(db) {
  // --- Endpoint GET /api/veterinarios ---
  // Devuelve una lista de todos los veterinarios para el desplegable.
  router.get('/', (req, res) => {
    console.log("📢 [GET /api/veterinarios] Petición de lista de veterinarios recibida.");
    
    const sql = `
      SELECT 
        v.vet_id, 
        u.nombre 
      FROM veterinarios v
      JOIN usuarios u ON v.vet_id = u.id
      ORDER BY u.nombre ASC;
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Error al consultar la lista de veterinarios:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
      res.status(200).json(results);
    });
  });

  return router;
};