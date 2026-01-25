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
    <footer className="bg-[#111827] text-gray-300 pt-16 pb-8 px-6 font-sans border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-8 border-b border-gray-800/50 pb-16">
          <div className="space-y-5 max-w-sm">
            <h2 className="text-white text-2xl font-black italic tracking-tighter">
              TÂM BÌNH <span className="text-red-500">RESTAURANT</span>
            </h2>
            <p className="text-sm leading-relaxed opacity-70">Buffet chay thanh đạm - hơn 50 món mỗi ngày. Nơi tìm lại sự bình yên trong tâm hồn qua từng món ăn.</p>
            <div className="flex gap-3 pt-2">
              <a href="https://www.facebook.com/tambinhchay/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all duration-300 text-white">
                <FaFacebookF size={14} />
              </a>
              <a href="https://www.youtube.com/@NhahangchayTamBinh" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-[#FF0000] hover:scale-110 transition-all duration-300 text-white">
                <FaYoutube size={16} />
              </a>
              <a href="https://www.tiktok.com/@nhahangchaytambinh" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-black border border-transparent hover:border-gray-600 hover:scale-110 transition-all duration-300 text-white">
                <FaTiktok size={14} />
              </a>
            </div>
          </div>
          <div className="min-w-37.5">
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Khám phá</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/home" className="hover:text-red-500 transition-colors inline-block">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-red-500 transition-colors inline-block">
                  Thực đơn đặc sắc
                </Link>
              </li>
              <li>
                <button onClick={scrollToBooking} className="hover:text-red-500 transition-colors cursor-pointer text-left">
                  Đặt bàn online
                </button>
              </li>
            </ul>
          </div>
          <div className="max-w-xs">
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Liên hệ</h3>
            <div className="text-sm space-y-4">
              <p className="flex items-start gap-3 leading-relaxed">
                <span className="text-red-500 mt-1">●</span>
                B33 Ng. 70 P. Nguyễn Thị Định, Trung Hoà, Cầu Giấy, Hà Nội
              </p>
              <p className="flex items-center gap-3 font-semibold text-white">
                <span className="text-red-500">●</span>
                Hotline: 0984832086
              </p>
              <div className="mt-6 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <p className="text-[10px] uppercase font-black text-gray-500 mb-1 tracking-widest">Giờ phục vụ</p>
                <p className="text-sm text-white font-bold">10:30 AM - 21:30 PM</p>
              </div>
            </div>
          </div>
          <div className="max-w-xs w-full lg:w-72">
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Ưu đãi độc quyền</h3>
            <p className="text-sm opacity-70 mb-5 leading-relaxed">Đăng ký để nhận thông báo về buffet 0đ và sự kiện.</p>
            <div className="relative group">
              <input type="email" placeholder="Email của bạn..." className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-4 pl-5 pr-28 text-sm focus:outline-none focus:border-red-500 transition-all shadow-inner" />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-red-600 hover:bg-red-700 text-white px-5 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20 cursor-pointer">GỬI NGAY</button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-[10px] font-bold tracking-[0.2em] opacity-30 uppercase">
          <p>© 2026 NHÀ HÀNG CHAY TÂM BÌNH. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
