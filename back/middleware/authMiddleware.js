const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'
const { actualizarStatusPorId } = require('../src/models/statusModel')

const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Formato del token inválido' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        const decoded = jwt.decode(token) // Decodifica sin verificar
        const userId = decoded?.id
        if (userId) {
          await actualizarStatusPorId(userId, false) // 👈 Aquí actualizas el status
          console.log(
            `Token expirado. Status actualizado para usuario ${userId}`
          )
        }
      } catch (e) {
        console.error('Error actualizando status al expirar el token:', e)
      }
      return res.status(401).json({ message: 'Token expirado' })
    }

    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

module.exports = verificarToken
