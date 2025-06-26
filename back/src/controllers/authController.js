const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') // Cambiado a bcryptjs
const { getUserByEmail } = require('../models/usuariosModel')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'

const verificarCredenciales = async (email, password) => {
  const usuario = await getUserByEmail(email)
  const passwordValida = await bcrypt.compare(password, usuario.password)
  if (!passwordValida) {
    throw { code: 401, message: 'Credenciales incorrectas' }
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    await verificarCredenciales(email, password)

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30s' })

    res.send({ token })
  } catch (error) {
    console.error('Error en login:', error)
    res
      .status(error.code || 500)
      .json({ message: error.message || 'Error interno del servidor' })
  }
}

module.exports = { login }
