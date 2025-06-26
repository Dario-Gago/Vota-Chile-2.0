const { pool } = require('../../db/connection')
const bcrypt = require('bcryptjs') // Cambiado a bcryptjs

const registrarUsuario = async ({ email, password, rut, admin }) => {
  const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [
    email
  ])
  if (existe.rowCount > 0) {
    throw { code: 400, message: 'El email ya está registrado' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const query =
    'INSERT INTO usuarios (email, password, rut, admin) VALUES ($1, $2, $3, $4)'
  const values = [email, hashedPassword, rut, admin]
  await pool.query(query, values)
}

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1'
  const values = [email]
  const result = await pool.query(query, values)

  if (result.rows.length === 0) {
    throw { code: 401, message: 'Credenciales incorrectas' }
  }

  return result.rows[0]
}

module.exports = { registrarUsuario, getUserByEmail }
