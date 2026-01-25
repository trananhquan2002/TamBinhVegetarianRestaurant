import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'
const formatCurrency = (number) => {
  if (isNaN(number) || number === null) return '0 VNĐ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
    .format(number)
    .replace('₫', ' VNĐ')
}
export default function CartList() {
  const navigate = useNavigate()
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart()
  const handleGoToMenu = () => {
    navigate('/menu#product-section', { state: { fromCart: true } })
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-white z-10 border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Giỏ hàng ({cart.length})</h2>
          <button onClick={handleGoToMenu} className="text-sm text-white bg-green-500 rounded-full w-30 h-10 cursor-pointer">
            Thêm món
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-cart-shopping text-3xl text-gray-300"></i>
            </div>
            <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống</p>
            <button onClick={handleGoToMenu} className="bg-green-500 text-white px-8 py-2 rounded-full font-medium cursor-pointer">
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">{item.title}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 ml-2 cursor-pointer">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <p className="text-red-500 font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-r-gray cursor-pointer">
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-l-gray cursor-pointer">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Tổng thanh toán</span>
                <span className="text-xl font-bold text-red-500">{formatCurrency(cartTotal)}</span>
              </div>
              <Link to="/checkout" className="flex-1 max-w-50 bg-[#fe2c55] text-white text-center py-3 rounded-full font-bold hover:bg-[#ef2950] transition-colors">
                Đặt hàng
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
