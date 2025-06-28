const express = require('express')
const router = express.Router()
const { logoutAuto } = require('../src/controllers/logoutController')

router.post('/', express.text(), logoutAuto)

module.exports = router
