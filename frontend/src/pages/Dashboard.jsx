import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

const DashboardContent = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    nom: '', prix: '', moq: '', stock: '',
    description: '', type_affichage: 'photo', categorie: ''
  })

  const token = localStorage.getItem('oxymed_token')

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const loadAll = async () => {
      await fetchStats()
      await fetchOrders()
      await fetchUsers()
      await fetchProducts()
      setLoading(false)
    }
    loadAll()
  }, [])

  const handleApproveOrder = async (id) => {
    await fetch(`/api/orders/${id}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchOrders()
    fetchStats()
  }

  const handleRejectOrder = async (id) => {
    await fetch(`/api/orders/${id}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchOrders()
    fetchStats()
  }

  const handleApproveUser = async (id) => {
    await fetch(`/api/admin/users/${id}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchUsers()
  }

  const handleRejectUser = async (id) => {
    await fetch(`/api/admin/users/${id}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchUsers()
  }

  const handleSuspendUser = async (id) => {
    await fetch(`/api/admin/users/${id}/suspend`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchUsers()
  }

  const handleToggleProduct = async (id) => {
    await fetch(`/api/admin/products/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchProducts()
    fetchStats()
  }

  const handleAddProduct = async () => {
    if (!newProduct.nom || !newProduct.prix || !newProduct.moq || !newProduct.stock) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      })
      if (res.ok) {
        alert('Produit ajoute avec succes!')
        setShowAddProduct(false)
        setNewProduct({ nom: '', prix: '', moq: '', stock: '', description: '', type_affichage: 'photo', categorie: '' })
        fetchProducts()
        fetchStats()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Tableau de Bord Admin
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <h3 className="text-gray-500 text-sm">Total Commandes</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats?.total_orders || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <h3 className="text-gray-500 text-sm">En Attente</h3>
          <p className="text-4xl font-bold text-orange-500 mt-2">{stats?.pending_orders || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <h3 className="text-gray-500 text-sm">Utilisateurs</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <h3 className="text-gray-500 text-sm">Produits Actifs</h3>
          <p className="text-4xl font-bold text-purple-500 mt-2">{stats?.active_products || 0}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Commandes ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Utilisateurs ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Produits ({products.length})
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Commandes</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">Aucune commande</p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div key={order.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div>
                    <p className="font-semibold">
                      Commande #{order.id} — {order.client_prenom} {order.client_nom}
                    </p>
                    <p className="text-sm text-gray-600">Total: {order.total} DT</p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                      order.status === 'approved' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {order.status}
                    </span>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveOrder(order.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Utilisateurs</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">Aucun utilisateur</p>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map((u) => (
                <div key={u.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div>
                    <p className="font-semibold">{u.prenom} {u.nom}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-red-100 text-red-600' :
                        u.role === 'medecin' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.is_approved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {u.is_approved ? 'Approuve' : 'En attente'}
                      </span>
                      {!u.is_active && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                          Suspendu
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {u.role === 'medecin' && !u.is_approved && (
                      <>
                        <button
                          onClick={() => handleApproveUser(u.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleRejectUser(u.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {u.is_active && u.role !== 'admin' && (
                      <button
                        onClick={() => handleSuspendUser(u.id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                      >
                        Suspendre
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Produits</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              + Ajouter un produit
            </button>
          </div>

          {/* ADD PRODUCT FORM */}
          {showAddProduct && (
            <div className="border rounded-xl p-4 mb-4 bg-gray-50">
              <h3 className="font-bold text-gray-800 mb-3">Nouveau Produit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nom *"
                  value={newProduct.nom}
                  onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                  className="border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Prix (DT) *"
                  value={newProduct.prix}
                  onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })}
                  className="border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="MOQ *"
                  value={newProduct.moq}
                  onChange={(e) => setNewProduct({ ...newProduct, moq: e.target.value })}
                  className="border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Stock *"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Categorie"
                  value={newProduct.categorie}
                  onChange={(e) => setNewProduct({ ...newProduct, categorie: e.target.value })}
                  className="border rounded p-2"
                />
                <select
                  value={newProduct.type_affichage}
                  onChange={(e) => setNewProduct({ ...newProduct, type_affichage: e.target.value })}
                  className="border rounded p-2"
                >
                  <option value="photo">Photo</option>
                  <option value="galerie">Galerie</option>
                  <option value="3D">3D</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="border rounded p-2 md:col-span-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddProduct}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* PRODUCTS LIST */}
          {products.length === 0 ? (
            <p className="text-gray-500">Aucun produit</p>
          ) : (
            <div className="flex flex-col gap-3">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div>
                    <p className="font-semibold">{product.nom}</p>
                    <p className="text-sm text-gray-600">
                      {product.prix} DT — MOQ: {product.moq} — Stock: {product.stock}
                    </p>
                    <p className="text-xs text-gray-400">{product.categorie} — {product.type_affichage}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {product.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <button
                      onClick={() => handleToggleProduct(product.id)}
                      className={`px-3 py-1 rounded text-sm text-white ${
                        product.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {product.is_active ? 'Desactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Dashboard = () => {
  return (
    <ProtectedRoute adminOnly={true}>
      <DashboardContent />
    </ProtectedRoute>
  )
}

export default Dashboard