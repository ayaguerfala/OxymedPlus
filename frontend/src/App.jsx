import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import NotificationBell from './components/NotificationBell'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Home from './pages/Home'
import MyOrders from './pages/MyOrders'
import WaitingListPage from './pages/WaitingListPage'
import useProductsAPI from './hooks/useProductsAPI'
import { useAuth } from './context/AuthContext'

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { products, loading, error } = useProductsAPI()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('showRegister') === 'true') {
      setShowRegister(true)
    }
  }, [])

  const handleCatalogueClick = () => {
    if (!user) {
      setShowRegister(true)
      return
    }
    navigate('/catalogue')
  }

  const getRoleBadgeClass = () => {
    if (!user) return ''
    if (user.role === 'admin') return 'bg-purple-100 text-purple-700'
    if (user.role === 'medecin' || user.role === 'doctor') return 'bg-green-100 text-green-700'
    return 'bg-blue-100 text-blue-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-600">Chargement des produits...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 text-xl font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Reessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <img
            src="https://oxymedplus.com/storage/2024/11/OXYMED_PLUS-removebg-preview-1.png"
            alt="OxymedPlus"
            onClick={() => navigate('/')}
            className="h-10 cursor-pointer"
          />
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <button
              onClick={handleCatalogueClick}
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              Catalogue
            </button>
            {user ? (
              <>
                <span className="text-gray-600 flex items-center gap-2">
                  Bonjour, <strong>{user.prenom}</strong>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeClass()}`}>
                    {user.role}
                  </span>
                </span>
                <NotificationBell />
                <button
                  onClick={() => navigate('/my-orders')}
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  Mes Commandes
                </button>
                <button
                  onClick={() => navigate('/waiting-list')}
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  Liste d'Attente
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  Mon Profil
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-semibold"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
                >
                  Connexion
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-semibold"
                >
                  Inscription
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/catalogue"
          element={
            <div className="max-w-6xl mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    nom={product.nom}
                    prix={product.prix}
                    moq={product.moq}
                    stock={product.stock}
                    image_couverture={product.image_couverture}
                    type_affichage={product.type_affichage}
                    id={product.id}
                    onDetailsClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </div>
          }
        />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/waiting-list" element={<WaitingListPage />} />
      </Routes>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )}
    </div>
  )
}

export default App