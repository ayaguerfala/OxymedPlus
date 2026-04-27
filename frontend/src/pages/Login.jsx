import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Login = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Veuillez remplir tous les champs')
      return
    }
    login(email, password)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Connexion
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-2 text-sm text-gray-500">
          <p>Test comptes :</p>
          <p>admin@oxymed.com / admin123</p>
          <p>medecin@oxymed.com / med123</p>
          <p>client@oxymed.com / client123</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Pas encore de compte?{" "}
          <span
            onClick={onSwitchToRegister}
            className="text-blue-600 cursor-pointer hover:underline font-semibold"
          >
            S'inscrire
          </span>
        </p>

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}

export default Login