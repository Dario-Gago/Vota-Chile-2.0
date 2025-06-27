// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Context from '../contexts/Context' // o donde tengas tu contexto de autenticación

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(Context) // asumiendo que tienes un token en el contexto

  if (!token) {
    return <Navigate to="/perfil" replace />
  }

  return children
}

export default ProtectedRoute
