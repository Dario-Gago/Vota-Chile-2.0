import React, { useEffect, useState } from 'react'
import axios from 'axios'

const FriendsSection = () => {
  const [amigos, setAmigos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerAmigos = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/amigos') // Ajusta la URL según tu backend
        setAmigos(data)
      } catch (error) {
        console.error('Error al obtener amigos:', error)
      } finally {
        setCargando(false)
      }
    }

    obtenerAmigos()
  }, [])

  if (cargando) return <p>Cargando amigos...</p>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tus amigos</h2>
      {amigos.length === 0 ? (
        <p>No tienes amigos aún.</p>
      ) : (
        <ul className="space-y-2">
          {amigos.map((amigo) => (
            <li key={amigo.id} className="p-3 bg-gray-100 rounded-md shadow">
              <p className="font-semibold">{amigo.nombre}</p>
              <p className="text-sm text-gray-600">{amigo.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FriendsSection
