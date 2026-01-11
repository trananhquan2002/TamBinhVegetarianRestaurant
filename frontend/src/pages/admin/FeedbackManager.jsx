import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaUserCircle, FaPhoneAlt, FaRegCommentDots, FaTrashAlt } from 'react-icons/fa'

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/feedbacks?date=${filterDate}`)
      const data = await res.json()
      setFeedbacks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Lỗi tải góp ý:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [filterDate])

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header & Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight uppercase">Góp ý khách hàng</h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">Lắng nghe để cải thiện dịch vụ của bạn</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <div className="flex items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-2xl flex-1 min-w-50 focus-within:ring-2 ring-green-500/20 transition-all">
            <FaCalendarAlt className="text-green-600 mr-3 shrink-0" />
            <input 
              type="date" 
              value={filterDate} 
              className="bg-transparent text-sm font-bold outline-none w-full cursor-pointer" 
              onChange={(e) => setFilterDate(e.target.value)} 
            />
          </div>
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')} 
              className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black hover:bg-gray-50 transition uppercase shrink-0"
            >
              Tất cả
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse font-black tracking-widest">ĐANG TẢI DỮ LIỆU...</div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-20 text-center border border-dashed border-gray-200 text-gray-400 font-bold">
          Chưa có góp ý nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {feedbacks.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-green-50 group-hover:text-green-500 transition-colors shrink-0">
                  <FaUserCircle size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 text-base sm:text-lg truncate uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold">
                      <FaPhoneAlt className="text-green-500" size={10} /> {item.phone}
                    </span>
                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50/50 rounded-2xl relative">
                <FaRegCommentDots className="absolute top-3 right-3 text-gray-200" size={18} />
                <p className="text-gray-600 text-sm sm:text-base italic leading-relaxed pr-6">
                  "{item.message}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}