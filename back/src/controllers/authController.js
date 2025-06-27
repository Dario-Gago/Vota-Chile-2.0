const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
  getUserByEmail,
  actualizarStatusPorId
} = require('../models/usuariosModel') // 👈 importa esta función
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'

const verificarCredenciales = async (email, password) => {
  const usuario = await getUserByEmail(email)
  const passwordValida = await bcrypt.compare(password, usuario.password)
  if (!passwordValida) {
    throw { code: 401, message: 'Credenciales incorrectas' }
  }
  return usuario
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const usuario = await verificarCredenciales(email, password)

    // ✅ Cambiar status a true al loguearse
    await actualizarStatusPorId(usuario.id, true)

    // Generar el token con el ID del usuario
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      JWT_SECRET,
      { expiresIn: '5m' }
    )

    res.send({ token })
  } catch (error) {
    console.error('Error en login:', error)
    res
      .status(error.code || 500)
      .json({ message: error.message || 'Error interno del servidor' })
  }
}

module.exports = { login }
