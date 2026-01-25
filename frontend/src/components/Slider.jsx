import { useLocation } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
const adsData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070',
    title: 'Đại Tiệc Chay Thanh Tịnh',
    desc: 'Buffet Chay Trọn Gói | Thứ 2 - Thứ 4 & T6 - CN: 99k | Riêng Thứ 5: chỉ 89k',
    buttonText: 'Đặt bàn ngay',
    targetId: 'booking-section',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071',
    title: 'Thực Đơn Mùa Vu Lan',
    desc: 'Trọn vẹn hiếu đạo với những món chay tinh tế, đủ đầy dinh dưỡng.',
    buttonText: 'Xem thực đơn',
    targetId: 'product-section',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1887',
    title: 'Giao Hàng Tận Nơi',
    desc: 'Thưởng thức ẩm thực chay tại gia với dịch vụ giao hàng siêu tốc.',
    buttonText: 'Đặt món ngay',
    targetId: 'product-section',
  },
]
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
export default function Slider() {
  const location = useLocation()
  if (location.state?.fromCart) {
    return null
  }
  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper h-75 md:h-125 lg:h-150 w-full">
        {adsData.map((ad) => (
          <SwiperSlide key={ad.id}>
            <div className="relative w-full h-full">
              <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-xl text-white space-y-4 animate-in fade-in slide-in-from-left-10 duration-1000">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-tight">{ad.title}</h2>
                    <p className="text-sm md:text-xl font-medium opacity-90 border-l-4 border-green-500 pl-4">{ad.desc}</p>
                    <div className="pt-4">
                      <button onClick={() => scrollToSection(ad.targetId)} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold uppercase text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20 cursor-pointer">
                        {ad.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx="true" global="true">{`
        .swiper-pagination-bullet {
          background: #fff !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #16a34a !important;
          width: 30px !important;
          border-radius: 5px !important;
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
