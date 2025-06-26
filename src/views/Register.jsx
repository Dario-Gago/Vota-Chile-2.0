import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ENDPOINT } from '../config/constans'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const initialForm = {
  email: 'prueba@ejemplo.com',
  password: '123456',
  rut: ''
}

const Register = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(initialForm)

  const handleUser = (event) =>
    setUser({ ...user, [event.target.name]: event.target.value })

  const handleForm = (event) => {
    event.preventDefault()

    const validarRut = (rut) => {
      rut = rut.replace(/\./g, '').replace('-', '')
      const cuerpo = rut.slice(0, -1)
      let dv = rut.slice(-1).toUpperCase()

      let suma = 0
      let multiplo = 2

      for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo
        multiplo = multiplo < 7 ? multiplo + 1 : 2
      }

      const dvEsperado = 11 - (suma % 11)
      const dvFinal =
        dvEsperado === 11
          ? '0'
          : dvEsperado === 10
          ? 'K'
          : dvEsperado.toString()

      return dvFinal === dv
    }

    if (!user.email.trim() || !user.password.trim() || !user.rut.trim()) {
      return Swal.fire(
        'Campos requeridos',
        'Todos los campos son obligatorios.',
        'warning'
      )
    }

    if (!emailRegex.test(user.email)) {
      return Swal.fire(
        'Formato inválido',
        'El formato del email no es correcto.',
        'error'
      )
    }

    if (user.password.length < 6) {
      return Swal.fire(
        'Contraseña inválida',
        'La contraseña debe tener al menos 6 caracteres.',
        'warning'
      )
    }

    if (!validarRut(user.rut)) {
      return Swal.fire(
        'RUT inválido',
        'El RUT ingresado no es válido.',
        'error'
      )
    }

    axios
      .post(ENDPOINT.users, user)
      .then(() => {
        Swal.fire(
          '¡Éxito!',
          'Usuario registrado con éxito 😀.',
          'success'
        ).then(() => {
          navigate('/login')
        })
      })
      .catch(({ response: { data } }) => {
        console.error(data)
        Swal.fire('Error', `${data.message} 🙁.`, 'error')
      })
  }

  useEffect(() => {
    if (window.sessionStorage.getItem('token')) {
      navigate('/perfil')
    }
  }, [])

  return (
    <form
      onSubmit={handleForm}
      className="w-full max-w-sm mx-auto mt-20 p-8 bg-white rounded-2xl shadow-md border border-gray-200"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Registrar nuevo usuario
      </h1>
      <hr className="mb-6" />

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          value={user.email}
          onChange={handleUser}
          type="email"
          name="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Enter email"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <input
          value={user.password}
          onChange={handleUser}
          type="password"
          name="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Password"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">RUT</label>
        <input
          value={user.rut}
          onChange={handleUser}
          type="text"
          name="rut"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Ej: 21.796.387-7"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Registrarme
      </button>
    </form>
  )
}

export default Register
