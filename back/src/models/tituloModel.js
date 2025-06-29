const { pool } = require('../../db/connection') // o puede ser './db' o '../db' según tu estructura

// Obtener el título actual (asume solo una fila con id = 1)
const obtenerTitulo = async () => {
  const result = await pool.query('SELECT titulo FROM elecciones WHERE id = 1')
  return result.rows[0]
}

// Actualizar el título
const actualizarTitulo = async (nuevoTitulo) => {
  const result = await pool.query(
    'UPDATE elecciones SET titulo = $1 WHERE id = 1 RETURNING titulo',
    [nuevoTitulo]
  )
  return result.rows[0]
}

// Crear el título inicial si no existe
const crearTituloInicial = async () => {
  const result = await pool.query('SELECT * FROM elecciones WHERE id = 1')
  if (result.rows.length === 0) {
    await pool.query('INSERT INTO elecciones (id, titulo) VALUES (1, $1)', [
      'Título por defecto'
    ])
  }
}

module.exports = {
  obtenerTitulo,
  actualizarTitulo,
  crearTituloInicial
}
