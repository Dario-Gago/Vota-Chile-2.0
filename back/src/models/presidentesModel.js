const { pool } = require('../../db/connection')

// Obtener todos los presidentes
const getAllPresidentes = async () => {
  const result = await pool.query('SELECT * FROM presidentes ORDER BY id')
  return result.rows
}

module.exports = {
  getAllPresidentes
}
