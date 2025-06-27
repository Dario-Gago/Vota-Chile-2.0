const { getAllPresidentes } = require('../models/presidentesModel')

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

module.exports = {
  obtenerPresidentes
}
