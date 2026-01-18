import { Link } from 'react-router-dom'
import { FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa'
export default function Footer() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <footer className="bg-[#111827] text-gray-300 pt-12 pb-6 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-800 pb-12">
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-black italic tracking-tighter">
              TÂM BÌNH <span className="text-red-500">RESTAURANT</span>
            </h2>
            <p className="text-sm leading-relaxed opacity-80">Buffet chay thanh đạm - hơn 50 món mỗi ngày. Nơi tìm lại sự bình yên trong tâm hồn qua từng món ăn.</p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/tambinhchay/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 cursor-pointer text-white no-underline">
                <FaFacebookF size={14} />
              </a>
              <a href="https://www.youtube.com/@NhahangchayTamBinh" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition-all duration-300 cursor-pointer text-white no-underline">
                <FaYoutube size={16} />
              </a>
              <a href="https://www.tiktok.com/@nhahangchaytambinh" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black border border-transparent hover:border-gray-600 transition-all duration-300 cursor-pointer text-white no-underline">
                <FaTiktok size={14} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-5 uppercase text-sm tracking-widest">Khám phá</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/home" className="hover:text-red-500 transition-all">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-red-500 transition-all">
                  Thực đơn đặc sắc
                </Link>
              </li>
              <li>
                <button onClick={scrollToBooking} className="hover:text-red-500 transition-all cursor-pointer">
                  Đặt bàn online
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-1 uppercase text-sm tracking-widest">Liên hệ</h3>
            <div className="text-sm space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-red-500 font-bold">●</span>
                B33 Ng. 70 P. Nguyễn Thị Định, Trung Hoà, Cầu Giấy, Hà Nội
              </p>
              <p className="flex items-center gap-2">
                <span className="text-red-500 font-bold">●</span>
                Hotline: <span className="text-white font-bold">0984832086</span>
              </p>
              <div className="mt-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-[11px] uppercase font-bold text-gray-400">Giờ phục vụ</p>
                <p className="text-sm text-white">08:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-1 uppercase text-sm tracking-widest">Ưu đãi độc quyền</h3>
            <p className="text-xs opacity-70">Đăng ký để nhận thông báo về buffet 0đ và sự kiện đặc biệt.</p>
            <div className="relative group">
              <input type="email" placeholder="Email của bạn..." className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-red-500 transition-all" />
              <button className="absolute right-1 top-1 bottom-1 bg-red-600 hover:bg-red-700 text-white px-4 rounded-xl text-xs font-bold transition-all active:scale-95">GỬI NGAY</button>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium tracking-wide opacity-50 uppercase">
          <p>© 2026 NHÀ HÀNG CHAY TÂM BÌNH. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
