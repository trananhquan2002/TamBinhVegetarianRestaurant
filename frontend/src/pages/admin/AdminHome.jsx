import { useEffect, useState, useCallback } from 'react'
import { FaUsers, FaClipboardList, FaUtensils, FaMoneyBillWave } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import io from 'socket.io-client'
const socket = io('http://localhost:5000')
export default function AdminHome() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    newOrders: 0,
    reservations: 0,
    revenue: 0,
  })
  const [notifications, setNotifications] = useState([])
  const fetchStats = useCallback(async () => {
    if (!admin?.token) return
    try {
      const res = await fetch('/api/stats', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.status === 403 || res.status === 401) {
        console.error('Bạn không có quyền quản trị!')
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
  const fetchNotifications = useCallback(async () => {
    if (!admin?.token) return
    try {
      const res = await fetch('/api/notifications', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.status === 403 || res.status === 401) {
        console.error('Bạn không có quyền quản trị!')
        logout()
        navigate('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setNotifications(data)
      }
    } catch (err) {
      console.error('Lỗi fetchNotifications:', err)
    }
  }, [admin?.token, logout, navigate])
  useEffect(() => {
    fetchStats()
    fetchNotifications()
  }, [fetchStats, fetchNotifications])
  useEffect(() => {
    socket.on('update_stats', () => {
      fetchStats()
    })
    socket.on('new_activity', (noti) => {
      setNotifications((prev) => {
        const isExisted = prev.find((item) => item._id === noti._id)
        if (isExisted) return prev
        return [noti, ...prev].slice(0, 15)
      })
      fetchStats()
    })
    return () => {
      socket.off('update_stats')
      socket.off('new_activity')
    }
  }, [fetchStats])
  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-2xl font-black uppercase mb-1">Bảng điều khiển</h1>
      <p className="text-sm text-gray-400 mb-8">Hoạt động và thông báo hệ thống</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 cursor-pointer">
        <Card label="Tổng người dùng" value={stats.totalUsers} icon={<FaUsers />} color="blue" />
        <Link to="/admin/orders">
          <Card label="Đơn hàng mới" value={stats.newOrders} icon={<FaClipboardList />} color="orange" />
        </Link>
        <Link to="/admin/reservations">
          <Card label="Lịch đặt bàn" value={stats.reservations} icon={<FaUtensils />} color="green" />
        </Link>
        <Card label="Doanh thu ngày" value={`${stats.revenue.toLocaleString()}đ`} icon={<FaMoneyBillWave />} color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[30px] shadow-sm">
          <h3 className="font-black uppercase text-sm mb-5 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Hoạt động gần đây
          </h3>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-300 italic py-10">Chưa có hoạt động nào được ghi lại...</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <Link key={n._id} to={n.type === 'order' ? '/admin/orders' : n.type === 'reservation' ? '/admin/reservations' : '/admin/feedback'} className="block no-underline">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border transition-all hover:bg-white hover:shadow-md hover:border-green-400 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.type === 'order' ? 'bg-orange-100 text-orange-500' : n.type === 'reservation' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>{n.type === 'order' ? <FaClipboardList /> : <FaUtensils />}</div>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors">{n.content}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-black italic uppercase">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#00b34d] text-white p-8 rounded-[30px] flex flex-col justify-center items-center text-center shadow-lg shadow-green-100">
          <FaUtensils size={40} className="opacity-40 mb-4" />
          <h2 className="font-black uppercase text-lg mb-2">Nhà hàng chay Tâm Bình</h2>
          <p className="text-xs opacity-80 leading-relaxed font-medium">Chúc bạn một ngày làm việc hiệu quả và phục vụ khách hàng thật tốt!</p>
        </div>
      </div>
    </div>
  )
}
function Card({ label, value, icon, color }) {
  const theme = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div className="bg-white p-5 rounded-[25px] border flex items-center gap-4 hover:shadow-lg transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${theme[color]} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-black text-gray-800">{value}</p>
      </div>
    </div>
  )
}
