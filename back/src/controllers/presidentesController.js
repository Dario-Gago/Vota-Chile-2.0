const {
  getAllPresidentes,
  actualizarPresidente,
  eliminarPresidente,
  deleteAllPresidentes
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

const eliminarPresidenteController = async (req, res) => {
  try {
    const { id } = req.params

    const presidenteEliminado = await eliminarPresidente(id)
    if (!presidenteEliminado) {
      return res.status(404).json({ message: 'Presidente no encontrado' })
    }

    return res.json({ message: 'Presidente eliminado correctamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error eliminando presidente' })
  }
}
const eliminarTodosPresidentes = async (req, res) => {
  try {
    await deleteAllPresidentes()
    res.status(200).json({ message: 'Todos los presidentes fueron eliminados' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar presidentes' })
  }
}
module.exports = {
  obtenerPresidentes,
  updatePresidente,
  eliminarPresidenteController,
  eliminarTodosPresidentes
}
