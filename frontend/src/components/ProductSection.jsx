import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from './ProductCard'
const API_BASE_URL = import.meta.env.VITE_API_URL
export default function ProductSection() {
  const [productData, setProductData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('')
  const [activeCategoryName, setActiveCategoryName] = useState('')
  const [itemsToShow, setItemsToShow] = useState(4)
  const itemsPerLoad = 4
  const { hash, state } = useLocation()
  const shouldHideSlider = state?.fromCart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([fetch(`${API_BASE_URL}/api/menu`), fetch(`${API_BASE_URL}/api/categories`)])
        if (!prodRes.ok) throw new Error('Lỗi tải menu')
        const prodJson = await prodRes.json()
        const catJson = await catRes.json()
        const limitedCategories = catJson.slice(0, 3)
        setCategoriesData(limitedCategories)
        const mangVeCategory = limitedCategories.find((cat) => cat.name === 'Mang về')
        if (mangVeCategory) {
          setActiveCategory(mangVeCategory._id)
        } else if (limitedCategories.length > 0) {
          setActiveCategory(limitedCategories[0]._id)
        }
        const mappedProducts = (prodJson.data || prodJson).map((p) => ({
          ...p,
          image: `/assets/images/${p.image}`,
        }))
        setProductData(mappedProducts)
        setCategoriesData(catJson)
      } catch (e) {
        setError('Không thể kết nối máy chủ.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const activeCat = categoriesData.find((c) => c._id === activeCategory)
    if (activeCat) setActiveCategoryName(activeCat.name)
  }, [activeCategory, categoriesData])
  useEffect(() => {
    if (hash === '#product-section') {
      const element = document.getElementById('product-section')
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [hash])
  const handleTabChange = (id) => {
    setActiveCategory(id)
    setItemsToShow(4)
  }
  function HandleClicViewMore() {
    if (!isShowMore) {
      setItemsToShow(4)
      const section = document.getElementById('product-section')
      if (section) section.scrollIntoView({ behavior: 'smooth' })
    } else {
      setItemsToShow((prev) => prev + itemsPerLoad)
    }
  }
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const getBuffetPrice = () => {
    const today = new Date().getDay()
    return today === 4 ? '89.000' : '99.000'
  }
  const filteredByTab = productData.filter((p) => p.categoryId?.toString() === activeCategory?.toString())
  const visibleProducts = filteredByTab.slice(0, itemsToShow)
  const isShowMore = itemsToShow < filteredByTab.length
  if (isLoading) return <div className="text-center py-8 italic">Đang tải menu...</div>
  if (error) return <div className="text-center py-8 text-red-600 font-bold">{error}</div>
  return (
    <>
      <section id="product-section" className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Thực đơn Tâm Bình</h2>
        <div className="flex justify-center mb-10 px-2">
          <ul className="flex bg-gray-200 p-1.5 rounded-full w-full max-w-md md:max-w-max overflow-hidden">
            {categoriesData.map((cat) => (
              <li
                key={cat._id}
                className={`flex-1 md:flex-none text-center px-4 md:px-8 py-2.5 rounded-full cursor-pointer transition-all duration-300 font-medium text-sm md:text-base whitespace-nowrap
                  ${activeCategory === cat._id ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-300'}`}
                onClick={() => handleTabChange(cat._id)}>
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
        {activeCategoryName === 'Buffet' ? (
          <div className="bg-linear-to-r from-amber-50 to-orange-100 rounded-3xl p-8 mb-10 border border-orange-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">Khuyến mãi hôm nay</span>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Buffet Chay Trọn Gói</h3>
                <p className="text-gray-600 mb-6 text-lg italic">"Thứ 2 - Thứ 4 & T6 - CN: 99k | Riêng Thứ 5: chỉ 89k"</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                  <span className="text-5xl font-black text-red-600">{getBuffetPrice()}đ</span>
                  <span className="text-gray-500 text-lg">/ người</span>
                </div>
                <button onClick={scrollToBooking} className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 mx-auto md:mx-0 cursor-pointer">
                  Đặt bàn ngay
                </button>
              </div>
              <div className="flex-1">
                <img src="/assets/images/buffet.jpg" alt="Buffet" className="rounded-2xl shadow-lg w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((item) => (
                <ProductCard key={item._id} {...item} />
              ))}
            </div>
            {filteredByTab.length > 4 && (
              <div className="text-center mt-12">
                <button onClick={HandleClicViewMore} className="bg-gray-900 text-white px-10 py-3 rounded-xl hover:bg-yellow-500 font-bold shadow-lg cursor-pointer transition-colors">
                  {isShowMore ? 'Xem thêm sản phẩm' : 'Thu gọn sản phẩm'}
                </button>
              </div>
            )}
          </>
        )}
        {filteredByTab.length === 0 && activeCategoryName !== 'Buffet' && <div className="text-center text-gray-400 py-10 italic">Chưa có món ăn nào trong danh mục này</div>}
      </section>
    </>
  )
}
