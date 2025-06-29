// controllers/statusController.js

const {
  obtenerStatusPorId,
  actualizarStatusPorId,
  obtenerTotalStatus
} = require('../models/statusModel')

/**
 * Controlador para obtener el status del usuario autenticado
 */
const getStatus = async (req, res) => {
  try {
    const userId = req.user.id // Asegúrate que middleware de autenticación define req.user
    const status = await obtenerStatusPorId(userId)

    // Retornar solo el estado, o todo el usuario según tu función
    res.json({ status })
  } catch (error) {
    const statusCode = error.code || 500
    res.status(statusCode).json({
      message: error.message || 'Error al obtener el estado'
    })
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
      return res.status(400).json({
        message: 'El campo "status" debe ser booleano'
      })
    }

    const updatedUser = await actualizarStatusPorId(userId, status)

    res.json({
      message: 'Estado actualizado correctamente',
      user: updatedUser
    })
  } catch (error) {
    const statusCode = error.code || 500
    res.status(statusCode).json({
      message: error.message || 'Error al actualizar el estado'
    })
  }
}

/**
 * Controlador para obtener el total de usuarios conectados (status = true)
 */
const getTotalStatus = async (req, res) => {
  try {
    const total = await obtenerTotalStatus()
    res.json({ total })
  } catch (error) {
    const statusCode = error.code || 500
    res.status(statusCode).json({
      message:
        error.message || 'Error al obtener el total de usuarios conectados'
    })
  }
}

module.exports = {
  getStatus,
  updateStatus,
  getTotalStatus
}
