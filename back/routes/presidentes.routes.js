const express = require('express')
const router = express.Router()
const {
  obtenerPresidentes,
  updatePresidente,
  eliminarPresidenteController,
  eliminarTodosPresidentes
} = require('../src/controllers/presidentesController')
const verificarToken = require('../middleware/authMiddleware')
router.get('/', verificarToken, obtenerPresidentes)
router.put('/:id', verificarToken, updatePresidente)
router.delete('/:id', verificarToken, eliminarPresidenteController)
router.delete('/', verificarToken, eliminarTodosPresidentes)

module.exports = router
