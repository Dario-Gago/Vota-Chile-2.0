const { registrarUsuario, getUserByEmail } = require('../models/usuariosModel')

const crearUsuario = async (req, res) => {
  try {
    await registrarUsuario(req.body)
    res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    const status = error.code || 500
    res
      .status(status)
      .json({ message: error.message || 'Error interno del servidor' })
  }
}
const mostrarUsuario = async (req, res) => {
  try {
    const usuario = await getUserByEmail(req.email)
    // No devuelvas la contraseña
    delete usuario.password
    res.json([usuario])
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || 'Error al obtener usuario' })
  }
}
module.exports = { crearUsuario, mostrarUsuario }
