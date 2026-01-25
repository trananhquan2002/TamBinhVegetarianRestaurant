import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function LoginAdmin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [error, setError] = useState('')
  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/api/login-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, passWord }),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.role === 'admin') {
          login(data)
          navigate('/admin')
        } else {
          setError('Tài khoản này không có quyền truy cập')
        }
      } else {
        setError(data.message || 'Sai tên đăng nhập hoặc mật khẩu')
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-indigo-950 px-4">
      <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Admin Portal</h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-[0.2em]">Quản trị hệ thống</p>
        </div>
        <div className="space-y-4">
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            placeholder="Admin Username"
            autoComplete="username"
            onChange={(e) => {
              setUserName(e.target.value)
              setError('')
            }}
          />
          <input
            type="password"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            placeholder="Admin Password"
            autoComplete="current-password"
            onChange={(e) => {
              setPassWord(e.target.value)
              setError('')
            }}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 cursor-pointer uppercase tracking-widest">Đăng nhập hệ thống</button>
        <div className="text-center pt-2">
          <Link to="/admin/register" className="text-sm text-indigo-600 font-bold">
            Tạo tài khoản quản trị mới
          </Link>
        </div>
      </form>
    </div>
  )
}
