import axios from 'axios'
import { useEffect, useState } from 'react'
import { ENDPOINT } from '../config/constans'
import Swal from 'sweetalert2'

const PresidentesList = () => {
  const [presidentes, setPresidentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [votingId, setVotingId] = useState(null)

  // Función para obtener presidentes
  const fetchPresidentes = async () => {
    try {
      const token = window.sessionStorage.getItem('token')
      const { data } = await axios.get(ENDPOINT.presidentes, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPresidentes(data)
      setLoading(false)
    } catch (err) {
      if (loading) {
        // Solo mostrar error si es la primera carga
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Error al cargar presidentes'
        })
      }
      setLoading(false)
      console.error('Error al obtener presidentes:', err)
    }
  }

  useEffect(() => {
    // Cargar datos inicialmente
    fetchPresidentes()

    // Configurar actualización automática cada 10 segundos
    const interval = setInterval(() => {
      fetchPresidentes()
    }, 10000) // 10000ms = 10 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval)
  }, [])

  const handleVote = async (presidenteId) => {
    // Encontrar el nombre del presidente para la confirmación
    const presidente = presidentes.find((p) => p.id === presidenteId)

    // Mostrar confirmación antes de votar
    const result = await Swal.fire({
      title: '¿Confirmar voto?',
      text: `¿Estás seguro que quieres votar por ${presidente?.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, votar',
      cancelButtonText: 'Cancelar'
    })

    // Si el usuario cancela, no hacer nada
    if (!result.isConfirmed) {
      return
    }

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

      // Actualizar la lista después del voto (optimistic update)
      setPresidentes((prevPresidentes) =>
        prevPresidentes.map((presidente) =>
          presidente.id === presidenteId
            ? { ...presidente, votos: presidente.votos + 1 }
            : presidente
        )
      )

      Swal.fire({
        icon: 'success',
        title: 'Voto registrado',
        text: 'Gracias por votar por tu candidato preferido!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      })

      // Actualizar datos inmediatamente después del voto para sincronizar
      setTimeout(() => {
        fetchPresidentes()
      }, 1000)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al votar',
        text: err.response?.data?.message || 'Error al votar'
      })
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
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Actualizando cada 10s</span>
          </div>
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
