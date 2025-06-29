import React from 'react'

const PresidenteCard = ({
  presidente,
  edicion,
  setEdiciones,
  isAdmin,
  handleUpdate,
  handleDelete,
  handleVote,
  votingId
}) => {
  return (
    <div
      key={presidente.id}
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
        <h3 className="text-xl sm:text-2xl font-bold text-white text-center">
          {presidente.nombre}
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {isAdmin ? (
          <>
            <input
              type="text"
              value={edicion?.nombre || ''}
              placeholder="Nombre del candidato"
              onChange={(e) =>
                setEdiciones((prev) => ({
                  ...prev,
                  [presidente.id]: {
                    ...prev[presidente.id],
                    nombre: e.target.value
                  }
                }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <textarea
              value={edicion?.descripcion || ''}
              placeholder="Descripción del candidato"
              onChange={(e) =>
                setEdiciones((prev) => ({
                  ...prev,
                  [presidente.id]: {
                    ...prev[presidente.id],
                    descripcion: e.target.value
                  }
                }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <button
              onClick={() => handleUpdate(presidente.id)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Guardar
            </button>

            <button
              onClick={() => handleDelete(presidente.id)}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Eliminar
            </button>
          </>
        ) : (
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed min-h-[60px]">
            {presidente.descripcion}
          </p>
        )}

        <div className="flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow text-gray-700 font-semibold flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{presidente.votos} votos</span>
          </div>
        </div>

        {!isAdmin && (
          <button
            onClick={() => handleVote(presidente.id)}
            disabled={votingId === presidente.id}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              votingId === presidente.id
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95 shadow-md hover:shadow-lg'
            }`}
          >
            {votingId === presidente.id ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Votando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Votar</span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default PresidenteCard
