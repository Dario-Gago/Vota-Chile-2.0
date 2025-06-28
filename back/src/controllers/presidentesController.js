const {
  getAllPresidentes,
  actualizarPresidente
} = require('../models/presidentesModel')

// Controlador para obtener la lista de presidentes
const obtenerPresidentes = async (req, res) => {
  try {
    const presidentes = await getAllPresidentes()
    res.json(presidentes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener presidentes' })
  }
}
const updatePresidente = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body

  try {
    const result = await actualizarPresidente(id, nombre, descripcion)

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Presidente no encontrado' })
    }

    res.json({
      message: 'Presidente actualizado correctamente',
      presidente: result.rows[0]
    })
  } catch (error) {
    console.error('Error al actualizar presidente:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
module.exports = {
  obtenerPresidentes,
  updatePresidente
}
