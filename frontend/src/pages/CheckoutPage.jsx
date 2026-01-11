import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiMapPin, FiTruck, FiCreditCard } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
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
export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [customerName, setCustomerName] = useState(user?.userName || '')
  const [phone, setPhone] = useState('')
  const [selectedArea, setSelectedArea] = useState(null)
  const [addressDetail, setAddressDetail] = useState('')
  const [distance, setDistance] = useState(0)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  useEffect(() => {
    const fetchLastInfo = async () => {
      if (user?._id) {
        try {
          const res = await fetch(`/api/orders/last-info/${user._id}`)
          const data = await res.json()
          if (res.ok && data.address) {
            setCustomerName(data.customerName)
            setPhone(data.phone)
            const savedLat = data.address.lat
            const savedLng = data.address.lng
            const matchedArea = HA_NOI_AREAS.find((a) => a.lat === savedLat && a.lng === savedLng)
            if (matchedArea) {
              setSelectedArea(matchedArea)
            }
            setAddressDetail(data.address.detail.split(',')[0])
          }
        } catch (error) {
          console.log('Chưa có thông tin cũ để lấy')
        }
      }
    }
    fetchLastInfo()
  }, [user])
  useEffect(() => {
    if (selectedArea) {
      const d = calculateDistance(RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng, selectedArea.lat, selectedArea.lng)
      setDistance(Math.round(d * 10) / 10)
    }
  }, [selectedArea])
  const shippingFee = distance > 10 ? 15000 + (Math.ceil(distance) - 10) * 5000 : 0
  const totalAmount = cartTotal + shippingFee
  const handlePlaceOrder = async () => {
    if (!phone || !selectedArea || !addressDetail) return alert('Vui lòng nhập đủ thông tin!')
    const orderData = {
      customerId: user?._id || user?.id,
      customerName,
      phone,
      address: {
        detail: `${addressDetail}, ${selectedArea.name}, Hà Nội`,
        lat: selectedArea.lat,
        lng: selectedArea.lng,
      },
      cartItems: cart.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      subTotal: cartTotal,
      distance,
      shippingFee,
      totalAmount,
      paymentMethod: 'COD',
    }
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      const result = await res.json()
      if (res.ok) {
        clearCart()
        navigate('/order-success', { state: { order: result.order } }) // sau khi thành công truyền state đi
      } else {
        console.error('Lỗi: ' + result.message)
      }
    } catch (err) {
      console.error('Lỗi kết nối hệ thống!')
    }
  }
  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-32">
      <div className="bg-white p-4 border-b-4 border-dashed border-red-100">
        <h4 className="font-bold text-xs text-red-600 mb-4 flex items-center gap-2 uppercase tracking-tight">
          <FiMapPin /> Địa chỉ nhận hàng (Hà Nội)
        </h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input className="flex-1 border-b py-2 text-sm outline-none focus:border-red-500" placeholder="Tên người nhận" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <input className="flex-1 border-b py-2 text-sm outline-none focus:border-red-500" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <select
            className="w-full border-b py-2 text-sm outline-none bg-white"
            value={selectedArea?.name}
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
          <input className="w-full border-b py-2 text-sm outline-none focus:border-red-500" placeholder="Số nhà, tên đường, tòa nhà..." value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
        </div>
      </div>
      <div className="mt-2 bg-white p-4">
        <div className="flex items-center gap-2 mb-4 border-l-4 border-black pl-2">
          <span className="text-sm font-bold uppercase italic">Tâm Bình Restaurant</span>
        </div>
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 mb-4">
            <img src={item.image} className="w-20 h-20 rounded object-cover border" />
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-sm font-medium line-clamp-2">{item.title}</p>
              <div className="flex justify-between items-center">
                <span className="text-red-600 font-bold">{item.price.toLocaleString()}đ</span>
                <span className="text-gray-400 text-xs font-bold">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 bg-white p-4 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <FiTruck /> Vận chuyển ({distance} km)
          </span>
          <span className={shippingFee === 0 ? 'text-green-600 font-bold' : 'font-bold'}>{shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString()}đ`}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-4">
          <span className="text-gray-500 flex items-center gap-2">
            <FiCreditCard /> Thanh toán
          </span>
          <span className="font-bold">Tiền mặt (COD)</span>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-50">
        <div>
          <p className="text-[10px] text-gray-400 font-bold">TỔNG THANH TOÁN</p>
          <p className="text-[#FE2C55] font-black text-2xl">{totalAmount.toLocaleString()}đ</p>
        </div>
        <button onClick={handlePlaceOrder} className="bg-[#FE2C55] text-white px-12 py-3.5 rounded-sm font-black text-sm active:opacity-80 transition-all uppercase cursor-pointer">
          Đặt hàng
        </button>
      </div>
    </div>
  )
}
