import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'
import Context from '../contexts/Context'
import { Link } from 'react-router-dom'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const initialForm = { email: 'prueba@ejemplo.com', password: '123456' }

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const { setDeveloper } = useContext(Context)

  const handleUser = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value })
    setErrorMessage('') // Limpiar el error al escribir
  }

  const handleForm = async (event) => {
    event.preventDefault()

    if (!user.email.trim() || !user.password.trim()) {
      return setErrorMessage('Email y contraseña son obligatorios.')
    }

    if (!emailRegex.test(user.email)) {
      return setErrorMessage('El formato del email no es válido.')
    }

    try {
      const { data } = await axios.post(ENDPOINT.login, user)
      window.sessionStorage.setItem('token', data.token)
      window.sessionStorage.setItem('rut', data.rut)
      setDeveloper({})
      navigate('/perfil')
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Error al iniciar sesión.'
      setErrorMessage(msg)
    }
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

      {errorMessage && (
        <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded-lg">
          {errorMessage}
        </div>
      )}

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
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link
          to="/registrarse"
          className="text-emerald-600 hover:underline font-medium"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  )
}

export default Login
