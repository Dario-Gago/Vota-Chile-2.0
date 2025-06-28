import React from 'react'

const EstadisticasVotacion = ({ presidentes }) => {
  const totalVotos = presidentes.reduce((total, p) => total + p.votos, 0)
  const promedio =
    presidentes.length > 0 ? Math.round(totalVotos / presidentes.length) : 0

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        Estadísticas de Votación
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {presidentes.length}
          </div>
          <div className="text-sm text-gray-600">Candidatos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {totalVotos.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total de Votos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{promedio}</div>
          <div className="text-sm text-gray-600">Promedio por Candidato</div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasVotacion
