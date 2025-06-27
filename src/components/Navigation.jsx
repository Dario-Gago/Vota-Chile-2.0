import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../contexts/Context'
import { ENDPOINT } from '../config/constans'
import axios from 'axios'

const Navigation = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const logout = async () => {
    setIsMenuOpen(false)
    const token = window.sessionStorage.getItem('token')

    try {
      await axios.put(
        ENDPOINT.actualizarStatus,
        { status: false },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }

    window.sessionStorage.removeItem('token')
    setDeveloper(null)
    navigate('/')
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const renderAuthButtons = () => {
    if (!getDeveloper) {
      return (
        <>
          <Link
            to="/registrarse"
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-4 py-2 rounded-lg transition block text-center mb-2 md:inline-block md:m-1 md:mb-0"
            onClick={closeMenu}
          >
            Registrarse
          </Link>
          <Link
            to="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition block text-center md:inline-block md:m-1"
            onClick={closeMenu}
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
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg transition block text-center mb-2 md:inline-block md:m-1 md:mb-0"
          onClick={closeMenu}
        >
          Mi Perfil
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition block w-full text-center md:inline-block md:m-1 md:w-auto"
        >
          Salir
        </button>
      </>
    )
  }

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-2xl font-bold text-emerald-600">VC.cl</span>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-1"
          >
            Inicio
            <i className="fa-solid fa-house ml-1" />
          </Link>

          {getDeveloper && (
            <>
              <Link
                to="/amigos"
                className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-1"
              >
                Amigos
                <i className="fa-solid fa-user-group ml-1" />
              </Link>
              <Link
                to="/votar"
                className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-1"
              >
                Votar
                <i className="fa-solid fa-check-to-slot ml-1" />
              </Link>
            </>
          )}

          {renderAuthButtons()}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
          aria-label="Menú"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out z-50 relative ${
          isMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-6 py-4 space-y-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-2 py-2 border-b border-gray-100"
            onClick={closeMenu}
          >
            <i className="fa-solid fa-house" />
            Inicio
          </Link>

          {getDeveloper && (
            <>
              <Link
                to="/amigos"
                className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-2 py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-user-group" />
                Amigos
              </Link>

              <Link
                to="/votar"
                className="text-gray-700 hover:text-emerald-500 font-medium flex items-center gap-2 py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-check-to-slot" />
                Votar
              </Link>
            </>
          )}

          <div className="space-y-3">{renderAuthButtons()}</div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
