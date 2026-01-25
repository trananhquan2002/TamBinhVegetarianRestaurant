import { FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { toast } from 'react-hot-toast'
export default function ProductCard(props) {
  const { addToCart } = useCart()
  const productData = {
    id: props._id,
    title: props.title,
    desc: props.desc,
    price: props.price,
    image: props.image,
  }
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={props.image}
          alt={props.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = '/assets/images/default-food.jpg'
          }}
        />
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">{props.price?.toLocaleString()}đ</div>
      </div>
      <div className="p-4 flex flex-col flex-1 bg-white">
        <h3 className="font-bold text-base text-gray-800 mb-1 group-hover:text-red-700 transition-colors line-clamp-1">{props.title}</h3>
        <p className="text-xs text-gray-500 flex-1 line-clamp-2 mb-4 leading-relaxed">{props.desc}</p>
        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <span className="font-extrabold text-red-700 text-base">{props.price?.toLocaleString()}đ</span>
          <button
            onClick={() => {
              addToCart(productData)
              toast.dismiss()
              toast.success(`Đã thêm ${props.title} vào giỏ hàng thành công`, {
                duration: 3000,
                style: {
                  border: 'none',
                  padding: '16px',
                  color: '#16a34a',
                  fontWeight: '500',
                  borderRadius: '12px',
                  background: '#fff',
                },
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#fff',
                },
              })
            }}
            className="bg-yellow-400 hover:bg-gray-900 hover:text-white text-black w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer active:scale-90"
            title="Thêm vào giỏ hàng">
            <FiShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
