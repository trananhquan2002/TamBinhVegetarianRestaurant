import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function Register() {
  const navigate = useNavigate()
  const { admin } = useAuth()
  const [formData, setFormData] = useState({ userName: '', passWord: '', confirmPass: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.passWord.length < 6) return setError('Mật khẩu phải ít nhất 6 ký tự.')
    if (formData.passWord !== formData.confirmPass) return setError('Mật khẩu không khớp.')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin?.token}` },
        body: JSON.stringify({
          userName: formData.userName,
          passWord: formData.passWord,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        navigate('/admin/login')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-400 via-purple-500 to-indigo-700 px-4">
      <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Đăng ký Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Tạo thêm tài khoản quản trị hệ thống</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Username</label>
            <input className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Tên đăng nhập" required onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Mật khẩu</label>
            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Mật khẩu" required onChange={(e) => setFormData({ ...formData, passWord: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Xác nhận mật khẩu</label>
            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Xác nhận mật khẩu" required onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100 font-medium">{error}</p>}
        <button disabled={loading} className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-lg transition-all shadow-lg cursor-pointer`}>
          {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
        </button>
        <div className="text-center pt-2">
          <Link to="/admin/login" className="text-indigo-600 hover:underline text-sm font-medium">
            Đã có tài khoản? Quay lại Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}
