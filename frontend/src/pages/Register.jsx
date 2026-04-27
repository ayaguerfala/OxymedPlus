import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Register = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    role: 'client',
    cnom: ''
  })
  const { loading, register } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (formData.role === 'medecin' && !formData.cnom) {
      alert('Veuillez entrer votre numero CNOM')
      return
    }
    const success = await register(formData)
    if (success) {
      onSwitchToLogin()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4 my-4">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Inscription
        </h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFormData({ ...formData, role: 'client' })}
            className={`flex-1 py-2 rounded-lg font-semibold border-2 ${
              formData.role === 'client'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setFormData({ ...formData, role: 'medecin' })}
            className={`flex-1 py-2 rounded-lg font-semibold border-2 ${
              formData.role === 'medecin'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            Medecin
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="prenom"
            placeholder="Prenom *"
            value={formData.prenom}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="nom"
            placeholder="Nom *"
            value={formData.nom}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe *"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
          <input
            type="tel"
            name="telephone"
            placeholder="Telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
          {formData.role === 'medecin' && (
            <input
              type="text"
              name="cnom"
              placeholder="Numero CNOM *"
              value={formData.cnom}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:outline-none focus:border-green-500"
            />
          )}
        </div>

        {formData.role === 'medecin' && (
          <p className="mt-2 text-sm text-orange-500">
            Votre compte medecin sera active apres approbation de l'administrateur.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full text-white py-3 rounded-lg font-bold disabled:opacity-50 ${
            formData.role === 'medecin'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Deja un compte?{" "}
          <span
            onClick={onSwitchToLogin}
            className="text-blue-600 cursor-pointer hover:underline font-semibold"
          >
            Se connecter
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

export default Register