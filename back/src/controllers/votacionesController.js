const {
  verificarSiVoto,
  registrarVoto,
  incrementarVotoPresidente,
  obtenerVotosPorRut
} = require('../models/votacionesModel')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'

const { getUserById } = require('../models/usuariosModel')

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
    console.error('Error al votar:', error)
    res.status(500).json({ message: 'Error interno al votar' })
  }
}
const getVotosPorRut = async (req, res) => {
  try {
    const { rut } = req.params

    if (!rut) {
      return res.status(400).json({ message: 'RUT es requerido' })
    }

    const votos = await obtenerVotosPorRut(rut)

    if (votos.length === 0) {
      return res
        .status(404)
        .json({ message: 'No se encontraron votos para este RUT' })
    }

    return res.json(votos)
  } catch (error) {
    console.error('Error en getVotosPorRut:', error)
    return res.status(500).json({ message: 'Error al obtener los votos' })
  }
}
// Obtener los votos del usuario autenticado

module.exports = {
  votar,
  getVotosPorRut
}
