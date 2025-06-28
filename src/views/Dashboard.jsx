import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ENDPOINT } from '../config/constans'
import Swal from 'sweetalert2'

const Dashboard = () => {
  const [presidentes, setPresidentes] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '' })

  // Obtener presidentes al cargar el componente
  useEffect(() => {
    fetchPresidentes()
  }, [])

  const fetchPresidentes = async () => {
    try {
      const res = await axios.get(`${ENDPOINT}/presidentes`)
      setPresidentes(res.data)
    } catch (error) {
      console.error('Error al obtener presidentes:', error)
    }
  }

  const handleEditClick = (presidente) => {
    setEditingId(presidente.id)
    setEditForm({
      nombre: presidente.nombre,
      descripcion: presidente.descripcion
    })
  }

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSave = async (id) => {
    try {
      await axios.put(`${ENDPOINT}/presidentes/${id}`, editForm)
      Swal.fire(
        'Actualizado',
        'Presidente actualizado correctamente',
        'success'
      )
      setEditingId(null)
      fetchPresidentes()
    } catch (error) {
      console.error('Error al actualizar:', error)
    }
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${ENDPOINT}/presidentes/${id}`)
        Swal.fire('Eliminado', 'Presidente eliminado correctamente', 'success')
        fetchPresidentes()
      } catch (error) {
        console.error('Error al eliminar:', error)
      }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      {presidentes.map((presidente) => (
        <div
          key={presidente.id}
          className="bg-white shadow p-4 mb-4 rounded-md border"
        >
          {editingId === presidente.id ? (
            <>
              <input
                type="text"
                name="nombre"
                value={editForm.nombre}
                onChange={handleChange}
                className="border p-2 mb-2 w-full"
              />
              <textarea
                name="descripcion"
                value={editForm.descripcion}
                onChange={handleChange}
                className="border p-2 mb-2 w-full"
              />
              <button
                onClick={() => handleSave(presidente.id)}
                className="bg-green-500 text-white px-4 py-1 rounded mr-2"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{presidente.nombre}</h2>
              <p className="text-gray-600">{presidente.descripcion}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleEditClick(presidente)}
                  className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(presidente.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default Dashboard
