import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ userName: '', passWord: '', confirmPass: '' })
  const [error, setError] = useState('')
  const handleRegister = async (e) => {
    e.preventDefault()
    if (formData.passWord !== formData.confirmPass) return setError('Mật khẩu không khớp.')
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.userName,
          passWord: formData.passWord,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        navigate('/login')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#12c2e9] via-[#c471ed] to-[#f64f59] px-4">
      <form onSubmit={handleRegister} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Tâm Bình</h1>
          <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-widest">Đăng ký thành viên</p>
        </div>
        <div className="space-y-4">
          <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-400 transition-all font-medium" placeholder="Tên đăng nhập" onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
          <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-400 transition-all font-medium" placeholder="Mật khẩu" required onChange={(e) => setFormData({ ...formData, passWord: e.target.value })} />
          <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-400 transition-all font-medium" placeholder="Xác nhận mật khẩu" required onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })} />
        </div>
        {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-xl">{error}</p>}
        <button className="w-full bg-linear-to-r from-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider">Đăng ký ngay</button>
        <div className="text-center">
          <p className="text-gray-500 text-sm font-medium">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-600 font-bold">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
