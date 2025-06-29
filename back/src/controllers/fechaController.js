const {
  obtenerFechaEvento,
  actualizarFechaEvento
} = require('../models/fechaModel')

// Controller para obtener la fecha del evento
const getFechaEvento = async (req, res) => {
  try {
    const fechaEvento = await obtenerFechaEvento()
    res.json({
      success: true,
      fecha: fechaEvento.fecha_inicio
    })
  } catch (error) {
    console.error('Error en getFechaEvento:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener la fecha del evento',
      error: error.message
    })
  }
}

// Controller para actualizar la fecha del evento
const updateFechaEvento = async (req, res) => {
  try {
    // FIX: Change to match frontend request body
    const { fecha_inicio } = req.body

    // Validar que se envió una fecha
    if (!fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      })
    }

    // Validar que la fecha sea válida
    const nuevaFecha = new Date(fecha_inicio)
    if (isNaN(nuevaFecha.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido'
      })
    }

    // Removed validation for past dates - now allows any valid date

    await actualizarFechaEvento(nuevaFecha)

    res.json({
      success: true,
      message: 'Fecha del evento actualizada correctamente',
      fecha: nuevaFecha
    })
  } catch (error) {
    console.error('Error en updateFechaEvento:', error)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la fecha del evento',
      error: error.message
    })
  }
}

module.exports = {
  getFechaEvento,
  updateFechaEvento
}
