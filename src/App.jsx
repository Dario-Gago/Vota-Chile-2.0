import './App.css'
import Context from './contexts/Context'
import useDeveloper from './hooks/useDeveloper'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ENDPOINT } from './config/constans'
import axios from 'axios'

import Navigation from './components/Navigation'
import Home from './views/Home'
import Registro from './views/Register'
import Login from './views/Login'
import Perfil from './views/Profile'
import Votar from './views/Votar'
import ProtectedRouteHome from './components/ProtectedRouteHome'
import ProtectedRouteVotar from './components/ProtectedRouteVotar'

const App = () => {
  const globalState = useDeveloper()

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')

    if (token) {
      axios
        .get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data: [user] }) => globalState.setDeveloper({ ...user }))
        .catch(() => {
          window.sessionStorage.removeItem('token')
          globalState.setDeveloper(null)
        })
    }

    // Detectar cierre de pestaña/ventana
    const handleBeforeUnload = () => {
      const token = window.sessionStorage.getItem('token')
      if (token) {
        navigator.sendBeacon(
          `${ENDPOINT.logoutAuto}`,
          JSON.stringify({ token })
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <Context.Provider value={globalState}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/registrarse"
            element={
              <ProtectedRouteHome>
                <Registro />
              </ProtectedRouteHome>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRouteHome>
                <Login />
              </ProtectedRouteHome>
            }
          />
          <Route path="/perfil" element={<Perfil />} />
          <Route
            path="/votar"
            element={
              <ProtectedRouteVotar>
                <Votar />
              </ProtectedRouteVotar>
            }
          />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
