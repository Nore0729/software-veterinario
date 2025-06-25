// mi-backend/api/consultasvet.js

const express = require('express');
const router = express.Router();

// La función se exporta y recibe la conexión a la DB (db)
module.exports = function(db) {

  // --- Endpoint GET /api/consultas ---
  // Obtiene todas las historias clínicas con información detallada
  router.get('/', (req, res) => {
    console.log("📢 [GET /api/consultas] Petición recibida.");

    // SQL actualizado para seleccionar las nuevas columnas
    const sql = `
      SELECT 
        hc.id AS id_historia,
        hc.fecha_consulta,
        hc.motivo_consulta,
        hc.diagnostico,
        hc.tratamiento,
        hc.observaciones,
        hc.medicamentos,          -- Columna JSON
        hc.signos_vitales,        -- Columna JSON
        hc.proxima_cita,          -- Columna DATE
        hc.archivos_adjuntos,     -- Columna JSON
        m.id AS id_mascota,
        m.nombre AS nombre_mascota,
        m.especie,
        m.raza,
        m.fecha_nac AS fecha_nac_mascota,
        prop.nombre AS nombre_propietario,
        prop.tel AS telefono_propietario,
        vet_user.nombre AS nombre_veterinario
      FROM historias_clinicas hc
      JOIN mascotas m ON hc.mascota_id = m.id
      JOIN usuarios prop ON m.doc_pro = prop.doc
      JOIN veterinarios v ON hc.vet_id = v.vet_id
      JOIN usuarios vet_user ON v.vet_id = vet_user.id
      ORDER BY hc.fecha_consulta DESC;
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ [GET /api/consultas] Error al consultar la base de datos:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      console.log(`✅ [GET /api/consultas] Se encontraron ${results.length} registros.`);
      
      // Transformamos los resultados para que coincidan con la estructura del frontend
      const consultasFormateadas = results.map(row => {
        const edadAnios = new Date().getFullYear() - new Date(row.fecha_nac_mascota).getFullYear();
        
        return {
          id: row.id_historia,
          fecha: new Date(row.fecha_consulta).toISOString().split('T')[0],
          hora: new Date(row.fecha_consulta).toTimeString().split(' ')[0].substring(0, 5),
          mascota: {
            id: row.id_mascota,
            nombre: row.nombre_mascota,
            especie: row.especie,
            raza: row.raza,
            edad: `${edadAnios} años`,
            propietario: row.nombre_propietario,
            telefono: row.telefono_propietario,
          },
          veterinario: `Dr. ${row.nombre_veterinario}`,
          motivo: row.motivo_consulta,
          sintomas: "Revisar motivo",
          diagnostico: row.diagnostico,
          tratamiento: row.tratamiento,
          medicamentos: row.medicamentos || [],
          signosVitales: row.signos_vitales || {},
          observaciones: row.observaciones,
          proximaCita: row.proxima_cita ? new Date(row.proxima_cita).toISOString().split('T')[0] : null,
          estado: "completada",
          archivos: row.archivos_adjuntos || [],
        };
      });

      res.status(200).json(consultasFormateadas);
    });
  });

  // ****************************************************
  // ***** INICIO DEL NUEVO CÓDIGO PARA CREAR CONSULTAS *****
  // ****************************************************

  // --- Endpoint POST /api/consultas ---
  // Crea una nueva historia clínica (consulta)
  router.post('/', (req, res) => {
    console.log("📢 [POST /api/consultas] Petición para crear consulta recibida.");

    // Extraemos todos los datos del cuerpo de la petición (del formulario)
    const {
      mascota_id,
      vet_id,
      fecha_consulta,
      motivo_consulta,
      signos_vitales,
      diagnostico,
      tratamiento,
      medicamentos,
      observaciones,
      proxima_cita
    } = req.body;

    // Validación básica
    if (!mascota_id || !vet_id || !fecha_consulta || !motivo_consulta) {
      return res.status(400).json({ error: "Faltan campos obligatorios (mascota, veterinario, fecha, motivo)." });
    }

    const sql = `
      INSERT INTO historias_clinicas (
        mascota_id, vet_id, fecha_consulta, motivo_consulta, signos_vitales, 
        diagnostico, tratamiento, medicamentos, observaciones, proxima_cita
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Los objetos/arrays deben ser convertidos a string JSON para guardarlos en la BD
    const params = [
      mascota_id,
      vet_id,
      fecha_consulta,
      motivo_consulta,
      JSON.stringify(signos_vitales || {}),
      diagnostico,
      tratamiento,
      JSON.stringify(medicamentos || []),
      observaciones,
      proxima_cita || null
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ Error al insertar en la base de datos:", err);
        return res.status(500).json({ error: "Error interno del servidor al guardar la consulta." });
      }
      console.log("✅ Consulta creada con éxito. ID:", result.insertId);
      res.status(201).json({ message: "Consulta registrada exitosamente", consultaId: result.insertId });
    });
  });

  // ****************************************************
  // ****** FIN DEL NUEVO CÓDIGO PARA CREAR CONSULTAS ******
  // ****************************************************
 // ... (después del bloque de router.post('/') que ya tienes)

  // --- Endpoint PUT /api/consultas/:id ---
  // Actualiza una historia clínica existente
  router.put('/:id', (req, res) => {
    const consultaId = req.params.id;
    console.log(`📢 [PUT /api/consultas/${consultaId}] Petición para actualizar consulta recibida.`);

    const {
      mascota_id,
      vet_id,
      fecha_consulta,
      motivo_consulta,
      signos_vitales,
      diagnostico,
      tratamiento,
      medicamentos,
      observaciones,
      proxima_cita
    } = req.body;

    // Validación
    if (!mascota_id || !vet_id || !fecha_consulta || !motivo_consulta) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const sql = `
      UPDATE historias_clinicas SET
        mascota_id = ?,
        vet_id = ?,
        fecha_consulta = ?,
        motivo_consulta = ?,
        signos_vitales = ?,
        diagnostico = ?,
        tratamiento = ?,
        medicamentos = ?,
        observaciones = ?,
        proxima_cita = ?
      WHERE id = ?
    `;

    const params = [
      mascota_id,
      vet_id,
      fecha_consulta,
      motivo_consulta,
      JSON.stringify(signos_vitales || {}),
      diagnostico,
      tratamiento,
      JSON.stringify(medicamentos || []),
      observaciones,
      proxima_cita || null,
      consultaId // El ID para la cláusula WHERE
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar la base de datos:", err);
        return res.status(500).json({ error: "Error interno del servidor al actualizar la consulta." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No se encontró una consulta con ese ID." });
      }
      console.log(`✅ Consulta con ID ${consultaId} actualizada con éxito.`);
      res.status(200).json({ message: "Consulta actualizada exitosamente." });
    });
  });


  router.delete('/:id', (req, res) => {
    const consultaId = req.params.id;
    console.log(`📢 [DELETE /api/consultas/${consultaId}] Petición para eliminar consulta recibida.`);

    const sql = "DELETE FROM historias_clinicas WHERE id = ?";

    db.query(sql, [consultaId], (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar de la base de datos:", err);
        return res.status(500).json({ error: "Error interno del servidor al eliminar la consulta." });
      }

      // `affectedRows` nos dice si se borró algo. Si es 0, el ID no existía.
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No se encontró una consulta con ese ID." });
      }

      console.log(`✅ Consulta con ID ${consultaId} eliminada con éxito.`);
      res.status(200).json({ message: "Consulta eliminada exitosamente." });
    });
  });
  return router;
};