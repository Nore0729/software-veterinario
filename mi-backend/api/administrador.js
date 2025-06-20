// routes/admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = function(db) {
    // --- GESTIÓN DE ROLES ---
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

    // --- GESTIÓN DE SERVICIOS ---
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

    return router;
}