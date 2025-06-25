// api/citasvet.js

const express = require('express');
const router = express.Router();

module.exports = function(db) {

  // GET: Obtener TODAS las citas para la lista
  router.get('/', (req, res) => {
    const sql = `
      SELECT
        c.id, m.nombre AS petName, p.nombre AS ownerName, p.tel AS phone,
        p.email AS email, c.fecha_hora, s.nombre AS service, c.estado AS status, c.notas AS notes,
        vet_user.nombre AS veterinario
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN usuarios p ON m.doc_pro = p.doc
      JOIN servicios s ON c.servicio_id = s.id
      JOIN veterinarios v ON c.vet_id = v.vet_id
      JOIN usuarios vet_user ON v.vet_id = vet_user.id
      ORDER BY c.fecha_hora ASC;
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error interno del servidor.' });
      const citasFormateadas = results.map(cita => {
        const fechaHora = new Date(cita.fecha_hora);
        return { ...cita, date: fechaHora.toISOString().split('T')[0], time: fechaHora.toTimeString().split(' ')[0].substring(0, 5) };
      });
      res.status(200).json(citasFormateadas);
    });
  });

  // GET: Obtener UNA SOLA cita por su ID (para rellenar el formulario de edición)
  router.get('/:id', (req, res) => {
    const citaId = req.params.id;
    const sql = `
      SELECT c.mascota_id, c.vet_id, c.servicio_id, c.fecha_hora, c.notas AS motivo, m.doc_pro AS propietario_doc 
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      WHERE c.id = ?
    `;
    db.query(sql, [citaId], (err, results) => {
      if (err) return res.status(500).json({ error: "Error interno del servidor." });
      if (results.length === 0) return res.status(404).json({ error: "No se encontró la cita." });
      
      const cita = results[0];
      const fechaHoraJS = new Date(cita.fecha_hora);
      cita.fecha_hora = fechaHoraJS.toISOString().split('T')[0];
      cita.time = fechaHoraJS.toTimeString().split(' ')[0].substring(0, 5);
      res.json(cita);
    });
  });

  // PUT: Actualizar una cita existente por su ID
  router.put('/:id', (req, res) => {
    const citaId = req.params.id;
    const { servicio_id, vet_id, fecha_hora, time, motivo } = req.body;
    const fechaHoraCompleta = `${fecha_hora} ${time}:00`;
    const sql = `UPDATE citas SET servicio_id = ?, vet_id = ?, fecha_hora = ?, notas = ? WHERE id = ?`;
    const params = [servicio_id, vet_id, fechaHoraCompleta, motivo, citaId];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar la cita:", err);
        return res.status(500).json({ error: 'Error al actualizar la cita.' });
      }
      res.status(200).json({ message: 'Cita actualizada exitosamente' });
    });
  });
  
  // POST: Crear una nueva cita
  router.post('/', (req, res) => {
    const { mascota_id, vet_id, servicio_id, fecha_hora, time, motivo } = req.body;
    if (!mascota_id || !vet_id || !servicio_id || !fecha_hora || !time) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    const fechaHoraCompleta = `${fecha_hora} ${time}:00`;
    const sql = `INSERT INTO citas (mascota_id, vet_id, servicio_id, fecha_hora, notas, estado) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [mascota_id, vet_id, servicio_id, fechaHoraCompleta, motivo, 'Pendiente'];
    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al agendar la cita.' });
      res.status(201).json({ message: "Cita agendada exitosamente", citaId: result.insertId });
    });
  });

  // PATCH: Actualizar solo el estado de una cita
  router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE citas SET estado = ? WHERE id = ?";
    db.query(sql, [status, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: "Error interno del servidor." });
      res.status(200).json({ message: "Estado actualizado correctamente." });
    });
  });
  
  // DELETE: Eliminar una cita por su ID
  router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM citas WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: "Error interno del servidor." });
      res.status(200).json({ message: "Cita eliminada exitosamente." });
    });
  });

  return router;
};