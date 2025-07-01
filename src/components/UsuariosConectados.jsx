// src/components/UsuariosConectados.jsx
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { ENDPOINT } from '../config/constans'

const UsuariosConectados = () => {
  const [usuariosConectados, setUsuariosConectados] = useState(0)

  const getToken = () => window.sessionStorage.getItem('token')

  const fetchUsuariosConectados = useCallback(async () => {
    const token = getToken()
    if (!token) return

    try {
      const response = await axios.get(ENDPOINT.totalUsuariosConectados, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsuariosConectados(response.data.total)
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error('Error al obtener usuarios conectados:', error)
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUsuariosConectados(0)
      }
    }
  }, [])

  useEffect(() => {
    fetchUsuariosConectados()
    const interval = setInterval(fetchUsuariosConectados, 1000)
    return () => clearInterval(interval)
  }, [fetchUsuariosConectados])

  return (
    <div className="mt-2 sm:mt-4">
      <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base text-green-700 bg-green-100 font-semibold rounded-full border border-green-200">
        Usuarios conectados: {usuariosConectados}
      </span>
    </div>
  )
}

export default UsuariosConectados
