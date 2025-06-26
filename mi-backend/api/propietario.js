const express = require('express');
const bcrypt = require('bcrypt');

module.exports = function(db) {
  const router = express.Router();

  // ✅ Registro de propietario
  router.post('/registro', (req, res) => {
    const { tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password } = req.body;
    if (!tipo_Doc || !doc || !nombre || !fecha_Nac || !tel || !email || !direccion || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const checkEmailQuery = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Error al validar email' });
      if (results.length > 0) return res.status(400).json({ message: 'El correo ya está registrado' });

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUsuarioQuery = `
          INSERT INTO usuarios (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertUsuarioQuery, [tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword], (err2, results2) => {
          if (err2) return res.status(500).json({ message: 'Error al registrar el usuario' });

          const usuarioId = results2.insertId;
          db.query('INSERT INTO propietarios (id_prop) VALUES (?)', [usuarioId], (err3) => {
            if (err3) return res.status(500).json({ message: 'Usuario creado, pero error al asignar como propietario' });
            return res.status(201).json({ message: 'Propietario registrado exitosamente' });
          });
        });
      } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
      }
    });
  });

  // ✅ Obtener datos del propietario por email
  router.get('/email/:email', (req, res) => {
    const { email } = req.params;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND id IN (SELECT id_prop FROM propietarios)';
    db.query(sql, [email], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al consultar' });
      if (result.length === 0) return res.status(404).json({ error: 'No se encontró el propietario' });
      res.json(result[0]);
    });
  });

  // ✅ Listar todos los propietarios (para desplegable)
  router.get('/', (req, res) => {
    const sql = `
      SELECT u.id, u.nombre, u.doc
      FROM propietarios p
      JOIN usuarios u ON p.id_prop = u.id
      ORDER BY u.nombre ASC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error interno del servidor.' });
      res.status(200).json(results);
    });
  });

  // ✅ Obtener mascotas por documento del propietario
  router.get('/:doc/mascotas', (req, res) => {
    const propietarioDoc = req.params.doc;
    const sql = 'SELECT id, nombre, especie FROM mascotas WHERE doc_pro = ? ORDER BY nombre ASC';
    db.query(sql, [propietarioDoc], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al consultar mascotas' });
      res.status(200).json(results);
    });
  });

  // ✅ Verificar contraseña del propietario
  router.post('/verificar-password', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT password FROM usuarios WHERE email = ?';

    db.query(sql, [email], async (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al consultar la base de datos' });
      if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

      const hashedPassword = result[0].password;
      try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (isMatch) {
          return res.json({ success: true });
        } else {
          return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
      } catch (errCompare) {
        return res.status(500).json({ error: 'Error al comparar contraseñas' });
      }
    });
  });

  // ✅ ACTUALIZAR datos del propietario por email (RUTA CORREGIDA)
  router.put('/email/:email', (req, res) => {
    const emailOriginal = req.params.email;
    const { tel, email, direccion } = req.body;

    if (!tel || !email || !direccion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
      UPDATE usuarios 
      SET tel = ?, email = ?, direccion = ?
      WHERE email = ?`;

    db.query(sql, [tel, email, direccion, emailOriginal], (err, result) => {
      if (err) {
        console.error('❌ Error al actualizar:', err);
        return res.status(500).json({ error: 'Error al actualizar datos' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado o sin cambios' });
      }

      return res.json({ success: true });
    });
  });

  return router;
};
