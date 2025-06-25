const express = require('express');
const router = express.Router();

// Exportamos una función que recibe la conexión a la base de datos (db)
module.exports = function(db) {

  // --- Endpoint GET /api/citasvet ---
  // Obtiene todas las citas con información detallada
  router.get('/', (req, res) => {
    console.log("📢 [GET /api/citasvet] Petición de lista de citas recibida.");
    const sql = `
      SELECT
        c.id, m.nombre AS petName, p.nombre AS ownerName, p.tel AS phone,
        p.email AS email, c.fecha_hora, s.nombre AS service, c.estado AS status, c.notas AS notes
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN usuarios p ON m.doc_pro = p.doc
      JOIN servicios s ON c.servicio_id = s.id
      ORDER BY c.fecha_hora ASC;
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Error al consultar la lista de citas:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
      const citasFormateadas = results.map(cita => {
        const fechaHora = new Date(cita.fecha_hora);
        return {
          ...cita,
          date: fechaHora.toISOString().split('T')[0],
          time: fechaHora.toTimeString().split(' ')[0].substring(0, 5)
        };
      });
      res.status(200).json(citasFormateadas);
    });
  });
  
  // --- Endpoint PATCH /api/citasvet/:id/status ---
  // Actualiza únicamente el estado de una cita específica.
  router.patch('/:id/status', (req, res) => {
    const citaId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'El nuevo estado es obligatorio.' });
    }
    const sql = "UPDATE citas SET estado = ? WHERE id = ?";
    db.query(sql, [status, citaId], (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar el estado:", err);
        return res.status(500).json({ error: "Error interno del servidor." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No se encontró una cita con ese ID." });
      }
      res.status(200).json({ message: "Estado actualizado correctamente." });
    });
  });

  // --- Endpoint POST /api/citasvet ---
  // Crea una nueva cita en la base de datos.
  router.post('/', (req, res) => {
    console.log("📢 [POST /api/citasvet] Petición para agendar nueva cita recibida.");

    const { 
      mascota_id, 
      vet_id, 
      servicio_id, 
      fecha_hora, // Campo de fecha 'YYYY-MM-DD'
      time,       // Campo de hora 'HH:MM'
      motivo 
    } = req.body;

    if (!mascota_id || !vet_id || !servicio_id || !fecha_hora || !time) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para agendar la cita.' });
    }
    
    // Unimos la fecha y la hora para el formato DATETIME de MySQL
    const fechaHoraCompleta = `${fecha_hora} ${time}:00`;

    const sql = `
      INSERT INTO citas (mascota_id, vet_id, servicio_id, fecha_hora, motivo, estado) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Una nueva cita se crea con el estado 'pending' (o 'Programada')
    const params = [mascota_id, vet_id, servicio_id, fechaHoraCompleta, motivo, 'pending'];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ Error al insertar la cita en la base de datos:", err);
        return res.status(500).json({ error: 'Error interno del servidor al agendar la cita.' });
      }
      console.log("✅ Cita agendada con éxito. ID:", result.insertId);
      res.status(201).json({ message: "Cita agendada exitosamente", citaId: result.insertId });
    });
  });

  // Devolvemos el router configurado
  return router;
};