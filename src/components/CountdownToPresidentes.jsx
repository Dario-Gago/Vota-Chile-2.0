import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VotacionesList from './VotacionesList'
import { ENDPOINT } from '../config/constans'

const CountdownToPresidentes = () => {
  const [timeLeft, setTimeLeft] = useState({})
  const [finished, setFinished] = useState(false)
  const [usuariosConectados, setUsuariosConectados] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [targetDate, setTargetDate] = useState(null)

  const calculateTimeLeft = () => {
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
  }

  const fetchUsuariosConectados = async () => {
    const token = window.sessionStorage.getItem('token')
    if (!token) return

    try {
      const response = await axios.get(ENDPOINT.totalUsuariosConectados, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUsuariosConectados(response.data.total)
    } catch (error) {
      console.error('Error al obtener usuarios conectados:', error)
    }
  }

  const obtenerRolUsuario = async () => {
    try {
      const token = window.sessionStorage.getItem('token')
      if (!token) return

      const { data } = await axios.get(`${ENDPOINT.users}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsAdmin(data.admin)
    } catch (err) {
      console.error('Error al obtener info del usuario', err)
    }
  }

  const obtenerFecha = async () => {
    try {
      const token = window.sessionStorage.getItem('token')

      // Crear headers condicionalmente
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` }
          }
        : {}

      const { data } = await axios.get(ENDPOINT.fecha, config)
      setTargetDate(new Date(data.fecha))
    } catch (error) {
      console.error('Error al obtener fecha de votación:', error)
    }
  }

  useEffect(() => {
    obtenerRolUsuario()
    obtenerFecha()
  }, [])

  useEffect(() => {
    fetchUsuariosConectados()
    if (!targetDate) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (finished || isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-1000 w-full max-w-6xl mx-auto">
          <div className="relative px-4">
            <div className="absolute inset-0 blur-3xl opacity-20 rounded-full bg-green-400"></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-green-600 mb-2 sm:mb-4 leading-tight">
              ¡La votación ha comenzado!
            </h2>
            {isAdmin && (
              <div className="mt-2 sm:mt-4">
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base text-green-700 bg-green-100 font-semibold rounded-full border border-green-200">
                  Usuarios conectados: {usuariosConectados}
                </span>
              </div>
            )}
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

  const timeUnits = [
    { value: timeLeft.días, label: 'días', shortLabel: 'd' },
    { value: timeLeft.horas, label: 'horas', shortLabel: 'h' },
    { value: timeLeft.minutos, label: 'minutos', shortLabel: 'm' },
    { value: timeLeft.segundos, label: 'segundos', shortLabel: 's' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Background decorative elements - Responsive sizes */}
      <div className="absolute top-4 sm:top-8 lg:top-10 left-4 sm:left-8 lg:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-4 sm:bottom-8 lg:bottom-10 right-4 sm:right-8 lg:right-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10 relative z-10 w-full max-w-5xl mx-auto px-2">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight px-4">
            Votaciones
          </h1>
          <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-medium px-4">
            Comienzan en:
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 mx-2 sm:mx-4">
          {/* Grid responsivo mejorado */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="text-center group relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-mono tabular-nums leading-none">
                    {String(unit.value || 0).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base font-medium mt-1 sm:mt-2 lg:mt-3 opacity-90">
                    {/* Responsive labels */}
                    <span className="hidden xs:hidden sm:inline lg:inline">
                      {unit.label}
                    </span>
                    <span className="xs:inline sm:hidden lg:hidden">
                      {unit.shortLabel}
                    </span>
                  </div>
                </div>
                {/* Separadores solo en pantallas grandes */}
                {index < timeUnits.length - 1 && (
                  <div className="hidden sm:block lg:block absolute top-1/2 -right-2 sm:-right-3 text-lg sm:text-xl lg:text-2xl text-gray-400 font-bold transform -translate-y-1/2">
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status indicator responsive */}
        <div className="bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-xs sm:text-sm lg:text-base font-medium text-center">
              Actualizándose en tiempo real
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownToPresidentes
