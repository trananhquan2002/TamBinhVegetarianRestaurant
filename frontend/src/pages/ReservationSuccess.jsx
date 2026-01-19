import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiClock, FiCalendar, FiUsers, FiPhone, FiCheckCircle, FiHome } from 'react-icons/fi'
import { FaCheckCircle } from 'react-icons/fa'
import { io } from 'socket.io-client'
import { formatDateTimeVN } from '../utils/formatDate'
const API_BASE_URL = import.meta.env.VITE_API_URL
const socket = io(API_BASE_URL)
export default function ReservationSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(location.state?.reservation)
  const isConfirmed = reservation?.status === 'confirmed'
  const { time, date } = formatDateTimeVN(reservation?.time)
  useEffect(() => {
    if (reservation?._id) {
      socket.emit('join-reservation-room', reservation._id)
      socket.on('reservation-status-updated', (updatedData) => {
        if (updatedData.status === 'confirmed' && reservation.status !== 'confirmed') {
          setReservation(updatedData)
          const audio = new Audio('/assets/sound/success-chime.mp3')
          audio.loop = false
          audio
            .play()
            .then(() => {
              setTimeout(() => {
                audio.pause()
                audio.currentTime = 0
              }, 1000)
            })
            .catch((err) => console.log('Trình duyệt chặn tự động phát âm thanh:', err))
        } else {
          setReservation(updatedData)
        }
      })
    }
    return () => {
      socket.off('reservation-status-updated')
    }
  }, [reservation?._id, reservation?.status])
  if (!reservation) {
    return <div className="p-10 text-center">Không tìm thấy thông tin đặt bàn.</div>
  }
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8">
      <div className="w-full max-w-125 flex flex-col items-center animate-fadeIn">
        <div className="bg-white w-full rounded-4xl p-6 sm:p-10 shadow-sm text-center mb-4 transition-all">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-orange-50 p-5 rounded-full relative z-10">{isConfirmed ? <FaCheckCircle className="text-green-500 text-5xl animate-bounce" /> : <FiClock className="text-orange-500 text-5xl" />}</div>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full uppercase mb-4 ${isConfirmed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></span>
            {isConfirmed ? 'Nhà hàng đã xác nhận' : 'Chờ xác nhận từ nhà hàng'}
          </div>
          <h1 className="text-2xl font-black">{isConfirmed ? 'ĐẶT BÀN THÀNH CÔNG' : 'ĐANG CHỜ DUYỆT'}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Chào <span className="font-bold text-black">{reservation?.fullName}</span>, {isConfirmed ? 'yêu cầu đặt bàn của bạn đã được chấp nhận. Hẹn gặp lại bạn tại nhà hàng!' : 'yêu cầu đặt bàn của bạn đã được gửi tới hệ thống.'}
          </p>
        </div>
        <div className="bg-white w-full rounded-4xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4 flex items-center gap-2">
            <FiCheckCircle className="text-green-500" /> Chi tiết yêu cầu
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Số khách</span>
              <p className="text-md font-black flex items-center gap-2">
                <FiUsers size={14} /> {reservation?.quantity} người
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Thời gian</span>
              <p className="text-md font-black flex items-center gap-2">
                <FiCalendar size={14} />
                <span>
                  {time} - {date}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-3 mt-8">
          <button onClick={() => navigate('/')} className="w-full bg-[#FE2C55] hover:bg-[#ef294e] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-red-100 uppercase text-sm tracking-widest cursor-pointer">
            <FiHome /> Quay lại trang chủ
          </button>
        </div>
        <div className="mt-8 w-full">
          <div className="bg-red-50 border border-red-100 rounded-3xl p-5 flex flex-col items-center gap-2">
            <p className="text-[13px] text-gray-600 font-medium">Cần hỗ trợ đặt bàn nhanh?</p>
            <a href="tel:0984832086" className="flex items-center gap-3 text-red-500 hover:scale-105 transition-transform">
              <div className="bg-red-500 text-white p-2.5 rounded-full shadow-md">
                <FiPhone size={18} />
              </div>
              <span className="text-2xl font-black tracking-tight">0984832086</span>
            </a>
            <p className="text-[11px] text-red-400 text-center leading-relaxed mt-1">
              Nếu quá 15 phút không nhận được cuộc gọi,
              <br className="hidden sm:block" />
              vui lòng gọi hotline để được hỗ trợ ngay.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
