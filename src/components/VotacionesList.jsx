import axios from 'axios'
import { useEffect, useState } from 'react'
import { ENDPOINT } from '../config/constans'
import Swal from 'sweetalert2'
const VotacionesList = () => {
  const [presidentes, setPresidentes] = useState([])
  const [ediciones, setEdiciones] = useState({})
  const [loading, setLoading] = useState(true)
  const [votingId, setVotingId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const obtenerRolUsuario = async () => {
    try {
      const token = window.sessionStorage.getItem('token')
      const { data } = await axios.get(`${ENDPOINT.users}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsAdmin(data.admin)
    } catch (err) {
      console.error('Error al obtener info del usuario', err)
    }
  }

  const fetchPresidentes = async () => {
    try {
      const token = window.sessionStorage.getItem('token')
      const { data } = await axios.get(ENDPOINT.presidentes, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Solo usamos los presidentes
      const listaPresidentes = data.presidentes || data
      setPresidentes(listaPresidentes)

      const inicial = {}
      listaPresidentes.forEach((p) => {
        inicial[p.id] = { nombre: p.nombre, descripcion: p.descripcion }
      })
      setEdiciones(inicial)
      setLoading(false)
    } catch (err) {
      if (loading) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Error al cargar presidentes'
        })
      }
      setLoading(false)
      console.error('Error al obtener presidentes:', err)
    }
  }

  useEffect(() => {
    fetchPresidentes()
    obtenerRolUsuario()
    obtenerTitulo()

    const interval = setInterval(fetchPresidentes, 10000)
    return () => clearInterval(interval)
  }, [])

  const obtenerTitulo = async () => {
    try {
      const { data } = await axios.get(ENDPOINT.titulo)
      setTitulo(data.titulo)
      setNuevoTitulo(data.titulo)
    } catch (error) {
      console.error('Error al obtener título', error)
    }
  }
  const actualizarTitulo = async () => {
    try {
      const token = window.sessionStorage.getItem('token')
      const { data } = await axios.put(
        ENDPOINT.titulo,
        { titulo: nuevoTitulo },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setTitulo(data.titulo)
      Swal.fire('Actualizado', 'El título fue actualizado', 'success')
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.message || 'No se pudo actualizar el título',
        'error'
      )
    }
  }

  const handleVote = async (presidenteId) => {
    const presidente = presidentes.find((p) => p.id === presidenteId)
    const result = await Swal.fire({
      title: '¿Confirmar voto?',
      text: `¿Estás seguro que quieres votar por ${presidente?.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, votar',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    setVotingId(presidenteId)

    try {
      const token = window.sessionStorage.getItem('token')
      await axios.post(
        `${ENDPOINT.votar}/${presidenteId}/votar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setPresidentes((prev) =>
        prev.map((p) =>
          p.id === presidenteId ? { ...p, votos: p.votos + 1 } : p
        )
      )

      Swal.fire({
        icon: 'success',
        title: 'Voto registrado',
        text: 'Gracias por votar por tu candidato preferido!',
        timer: 2000,
        showConfirmButton: false
      })

      setTimeout(fetchPresidentes, 1000)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al votar',
        text: err.response?.data?.message || 'Error al votar'
      })
    } finally {
      setVotingId(null)
    }
  }

  const handleUpdate = async (id) => {
    const { nombre, descripcion } = ediciones[id]
    try {
      const token = window.sessionStorage.getItem('token')
      await axios.put(
        `${ENDPOINT.presidentes}/${id}`,
        { nombre, descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      Swal.fire('Actualizado', 'Presidente actualizado', 'success')
      fetchPresidentes()
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.message || 'No se pudo actualizar',
        'error'
      )
    }
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el presidente permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirm.isConfirmed) return

    try {
      const token = window.sessionStorage.getItem('token')
      await axios.delete(`${ENDPOINT.presidentes}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      Swal.fire('Eliminado', 'El presidente ha sido eliminado', 'success')
      fetchPresidentes()
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.message || 'No se pudo eliminar',
        'error'
      )
    }
  }

  // NUEVA FUNCIÓN PARA ELIMINAR TODOS LOS PRESIDENTES
  const handleDeleteAll = async () => {
    const confirm = await Swal.fire({
      title: '¿Eliminar todos los presidentes?',
      text: 'Esta acción eliminará permanentemente todos los presidentes. ¡No se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar todos',
      cancelButtonText: 'Cancelar'
    })

    if (!confirm.isConfirmed) return

    try {
      const token = window.sessionStorage.getItem('token')
      await axios.delete(`${ENDPOINT.presidentes}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      Swal.fire(
        'Eliminados',
        'Todos los presidentes han sido eliminados',
        'success'
      )
      fetchPresidentes()
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.message ||
          'No se pudieron eliminar los presidentes',
        'error'
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">
            {isAdmin ? 'Panel de administración' : 'Vota por tu candidato'}
          </p>
          {isAdmin ? (
            <div className="mb-4">
              <input
                type="text"
                value={nuevoTitulo}
                placeholder="Ingrese un tíulo"
                onChange={(e) => setNuevoTitulo(e.target.value)}
                className="text-4xl font-bold text-center w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-700"
              />
              <button
                onClick={actualizarTitulo}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Guardar Título
              </button>
            </div>
          ) : (
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{titulo}</h1>
          )}

          {/* BOTÓN ELIMINAR TODOS - SOLO ADMIN */}
          {isAdmin && (
            <div className="mt-4 mb-6 flex justify-center">
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Eliminar todos los presidentes
              </button>
            </div>
          )}

          <div className="mt-4 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidentes.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white text-center">
                  {p.nombre}
                </h3>
              </div>

              <div className="p-6">
                {isAdmin ? (
                  <>
                    <input
                      type="text"
                      value={ediciones[p.id]?.nombre || ''}
                      onChange={(e) =>
                        setEdiciones({
                          ...ediciones,
                          [p.id]: {
                            ...ediciones[p.id],
                            nombre: e.target.value
                          }
                        })
                      }
                      className="w-full border rounded px-2 py-1 mb-3"
                    />
                    <textarea
                      value={ediciones[p.id]?.descripcion || ''}
                      onChange={(e) =>
                        setEdiciones({
                          ...ediciones,
                          [p.id]: {
                            ...ediciones[p.id],
                            descripcion: e.target.value
                          }
                        })
                      }
                      className="w-full border rounded px-2 py-1 mb-3"
                    />
                    <button
                      onClick={() => handleUpdate(p.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 w-full"
                    >
                      Guardar
                    </button>

                    {/* BOTÓN ELIMINAR */}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                    {p.descripcion}
                  </p>
                )}

                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-gray-700">
                      {p.votos.toLocaleString()} votos
                    </span>
                  </div>
                </div>

                {!isAdmin && (
                  <button
                    onClick={() => handleVote(p.id)}
                    disabled={votingId === p.id}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      votingId === p.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {votingId === p.id ? (
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
          ))}
        </div>

        {/* Footer Stats */}
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
                {presidentes
                  .reduce((total, p) => total + p.votos, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total de Votos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {presidentes.length > 0
                  ? Math.round(
                      presidentes.reduce((total, p) => total + p.votos, 0) /
                        presidentes.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">
                Promedio por Candidato
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotacionesList
