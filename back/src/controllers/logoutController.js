const jwt = require('jsonwebtoken')
const { setUserStatusFalse } = require('../models/usuariosModel')
const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'

const logoutAuto = async (req, res) => {
  try {
    const { token } = JSON.parse(req.body)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id
    await setUserStatusFalse(userId)
    res.sendStatus(200)
  } catch (error) {
    console.error('Error en logout-auto:', error)
    res.sendStatus(400)
  }
}

module.exports = {
  logoutAuto
}
