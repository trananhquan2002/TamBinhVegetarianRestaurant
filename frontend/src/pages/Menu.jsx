import ProductSection from '../components/ProductSection'
import ReservationSection from '../components/ReservationSection'
import Slider from '../components/Slider'
import { Helmet } from 'react-helmet-async'
export default function Menu() {
  return (
    <main>
      <Helmet>
        <title>Thực Đơn Buffet Chay 50 Món Đặc Sắc - Tâm Bình</title>
        <meta name="description" content="Khám phá danh sách các món chay đa dạng: từ súp, món chính đến tráng miệng tại nhà hàng chay Tâm Bình. Nguyên liệu tươi sạch, thuần khiết." />
        <meta property="og:title" content="Thực Đơn Buffet Chay Đặc Sắc - Tâm Bình Restaurant" />
        <link rel="canonical" href="https://tam-binh-vegetarian-restaurant.vercel.app/menu" />
      </Helmet>
      <Slider />
      <ProductSection />
      <ReservationSection />
    </main>
  )
}
