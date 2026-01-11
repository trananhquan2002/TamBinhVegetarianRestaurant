import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaHome, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { FiClock, FiCheckCircle } from 'react-icons/fi'
import io from 'socket.io-client'
const socket = io('http://localhost:5000')
export default function OrderSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(location.state?.order || null)
  const [isConfirmed, setIsConfirmed] = useState(location.state?.order?.status === 'confirmed')
  const orderRef = useRef(order)
  useEffect(() => {
    orderRef.current = order
  }, [order])
  useEffect(() => {
    if (order?._id) {
      socket.emit('join-order-room', order._id)
      socket.on('order-status-updated', (updatedOrder) => {
        if (updatedOrder.status === 'confirmed' && orderRef.current?.status !== 'confirmed') {
          setOrder(updatedOrder)
          setIsConfirmed(true)
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
          setOrder(updatedOrder)
        }
      })
    }
    return () => {
      socket.off('order-status-updated')
    }
  }, [order?._id])
  if (!order) return <div className="p-10 text-center font-bold">Không tìm thấy đơn hàng...</div>
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg flex flex-col items-center animate-fadeIn">
        <div className="bg-white w-full rounded-[40px] p-8 sm:p-10 shadow-sm text-center mb-4 transition-all">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`${isConfirmed ? 'bg-green-50' : 'bg-blue-50'} p-6 rounded-full relative z-10`}>{isConfirmed ? <FaCheckCircle className="text-green-500 text-6xl animate-bounce" /> : <FiClock className="text-blue-500 text-6xl animate-pulse" />}</div>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full uppercase mb-5 text-[11px] font-bold ${isConfirmed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></span>
            {isConfirmed ? 'Nhà hàng đã xác nhận' : 'Đang chờ nhà hàng duyệt'}
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">{isConfirmed ? 'ĐÃ DUYỆT ĐƠN HÀNG' : 'ĐẶT HÀNG THÀNH CÔNG'}</h1>
          <p className="text-gray-500 text-sm leading-relaxed px-4">
            Chào <span className="font-bold text-black">{order.customerName}</span>, {isConfirmed ? 'đơn hàng của bạn đã được nhà hàng xác nhận và sẽ sớm giao đến bạn nhanh nhất có thể.' : 'đơn hàng đã được gửi tới hệ thống. Vui lòng giữ máy, nhà hàng sẽ sớm xác nhận đơn hàng của bạn.'}
          </p>
        </div>
        <div className="bg-white w-full rounded-[40px] p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
            <FiCheckCircle className="text-green-500" /> Chi tiết đơn hàng
          </h3>
          <div className="space-y-4">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="bg-gray-100 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-600">{item.quantity}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                    <p className="text-[10px] text-gray-400">Đơn giá: {item.price.toLocaleString()}đ</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700">{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-3xl p-5 space-y-3">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>Tạm tính</span>
              <span>{order.subTotal?.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>Phí vận chuyển</span>
              <span>+{order.shippingFee?.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
              <span className="text-sm font-black uppercase">Tổng thanh toán</span>
              <span className="text-xl font-black text-[#FE2C55]">{(order.totalAmount || order.subTotal + order.shippingFee).toLocaleString()}đ</span>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-gray-400 shrink-0" />
              <p className="line-clamp-1 italic">{order.address?.detail || order.address}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaPhoneAlt className="text-gray-400 shrink-0" />
              <p className="font-bold">{order.phone}</p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-3 mt-6">
          <button onClick={() => navigate('/')} className="w-full bg-[#FE2C55] hover:bg-[#ef294e] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-red-100 uppercase text-xs tracking-[0.2em] cursor-pointer">
            <FaHome /> Quay về trang chủ
          </button>
        </div>
        <div className="mt-8 mb-10 w-full text-center">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-2">Cần thay đổi thông tin?</p>
          <a href="tel:0984832086" className="text-red-500 font-black text-lg hover:underline transition-all">
            Hotline: 0984 832 086
          </a>
        </div>
      </div>
    </div>
  )
}
