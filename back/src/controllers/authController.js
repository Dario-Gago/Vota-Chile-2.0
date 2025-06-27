const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUserByEmail } = require('../models/usuariosModel')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'

// ✅ Ahora devuelve el usuario si la contraseña es válida
const verificarCredenciales = async (email, password) => {
  const usuario = await getUserByEmail(email)
  const passwordValida = await bcrypt.compare(password, usuario.password)
  if (!passwordValida) {
    throw { code: 401, message: 'Credenciales incorrectas' }
  }
  return usuario // 👈 importante
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const usuario = await verificarCredenciales(email, password)

    // ✅ Incluir id en el payload del token
    const token = jwt.sign(
      {
        id: usuario.id, // 👈 necesario para usar req.user.id
        email: usuario.email // opcional
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
