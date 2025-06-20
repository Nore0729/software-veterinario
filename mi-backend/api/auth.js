// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = function(db) {
  // RUTA: POST /api/auth/login
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    const query = 'SELECT u.* FROM usuarios u INNER JOIN propietarios p ON u.id = p.id_prop WHERE u.email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Error del servidor' });
      if (results.length === 0) return res.status(401).json({ message: 'Correo o contraseña incorrectos o no es propietario' });
      
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });

      return res.status(200).json({ message: 'Login exitoso', nombre: user.nombre, doc: user.doc, email: user.email, rol: 'propietario' });
    });
  });

  // RUTA: POST /api/auth/reset-password
  router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ success: false, message: 'Email y nueva contraseña son requeridos' });
    
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query("CALL ModifyPassword(?, ?)", [email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al actualizar la contraseña' });
        res.status(200).json({ message: 'Tu contraseña fue cambiada correctamente' });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error del servidor al restablecer la contraseña' });
    }
  });

  return router;
};