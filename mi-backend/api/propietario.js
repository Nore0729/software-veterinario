// routes/propietarios.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();


module.exports = function(db) {
  // RUTA: POST /api/propietarios/registro (Tu código original - sin cambios)
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
        const insertUsuarioQuery = `INSERT INTO usuarios (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertUsuarioQuery, [tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword], (err2, results2) => {
          if (err2) return res.status(500).json({ message: 'Hubo un problema al registrar el usuario' });
          
          const usuarioId = results2.insertId;
          db.query('INSERT INTO propietarios (id_prop) VALUES (?)', [usuarioId], (err3) => {
            if (err3) return res.status(500).json({ message: 'Usuario creado pero hubo un problema al asignar como propietario' });
            return res.status(201).json({ message: 'Propietario registrado exitosamente' });
          });
        });
      } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
      }
    });
  });

  // RUTA: GET /api/propietarios/email/:email (Tu código original - sin cambios)
  router.get('/email/:email', (req, res) => {
    const { email } = req.params;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND id IN (SELECT id_prop FROM propietarios)';
    db.query(sql, [email], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al consultar' });
      if (result.length === 0) return res.status(404).json({ error: 'No se encontró el propietario' });
      res.json(result[0]);
    });
  });

  // *******************************************************************
  // ** RUTAS NUEVAS AÑADIDAS                    **
  // *******************************************************************

  // RUTA NUEVA: GET /api/propietarios (para listar todos en el desplegable)
  router.get('/', (req, res) => {
    console.log("📢 [GET /api/propietarios] Petición de lista de propietarios.");
    
    const sql = `
      SELECT 
        u.id, 
        u.nombre, 
        u.doc 
      FROM propietarios p
      JOIN usuarios u ON p.id_prop = u.id
      ORDER BY u.nombre ASC;
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Error al consultar la lista de propietarios:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
      res.status(200).json(results);
    });
  });

  // RUTA NUEVA: GET /api/propietarios/:doc/mascotas (para filtrar mascotas)
  router.get('/:doc/mascotas', (req, res) => {
    const propietarioDoc = req.params.doc;
    console.log(`📢 [GET /api/propietarios/${propietarioDoc}/mascotas] Petición de mascotas por propietario.`);

    const sql = "SELECT id, nombre, especie FROM mascotas WHERE doc_pro = ? ORDER BY nombre ASC";
    
    db.query(sql, [propietarioDoc], (err, results) => {
      if (err) {
        console.error(`❌ Error al consultar las mascotas del propietario ${propietarioDoc}:`, err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
      console.log(`✅ Se encontraron ${results.length} mascotas para el propietario ${propietarioDoc}.`);
      res.status(200).json(results);
    });
  });


  router.post('/verificar-password', (req, res) => {
    const { email, password } = req.body;
    
    const sql = 'SELECT password FROM usuarios WHERE email = ?';
    db.query(sql, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al consultar la base de datos' });
      }
    
      if (result.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
    
      const hashedPassword = result[0].password;
      console.log('🔑 Password recibido:', password);
      console.log('🔐 Hash almacenado en la BD:', hashedPassword);
    
      bcrypt.compare(password, hashedPassword, (errCompare, isMatch) => {
        if (errCompare) {
          return res.status(500).json({ error: 'Error al comparar contraseñas' });
        }
    
        if (isMatch) {
          res.json({ success: true });
        } else {
          res.status(401).json({ error: 'Contraseña incorrecta' });
        }
      });
    });
  });

  return router;
};