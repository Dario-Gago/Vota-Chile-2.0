const express = require('express')
const router = express.Router()
const {
  votar,
  getVotosPorRut
} = require('../src/controllers/votacionesController')
const verificarToken = require('../middleware/authMiddleware')

// POST /votaciones/:id/votar
router.post('/:id/votar', verificarToken, votar)

// GET /votaciones/mis-votos
router.get('/:rut', verificarToken, getVotosPorRut)

module.exports = router
