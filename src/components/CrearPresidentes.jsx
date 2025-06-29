import React from 'react'

const CrearPresidentes = ({
  cantidadCrear,
  setCantidadCrear,
  handleCrearPresidentes
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 space-y-6 animate-in fade-in duration-1000">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
        Crear presidentes
      </h2>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => setCantidadCrear((prev) => Math.max(1, prev - 1))}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold text-2xl shadow hover:bg-blue-300 transition"
          aria-label="Disminuir cantidad"
          type="button"
        >
          −
        </button>

        <input
          type="number"
          min="1"
          max="100"
          value={cantidadCrear}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (!isNaN(value)) {
              setCantidadCrear(Math.min(Math.max(value, 1), 100))
            } else {
              setCantidadCrear(1)
            }
          }}
          className="w-20 text-center rounded-md border border-gray-300 bg-white/90 text-lg font-semibold text-gray-800 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Cantidad"
          aria-label="Cantidad de presidentes"
        />

        <button
          onClick={() => setCantidadCrear((prev) => Math.min(100, prev + 1))}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold text-2xl shadow hover:bg-blue-300 transition"
          aria-label="Incrementar cantidad"
          type="button"
        >
          +
        </button>
      </div>

      <div className="pt-2">
        <button
          onClick={() => handleCrearPresidentes(cantidadCrear)}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-teal-700 transition-all duration-300"
          type="button"
        >
          Crear presidentes
        </button>
      </div>
    </div>
  )
}

export default CrearPresidentes
