import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaHome, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { FiClock, FiCheckCircle } from 'react-icons/fi'
import io from 'socket.io-client'
const API_BASE_URL = import.meta.env.VITE_API_URL
const socket = io(API_BASE_URL)
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
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center p-0 sm:p-8 antialiased">
      <div className="w-full max-w-lg animate-fadeIn">
        <div className={`w-full p-8 text-white relative overflow-hidden ${isConfirmed ? 'bg-[#00B34D]' : 'bg-[#FE2C55]'} sm:rounded-b-[40px] shadow-lg`}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 bg-white/20 p-4 rounded-full backdrop-blur-md">{isConfirmed ? <FaCheckCircle className="text-white text-5xl animate-bounce" /> : <FiClock className="text-white text-5xl animate-pulse" />}</div>
            <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">{isConfirmed ? 'Đã xác nhận đơn hàng' : 'Đang chờ xử lý'}</h1>
            <p className="text-white/80 text-sm font-medium px-6 leading-relaxed">
              Chào <span className="text-white font-black">{order.customerName}</span>, {isConfirmed ? 'đơn hàng của bạn đang được chuẩn bị và sẽ giao đến bạn sớm nhất.' : 'đơn hàng đã được gửi đi. Vui lòng đợi trong giây lát để nhà hàng xác nhận.'}
            </p>
          </div>
          <FaHome size={150} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
        </div>
        <div className="px-4 -mt-6 relative z-20">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-red-50 p-3 rounded-full shrink-0">
              <FaMapMarkerAlt className="text-[#FE2C55]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-xs uppercase tracking-wider text-gray-800">Địa chỉ nhận hàng</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">
                {order.customerName} | {order.phone}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed italic">{order.address?.detail || order.address}</p>
            </div>
          </div>
        </div>
        <div className="px-4 mt-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2 uppercase text-[11px] tracking-widest">
              <FiCheckCircle className="text-green-500 text-lg" /> Chi tiết đơn hàng
            </h3>
            <div className="space-y-6">
              {(order.cartItems || order.items || []).map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-50">{item.image ? <img src={item.image ? `/assets/images/${item.image.split('/').pop()}` : 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover" /> : <FaHome className="text-gray-300" />}</div>
                    <div className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{item.quantity}</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm font-black text-gray-800 line-clamp-1 uppercase tracking-tight">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Đơn giá: {item.price.toLocaleString()}đ</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-black text-gray-800">{(item.price * item.quantity).toLocaleString()}đ</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-dashed border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Tổng tiền hàng</span>
                <span className="text-gray-700 font-bold">{order.subTotal?.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Phí vận chuyển</span>
                <span className="text-gray-700 font-bold">+{order.shippingFee?.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2">
                <span className="text-sm font-black uppercase tracking-tighter">Tổng thanh toán</span>
                <span className="text-2xl font-black text-[#FE2C55]">{(order.totalAmount || order.subTotal + order.shippingFee).toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 mt-8 space-y-4 mb-12">
          <button onClick={() => navigate('/')} className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-[20px] font-black flex items-center justify-center gap-3 active:scale-[0.97] transition-all uppercase text-xs tracking-widest shadow-xl shadow-gray-200 cursor-pointer">
            <FaHome /> Tiếp tục mua sắm
          </button>
          <div className="bg-white rounded-3xl p-6 text-center border border-gray-100">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">Bạn cần hỗ trợ gấp?</p>
            <a href="tel:0984832086" className="inline-flex items-center gap-3 text-[#FE2C55] font-black text-xl hover:scale-105 transition-transform">
              <div className="bg-red-50 p-2 rounded-full">
                <FaPhoneAlt className="text-sm" />
              </div>
              0984832086
            </a>
          </div>
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cảm ơn bạn đã tin tưởng Tâm Bình!</p>
        </div>
      </div>
    </div>
  )
}
