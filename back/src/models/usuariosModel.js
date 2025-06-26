const { pool } = require('../../db/connection')
const bcrypt = require('bcryptjs')

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1'
  const result = await pool.query(query, [email])
  if (result.rows.length === 0) {
    throw { code: 401, message: 'Credenciales incorrectas' }
  }
  return result.rows[0]
}

const getUserByRut = async (rut) => {
  const query = 'SELECT * FROM usuarios WHERE rut = $1'
  const result = await pool.query(query, [rut])
  if (result.rows.length > 0) {
    throw { code: 400, message: 'El RUT ya está registrado' }
  }
}

const registrarUsuario = async ({ email, password, rut, admin }) => {
  const existeEmail = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  )
  if (existeEmail.rowCount > 0) {
    throw { code: 400, message: 'El email ya está registrado' }
  }

  await getUserByRut(rut) // ⬅️ Verifica si el RUT ya existe

  const hashedPassword = await bcrypt.hash(password, 10)
  const query =
    'INSERT INTO usuarios (email, password, rut, admin) VALUES ($1, $2, $3, $4)'
  const values = [email, hashedPassword, rut, admin]
  await pool.query(query, values)
}

module.exports = { registrarUsuario, getUserByEmail, getUserByRut }
