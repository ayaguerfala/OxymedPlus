import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  const addToCart = (product, quantity) => {
    const exists = cart.some((item) => item.id === product.id)
    if (!exists) {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + (item.prix * item.quantity)
    }, 0).toFixed(2)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)