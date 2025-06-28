const { pool } = require('../../db/connection')

// Obtener todos los presidentes
const getAllPresidentes = async () => {
  const result = await pool.query('SELECT * FROM presidentes ORDER BY id')
  return result.rows
}

const actualizarPresidente = async (id, nombre, descripcion) => {
  const result = await pool.query(
    'UPDATE presidentes SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
    [nombre, descripcion, id]
  )
  return result
}

module.exports = {
  getAllPresidentes,
  actualizarPresidente
}
