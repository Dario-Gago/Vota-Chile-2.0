import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ENDPOINT } from '../config/constans'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

const initialForm = {
  email: '',
  password: '',
  rut: '',
  nombre_usuario: ''
}

// ✅ NUEVA FUNCIÓN para formatear el RUT como 12.345.678-9
const formatearRut = (valor) => {
  valor = valor.replace(/[^0-9kK]/g, '').toUpperCase()

  let cuerpo = valor.slice(0, -1)
  let dv = valor.slice(-1)

  let cuerpoFormateado = ''
  while (cuerpo.length > 3) {
    cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado
    cuerpo = cuerpo.slice(0, -3)
  }
  cuerpoFormateado = cuerpo + cuerpoFormateado

  return cuerpoFormateado + '-' + dv
}

const Register = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(initialForm)

  const handleUser = (event) => {
    const { name, value } = event.target
    const newValue = name === 'rut' ? formatearRut(value) : value
    setUser({ ...user, [name]: newValue })
  }

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

    if (
      !user.email.trim() ||
      !user.password.trim() ||
      !user.rut.trim() ||
      !user.nombre_usuario.trim()
    ) {
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

    if (!validarRut(user.rut)) {
      return Swal.fire(
        'RUT inválido',
        'El RUT ingresado no es válido.',
        'error'
      )
    }

    if (user.nombre_usuario.length < 3) {
      return Swal.fire(
        'Nombre de usuario inválido',
        'El nombre de usuario debe tener al menos 3 caracteres.',
        'error'
      )
    }

    if (!specialCharRegex.test(user.nombre_usuario)) {
      return Swal.fire(
        'Nombre de usuario inválido',
        'Debe contener al menos un carácter especial (!@#$%^&*)',
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
          placeholder="Ingrese su email"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Nombre de Usuario
        </label>
        <input
          value={user.nombre_usuario}
          onChange={handleUser}
          type="text"
          name="nombre_usuario"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Ej: juan_perez@"
        />
        <small className="text-gray-500 text-xs mt-1 block">
          Debe contener al menos 3 caracteres y un carácter especial
        </small>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Contraseña
        </label>
        <input
          value={user.password}
          onChange={handleUser}
          type="password"
          name="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Ingrese una contraseña"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">RUT</label>
        <input
          value={user.rut}
          onChange={handleUser}
          type="text"
          name="rut"
          maxLength={12}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Ej: 12.345.678-9"
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
