const express = require('express')
const router = express.Router()
const {
  crearUsuario,
  mostrarUsuario,
  obtenerInfoUsuario
} = require('../src/controllers/usuariosController')
const verificarToken = require('..//middleware/authMiddleware')

router.post('/', crearUsuario)
router.get('/', verificarToken, mostrarUsuario)
router.get('/info', verificarToken, obtenerInfoUsuario)

module.exports = router
