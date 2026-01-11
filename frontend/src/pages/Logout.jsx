import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Logout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Đang đăng xuất...</h1>
    </div>
  )
}
