import React, { useEffect, useState } from 'react'
import PresidentesList from './PresidentesList'

const CountdownToPresidentes = () => {
  const [timeLeft, setTimeLeft] = useState({})
  const [finished, setFinished] = useState(false)

  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-06-27T23:30:40')
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
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          ¡La votación ha comenzado!
        </h2>
        <PresidentesList />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
        Votaciones presidenciales en:
      </h2>
      <div className="flex gap-4 text-xl sm:text-2xl font-mono text-white bg-blue-600 px-6 py-3 rounded-xl shadow-lg">
        <div>{timeLeft.días}d</div>
        <div>{timeLeft.horas}h</div>
        <div>{timeLeft.minutos}m</div>
        <div>{timeLeft.segundos}s</div>
      </div>
    </div>
  )
}

export default CountdownToPresidentes
