const express = require('express')
const router = express.Router()
const { votar } = require('../src/controllers/votacionesController')
const verificarToken = require('../middleware/authMiddleware')

// POST /votaciones/:id/votar
router.post('/:id/votar', verificarToken, votar)

module.exports = router
