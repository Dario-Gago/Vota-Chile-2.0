import axios from 'axios'
import { useEffect, useState } from 'react'
import { ENDPOINT } from '../config/constans'
import Swal from 'sweetalert2'
import TituloPanel from './TituloPanel'
import CrearPresidentes from './CrearPresidentes'
import PresidenteCard from './PresidenteCard'
import EstadisticasVotacion from './EstadisticasVotacion'

const VotacionesList = () => {
  const [presidentes, setPresidentes] = useState([])
  const [ediciones, setEdiciones] = useState({})
  const [loading, setLoading] = useState(true)
  const [votingId, setVotingId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [cantidadCrear, setCantidadCrear] = useState(1)
  const [nuevaFecha, setNuevaFecha] = useState('')

  const handleCrearPresidentes = async (cantidad) => {
    if (cantidad < 1) {
      Swal.fire('Error', 'La cantidad debe ser al menos 1', 'error')
      return
    }
    try {
      const token = window.sessionStorage.getItem('token')
      const promesas = []
      for (let i = 0; i < cantidad; i++) {
        promesas.push(
          axios.post(
            ENDPOINT.presidentes,
            { nombre: null, descripcion: null },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      }
      await Promise.all(promesas)
      Swal.fire(
        '¡Hecho!',
        `${cantidad} presidente(s) creado(s) correctamente`,
        'success'
      )
      fetchPresidentes()
    } catch (error) {
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Error al crear presidentes',
        'error'
      )
    }
  }

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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
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

  useEffect(() => {
    fetchPresidentes()
    obtenerRolUsuario()
    obtenerTitulo()
  }, [])

  useEffect(() => {
    if (!isAdmin) {
      const intervalo = setInterval(() => {
        fetchPresidentes()
      }, 5000)

      return () => clearInterval(intervalo)
    }
  }, [isAdmin])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 relative overflow-hidden py-12 px-6 sm:px-12">
      {/* Background decoration */}
      <div className="absolute top-16 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <header className="w-full text-center mb-12">
          <p className="text-lg text-gray-600 font-semibold tracking-wide mb-2">
            {isAdmin ? 'Panel de administración' : 'Vota por tu candidato'}
          </p>

          <TituloPanel
            titulo={titulo}
            nuevoTitulo={nuevoTitulo}
            setNuevoTitulo={setNuevoTitulo}
            actualizarTitulo={actualizarTitulo}
            isAdmin={isAdmin}
          />
          <hr />

          <div className="mt-6 h-1 w-28 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full mx-auto" />
        </header>

        {/* Presidentes Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {presidentes.map((p) => (
            <PresidenteCard
              key={p.id}
              presidente={p}
              edicion={ediciones[p.id]}
              setEdiciones={setEdiciones}
              isAdmin={isAdmin}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              handleVote={handleVote}
              votingId={votingId}
              className="transform hover:scale-[1.03] transition-transform duration-300"
            />
          ))}
        </section>
        {isAdmin && (
          <section className="mt-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 w-full mx-auto border border-blue-100">
            <CrearPresidentes
              cantidadCrear={cantidadCrear}
              setCantidadCrear={setCantidadCrear}
              handleCrearPresidentes={handleCrearPresidentes}
            />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
              >
                Eliminar todos los presidentes
              </button>
            </div>
          </section>
        )}

        {/* Estadísticas */}
        {/* Estadísticas */}
        <div className="mt-14 w-full">
          <EstadisticasVotacion presidentes={presidentes} />
        </div>
      </div>
      {isAdmin && (
        <section className="mt-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 w-full mx-auto border border-blue-100">
          {/* NUEVO formulario para cambiar fecha */}
          <div className="mt-4 sm:mt-6 lg:mt-8">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const token = window.sessionStorage.getItem('token')
                  await axios.put(
                    ENDPOINT.fecha,
                    { fecha_inicio: nuevaFecha },
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                  Swal.fire(
                    'Éxito',
                    'Fecha actualizada correctamente',
                    'success'
                  )
                } catch (error) {
                  console.error('Error al actualizar fecha:', error)
                  Swal.fire('Error', 'No se pudo actualizar la fecha', 'error')
                }
              }}
              className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white/20 w-full mx-auto space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
                Cambiar fecha de inicio de la votación
              </h2>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <input
                  type="datetime-local"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base font-semibold shadow-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  )
}

export default VotacionesList
