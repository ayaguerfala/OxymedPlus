import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-xl p-8 text-center shadow max-w-md mx-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Acces Restreint
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez etre connecte pour acceder a cette page.
          </p>
          <p className="text-sm text-gray-500">
            Cliquez sur "Connexion" dans la barre de navigation.
          </p>
        </div>
      </div>
    )
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-xl p-8 text-center shadow max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acces Refuse
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions necessaires pour acceder a cette page.
          </p>
          <p className="text-sm text-gray-500">
            Cette page est reservee aux administrateurs.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute