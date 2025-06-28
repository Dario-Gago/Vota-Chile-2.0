import React, { useEffect, useState } from 'react'
import PresidentesList from './PresidentesList'

const CountdownToPresidentes = () => {
  const [timeLeft, setTimeLeft] = useState({})
  const [finished, setFinished] = useState(false)

  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-06-28T15:11:40')
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

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft()
      setTimeLeft(time)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 animate-in fade-in duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full"></div>
            <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-green-600 mb-2">
              ¡La votación ha comenzado!
            </h2>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-500">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>
          <div className="mt-8">
            <PresidentesList />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="text-center space-y-8 relative z-10 max-w-4xl mx-auto">
        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Votaciones Presidenciales
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            Comienzan en:
          </p>
        </div>

        {/* Countdown display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="text-center group">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono tabular-nums">
                    {String(unit.value || 0).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm font-medium mt-2 opacity-90">
                    <span className="hidden sm:inline">{unit.label}</span>
                    <span className="sm:hidden">{unit.shortLabel}</span>
                  </div>
                </div>
                {/* Separator */}
                {index < timeUnits.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 text-2xl text-gray-400 font-bold transform -translate-y-1/2">
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-sm sm:text-base font-medium">
              Actualizándose en tiempo real
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownToPresidentes
