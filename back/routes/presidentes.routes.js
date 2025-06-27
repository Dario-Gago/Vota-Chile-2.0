const express = require('express')
const router = express.Router()
const {
  obtenerPresidentes
} = require('../src/controllers/presidentesController')

router.get('/', obtenerPresidentes)

module.exports = router
