import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/Context'

const Navigation = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)

  const logout = () => {
    setDeveloper()
    window.sessionStorage.removeItem('token')
    navigate('/')
  }

  const isLogin = () => {
    if (!getDeveloper) {
      return (
        <>
          <Link
            to="/registrarse"
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-4 py-2 rounded-lg transition m-1"
          >
            Registrarse
          </Link>
          <Link
            to="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition m-1"
          >
            Iniciar Sesión
          </Link>
        </>
      )
    }

    return (
      <>
        <Link
          to="/perfil"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg transition m-1"
        >
          Mi Perfil
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition m-1"
        >
          Salir
        </button>
      </>
    )
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <span className="text-2xl font-bold text-emerald-600">VC.cl</span>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-1"
        >
          Inicio
          <i className="fa-solid fa-house ml-1" />
        </Link>
        {isLogin()}
      </div>
    </nav>
  )
}

export default Navigation
