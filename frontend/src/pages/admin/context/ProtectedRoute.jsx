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
  const isAuth = !!user || !!admin
  return (
    <>
      {!isAuth && location.pathname === '/checkout' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 mx-auto max-w-7xl mt-4 rounded-r-lg shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎁</span>
              <p className="text-blue-700 font-medium">
                Bạn có muốn <span className="font-bold">đăng nhập</span> để nhận ưu đãi cho thành viên và theo dõi đơn hàng dễ dàng hơn không?
              </p>
            </div>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md active:scale-95">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      )}
      {children}
    </>
  )
}
