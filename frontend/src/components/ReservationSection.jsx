import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function ReservationSection() {
  const [guestCount, setGuestCount] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ fullName: '', phone: '', quantity: '', time: '' })
  const [error, setError] = useState('')
  const handleReservation = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/reservation', {
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
    <section id="booking-section" className="bg-gray-100 py-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Đặt bàn buffet</h2>
        <form className="space-y-5" onSubmit={handleReservation}>
          <input value={formData.fullName} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="Họ và tên" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          <input value={formData.phone} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="Số điện thoại" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <select
            value={formData.quantity}
            onChange={(e) => {
              setGuestCount(e.target.value), setFormData({ ...formData, quantity: e.target.value })
            }}
            className={`w-full border border-gray-300 rounded-xl px-4 py-3 cursor-pointer outline-none focus:ring-2 focus:ring-red-500 transition-all 
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
          <input value={formData.time} type="datetime-local" onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none text-gray-600" title="Ngày giờ đến" />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-200 transition-all active:scale-95 cursor-pointer">Đặt bàn ngay</button>
        </form>
        <p className="text-center text-red-500 text-[16px] mt-6 italic">* Vui lòng đặt trước ít nhất 30 phút để chúng tôi phục vụ tốt nhất.</p>
      </div>
    </section>
  )
}
