import React from 'react'

const TituloPanel = ({
  titulo,
  nuevoTitulo,
  setNuevoTitulo,
  actualizarTitulo,
  isAdmin
}) => {
  if (isAdmin) {
    return (
      <div className="max-w-3xl w-full mx-auto my-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 space-y-4 animate-in fade-in duration-1000">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Editar título del panel
        </h2>
        <input
          type="text"
          value={nuevoTitulo}
          placeholder="Ingrese un título"
          onChange={(e) => setNuevoTitulo(e.target.value)}
          className="w-full px-4 py-3 text-xl font-bold text-center text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          aria-label="Título para el panel"
        />
        <button
          onClick={actualizarTitulo}
          type="button"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          aria-label="Guardar título"
        >
          Guardar Título
        </button>
      </div>
    )
  }

  return (
    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-6 animate-in fade-in duration-1000 max-w-4xl mx-auto">
      {titulo}
    </h1>
  )
}

export default TituloPanel
