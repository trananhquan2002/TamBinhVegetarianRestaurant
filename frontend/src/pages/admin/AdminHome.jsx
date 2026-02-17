import { useEffect, useState, useCallback, useRef } from 'react'
import { FaUsers, FaClipboardList, FaUtensils, FaMoneyBillWave, FaEllipsisV, FaCheckDouble } from 'react-icons/fa'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import io from 'socket.io-client'
const API_BASE_URL = import.meta.env.VITE_API_URL
const socket = io(API_BASE_URL)
export default function AdminHome() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const { notifications, fetchNotifications } = useOutletContext()
  const [stats, setStats] = useState({
    totalUsers: 0,
    newOrders: 0,
    reservations: 0,
    revenue: 0,
  })
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const audioPlayer = useRef(new Audio('/assets/sound/success-chime.mp3'))
  const playNotificationSound = () => {
    const audio = audioPlayer.current
    audio.currentTime = 0
    audio.play().catch((err) => console.log('Chờ tương tác người dùng để phát âm thanh'))
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])
  const fetchStats = useCallback(async () => {
    if (!admin?.token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.status === 403 || res.status === 401) {
        logout()
        navigate('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats || data)
      }
    } catch (err) {
      console.error('Lỗi fetchStats:', err)
    }
  }, [admin?.token, logout, navigate])
  const handleReadAll = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.ok) {
        fetchNotifications()
        setShowMenu(false)
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật thông báo:', err)
    }
  }
  useEffect(() => {
    fetchStats()
  }, [fetchStats])
  useEffect(() => {
    socket.on('new_activity', () => {
      fetchStats()
      if (fetchNotifications) fetchNotifications()
      playNotificationSound()
    })
    socket.on('update_stats', () => {
      fetchStats()
    })
    return () => {
      socket.off('new_activity')
      socket.off('update_stats')
    }
  }, [fetchStats, fetchNotifications])
  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-2xl font-black uppercase mb-1">Bảng điều khiển</h1>
      <p className="text-sm text-gray-400 mb-8">Hoạt động và thông báo hệ thống</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card label="Tổng người dùng" value={stats.totalUsers} icon={<FaUsers />} color="blue" />
        <Link to="/admin/orders" className="no-underline">
          <Card label="Đơn hàng mới" value={stats.newOrders} icon={<FaClipboardList />} color="orange" />
        </Link>
        <Link to="/admin/reservations" className="no-underline">
          <Card label="Lịch đặt bàn" value={stats.reservations} icon={<FaUtensils />} color="green" />
        </Link>
        <Card label="Doanh thu ngày" value={`${stats.revenue?.toLocaleString()}đ`} icon={<FaMoneyBillWave />} color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[30px] shadow-sm relative">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-black uppercase text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Hoạt động gần đây
            </h3>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition-all ${showMenu ? 'bg-gray-100 text-green-600' : 'hover:bg-gray-50 text-gray-400'}`}>
                <FaEllipsisV className="cursor-pointer" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <button onClick={handleReadAll} className="w-full text-left px-4 py-4 text-xs flex items-center gap-3 hover:bg-green-50 text-gray-700 font-black uppercase tracking-wider transition-colors border-none bg-transparent cursor-pointer">
                    <FaCheckDouble className="text-green-500 text-base" /> Đã xem tất cả
                  </button>
                </div>
              )}
            </div>
          </div>
          {!notifications || notifications.filter((n) => !n.isRead).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FaClipboardList className="text-gray-200 text-2xl" />
              </div>
              <p className="text-center text-gray-300 italic text-sm">Hiện tại không có thông báo mới...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications
                .filter((n) => !n.isRead)
                .map((n) => (
                  <Link key={n._id} to={n.type === 'order' ? '/admin/orders' : n.type === 'reservation' ? '/admin/reservations' : '/admin/feedbacks'} className="block no-underline">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent transition-all hover:bg-white hover:shadow-md hover:border-green-200 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${n.type === 'order' ? 'bg-orange-100 text-orange-500' : n.type === 'reservation' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>{n.type === 'order' ? <FaClipboardList /> : <FaUtensils />}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors mb-0.5">{n.content}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Nhấp để xem chi tiết</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-black italic uppercase bg-white px-2 py-1 rounded-lg border shadow-sm">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
        <div className="bg-[#00b34d] text-white p-8 rounded-[30px] flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden group">
          <FaUtensils size={150} className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
              <FaUtensils size={30} className="text-white" />
            </div>
            <h2 className="font-black uppercase text-xl mb-3 tracking-widest">Tâm Bình Admin</h2>
            <div className="w-10 h-1 bg-white/40 mx-auto mb-4 rounded-full"></div>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Chào buổi tối, {admin?.userName || 'Quản trị viên'}!<br />
              Chúc bạn một ngày làm việc hiệu quả!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
function Card({ label, value, icon, color }) {
  const theme = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  }
  return (
    <div className="bg-white p-5 rounded-[25px] border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${theme[color]} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  )
}
