import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiMapPin, FiTruck, FiCreditCard } from 'react-icons/fi'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
const HA_NOI_AREAS = [
  { name: 'Quận Cầu Giấy', lat: 21.0362, lng: 105.7908 },
  { name: 'Quận Thanh Xuân', lat: 20.9937, lng: 105.8119 },
  { name: 'Quận Đống Đa', lat: 21.0131, lng: 105.8202 },
  { name: 'Quận Ba Đình', lat: 21.0341, lng: 105.8222 },
  { name: 'Quận Hoàn Kiếm', lat: 21.0287, lng: 105.8523 },
  { name: 'Quận Hai Bà Trưng', lat: 21.0125, lng: 105.854 },
  { name: 'Quận Tây Hồ', lat: 21.0654, lng: 105.82 },
  { name: 'Quận Nam Từ Liêm', lat: 21.0145, lng: 105.7644 },
  { name: 'Quận Bắc Từ Liêm', lat: 21.0694, lng: 105.7564 },
  { name: 'Quận Hà Đông', lat: 20.9702, lng: 105.7738 },
  { name: 'Quận Long Biên', lat: 21.0365, lng: 105.895 },
  { name: 'Quận Hoàng Mai', lat: 20.9632, lng: 105.8453 },
  { name: 'Thị xã Sơn Tây', lat: 21.136, lng: 105.5019 },
  { name: 'Huyện Ba Vì', lat: 21.2333, lng: 105.35 },
  { name: 'Huyện Chương Mỹ', lat: 20.8833, lng: 105.6833 },
  { name: 'Huyện Đan Phượng', lat: 21.1, lng: 105.6667 },
  { name: 'Huyện Đông Anh', lat: 21.1333, lng: 105.8333 },
  { name: 'Huyện Gia Lâm', lat: 21.0333, lng: 105.9333 },
  { name: 'Huyện Hoài Đức', lat: 21.0167, lng: 105.7 },
  { name: 'Huyện Mê Linh', lat: 21.1833, lng: 105.7167 },
  { name: 'Huyện Mỹ Đức', lat: 20.6833, lng: 105.8 },
  { name: 'Huyện Phú Xuyên', lat: 20.7333, lng: 105.9 },
  { name: 'Huyện Phúc Thọ', lat: 21.1, lng: 105.5833 },
  { name: 'Huyện Quốc Oai', lat: 20.9833, lng: 105.6333 },
  { name: 'Huyện Sóc Sơn', lat: 21.2583, lng: 105.85 },
  { name: 'Huyện Thạch Thất', lat: 21.0167, lng: 105.55 },
  { name: 'Huyện Thanh Oai', lat: 20.8667, lng: 105.7833 },
  { name: 'Huyện Thanh Trì', lat: 20.95, lng: 105.85 },
  { name: 'Huyện Thường Tín', lat: 20.8333, lng: 105.85 },
  { name: 'Huyện Ứng Hòa', lat: 20.7167, lng: 105.7667 },
]
const RESTAURANT_COORDS = { lat: 21.0123, lng: 105.8123 }
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, admin } = useAuth()
  const location = useLocation()
  const isLoggedIn = !!user || !!admin
  const shouldHideBanner = location.state?.fromCart
  const navigate = useNavigate()
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedArea, setSelectedArea] = useState(null)
  const [addressDetail, setAddressDetail] = useState('')
  const [distance, setDistance] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    const savedInfo = localStorage.getItem('last_checkout_info')
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo)
      setCustomerName(parsedInfo.customerName || '')
      setPhone(parsedInfo.phone || '')
      setAddressDetail(parsedInfo.addressDetail || '')
      if (parsedInfo.selectedAreaName) {
        const area = HA_NOI_AREAS.find((a) => a.name === parsedInfo.selectedAreaName)
        if (area) setSelectedArea(area)
      }
    } else if (user) {
      setCustomerName(user.userName || '')
    }
  }, [user])
  useEffect(() => {
    const fetchLastInfo = async () => {
      const userId = user?._id || user?.id
      const token = user?.token
      if (userId && token && !localStorage.getItem('last_checkout_info')) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/orders/last-info/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          if (res.ok) {
            const data = await res.json()
            if (data) {
              if (data.customerName) setCustomerName(data.customerName)
              if (data.phone) setPhone(data.phone)
              if (data.address) {
                const matchedArea = HA_NOI_AREAS.find((a) => a.name === data.address.area)
                if (matchedArea) setSelectedArea(matchedArea)
                const detail = data.address.detail ? data.address.detail.split(',')[0] : ''
                setAddressDetail(detail)
              }
            }
          }
        } catch (error) {
          console.log('Chưa có thông tin cũ trên server')
        }
      }
    }
    fetchLastInfo()
  }, [user])
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  useEffect(() => {
    if (selectedArea) {
      const d = calculateDistance(RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng, selectedArea.lat, selectedArea.lng)
      setDistance(Math.round(d * 10) / 10)
    }
  }, [selectedArea])
  const shippingFee = distance > 10 ? 15000 + (Math.ceil(distance) - 10) * 5000 : 0
  const totalAmount = cartTotal + shippingFee
  const handlePlaceOrder = async () => {
    if (!customerName || !phone || !selectedArea || !addressDetail) {
      return toast.error('Vui lòng điền đầy đủ thông tin giao hàng!')
    }
    if (cart.length === 0) return toast.error('Giỏ hàng của bạn đang trống!')
    setIsSubmitting(true)
    const loadingToast = toast.loading('Đang xử lý đơn hàng...')
    const infoToSave = {
      customerName,
      phone,
      addressDetail,
      selectedAreaName: selectedArea.name,
    }
    localStorage.setItem('last_checkout_info', JSON.stringify(infoToSave))
    const orderData = {
      customerId: user?._id || user?.id || null,
      customerName,
      phone,
      address: {
        detail: `${addressDetail}, ${selectedArea.name}, Hà Nội`,
        area: selectedArea.name,
        lat: selectedArea.lat,
        lng: selectedArea.lng,
      },
      cartItems: cart.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subTotal: cartTotal,
      distance,
      shippingFee,
      totalAmount,
      paymentMethod: 'COD',
      status: 'pending',
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      const result = await res.json()
      toast.dismiss(loadingToast)
      if (res.ok) {
        toast.success('Đặt hàng thành công!')
        clearCart()
        navigate('/order-success', { state: { order: result.order } })
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi đặt hàng')
      }
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error('Lỗi kết nối hệ thống. Vui lòng thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      {!isLoggedIn && !shouldHideBanner && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 mx-auto max-w-7xl mt-4 rounded-r-lg shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎁</span>
              <p className="text-blue-700 font-medium">
                Bạn có muốn <span className="font-bold">đăng nhập</span> để nhận ưu đãi và tự động điền thông tin cho lần sau không?
              </p>
            </div>
            <Link to="/login" state={{ from: location }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow-md">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      )}
      <div className="bg-[#F5F5F5] min-h-screen pb-40">
        <div className="bg-white p-5 rounded-b-3xl shadow-sm border-b-4 border-dashed border-red-50">
          <h4 className="font-black text-xs text-[#FE2C55] mb-5 flex items-center gap-2 uppercase tracking-widest">
            <FiMapPin className="text-base" /> Địa chỉ nhận hàng (Hà Nội)
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#FE2C55] focus:bg-white transition-all shadow-sm" placeholder="Tên người nhận" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#FE2C55] focus:bg-white transition-all shadow-sm" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="relative">
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none appearance-none cursor-pointer focus:border-[#FE2C55] shadow-sm"
                value={selectedArea?.name || ''}
                onChange={(e) => {
                  const area = HA_NOI_AREAS.find((a) => a.name === e.target.value)
                  setSelectedArea(area)
                }}>
                <option value="">-- Chọn Quận/Huyện/Thị xã --</option>
                {HA_NOI_AREAS.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
            <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#FE2C55] focus:bg-white transition-all shadow-sm" placeholder="Số nhà, tên đường, tòa nhà..." value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 bg-white p-5 rounded-3xl shadow-sm mx-2">
          <div className="flex items-center gap-2 mb-5 border-l-4 border-[#FE2C55] pl-3">
            <span className="text-sm font-black uppercase italic tracking-tighter">Tâm Bình Restaurant</span>
          </div>
          <div className="space-y-5">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm" alt={item.title} />
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-2">{item.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#FE2C55] font-black text-base">{item.price.toLocaleString()}đ</span>
                    <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-lg font-black">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 bg-white p-5 rounded-3xl shadow-sm mx-2 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium flex items-center gap-2">
              <FiTruck className="text-lg text-blue-500" /> Phí vận chuyển ({distance} km)
            </span>
            <span className={shippingFee === 0 ? 'text-green-600 font-black' : 'font-black text-gray-800'}>{shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString()}đ`}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-4">
            <span className="text-gray-500 font-medium flex items-center gap-2">
              <FiCreditCard className="text-lg text-orange-500" /> Phương thức thanh toán
            </span>
            <span className="font-black text-gray-800">Tiền mặt (COD)</span>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-8 flex items-center justify-between z-50">
          <div className="pl-2">
            <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Tổng cộng thanh toán</p>
            <p className="text-[#FE2C55] font-black text-2xl tracking-tighter">{totalAmount.toLocaleString()}đ</p>
          </div>
          <button onClick={handlePlaceOrder} disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#FE2C55]'} text-white px-10 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-red-200 uppercase tracking-tight cursor-pointer`}>
            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay'}
          </button>
        </div>
      </div>
    </>
  )
}
