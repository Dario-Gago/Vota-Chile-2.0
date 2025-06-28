const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../../src/data/titulo.json')

// Ruta para obtener el título
// GET → Obtener el título
router.get('/', (req, res) => {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(jsonData)
    res.json(data)
  } catch (error) {
    console.error('Error al leer el archivo de título:', error)
    res.status(500).json({ message: 'Error al obtener el título' })
  }
})

// PUT → Actualizar el título
router.put('/', (req, res) => {
  const { titulo } = req.body

  if (!titulo) {
    return res.status(400).json({ message: 'El título es requerido' })
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify({ titulo }, null, 2))
    res.json({ message: 'Título actualizado correctamente', titulo })
  } catch (error) {
    console.error('Error al escribir el archivo de título:', error)
    res.status(500).json({ message: 'Error al actualizar el título' })
  }
})

module.exports = router
