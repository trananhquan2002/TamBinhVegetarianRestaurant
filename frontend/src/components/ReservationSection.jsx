import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../public/assets/images/aboutTamBinh.png'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function ReservationSection() {
  const [guestCount, setGuestCount] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ fullName: '', phone: '', quantity: '', time: '' })
  const [error, setError] = useState('')
  const handleReservation = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          quantity: formData.quantity,
          time: formData.time,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setFormData({ fullName: '', phone: '', quantity: '', time: '' })
        setGuestCount('')
        navigate('/reservation-success', { state: { reservation: data.reservation } })
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ!')
    }
  }
  return (
    <section id="booking-section" className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black italic tracking-tighter mb-12 text-gray-900 uppercase">
          <span className="text-red-600">Đặt Bàn Buffet</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <form className="space-y-5" onSubmit={handleReservation}>
              <input value={formData.fullName} className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm" placeholder="Họ và tên" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              <input value={formData.phone} className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm" placeholder="Số điện thoại" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <select
                value={formData.quantity}
                onChange={(e) => {
                  ;(setGuestCount(e.target.value), setFormData({ ...formData, quantity: e.target.value }))
                }}
                className={`w-full border border-gray-300 rounded-xl px-5 py-4 cursor-pointer outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm
                  ${guestCount === '' ? 'text-gray-400' : 'text-gray-900'}`}>
                <option value="" disabled hidden>
                  Số lượng người
                </option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1} className="text-gray-900">
                    {i + 1} người
                  </option>
                ))}
              </select>
              <input
                value={formData.time}
                type={formData.time ? 'datetime-local' : 'text'}
                placeholder="Ngày giờ đến"
                onFocus={(e) => (e.target.type = 'datetime-local')}
                onBlur={(e) => {
                  if (!formData.time) e.target.type = 'text'
                }}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 outline-none text-gray-600 shadow-sm"
              />
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button className="w-full lg:w-max bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-red-200 transition-all active:scale-95 cursor-pointer uppercase tracking-widest">Đặt bàn ngay</button>
            </form>
            <p className="text-red-500 text-sm italic mt-4">* Vui lòng đặt trước ít nhất 30 phút để chúng tôi phục vụ tốt nhất.</p>
          </div>
          <div className="w-full h-full min-h-100 lg:h-112.5 rounded-3xl overflow-hidden shadow-2xl">
            <img src={logo} className="w-full h-full object-cover object-center" />
          </div>
        </div>
      </div>
    </section>
  )
}
