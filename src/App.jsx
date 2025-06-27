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
import FriendsSection from './views/FriendsSection'
import Votar from './views/Votar'

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
  }, [])

  return (
    <Context.Provider value={globalState}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registrarse" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/amigos" element={<FriendsSection />} />
          <Route path="/votar" element={<Votar />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
