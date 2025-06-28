import { Navigate } from 'react-router-dom'

const ProtectedRouteHome = ({ children }) => {
  const token = sessionStorage.getItem('token') // Obtener el token del localStorage

  if (token) {
    return <Navigate to="/votar" />
  }

  // Si no hay token, permite ver el componente (Login o Registro)
  return children
}

export default ProtectedRouteHome
