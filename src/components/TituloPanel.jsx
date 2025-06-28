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
      <div className="mb-6 max-w-3xl mx-auto">
        <input
          type="text"
          value={nuevoTitulo}
          placeholder="Ingrese un título"
          onChange={(e) => setNuevoTitulo(e.target.value)}
          className="
            w-full
            text-4xl
            font-extrabold
            text-center
            border-b-4
            border-blue-500
            focus:outline-none
            focus:border-blue-700
            focus:shadow-md
            transition
            px-3
            py-2
            rounded-t-md
            bg-white
            shadow-sm
          "
          aria-label="Título para el panel"
        />
        <button
          onClick={actualizarTitulo}
          className="
            mt-4
            w-full
            bg-gradient-to-r from-blue-600 to-blue-700
            text-white
            font-semibold
            py-3
            rounded-lg
            shadow-lg
            hover:from-blue-700
            hover:to-blue-800
            transition
            duration-300
          "
          type="button"
          aria-label="Guardar título"
        >
          Guardar Título
        </button>
      </div>
    )
  } else {
    return (
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center max-w-4xl mx-auto">
        {titulo}
      </h1>
    )
  }
}

export default TituloPanel
