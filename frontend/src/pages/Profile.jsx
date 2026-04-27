import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

const ProfileContent = () => {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Mon Profil</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user.prenom[0]}{user.nom[0]}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.prenom} {user.nom}
            </h2>
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
              user.role === 'admin' ? 'bg-red-100 text-red-600' :
              user.role === 'medecin' ? 'bg-green-100 text-green-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Email</span>
            <span className="font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Role</span>
            <span className="font-semibold capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Statut</span>
            <span className={`font-semibold ${user.is_approved ? 'text-green-600' : 'text-orange-500'}`}>
              {user.is_approved ? 'Actif' : 'En attente d\'approbation'}
            </span>
          </div>
        </div>

        {user.role === 'medecin' && !user.is_approved && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-600 font-semibold">Compte en attente</p>
            <p className="text-orange-500 text-sm mt-1">
              Votre compte medecin est en cours de validation par l'administrateur.
              Vous serez notifie des que votre compte sera approuve.
            </p>
          </div>
        )}

        {user.role === 'medecin' && user.is_approved && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 font-semibold">Compte medecin approuve ✅</p>
            <p className="text-green-500 text-sm mt-1">
              Votre compte medecin est actif. Vous beneficiez d'une priorite accrue.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 font-bold"
      >
        Deconnexion
      </button>
    </div>
  )
}

const Profile = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

export default Profile