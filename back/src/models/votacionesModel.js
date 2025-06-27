// models/votacionesModel.js
const { pool } = require('../../db/connection')

// models/votacionesModel.js
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

module.exports = {
  verificarSiVoto,
  registrarVoto,
  incrementarVotoPresidente
}
