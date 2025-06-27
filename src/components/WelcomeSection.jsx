import React from 'react'
import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'

const WelcomeSection = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true) // Inicializar en false hasta obtener del backend
  const [statusLoading, setStatusLoading] = useState(false)

  // Función para obtener el status desde el backend
  const getOnlineStatus = async () => {
    const token = window.sessionStorage.getItem('token')
    try {
      const { data } = await axios.get(ENDPOINT.obtenerStatus, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsOnline(data.status || data) // Dependiendo de cómo devuelvas el dato
    } catch (error) {
      console.error('Error al obtener status:', error)
      // Mantener el estado actual si hay error
    }
  }

  // Función para cambiar el status (si tienes endpoint para actualizarlo)
  const toggleOnlineStatus = async () => {
    const token = window.sessionStorage.getItem('token')
    setStatusLoading(true)

    try {
      const newStatus = !isOnline
      // Asumiendo que tienes un endpoint para actualizar el status
      await axios.put(
        ENDPOINT.actualizarStatus,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsOnline(newStatus)
    } catch (error) {
      console.error('Error al actualizar status:', error)
      // Podrías mostrar un mensaje de error al usuario aquí
    } finally {
      setStatusLoading(false)
    }
  }

  const getDeveloperData = async () => {
    const token = window.sessionStorage.getItem('token')
    setLoading(true)

    try {
      const {
        data: [user]
      } = await axios.get(ENDPOINT.users, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDeveloper({ ...user })

      // Obtener el status después de obtener los datos del usuario
      await getOnlineStatus()
    } catch ({ response: { data } }) {
      console.error(data)
      window.sessionStorage.removeItem('token')
      setDeveloper(null)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDeveloperData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Cargando perfil...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      ¡Bienvenido de vuelta!
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {getDeveloper?.nombre_usuario}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <button
                    onClick={toggleOnlineStatus}
                    disabled={statusLoading}
                    className={`transition-all duration-300 px-4 py-2 rounded-full border backdrop-blur-sm hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed ${
                      isOnline
                        ? 'bg-green-500 bg-opacity-90 border-green-400 hover:bg-green-600'
                        : 'bg-gray-500 bg-opacity-90 border-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {statusLoading ? (
                        <div className="w-2 h-2 rounded-full bg-white animate-spin border border-transparent border-t-current"></div>
                      ) : (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isOnline
                              ? 'bg-green-200 animate-pulse'
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                      <span className="text-white font-semibold text-sm">
                        {statusLoading
                          ? 'Actualizando...'
                          : isOnline
                          ? 'En línea'
                          : 'Inactivo'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Tu Estatus
                      </p>
                      <p
                        className={`text-lg font-bold transition-colors duration-300 ${
                          isOnline ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {isOnline ? 'Votante Activo' : 'Votante Inactivo'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-500 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Acceso
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        Verificado
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Sesión
                      </p>
                      <p className="text-lg font-bold text-gray-900">Activa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¡Hora de votar!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Explora los candidatos y ejerce tu derecho al voto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeSection
