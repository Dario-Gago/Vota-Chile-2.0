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

module.exports = {
  obtenerStatusPorId,
  actualizarStatusPorId
}
