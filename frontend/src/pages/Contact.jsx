import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function Contact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [error, setError] = useState('')
  const handleFeedback = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert('Gửi feedback thành công!. Cảm ơn bạn')
        setFormData({ name: '', phone: '', message: '' })
        navigate('/')
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (error) {
      setError('Lỗi kết nối máy chủ!')
    }
  }
  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <Helmet>
        <title>Liên Hệ Nhà Hàng Chay Tâm Bình - Đặt Bàn Ngay</title>
        <meta name="description" content="Hỗ trợ đặt bàn nhanh chóng. Hotline: 0984832086. Địa chỉ: B33 Ng. 70 P. Nguyễn Thị Định, Trung Hoà, Cầu Giấy, Hà Nội." />
        <link rel="canonical" href="https://tam-binh-vegetarian-restaurant.vercel.app/contact" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Liên Hệ Với Tâm Bình</h1>
          <p className="text-gray-600">Chúng tôi luôn sẵn sàng lắng nghe và phục vụ bạn</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <section className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Thông Tin Chi Tiết</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-full text-red-600">
                    <i className="fa-solid fa-location-dot text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Địa chỉ</h3>
                    <p className="text-gray-600">B33 Ng. 70 P. Nguyễn Thị Định, Trung Hoà, Cầu Giấy, Hà Nội</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-full text-green-600">
                    <i className="fa-solid fa-phone text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Điện thoại</h3>
                    <p className="text-gray-600">0984832086</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <i className="fa-solid fa-clock text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Giờ mở cửa</h3>
                    <p className="text-gray-600">10:30 - 21:30 hàng ngày</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border-4 border-white h-80">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.588147775928!2d105.80165747515124!3d21.00913998845421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9633857e23%3A0xc3910c22622839b9!2zTmjDoCBow6BuZyBjaGF5IFTDom0gQsOsbmggLSBCdWZmZXQgY2hheSA1MGsgQ-G6p3UgR2nhuqV5!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Tâm Bình Map"></iframe>
            </div>
          </section>
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-50">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Gửi đánh giá</h2>
            <form className="space-y-5" onSubmit={handleFeedback}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Họ và tên</label>
                <input value={formData.name} type="text" placeholder="Nhập tên của bạn" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Số điện thoại</label>
                <input value={formData.phone} type="text" placeholder="Để chúng tôi tiện liên lạc" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Đánh giá của bạn</label>
                <textarea rows="4" placeholder="Bạn cần hỗ trợ gì?" value={formData.message} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none" required onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg mt-4 uppercase tracking-wider cursor-pointer">
                Gửi đánh giá ngay
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
