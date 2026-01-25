import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [error, setError] = useState('')
  const from = location.state?.from?.pathname
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
          navigate(from, { replace: true })
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
        navigate(from, { replace: true })
      } else {
        setError(data.message || 'Tên người dùng hoặc mật khẩu không đúng.')
      }
    } catch (err) {
      setError('Không thể kết nối máy chủ.')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-400 via-purple-500 to-indigo-700 px-4">
      <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Tâm Bình</h1>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Đăng nhập hệ thống</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              placeholder="Tên đăng nhập"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value)
                setError('')
              }}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              placeholder="Mật khẩu"
              value={passWord}
              onChange={(e) => {
                setPassWord(e.target.value)
                setError('')
              }}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-[11px] text-center font-bold bg-red-50 py-2.5 rounded-xl border border-red-100 animate-pulse">{error}</p>}
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 cursor-pointer uppercase tracking-tight">
          Đăng nhập ngay
        </button>
        <div className="relative flex items-center py-1">
          <div className="grow border-t border-gray-100"></div>
          <span className="shrink mx-4 text-gray-300 text-[10px] font-bold uppercase">Hoặc</span>
          <div className="grow border-t border-gray-100"></div>
        </div>
        <button type="button" onClick={() => googleLogin()} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3.5 rounded-2xl font-bold shadow-sm transition-all active:scale-95 cursor-pointer">
          <FcGoogle className="text-2xl" />
          <span className="text-sm">Tiếp tục với Google</span>
        </button>
        <div className="pt-2 text-center">
          <Link to="/register">
            <span className="text-gray-400 text-xs font-medium">Chưa có tài khoản? </span>
            <span className="text-indigo-600 hover:text-indigo-800 font-black text-xs transition-all cursor-pointer">Tạo tài khoản mới</span>
          </Link>
        </div>
      </form>
    </div>
  )
}
