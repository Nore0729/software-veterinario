// routes/admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = function (db) {
    // --- GESTIÓN DE ROLES ---
    // (Tu código de roles va aquí... sin cambios)
    router.post('/roles', (req, res) => {
        const { nom_rol, descripcion } = req.body;
        if (!nom_rol || !descripcion) return res.status(400).send("Todos los campos son obligatorios");
        const query = 'INSERT INTO roles (nom_rol, descripcion) VALUES (?, ?)';
        db.query(query, [nom_rol, descripcion], (err, results) => {
            if (err) return res.status(500).json({ message: "Hubo un problema al registrar el rol" });
            res.status(201).json({ id: results.insertId, nom_rol, descripcion });
        });
    });

    router.get('/roles', (req, res) => {
        db.query("SELECT id, nom_rol, descripcion FROM roles", (err, results) => {
            if (err) return res.status(500).json({ message: "Hubo un problema al obtener los roles" });
            res.status(200).json(results);
        });
    });

    router.put('/roles/:id', (req, res) => {
        const { id } = req.params;
        const { nom_rol, descripcion } = req.body;
        if (!nom_rol) return res.status(400).json({ message: "El nombre del rol es obligatorio" });
        const query = "UPDATE roles SET nom_rol = ?, descripcion = ? WHERE id = ?";
        db.query(query, [nom_rol, descripcion, id], (err, result) => {
            if (err) return res.status(500).json({ message: "Error al actualizar el rol" });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Rol no encontrado" });
            res.status(200).json({ message: "Rol actualizado correctamente" });
        });
    });

    router.delete('/roles/:id', (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM roles WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Rol no encontrado" });
            res.json({ message: "Rol eliminado", id });
        });
    });

    // --- GESTIÓN DE USUARIOS (NUEVO) ---
    router.post('/usuarios', async (req, res) => {
        const { tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password } = req.body;

        if (!tipo_Doc || !doc || !nombre || !fecha_Nac || !tel || !email || !direccion || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = `
                INSERT INTO usuarios (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword];

            db.query(query, values, (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: "El documento o correo electrónico ya se encuentra registrado." });
                    }
                    console.error("Error al registrar usuario:", err);
                    return res.status(500).json({ message: "Hubo un problema al registrar el usuario." });
                }
                
                res.status(201).json({ message: "Usuario registrado exitosamente", userId: results.insertId });
            });

        } catch (error) {
            console.error("Error al hashear la contraseña:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    });

    // --- GESTIÓN DE SERVICIOS ---
    // (Tu código de servicios va aquí... sin cambios)
    router.post('/servicios', (req, res) => {
        const { nombre, descripcion, precio, duracion_estimada } = req.body;
        if (!nombre || !descripcion || !precio || !duracion_estimada) return res.status(400).send("Todos los campos son obligatorios");
        const query = 'INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada) VALUES (?, ?, ?, ?)';
        db.query(query, [nombre, descripcion, precio, duracion_estimada], (err) => {
            if (err) return res.status(500).json({ message: "Hubo un problema al registrar el servicio" });
            res.status(201).json({ message: "Servicio registrado exitosamente" });
        });
    });

    router.get('/servicios', (req, res) => {
        db.query("SELECT * FROM servicios", (err, results) => {
            if (err) return res.status(500).json({ message: "Hubo un problema al obtener los servicios" });
            res.status(200).json(results);
        });
    });

    router.delete('/servicios/:id', (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM servicios WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Servicio no encontrado" });
            res.json({ message: "Servicio eliminado", id });
        });
    });

    //*********************************************************************/
    //********************GESTION DE REGISTRAR USUARIOS********************/
    //*********************************************************************/

    router.post('/usuarios', async (req, res) => {
        const { tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password } = req.body;
        if (!tipo_Doc || !doc || !nombre || !fecha_Nac || !tel || !email || !direccion || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `
                INSERT INTO usuarios
                (tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, password) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(query, [tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion, hashedPassword], (err, results) => {
                if (err) {
                    console.error("Error al insertar los datos:", err);
                    return res.status(500).json({ message: "Hubo un problema al registrar al usuario" });
                }
                res.status(201).json({ message: "Usuario registrado exitosamente" });
            });
        } catch (error) {
            console.error("Error al encriptar la contraseña:", error);
            return res.status(500).json({ message: "Error del servidor" });
        }
    });

    //****************************************************************************/
    //**************TRAER LA CANTIDAD DE USUARIO REGISTRADOS**********************/
    //****************************************************************************/

    router.get("/usuarios_registrados", (req, res) => {
        const query = "SELECT COUNT(*) AS total_usuarios FROM usuarios;";

        db.query(query, (err, results) => {
            if (err) {
                console.error("Error al obtener la cantidad de usuarios:", err);
                return res.status(500).json({ message: "Hubo un problema al obtener los usuarios" });
            }
            res.status(200).json(results);
        });
    });

    //**************************************************************************/
    //****************TRAER USUARIOS REGISTRADOS PARA ASIGNAR ROL************* */
    //**************************************************************************/

    router.get("/obtener_Usuarios", async (req, res) => {
        try {
            const query = "SELECT id, tipo_Doc, doc, nombre, fecha_Nac, tel, email, direccion FROM usuarios";
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error al obtener la cantidad de usuarios:", err);
                    return res.status(500).json({ message: "Hubo un problema al obtener los usuarios" });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).json({ message: "Error del servidor al obtener los usuarios" });
        }
    });

    //**************************************************************************/
    //***************************ASIRNAR ROL A USUARIO************************ */
    //**************************************************************************/

    router.post('/asignar_roles/:usuarioId', async (req, res) => {
        const { rolesSeleccionados, asignado_por } = req.body; // rolesSeleccionados es un array de ids de roles
      
        const usuarioId = req.params.usuarioId;
      
        // Verificamos que los rolesSeleccionados no estén vacíos
        if (!rolesSeleccionados || rolesSeleccionados.length === 0) {
          return res.status(400).json({ error: 'Se deben seleccionar al menos un rol' });
        }
        try {
          for (const rol_id of rolesSeleccionados) {
            const query = `
              INSERT INTO asignacion_roles (usu_id, rol_id, asignado_por)
              VALUES (?, ?, ?)
            `;
            
            await pool.promise().query(query, [usuarioId, rol_id, asignado_por]);
          }
      
          res.status(200).json({ message: 'Roles asignados correctamente' });
        } catch (error) {
          console.error('Error al asignar roles:', error);
          res.status(500).json({ error: 'Hubo un error al asignar los roles' });
        }
      });


    return router;
}