// models/votacionesModel.js
const { pool } = require('../../db/connection')

// Verifica si el RUT ya ha votado
const verificarSiVoto = async (rut) => {
  const { rows } = await pool.query(
    'SELECT * FROM votos_usuarios WHERE rut = $1',
    [rut]
  )
  return rows.length > 0
}

// Registra el voto
const registrarVoto = async (rut, presidenteId) => {
  await pool.query(
    'INSERT INTO votos_usuarios (rut, presidente_id) VALUES ($1, $2)',
    [rut, presidenteId]
  )
}

// Suma un voto al presidente
const incrementarVotoPresidente = async (presidenteId) => {
  await pool.query('UPDATE presidentes SET votos = votos + 1 WHERE id = $1', [
    presidenteId
  ])
}

// Obtener votos del usuario por RUT
const obtenerVotosPorRut = async (rut) => {
  try {
    const query = `
      SELECT
        vu.id as voto_id,
        vu.rut,
        p.id as presidente_id,
        p.nombre as presidente_nombre,
        p.descripcion as presidente_descripcion,
        p.votos as total_votos_presidente
      FROM votos_usuarios vu
      INNER JOIN presidentes p ON vu.presidente_id = p.id
      WHERE vu.rut = $1
    `
    const { rows } = await pool.query(query, [rut])
    return rows
  } catch (error) {
    console.error('Error en obtenerVotosPorRut:', error)
    throw error
  }
}

module.exports = {
  verificarSiVoto,
  registrarVoto,
  incrementarVotoPresidente,
  obtenerVotosPorRut
}
