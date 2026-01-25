import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function RegisterAdmin() {
  const navigate = useNavigate()
  const { admin } = useAuth()
  const [formData, setFormData] = useState({ userName: '', passWord: '', confirmPass: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.passWord.length < 6) return setError('Mật khẩu tối thiểu 6 ký tự.')
    if (formData.passWord !== formData.confirmPass) return setError('Mật khẩu không khớp.')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/register-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin?.token}`,
        },
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-indigo-950 px-4">
      <form onSubmit={handleRegister} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">New Admin</h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">Thêm tài khoản quản trị</p>
        </div>
        <div className="space-y-4">
          <div>
            <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="Admin Username" required onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
          </div>
          <div>
            <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="Mật khẩu" required onChange={(e) => setFormData({ ...formData, passWord: e.target.value })} />
          </div>
          <div>
            <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="Xác nhận mật khẩu" required onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}
        <button disabled={loading} className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 cursor-pointer'} text-white font-bold py-4 rounded-2xl transition-all shadow-xl uppercase tracking-widest`}>
          {loading ? 'Đang khởi tạo...' : 'Tạo tài khoản'}
        </button>
        <div className="text-center">
          <Link to="/admin/login" className="text-indigo-600 hover:underline text-sm font-bold uppercase tracking-tight">
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}
