import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

const WaitingListContent = () => {
  const [waitingList, setWaitingList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWaitingList = async () => {
      try {
        const token = localStorage.getItem('oxymed_token')
        const res = await fetch('/api/waiting-list/my-list', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setWaitingList(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchWaitingList()
  }, [])

  const handleLeave = async (id) => {
    try {
      const token = localStorage.getItem('oxymed_token')
      await fetch(`/api/waiting-list/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setWaitingList(waitingList.filter(item => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Ma Liste d'Attente
      </h1>

      {waitingList.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow">
          <p className="text-gray-500 text-lg">
            Vous n'etes sur aucune liste d'attente.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {waitingList.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Produit #{item.product_id}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Quantite souhaitee: {item.quantity}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Score de priorite: {item.priority_score}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Inscrit le: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    item.status === 'waiting' ? 'bg-orange-100 text-orange-600' :
                    item.status === 'notified' ? 'bg-blue-100 text-blue-600' :
                    item.status === 'converted' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status === 'waiting' ? 'En attente' :
                     item.status === 'notified' ? 'Notifie' :
                     item.status === 'converted' ? 'Converti' : 'Annule'}
                  </span>
                  {item.status === 'waiting' && (
                    <button
                      onClick={() => handleLeave(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Quitter la liste
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const WaitingListPage = () => {
  return (
    <ProtectedRoute>
      <WaitingListContent />
    </ProtectedRoute>
  )
}

export default WaitingListPage