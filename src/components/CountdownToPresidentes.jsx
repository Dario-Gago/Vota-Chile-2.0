import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import VotacionesList from './VotacionesList'
import { ENDPOINT } from '../config/constans'
import UsuariosConectados from './UsuariosConectados'

const CountdownToPresidentes = () => {
  const [timeLeft, setTimeLeft] = useState({})
  const [finished, setFinished] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [targetDate, setTargetDate] = useState(null)
  const [loading, setLoading] = useState(true)

  const getToken = () => window.sessionStorage.getItem('token')

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return {}
    const now = new Date()
    const difference = targetDate - now
    if (difference <= 0) {
      setFinished(true)
      return {}
    }

    return {
      días: Math.floor(difference / (1000 * 60 * 60 * 24)),
      horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((difference / 1000 / 60) % 60),
      segundos: Math.floor((difference / 1000) % 60)
    }
  }, [targetDate])

  const obtenerRolUsuario = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setIsAdmin(false)
      return
    }

    try {
      const { data } = await axios.get(`${ENDPOINT.users}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsAdmin(data.admin || false)
    } catch (error) {
      if (
        error.response?.status !== 401 &&
        error.response?.status !== 403 &&
        error.response?.status !== 404
      ) {
        console.error('Error al obtener info del usuario:', error)
      }

      setIsAdmin(false)

      if (error.response?.status === 401) {
        window.sessionStorage.removeItem('token')
      }
    }
  }, [])

  const obtenerFecha = useCallback(async () => {
    try {
      const token = getToken()
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {}

      const { data } = await axios.get(ENDPOINT.fecha, config)
      setTargetDate(new Date(data.fecha))
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error('Error al obtener fecha de votación:', error)
      }
    }
  }, [])

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await Promise.all([obtenerRolUsuario(), obtenerFecha()])
      setLoading(false)
    }

    initializeData()
  }, [obtenerRolUsuario, obtenerFecha])

  // 🚨 Esta verificación asegura que el contador no aparezca si ya pasó la fecha
  useEffect(() => {
    if (!targetDate) return
    const now = new Date()
    if (targetDate - now <= 0) {
      setFinished(true)
    }
  }, [targetDate])

  useEffect(() => {
    if (!targetDate) return
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate, calculateTimeLeft])

  const timeUnits = [
    { value: timeLeft.días, label: 'días', shortLabel: 'd' },
    { value: timeLeft.horas, label: 'horas', shortLabel: 'h' },
    { value: timeLeft.minutos, label: 'minutos', shortLabel: 'm' },
    { value: timeLeft.segundos, label: 'segundos', shortLabel: 's' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (finished || isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-1000 w-full max-w-6xl mx-auto">
          <div className="relative px-4">
            <div className="absolute inset-0 blur-3xl opacity-20 rounded-full bg-green-400"></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-green-600 mb-2 sm:mb-4 leading-tight">
              ¡La votación ha comenzado!
            </h2>
            {isAdmin && <UsuariosConectados />}
          </div>

          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-green-500">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>

          <div className="mt-4 sm:mt-6 lg:mt-8 w-full px-2 sm:px-4">
            <VotacionesList />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      <div className="absolute top-4 left-4 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-2 w-10 h-10 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="text-center space-y-6 w-full max-w-5xl mx-auto px-2 relative z-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-800">Votaciones</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 font-medium">Comienzan en:</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="text-center relative group">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg p-4 shadow-lg group-hover:scale-105 transform transition-all duration-300">
                  <div className="text-3xl font-bold font-mono">
                    {String(unit.value || 0).padStart(2, '0')}
                  </div>
                  <div className="text-sm mt-2">
                    <span className="hidden sm:inline">{unit.label}</span>
                    <span className="sm:hidden">{unit.shortLabel}</span>
                  </div>
                </div>
                {index < timeUnits.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 text-xl text-gray-400 font-bold transform -translate-y-1/2">
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-xs mx-auto">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-sm font-medium">
              Actualizándose en tiempo real
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownToPresidentes
