// Ajusta esta ruta según tu estructura de carpetas
const { pool } = require('../../db/connection') // o puede ser './db' o '../db' según tu estructura

const obtenerStatusPorId = async (id) => {
  const result = await pool.query('SELECT status FROM usuarios WHERE id = $1', [
    id
  ])
  if (result.rowCount === 0)
    throw { code: 404, message: 'Usuario no encontrado' }
  return result.rows[0].status
}

const actualizarStatusPorId = async (id, status) => {
  const result = await pool.query(
    'UPDATE usuarios SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  )
  if (result.rowCount === 0)
    throw { code: 404, message: 'Usuario no encontrado' }
  return result.rows[0]
}
const obtenerTotalStatus = async () => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM usuarios WHERE status = TRUE'
  )
  const total = parseInt(result.rows[0].count, 10) // count viene como string
  if (total === 0) {
    throw { code: 404, message: 'No hay usuarios conectados' }
  }
  return total // Devuelve solo el número total
}

module.exports = {
  obtenerStatusPorId,
  actualizarStatusPorId,
  obtenerTotalStatus
}
