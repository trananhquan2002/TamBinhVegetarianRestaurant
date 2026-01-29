import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { admin, user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (adminOnly) {
    if (!admin || admin.role !== 'admin') {
      return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
    return children
  }
  return children
}
