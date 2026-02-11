import { useState, useEffect, useCallback, useMemo } from 'react'
import { FaEye, FaPhoneAlt, FaMapMarkerAlt, FaTimes, FaUser, FaCalendarAlt, FaSearch, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa'
import io from 'socket.io-client'
import { useAuth } from './context/AuthContext'
import toast, { Toaster } from 'react-hot-toast'
const API_BASE_URL = import.meta.env.VITE_API_URL
const socket = io(API_BASE_URL)
export default function OrderManager() {
  const { admin } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterDate, setFilterDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const fetchOrders = useCallback(async () => {
    if (!admin?.token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders?date=${filterDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } else if (res.status === 401) {
        toast.error('Phiên đăng nhập hết hạn!')
      }
    } catch (err) {
      console.error('Lỗi fetchOrders:', err)
      toast.error('Lỗi kết nối máy chủ!')
    }
  }, [filterDate, admin?.token])
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])
  useEffect(() => {
    socket.on('new_activity', (newRes) => {
      fetchOrders()
      toast.success(`Đơn hàng mới từ ${guestName}`)
    })
    return () => socket.off('new_activity')
  }, [fetchOrders])
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || order.phone?.includes(searchTerm)
      const matchStatus = statusFilter === 'all' || order.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [orders, searchTerm, statusFilter])
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(start, start + itemsPerPage)
  }, [filteredOrders, currentPage])
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, filterDate])
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!admin?.token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.token}` },
        body: JSON.stringify({ status: newStatus }),
      })
      const updated = await res.json()
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)))
        toast.success('Đã duyệt đơn hàng!')
        if (selectedOrder?._id === orderId) setSelectedOrder(updated)
        socket.emit('confirmOrder', updated)
      }
    } catch (err) {
      toast.error('Lỗi kết nối!')
    }
  }
  return (
    <div className="p-4 sm:p-8 bg-[#FDFDFD] min-h-screen">
      <Toaster position="top-right" />
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 uppercase tracking-tighter shrink-0">Đơn hàng</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex-1 md:w-64">
            <FaSearch className="text-gray-400" />
            <input type="text" placeholder="Tìm tên, số điện thoại..." className="border-none focus:ring-0 font-bold text-gray-700 text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            <FaFilter className="text-blue-500 text-xs" />
            <select className="border-none focus:ring-0 font-bold text-gray-700 text-sm bg-transparent cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="confirmed">Đã duyệt</option>
            </select>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            <FaCalendarAlt className="text-green-600 shrink-0" />
            <input type="date" className="border-none focus:ring-0 font-bold text-gray-700 text-sm cursor-pointer" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="hidden lg:block bg-white rounded-[35px] shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Thanh toán</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-6">
                  <p className="font-black text-gray-800 uppercase text-sm">{order.customerName}</p>
                  <p className="text-[10px] text-gray-400 font-medium truncate max-w-62.5">{order.address?.detail || order.address}</p>
                </td>
                <td className="p-6 text-center">
                  <p className="font-black text-blue-600">{order.totalAmount?.toLocaleString()}đ</p>
                  <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded font-black text-gray-400 uppercase">COD</span>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>{order.status === 'confirmed' ? 'Đã duyệt' : 'Chờ duyệt'}</span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all cursor-pointer">
                      <FaEye size={16} />
                    </button>
                    {order.status === 'pending' && (
                      <button onClick={() => handleUpdateStatus(order._id, 'confirmed')} className="h-10 px-4 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 cursor-pointer transition-transform active:scale-95">
                        Duyệt
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden space-y-4">
        {currentOrders.map((order) => (
          <div key={order._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-black text-gray-800 uppercase text-base">{order.customerName}</p>
                <p className="text-xs text-blue-600 font-black mt-1">{order.totalAmount?.toLocaleString()}đ</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${order.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{order.status === 'confirmed' ? 'Đã duyệt' : 'Chờ'}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedOrder(order)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2">
                <FaEye /> Chi tiết
              </button>
              {order.status === 'pending' && (
                <button onClick={() => handleUpdateStatus(order._id, 'confirmed')} className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-100">
                  Duyệt đơn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl disabled:opacity-30 shadow-sm hover:bg-gray-50 transition-colors">
            <FaChevronLeft className="text-gray-600 text-xs" />
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl disabled:opacity-30 shadow-sm hover:bg-gray-50 transition-colors">
            <FaChevronRight className="text-gray-600 text-xs" />
          </button>
        </div>
      )}
      {filteredOrders.length === 0 && <div className="py-20 text-center text-gray-300 font-bold italic">Không tìm thấy đơn hàng nào phù hợp...</div>}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-5xl sm:rounded-[40px] rounded-t-[40px] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[95vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="md:w-5/12 bg-gray-50 p-6 sm:p-10 border-r border-gray-100 overflow-y-auto">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="text-xl font-black uppercase text-gray-800">Thông tin</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400">
                  <FaTimes size={24} />
                </button>
              </div>
              <h3 className="hidden md:block text-2xl font-black uppercase mb-8 text-gray-800">Khách hàng</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <FaUser />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Họ tên</p>
                    <p className="font-black truncate">{selectedOrder.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm shrink-0">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Liên hệ</p>
                    <p className="font-black">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Giao tới</p>
                    <p className="font-bold text-gray-600 text-sm leading-relaxed">{selectedOrder.address?.detail || selectedOrder.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-7/12 p-6 sm:p-10 flex flex-col bg-white relative overflow-hidden">
              <button onClick={() => setSelectedOrder(null)} className="hidden md:block absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors">
                <FaTimes size={24} />
              </button>
              <h3 className="text-xl sm:text-2xl font-black uppercase mb-6 text-gray-800">Món đã đặt</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {(selectedOrder.items || selectedOrder.cartItems || []).map((item, i) => {
                  return (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-3 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-green-600 text-sm shadow-sm shrink-0 border border-gray-100">{item.quantity}</div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-xs">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/assets/images/${item.image}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Error'
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 mb-1">{item.title}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 font-extrabold uppercase tracking-wide">Đơn giá: {item.price?.toLocaleString()}đ</p>
                        </div>
                      </div>
                      <p className="font-black text-gray-800 text-sm sm:text-base ml-2">{(item.price * item.quantity).toLocaleString()}đ</p>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 bg-gray-900 p-6 rounded-[30px] flex justify-between items-center">
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Tổng tiền</p>
                  <p className="text-white text-[10px] opacity-70 truncate">Ship: {selectedOrder.shippingFee?.toLocaleString()}đ</p>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white">{selectedOrder.totalAmount?.toLocaleString()}đ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
