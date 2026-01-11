import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ userName: '', passWord: '', confirmPass: '' })
  const [error, setError] = useState('')
  const handleRegister = async (e) => {
    e.preventDefault()
    if (formData.passWord !== formData.confirmPass) return setError('Mật khẩu không khớp.')
    try {
      const res = await fetch('/api/register', {
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-400 via-purple-500 to-indigo-700 px-4">
      <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Đăng ký</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="Username" onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Mật Khẩu" required onChange={(e) => setFormData({ ...formData, passWord: e.target.value })} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Xác nhận mật khẩu" required onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })} />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button className="w-full bg-green-600 text-white py-2 rounded cursor-pointer">Đăng ký ngay</button>
        <p className="text-center">
          <Link to="/login" className="text-blue-600">
            Đã có tài khoản? Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  )
}
