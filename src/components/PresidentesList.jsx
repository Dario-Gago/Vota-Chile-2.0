import axios from 'axios'
import { useEffect, useState } from 'react'
import { ENDPOINT } from '../config/constans'

const PresidentesList = () => {
  const [presidentes, setPresidentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [votingId, setVotingId] = useState(null)

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')
    axios
      .get(ENDPOINT.presidentes, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(({ data }) => {
        setPresidentes(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al cargar presidentes')
        setLoading(false)
      })
  }, [])

  const handleVote = async (presidenteId) => {
    setVotingId(presidenteId)

    try {
      const token = window.sessionStorage.getItem('token')
      await axios.post(
        `${ENDPOINT.votar}/${presidenteId}/votar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Actualizar la lista después del voto
      setPresidentes((prevPresidentes) =>
        prevPresidentes.map((presidente) =>
          presidente.id === presidenteId
            ? { ...presidente, votos: presidente.votos + 1 }
            : presidente
        )
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Error al votar')
    } finally {
      setVotingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Elecciones Presidenciales
          </h1>
          <p className="text-lg text-gray-600">
            Vota por tu candidato preferido
          </p>
          <div className="mt-4 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidentes.map(({ id, nombre, descripcion, votos }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white text-center">
                  {nombre}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                  {descripcion}
                </p>

                {/* Votos Counter */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-gray-700">
                      {votos.toLocaleString()} votos
                    </span>
                  </div>
                </div>

                {/* Vote Button */}
                <button
                  onClick={() => handleVote(id)}
                  disabled={votingId === id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    votingId === id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95 shadow-md hover:shadow-lg'
                  }`}
                >
                  {votingId === id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Votando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Votar</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Estadísticas de Votación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {presidentes.length}
              </div>
              <div className="text-sm text-gray-600">Candidatos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {presidentes
                  .reduce((total, p) => total + p.votos, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total de Votos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {presidentes.length > 0
                  ? Math.round(
                      presidentes.reduce((total, p) => total + p.votos, 0) /
                        presidentes.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">
                Promedio por Candidato
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PresidentesList
