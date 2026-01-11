import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { admin, loading } = useAuth()
  if (loading) return null
  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }
  if (adminOnly && admin.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}
