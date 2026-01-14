import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiLogOut, FiShoppingCart, FiUser } from 'react-icons/fi'
import MobileMenu from './MobileMenu'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const handleLogoClick = () => {
    navigate('/')
  }
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 h-16 md:h-20 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 cursor-pointer group shrink-0" onClick={handleLogoClick}>
            <img src="/assets/images/logoTamBinh.jpg" alt="Tâm Bình" className="w-8 h-8 md:w-11 md:h-11 rounded-full object-cover border border-red-100" />
            <span className="block font-black text-[11px] md:text-lg text-red-700 uppercase tracking-tighter whitespace-nowrap">Tâm Bình</span>
          </div>
          <nav className="hidden md:flex gap-6 font-bold text-sm uppercase text-gray-600">
            <Link className="hover:text-red-700 transition-colors" to="/home">
              Trang chủ
            </Link>
            <Link className="hover:text-red-700 transition-colors" to="/menu">
              Thực đơn
            </Link>
            <Link className="hover:text-red-700 transition-colors" to="/contact">
              Liên hệ
            </Link>
          </nav>
          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            <Link to="/cart" className="relative p-1.5 text-gray-700">
              <FiShoppingCart size={19} />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </Link>
            {user ? (
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 p-0.5 pr-2 rounded-full shadow-inner max-w-fit">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shrink-0 shadow-sm border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                {!user.avatar && <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm">{(typeof user === 'string' ? user : user.userName)?.charAt(0).toUpperCase()}</div>}
                <div className="flex items-center whitespace-nowrap overflow-visible">
                  <span className="text-[10px] md:text-xs font-black text-gray-800 tracking-tight px-1">{typeof user === 'string' ? user : user.userName}</span>
                </div>
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 ml-0.5 cursor-pointer">
                  <FiLogOut size={13} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-red-600 text-white p-2 rounded-full shadow-md">
                <FiUser size={16} />
              </Link>
            )}
            <button className="md:hidden p-1 text-2xl text-gray-700" onClick={() => setOpen(true)}>
              <FiMenu />
            </button>
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20"></div>
      <MobileMenu isOpen={open} onClose={() => setOpen(false)} cartCount={cartCount} />
    </>
  )
}
