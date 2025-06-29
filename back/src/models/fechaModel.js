const { pool } = require('../../db/connection')

const obtenerFechaEvento = async () => {
  try {
    // Primero verificamos si existe algún registro
    const result = await pool.query(
      'SELECT fecha_inicio FROM configuracion WHERE id = 1'
    )

    if (result.rows.length === 0) {
      // Si no existe, creamos un registro por defecto
      const fechaPorDefecto = new Date()
      fechaPorDefecto.setDate(fechaPorDefecto.getDate() + 7) // 7 días desde hoy

      await pool.query(
        'INSERT INTO configuracion (id, nombre_evento, fecha_inicio) VALUES ($1, $2, $3)',
        [1, 'Evento de Votación', fechaPorDefecto]
      )

      return { fecha_inicio: fechaPorDefecto }
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error al obtener fecha del evento:', error)
    throw error
  }
}

const actualizarFechaEvento = async (nuevaFecha) => {
  try {
    // Verificamos si existe el registro
    const existeRegistro = await pool.query(
      'SELECT id FROM configuracion WHERE id = 1'
    )

    if (existeRegistro.rows.length === 0) {
      // Si no existe, lo creamos
      await pool.query(
        'INSERT INTO configuracion (id, nombre_evento, fecha_inicio) VALUES ($1, $2, $3)',
        [1, 'Evento de Votación', nuevaFecha]
      )
    } else {
      // Si existe, lo actualizamos
      await pool.query(
        'UPDATE configuracion SET fecha_inicio = $1 WHERE id = 1',
        [nuevaFecha]
      )
    }
  } catch (error) {
    console.error('Error al actualizar fecha del evento:', error)
    throw error
  }
}

module.exports = {
  obtenerFechaEvento,
  actualizarFechaEvento
}
