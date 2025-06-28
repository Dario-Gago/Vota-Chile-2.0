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
const eliminarPresidente = async (id) => {
  const query = 'DELETE FROM presidentes WHERE id = $1 RETURNING *'
  const { rows } = await pool.query(query, [id])
  return rows[0] // devuelve el presidente eliminado o undefined si no existe
}
const deleteAllPresidentes = async () => {
  const query = 'DELETE FROM presidentes' // elimina todas las filas
  await pool.query(query)
}
const crearPresidenteVacio = async () => {
  const query = `
    INSERT INTO presidentes (nombre, descripcion, votos)
    VALUES ('', '', 0)
    RETURNING *;
  `
  const { rows } = await pool.query(query)
  return rows[0]
}
module.exports = {
  getAllPresidentes,
  actualizarPresidente,
  eliminarPresidente,
  deleteAllPresidentes,
  crearPresidenteVacio
}
