const {
  obtenerTitulo,
  actualizarTitulo,
  crearTituloInicial
} = require('../models/tituloModel')

// Asegurar que la fila con id=1 exista al iniciar
crearTituloInicial()

const getTitulo = async (req, res) => {
  try {
    const titulo = await obtenerTitulo()
    res.json(titulo)
  } catch (error) {
    console.error('Error al obtener el título:', error)
    res.status(500).json({ message: 'Error al obtener el título' })
  }
}

const putTitulo = async (req, res) => {
  try {
    const { titulo } = req.body
    if (!titulo) {
      return res.status(400).json({ message: 'El título es requerido' })
    }

    const actualizado = await actualizarTitulo(titulo)
    res.json(actualizado)
  } catch (error) {
    console.error('Error al actualizar el título:', error)
    res.status(500).json({ message: 'Error al actualizar el título' })
  }
}

module.exports = {
  getTitulo,
  putTitulo
}
