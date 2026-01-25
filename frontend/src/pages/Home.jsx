import ProductSection from '../components/ProductSection'
import ReservationSection from '../components/ReservationSection'
import Slider from '../components/Slider'
import AboutSection from '../components/AboutSection'
export default function Home() {
  return (
    <main>
      <Slider />
      <ProductSection />
      <AboutSection />
      <ReservationSection />
    </main>
  )
}
