import React from 'react'

const Stats = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-emerald-600">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">150K+</div>
            <div className="text-blue-100 text-lg">Votantes Registrados</div>
          </div>
          <div className="text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">98%</div>
            <div className="text-blue-100 text-lg">Seguridad Garantizada</div>
          </div>
          <div className="text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">24/7</div>
            <div className="text-blue-100 text-lg">Disponibilidad</div>
          </div>
          <div className="text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">5★</div>
            <div className="text-blue-100 text-lg">Calificación Promedio</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
