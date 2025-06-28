const {
  registrarUsuario,
  getUserByEmail,
  getUserById
} = require('../models/usuariosModel')

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
    const usuario = await getUserByEmail(req.user.email)
    // No devuelvas la contraseña
    delete usuario.password
    res.json([usuario])
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || 'Error al obtener usuario' })
  }
}
const obtenerInfoUsuario = async (req, res) => {
  try {
    const usuario = await getUserById(req.user.id)

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json(usuario)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error al obtener información del usuario' })
  }
}
module.exports = { crearUsuario, mostrarUsuario, obtenerInfoUsuario }
