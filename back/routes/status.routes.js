// routes/status.routes.js
const express = require('express')
const router = express.Router()
const {
  getStatus,
  updateStatus
} = require('../src/controllers/statusController')
const verificarToken = require('../middleware/authMiddleware')
// GET /status -> obtener estado del usuario
router.get('/', verificarToken, getStatus)

// PUT /status -> actualizar estado del usuario
router.put('/', verificarToken, updateStatus)

module.exports = router
