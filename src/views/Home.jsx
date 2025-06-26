import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect } from 'react'
import { ENDPOINT } from '../config/constans'

const Home = () => {
  const { setDeveloper } = useContext(Context)

  const getDeveloperData = () => {
    const token = window.sessionStorage.getItem('token')
    if (token) {
      axios
        .get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data: [user] }) => setDeveloper({ ...user }))
        .catch(() => {
          window.sessionStorage.removeItem('token')
          setDeveloper(null)
        })
    }
  }

  useEffect(getDeveloperData, [])

  return (
    <div className="max-w-3xl mx-auto mt-20 p-10 bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-2xl shadow-lg text-center transition transform hover:scale-[1.02]">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Bienvenido a <span className="text-emerald-500">Vota chile</span>
      </h1>
      <h4 className="text-lg text-gray-600 leading-relaxed">
        El lugar donde todos las <span className="font-medium">Personas</span>{' '}
        <br />
        podrán votar en linea
      </h4>
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 bg-emerald-50 p-6 rounded-xl shadow-lg">
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
          alt="Votar"
          className="w-32 h-32 md:w-40 md:h-40 object-contain"
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            ¡Votá con un solo click!
          </h2>
          <p className="text-gray-600 text-md">
            Elegí tu candidato de forma rápida, simple y segura.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
