import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Link } from 'react-router-dom'
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [error, setError] = useState('')
  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/login-admin', {
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
          setError('Tài khoản này không có quyền truy cập quản trị')
        }
      } else {
        setError(data.message || 'Tên người dùng hoặc mật khẩu không đúng.')
      }
    } catch (err) {
      setError('Không thể kết nối máy chủ.')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-400 via-purple-500 to-indigo-700 px-4">
      <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Admin Login</h1>
        <input
          className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Username"
          autoComplete="username"
          onChange={(e) => {
            setUserName(e.target.value)
            setError('')
          }}
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          autoComplete="current-password"
          onChange={(e) => {
            setPassWord(e.target.value)
            setError('')
          }}
        />
        {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded">{error}</p>}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold transition duration-200 cursor-pointer shadow-md">Đăng nhập</button>
        <div className="text-center pt-2">
          <Link to="/admin/register">
            <button type="button" className="text-sm text-indigo-600 hover:underline cursor-pointer">
              Tạo tài khoản quản trị mới
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}
