import { createContext, useContext, useMemo, useState } from 'react'
const CartContext = createContext(null)
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
const cleanPrice = (price) => {
  if (typeof price === 'number') return price
  return Number(price.toString().replace(/\./g, '')) || 0
}
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const addToCart = (product) => {
    setCart((prev) => {
      const existed = prev.find((i) => i.id === product.id)
      if (existed) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        {
          ...product,
          price: cleanPrice(product.price),
          quantity: 1,
        },
      ]
    })
  }
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }
  const increaseQuantity = (id) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)))
  }
  const decreaseQuantity = (id) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0))
  }
  const clearCart = () => setCart([])
  const cartCount = useMemo(() => cart.reduce((total, i) => total + i.quantity, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart])
  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  )
}
