const express = require('express')
const router = express.Router()
const {
  obtenerPresidentes,
  updatePresidente
} = require('../src/controllers/presidentesController')

router.get('/', obtenerPresidentes)
router.put('/:id', updatePresidente)

module.exports = router
