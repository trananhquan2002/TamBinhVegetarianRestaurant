import { useState, useEffect, useCallback } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { FaHome, FaBox, FaUtensils, FaComments, FaBars, FaTimes, FaBell } from 'react-icons/fa'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from './context/AuthContext'
import io from 'socket.io-client'
const API_BASE_URL = import.meta.env.VITE_API_URL
const socket = io(API_BASE_URL)
export default function AdminLayout() {
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [prevCount, setPrevCount] = useState(0)
  const fetchNotifications = useCallback(async () => {
    if (!admin?.token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setNotifications(data)
          setPrevCount(data.length)
        }
      }
    } catch (err) {
      console.error('Lỗi fetchNotifications:', err)
    }
  }, [admin?.token, prevCount])
  useEffect(() => {
    fetchNotifications()
    socket.on('new_activity', (noti) => {
      setNotifications((prev) => {
        const isExisted = prev.find((item) => item._id === noti._id)
        if (isExisted) return prev
        return [noti, ...prev].slice(0, 15)
      })
    })
    return () => socket.off('new_activity')
  }, [fetchNotifications])
  const navItems = [
    { path: '/admin', icon: <FaHome />, label: 'Trang chủ' },
    { path: '/admin/orders', icon: <FaBox />, label: 'Đơn hàng' },
    { path: '/admin/reservations', icon: <FaUtensils />, label: 'Đặt bàn' },
    { path: '/admin/feedback', icon: <FaComments />, label: 'Góp ý' },
  ]
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white h-full">
          <div className="p-6 flex justify-between items-center border-b">
            <h1 className="text-xl font-bold text-green-600">TÂM BÌNH</h1>
            <button onClick={() => setIsSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/admin'} onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-500 text-white' : 'text-gray-600'}`}>
                {item.icon} <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-md fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-green-600 uppercase italic">Tâm Bình Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/admin'} className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition ${isActive ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              {item.icon} <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 lg:ml-64 w-full">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-30">
          <button className="lg:hidden text-2xl" onClick={() => setIsSidebarOpen(true)}>
            <FaBars />
          </button>
          <span className="font-medium text-gray-500 hidden sm:inline italic text-sm">Hệ thống quản lý Nhà hàng Chay</span>
          <div className="flex items-center gap-4">
            {admin ? (
              <div className="flex items-center gap-3 bg-white border border-gray-100 py-1 pl-1 pr-4 rounded-full shadow-sm">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md">{(typeof admin === 'string' ? admin : admin.userName)?.charAt(0).toUpperCase()}</div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Admin</span>
                  <span className="text-sm font-extrabold text-gray-700 leading-tight">{typeof admin === 'string' ? admin : admin.userName}</span>
                </div>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button
                  onClick={() => {
                    logout()
                    navigate('/admin/login')
                  }}
                  className="text-gray-400 hover:text-red-500 transition-all hover:scale-110 cursor-pointer"
                  title="Đăng xuất">
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-all font-medium text-sm shadow-lg">
                <FiUser size={18} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </header>
        <main className="p-4 md:p-8 animate-fadeIn">
          <Outlet context={{ notifications, fetchNotifications }} />
        </main>
      </div>
    </div>
  )
}
