// routes/fecha.routes.js
const express = require('express')
const router = express.Router()
const verificarToken = require('../middleware/authMiddleware')

const {
  getFechaEvento,
  updateFechaEvento
} = require('../src/controllers/fechaController')

// GET /evento
router.get('/', verificarToken, getFechaEvento)

// PUT /evento
router.put('/', verificarToken, updateFechaEvento)

module.exports = router
