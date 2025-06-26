// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const { login } = require('../src/controllers/authController')

router.post('/', login)

module.exports = router
