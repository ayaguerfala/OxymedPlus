import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

const MyOrdersContent = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('oxymed_token')
        const res = await fetch('/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setOrders(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Mes Commandes</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow">
          <p className="text-gray-500 text-lg">Vous n'avez pas encore de commandes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Commande #{order.id}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                  order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                  order.status === 'approved' ? 'bg-green-100 text-green-600' :
                  order.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {order.status === 'pending' ? 'En attente' :
                   order.status === 'approved' ? 'Approuvee' :
                   order.status === 'rejected' ? 'Rejetee' : 'Livree'}
                </span>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-semibold text-gray-700 mb-2">Produits:</h3>
                {JSON.parse(order.items || '[]').map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600 py-1">
                    <span>{item.nom} x{item.quantity}</span>
                    <span>{(item.prix * item.quantity).toFixed(2)} DT</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between items-center">
                <p className="font-bold text-lg">Total: {order.total} DT</p>
                {order.delivery_address && (
                  <p className="text-sm text-gray-500">
                    📍 {order.delivery_address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const MyOrders = () => {
  return (
    <ProtectedRoute>
      <MyOrdersContent />
    </ProtectedRoute>
  )
}

export default MyOrders