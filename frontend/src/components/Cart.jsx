import { useState } from 'react'
import { useCart } from '../context/CartContext'
import CheckoutForm from './CheckoutForm'

const Cart = () => {
  const { cart, removeFromCart, getTotal, getItemCount } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <div className="border rounded-xl p-4 mb-6 bg-white shadow">
      <h2 className="text-xl font-bold mb-3">
        Mon Panier ({getItemCount()} articles)
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.nom}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} x {item.prix} DT = {(item.prix * item.quantity).toFixed(2)} DT
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
          <h3 className="font-bold mt-3 text-lg">Total: {getTotal()} DT</h3>
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-bold"
          >
            Commander via WhatsApp 📱
          </button>
        </div>
      )}

      {showCheckout && (
        <CheckoutForm onClose={() => setShowCheckout(false)} />
      )}
    </div>
  )
}

export default Cart