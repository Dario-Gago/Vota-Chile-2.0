import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Context from '../contexts/Context'

const MisVotos = () => {
  const { token } = useContext(Context)
  const [votos, setVotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVotos = async () => {
      try {
        const response = await axios.get('/mis-votos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setVotos(response.data)
      } catch (err) {
        setError('Error al obtener los votos')
      } finally {
        setLoading(false)
      }
    }
    fetchVotos()
  }, [token])

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Cargando tus votos...
      </p>
    )
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>
    )
  if (votos.length === 0)
    return (
      <p className="text-center text-gray-700 mt-10 font-medium">
        No tienes votos registrados.
      </p>
    )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-emerald-600">
        Mis Votos
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {votos.map((voto) => (
          <li
            key={voto.id}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {voto.nombreCandidato}
            </h3>
            <p className="mt-2 text-gray-600">
              Votos: <span className="font-medium">{voto.cantidadVotos}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MisVotos
