import { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext()
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
    }
    setLoading(false)
  }, [])
  const login = (data) => {
    setAdmin(data)
    localStorage.setItem('admin', JSON.stringify(data))
  }
  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('admin')
  }
  return <AuthContext.Provider value={{ admin, login, logout, loading }}>{!loading && children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
