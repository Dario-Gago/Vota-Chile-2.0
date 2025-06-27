require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT
const usuariosRoutes = require('./routes/usuarios.routes')
const authRoutes = require('./routes/auth.routes')
const presidentesRoutes = require('./routes/presidentes.routes')
const statusRoutes = require('./routes/status.routes')
const votarRoutes = require('./routes/votaciones.routes')

app.use(cors())
app.use(express.json())
app.use('/usuarios', usuariosRoutes)
app.use('/login', authRoutes)
app.use('/presidentes', presidentesRoutes)
app.use('/status', statusRoutes)
app.use('/votar', votarRoutes)

app.listen(
  PORT,
  console.log(
    `Servidor corriendo en el puerto ${PORT}. Puede acceder a la url aqui: http://localhost:${PORT}`
  )
)
