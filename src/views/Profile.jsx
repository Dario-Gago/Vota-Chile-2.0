import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans'

const Profile = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)

  const getDeveloperData = () => {
    const token = window.sessionStorage.getItem('token')
    axios
      .get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data: [user] }) => setDeveloper({ ...user }))
      .catch(({ response: { data } }) => {
        console.error(data)
        window.sessionStorage.removeItem('token')
        setDeveloper(null)
        navigate('/')
      })
  }

  useEffect(getDeveloperData, [])

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-2xl shadow-md text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Bienvenido,{' '}
        <span className="text-emerald-500">{getDeveloper?.email}</span>
      </h1>
      <h3 className="text-xl text-gray-600">
        Rol:{' '}
        <span className="font-semibold text-gray-800">{getDeveloper?.rol}</span>
      </h3>
      <h3 className="text-xl text-gray-600 mt-1">
        Lenguaje:{' '}
        <span className="font-semibold text-emerald-600">
          {getDeveloper?.lenguage}
        </span>
      </h3>
    </div>
  )
}

export default Profile
