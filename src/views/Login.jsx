import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ENDPOINT } from '../config/constans'
import Context from '../contexts/Context'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const initialForm = { email: 'prueba@ejemplo.com', password: '123456' }

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(initialForm)
  const { setDeveloper } = useContext(Context)

  const handleUser = (event) =>
    setUser({ ...user, [event.target.name]: event.target.value })

  const handleForm = (event) => {
    event.preventDefault()

    if (!user.email.trim() || !user.password.trim()) {
      return Swal.fire('Error', 'Email y Contraseña obligatorias.', 'warning')
    }

    if (!emailRegex.test(user.email)) {
      return Swal.fire('Error', 'El formato del email no es correcto!', 'error')
    }

    axios
      .post(ENDPOINT.login, user)
      .then(({ data }) => {
        window.sessionStorage.setItem('token', data.token)
        window.sessionStorage.setItem('rut', data.rut) // ✅ Guardar el rut aquí

        Swal.fire(
          '¡Éxito!',
          'Usuario identificado con éxito 😀.',
          'success'
        ).then(() => {
          setDeveloper({}) // Aquí podrías incluso guardar más datos si lo deseas
          navigate('/perfil')
        })
      })
      .catch(({ response: { data } }) => {
        console.error(data)
        Swal.fire('Error', `${data.message} 🙁.`, 'error')
      })
  }

  return (
    <form
      onSubmit={handleForm}
      className="w-full max-w-sm mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Iniciar Sesión
      </h1>
      <hr className="mb-6" />
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Email address
        </label>
        <input
          value={user.email}
          onChange={handleUser}
          type="email"
          name="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Enter email"
        />
      </div>
      <div className="mb-6">
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
      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Iniciar Sesión
      </button>
    </form>
  )
}

export default Login
