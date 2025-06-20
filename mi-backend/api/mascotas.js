const express = require('express');
const router = express.Router();

/**
 * Esta función exporta un router de Express con las rutas relacionadas a las mascotas.
 * @param {object} db - La conexión a la base de datos que se usará para las consultas.
 * @returns {object} El router de Express configurado.
 */
module.exports = function(db) {
    /**
     * @route POST /api/mascotas/registro
     * @description Registra una nueva mascota en la base de datos.
     */
    router.post('/registro', (req, res) => {
        const {
            doc_pro,
            nombre,
            especie,
            raza,
            genero,
            color,
            fecha_nac,
            peso,
            tamano,
            estado_reproductivo,
            vacunado,
            observaciones
        } = req.body;

        // Validación de campos obligatorios según la estructura de la tabla
        if (!doc_pro || !nombre || !especie || !raza || !genero || !fecha_nac || !tamano || !estado_reproductivo) {
            return res.status(400).json({ error: 'Faltan campos obligatorios para registrar la mascota.' });
        }

        const query = `
            INSERT INTO mascotas (
                doc_pro, nombre, especie, raza, genero, color, fecha_nac, 
                peso, tamano, estado_reproductivo, vacunado, observaciones
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            doc_pro, nombre, especie, raza, genero, color, fecha_nac, peso,
            tamano, estado_reproductivo,
            vacunado === true || vacunado === 'true' ? 1 : 0,
            observaciones
        ];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al registrar la mascota:', err);
                return res.status(500).json({ error: 'Hubo un problema en el servidor al registrar la mascota.' });
            }
            res.status(201).json({
                message: 'Mascota registrada exitosamente',
                mascotaId: result.insertId
            });
        });
    });

    /**
     * @route GET /api/mascotas/propietario/:doc_pro
     * @description Obtiene todas las mascotas asociadas a un documento de propietario.
     */
    router.get('/propietario/:doc_pro', (req, res) => {
        const { doc_pro } = req.params;

        if (!doc_pro) {
            return res.status(400).json({ error: 'El documento del propietario es obligatorio.' });
        }

        const query = 'SELECT * FROM mascotas WHERE doc_pro = ?';

        db.query(query, [doc_pro], (err, results) => {
            if (err) {
                console.error('Error al buscar mascotas:', err);
                return res.status(500).json({ error: 'Error en el servidor al obtener las mascotas.' });
            }
            res.json(results);
        });
    });

    return router;
};

