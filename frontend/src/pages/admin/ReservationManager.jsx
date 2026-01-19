import { useState, useEffect, useCallback, useMemo } from 'react'
import { FaCalendarAlt, FaCheck, FaPhoneAlt, FaUsers, FaClock, FaUserAlt, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { formatDateTimeVN } from '../../utils/formatDate'
import io from 'socket.io-client'
import { useAuth } from './context/AuthContext'
const API_BASE_URL = import.meta.env.VITE_API_URL
const socket = io(API_BASE_URL)
export default function ReservationManager() {
  const { admin } = useAuth()
  const [reservations, setReservations] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const fetchData = useCallback(async () => {
    if (!admin?.token) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations?date=${filterDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        const raw = Array.isArray(data) ? data : data.data || []
        setReservations(raw.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      } else if (res.status === 401) {
        toast.error('Phiên đăng nhập hết hạn!')
      }
    } catch (err) {
      console.error('Lỗi fetchData:', err)
      toast.error('Lỗi kết nối máy chủ!')
    } finally {
      setLoading(false)
    }
  }, [filterDate, admin?.token])
  useEffect(() => {
    fetchData()
  }, [fetchData])
  useEffect(() => {
    socket.on('new_activity', (newRes) => {
      fetchData()
      toast.success(`Yêu cầu đặt bàn mới từ ${guestName}`)
    })
    return () => socket.off('new_activity')
  }, [fetchData])
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.token}` },
        body: JSON.stringify({ status: 'confirmed' }),
      })
      const updated = await res.json()
      if (res.ok) {
        setReservations((prev) => prev.map((i) => (i._id === id ? { ...i, status: 'confirmed' } : i)))
        socket.emit('confirmReservation', updated)
        toast.success('Đã duyệt đặt bàn!')
      }
    } catch {
      toast.error('Lỗi hệ thống!')
    }
  }
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone.includes(searchTerm))
  }, [reservations, searchTerm])
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredReservations.slice(start, start + itemsPerPage)
  }, [filteredReservations, currentPage])
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterDate])
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-[30px] border shadow-sm flex flex-col xl:flex-row justify-between gap-5">
        <div>
          <h2 className="text-3xl font-black uppercase">Đặt bàn</h2>
          <p className="text-sm text-gray-400 font-bold uppercase mt-1">Lịch hẹn khách hàng</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center bg-gray-50 border px-4 py-3 rounded-2xl md:w-80">
            <FaSearch className="text-gray-400 mr-3" />
            <input type="text" placeholder="Tìm tên hoặc số điện thoại..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent outline-none font-bold w-full text-sm" />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center bg-gray-50 border px-4 py-3 rounded-2xl">
              <FaCalendarAlt className="text-green-600 mr-3" />
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="bg-transparent outline-none font-bold" />
            </div>
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="px-5 py-3 bg-black text-white rounded-2xl text-xs font-black uppercase">
                Tất cả
              </button>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-24 text-gray-300 font-black animate-pulse">ĐANG TẢI...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] text-center text-gray-400 font-black uppercase border-2 border-dashed">Không tìm thấy kết quả phù hợp</div>
      ) : (
        <>
          <div className="hidden lg:block bg-white rounded-[35px] overflow-hidden shadow border">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 border-b">
                <tr>
                  <th className="p-6 text-left">Khách hàng</th>
                  <th className="p-6 text-center">Liên hệ</th>
                  <th className="p-6 text-center">Số người</th>
                  <th className="p-6 text-center">Thời gian</th>
                  <th className="p-6 text-center">Trạng thái</th>
                  <th className="p-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentData.map((r) => {
                  const { time, date } = formatDateTimeVN(r.time)
                  return (
                    <tr key={r._id} className="hover:bg-green-50/40 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <FaUserAlt />
                          </div>
                          <span className="font-black uppercase text-sm text-gray-700">{r.fullName}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center font-bold text-gray-600">
                        <FaPhoneAlt className="inline mr-2 text-green-500" />
                        {r.phone}
                      </td>
                      <td className="p-6 text-center font-bold text-gray-600">
                        <FaUsers className="inline mr-2 text-blue-500" />
                        {r.quantity}
                      </td>
                      <td className="p-6 text-center">
                        <div className="font-bold text-gray-700">
                          <FaClock className="inline mr-2 text-orange-500" />
                          {time}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{date}</div>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${r.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>{r.status === 'confirmed' ? 'Đã duyệt' : 'Chờ duyệt'}</span>
                      </td>
                      <td className="p-6 text-right">
                        {r.status !== 'confirmed' && (
                          <button onClick={() => handleApprove(r._id)} className="h-10 px-6 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 cursor-pointer transition-all active:scale-95">
                            Duyệt
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {currentData.map((r) => {
              const { time, date } = formatDateTimeVN(r.time)
              return (
                <div key={r._id} className="bg-white p-6 rounded-[30px] border shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black uppercase text-lg flex items-center gap-2 text-gray-700">
                      <FaUserAlt className="text-gray-300" /> {r.fullName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${r.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{r.status === 'confirmed' ? 'Đã duyệt' : 'Chờ'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-500">
                    <p>
                      <FaPhoneAlt className="inline mr-2 text-green-500" /> {r.phone}
                    </p>
                    <p>
                      <FaUsers className="inline mr-2 text-blue-500" /> {r.quantity} khách
                    </p>
                    <p className="col-span-2">
                      <FaClock className="inline mr-2 text-orange-500" /> {time} — {date}
                    </p>
                  </div>
                  {r.status !== 'confirmed' && (
                    <button onClick={() => handleApprove(r._id)} className="w-full bg-green-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-green-100 transition-active active:scale-95">
                      <FaCheck className="inline mr-2" /> Xác nhận ngay
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-12 h-12 flex items-center justify-center bg-white border rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm">
                <FaChevronLeft className="text-gray-600" />
              </button>
              <div className="px-6 py-3 bg-white border rounded-2xl font-black text-sm shadow-sm">
                TRANG {currentPage} / {totalPages}
              </div>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-12 h-12 flex items-center justify-center bg-white border rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm">
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
