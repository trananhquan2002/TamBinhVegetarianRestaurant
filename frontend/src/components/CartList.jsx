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
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-3">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
        {cart.length === 0 ? (
          <>
            <p className="text-center text-gray-500 py-10">Giỏ hàng trống...</p>
            <button onClick={() => navigate('/menu')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
              Tiếp tục mua sắm
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 border rounded-lg p-4">
                  <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded mx-auto md:mx-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-blue-600 font-semibold">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-30">
                    <p className="font-semibold text-blue-600">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="self-center md:self-auto bg-red-500 text-white p-2 rounded hover:bg-red-600 cursor-pointer">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-6">
              <button onClick={() => navigate('/menu')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                Tiếp tục mua sắm
              </button>
              <div className="text-right">
                <p className="text-lg">
                  Tổng tiền: <span className="font-bold text-red-500">{formatCurrency(cartTotal)}</span>
                </p>
                <button className="mt-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 cursor-pointer">
                  <Link to="/checkout">Đặt hàng</Link>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
