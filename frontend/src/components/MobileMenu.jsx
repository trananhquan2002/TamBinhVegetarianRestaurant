import { Link } from 'react-router-dom'
import { FiX, FiShoppingCart, FiPhone, FiMenu } from 'react-icons/fi'
const MobileMenu = ({ isOpen, onClose, cartCount }) => {
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-lg p-4 animate-slideIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/menu" onClick={onClose} className="flex items-center gap-3 text-gray-700">
            <FiMenu size={20} />
            Thực đơn
          </Link>
          <Link to="/contact" onClick={onClose} className="flex items-center gap-3 text-gray-700">
            <FiPhone size={20} />
            Liên Hệ
          </Link>
          <Link to="/cart" onClick={onClose} className="flex items-center gap-3 text-gray-700 relative">
            <FiShoppingCart size={20} />
            Giỏ hàng
            {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </>
  )
}
export default MobileMenu
