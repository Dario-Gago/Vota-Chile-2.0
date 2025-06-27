// controllers/statusController.js

const {
  obtenerStatusPorId,
  actualizarStatusPorId
} = require('../models/statusModel')

/**
 * Controlador para obtener el status del usuario autenticado
 */
const getStatus = async (req, res) => {
  try {
    const userId = req.user.id // Asegúrate de que el middleware de autenticación lo esté definiendo
    const status = await obtenerStatusPorId(userId)
    res.json({ status })
  } catch (error) {
    const statusCode = error.code || 500
    res
      .status(statusCode)
      .json({ message: error.message || 'Error al obtener el estado' })
  }
}

/**
 * Controlador para actualizar el status del usuario autenticado
 */
const updateStatus = async (req, res) => {
  try {
    const userId = req.user.id
    const { status } = req.body

    if (typeof status !== 'boolean') {
      return res
        .status(400)
        .json({ message: 'El campo "status" debe ser booleano' })
    }

    const updatedUser = await actualizarStatusPorId(userId, status)
    res.json({ message: 'Estado actualizado correctamente', user: updatedUser })
  } catch (error) {
    const statusCode = error.code || 500
    res
      .status(statusCode)
      .json({ message: error.message || 'Error al actualizar el estado' })
  }
}

module.exports = {
  getStatus,
  updateStatus
}
