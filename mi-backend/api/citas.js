// Librarys 
const { Router } = require('express');

// Vars 
const Route = Router();

// Routes 
Route.use('/register', () => {
    // Vars 
    const data = req.body;

    // Verify 
    if (!data) return res.status(400).json({ message: 'Todos los campos son obligatorios' })

    
})

// Export Router
module.exports = Route