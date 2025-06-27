const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'az_AZ'

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1] // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Formato del token inválido' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload // 👈 ahora podrás usar req.user.id o req.user.email
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

module.exports = verificarToken
