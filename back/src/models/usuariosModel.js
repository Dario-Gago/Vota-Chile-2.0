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

const getUserByNombreUsuario = async (nombre_usuario) => {
  const query = 'SELECT * FROM usuarios WHERE nombre_usuario = $1'
  const result = await pool.query(query, [nombre_usuario])
  if (result.rows.length > 0) {
    throw { code: 400, message: 'El nombre de usuario ya está en uso' }
  }
}

const registrarUsuario = async ({
  email,
  password,
  rut,
  nombre_usuario,
  admin
}) => {
  const existeEmail = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  )
  if (existeEmail.rowCount > 0) {
    throw { code: 400, message: 'El email ya está registrado' }
  }

  await getUserByRut(rut) // ⬅️ Verifica si el RUT ya existe
  await getUserByNombreUsuario(nombre_usuario) // ⬅️ Verifica si el nombre de usuario ya existe

  const hashedPassword = await bcrypt.hash(password, 10)
  const query =
    'INSERT INTO usuarios (email, password, rut, nombre_usuario, admin) VALUES ($1, $2, $3, $4, $5)'
  const values = [email, hashedPassword, rut, nombre_usuario, admin]
  await pool.query(query, values)
}
const actualizarStatusPorId = async (id, status) => {
  await pool.query('UPDATE usuarios SET status = $1 WHERE id = $2', [
    status,
    id
  ])
}
const getUserById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, nombre_usuario, email, rut, admin, status FROM usuarios WHERE id = $1',
    [id]
  )
  return rows[0]
}

const setUserStatusFalse = async (userId) => {
  await pool.query('UPDATE usuarios SET status = false WHERE id = $1', [userId])
}

module.exports = {
  registrarUsuario,
  getUserByEmail,
  getUserByRut,
  getUserByNombreUsuario,
  actualizarStatusPorId,
  getUserById,
  setUserStatusFalse
}
