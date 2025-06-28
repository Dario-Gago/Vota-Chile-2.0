import React, { useState, useEffect } from 'react'
import { Vote, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { ENDPOINT } from '../config/constans'

const MisVotos = () => {
  const [votos, setVotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  const fetchMisVotos = async () => {
    const token = getToken()
    const rut = localStorage.getItem('rut') || sessionStorage.getItem('rut')

    if (!rut) {
      setError('No se encontró el RUT del usuario.')
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(ENDPOINT.misVotos(rut), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data && Array.isArray(response.data)) {
        setVotos(response.data)
        setHasVoted(response.data.length > 0)
      } else {
        setError('Respuesta inesperada del servidor')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Error al obtener los votos: ' + err.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMisVotos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando tus votos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />

          <p className="text-gray-600 text-center mb-4">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Votos</h1>
          <p className="text-gray-600">Consulta los votos que has emitido</p>
        </div>

        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              hasVoted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {hasVoted ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Ya has emitido tu voto</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <span>Aún no has votado</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Vote className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Tus Votos Emitidos
            </h2>
          </div>

          {!hasVoted ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No has votado aún
              </h3>
              <p className="text-gray-500">
                Cuando emitas tu voto, aparecerá aquí la información del
                candidato por el que votaste.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {votos.map((voto) => (
                <div
                  key={voto.voto_id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-blue-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <h3 className="text-xl font-bold text-gray-800">
                          {voto.presidente_nombre}
                        </h3>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {voto.presidente_descripcion}
                      </p>

                      <div className="bg-white/70 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">
                              Tu RUT:
                            </span>
                            <span className="text-gray-800">{voto.rut}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">
                              Total votos del candidato:
                            </span>
                            <span className="text-indigo-600 font-bold">
                              {voto.total_votos_presidente.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm text-center">
                  <strong>Nota:</strong> Esta información muestra el registro de
                  tu voto. Los datos se actualizan en tiempo real.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MisVotos
