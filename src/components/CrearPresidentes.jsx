import React from 'react'

const CrearPresidentes = ({
  cantidadCrear,
  setCantidadCrear,
  handleCrearPresidentes
}) => {
  return (
    <div className="mb-8 flex flex-col items-center space-y-4">
      <label className="text-base font-semibold text-gray-800">
        Cantidad de presidentes a crear
      </label>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCantidadCrear((prev) => Math.max(1, prev - 1))}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-2xl shadow-md hover:bg-blue-200 transition"
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
          className="w-20 text-center rounded-md border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-lg font-medium text-gray-900"
          placeholder="Cantidad"
          aria-label="Cantidad de presidentes"
        />

        <button
          onClick={() => setCantidadCrear((prev) => Math.min(100, prev + 1))}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-2xl shadow-md hover:bg-blue-200 transition"
          aria-label="Incrementar cantidad"
          type="button"
        >
          +
        </button>
      </div>

      <button
        onClick={() => handleCrearPresidentes(cantidadCrear)}
        className="mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition"
        type="button"
      >
        Crear presidentes
      </button>
    </div>
  )
}

export default CrearPresidentes
