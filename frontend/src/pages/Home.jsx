import ProductSection from '../components/ProductSection'
import ReservationSection from '../components/ReservationSection'
import Slider from '../components/Slider'
import AboutSection from '../components/AboutSection'
import { Helmet } from 'react-helmet-async'
export default function Home() {
  return (
    <main>
      <Helmet>
        <title>Nhà Hàng Chay Tâm Bình - Buffet Chay Ngon Tại Hà Nội</title>
        <meta name="description" content="Thưởng thức buffet chay thanh đạm với hơn 50 món ăn mỗi ngày tại Tâm Bình Restaurant. Không gian thanh tịnh, tọa lạc tại Cầu Giấy, Hà Nội." />
        <meta property="og:title" content="Nhà Hàng Chay Tâm Bình - Buffet Chay Thanh Đạm" />
        <meta property="og:description" content="Hơn 50 món chay mỗi ngày đang chờ đón bạn tại Cầu Giấy." />
        <link rel="canonical" href="https://tam-binh-vegetarian-restaurant.vercel.app/" />
      </Helmet>
      <Slider />
      <AboutSection />
      <ProductSection />
      <ReservationSection />
    </main>
  )
}
