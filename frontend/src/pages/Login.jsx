import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
const API_BASE_URL = import.meta.env.VITE_API_URL

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [error, setError] = useState('')

  // Cấu hình Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const loadingToast = toast.loading('Đang xác thực với Google...')
      try {
        const response = await fetch(`${API_BASE_URL}/api/loginGoogle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            tokengoogle: codeResponse.access_token,
          },
        })
        const data = await response.json()

        toast.dismiss(loadingToast)

        if (response.ok) {
          login(data)
          toast.success('Chào mừng ' + data.userName + ' đã quay trở lại!')
          navigate('/')
        } else {
          toast.error(data.message || 'Tài khoản không được phép truy cập')
        }
      } catch (err) {
        toast.dismiss(loadingToast)
        toast.error('Lỗi kết nối server Backend')
      }
    },
    onError: (error) => {
      console.log('Login failed: ', error)
      toast.error('Đăng nhập Google thất bại hoặc bạn đã đóng cửa sổ')
    },
  })

  // Đăng nhập bằng tài khoản thường
  async function handleLogin(e) {
    e.preventDefault()
    if (!userName || !passWord) return setError('Vui lòng nhập đầy đủ thông tin')
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, passWord }),
      })
      const data = await res.json()
      if (res.ok) {
        login(data)
        navigate('/')
      } else {
        setError(data.message || 'Tên người dùng hoặc mật khẩu không đúng.')
      }
    } catch (err) {
      setError('Không thể kết nối máy chủ.')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-400 via-purple-500 to-indigo-700 px-4">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm space-y-5">
        <h1 className="text-3xl font-black text-center text-gray-800 tracking-tight italic">TÂM BÌNH</h1>
        <div className="space-y-3">
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            placeholder="Tên đăng nhập"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value)
              setError('')
            }}
          />
          <input
            type="password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            placeholder="Mật khẩu"
            value={passWord}
            onChange={(e) => {
              setPassWord(e.target.value)
              setError('')
            }}
          />
        </div>
        {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-2 rounded-lg">{error}</p>}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 cursor-pointer">Đăng nhập hệ thống</button>
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-100"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400 font-medium">Hoặc</span>
          </div>
        </div>
        <button type="button" onClick={() => googleLogin()} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold shadow-sm transition-all active:scale-95 cursor-pointer">
          <FcGoogle className="text-2xl" />
          <span>Tiếp tục với Google</span>
        </button>
        <div className="pt-4 text-center border-t border-gray-50">
          <Link to="/register">
            <button type="button" className="text-indigo-600 hover:text-indigo-800 font-black text-sm transition-all cursor-pointer">
              Tạo tài khoản mới ngay
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}
