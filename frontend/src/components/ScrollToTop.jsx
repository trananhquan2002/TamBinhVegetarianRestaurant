import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <>
      {isVisible && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 p-4 bg-orange-600 text-white rounded-full shadow-2xl hover:bg-green-700 hover:scale-110 active:scale-90 transition-all duration-300 group cursor-pointer" aria-label="Scroll to top">
          <FaArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
    </>
  )
}
