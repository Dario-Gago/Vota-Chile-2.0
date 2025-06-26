const express = require('express')
const router = express.Router()
const {
  crearUsuario,
  mostrarUsuario
} = require('../src/controllers/usuariosController')
const verificarToken = require('..//middleware/authMiddleware')

router.post('/', crearUsuario)
router.get('/', verificarToken, mostrarUsuario)

module.exports = router
