import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showList, setShowList] = useState(false)
  const { user } = useAuth()

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('oxymed_token')
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.is_read).length)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('oxymed_token')
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('oxymed_token')
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="relative p-2 text-gray-600 hover:text-blue-600"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showList && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 border">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 p-4">Aucune notification</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !notif.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell