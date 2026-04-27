import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('oxymed_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) {
        alert(data.error || "Email ou mot de passe incorrect")
        setLoading(false)
        return
      }
      setUser(data.user)
      localStorage.setItem('oxymed_user', JSON.stringify(data.user))
      localStorage.setItem('oxymed_token', data.token)
    } catch (err) {
      alert("Erreur de connexion au serveur")
    }
    setLoading(false)
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) {
        alert(data.error || "Erreur lors de l'inscription")
        setLoading(false)
        return false
      }
      alert(data.message)
      setLoading(false)
      return true
    } catch (err) {
      alert("Erreur de connexion au serveur")
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('oxymed_user')
    localStorage.removeItem('oxymed_token')
  }

  const isAdmin = () => user?.role === "admin"
  const isMedecin = () => user?.role === "medecin"
  const isClient = () => user?.role === "client"

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isMedecin, isClient }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)