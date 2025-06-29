const express = require('express')
const router = express.Router()
const { getTitulo, putTitulo } = require('..//src/controllers/tituloController')

// Middleware opcional para proteger PUT si deseas autenticar (ej: JWT)
const verifyToken = require('../middleware/authMiddleware')

// Obtener el título
router.get('/', getTitulo)

// Actualizar el título (requiere token)
router.put('/', verifyToken, putTitulo)

module.exports = router
