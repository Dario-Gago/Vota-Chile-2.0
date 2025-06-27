const {
  verificarSiVoto,
  registrarVoto,
  incrementarVotoPresidente
} = require('../models/votacionesModel')

const { getUserById } = require('../models/usuariosModel') // debes tener esta función

const votar = async (req, res) => {
  try {
    const presidenteId = req.params.id
    const userId = req.user.id
    const usuario = await getUserById(userId)

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const yaVoto = await verificarSiVoto(usuario.rut)
    if (yaVoto) {
      return res.status(400).json({ message: 'Ya has votado' })
    }

    await registrarVoto(usuario.rut, presidenteId)
    await incrementarVotoPresidente(presidenteId)

    res.status(200).json({ message: 'Voto registrado con éxito' })
  } catch (error) {
    console.error('Error al votar:', error) // <--- Agrega esta línea
    res.status(500).json({ message: 'Error interno al votar' })
  }
}

module.exports = {
  votar
}
