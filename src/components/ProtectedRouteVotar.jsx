import { Navigate } from 'react-router-dom'

const ProtectedRouteVotar = ({ children }) => {
  const token = sessionStorage.getItem('token') // Obtener el token del localStorage

  if (!token) {
    return <Navigate to="/" />
  }

  // Si no hay token, permite ver el componente (Login o Registro)
  return children
}

export default ProtectedRouteVotar
