import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ProductCard = (props) => {
  const [quantity, setQuantity] = useState(props.moq)
  const [joinedWaitingList, setJoinedWaitingList] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  const increase = () => setQuantity(quantity + 1)

  const decrease = () => {
    if (quantity > props.moq) setQuantity(quantity - 1)
  }

  const handleAddToCart = () => addToCart(props, quantity)

  const handleJoinWaitingList = async () => {
    if (!user) {
      alert('Veuillez vous connecter pour rejoindre la liste d\'attente')
      return
    }
    try {
      const token = localStorage.getItem('oxymed_token')
      const res = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: props.id, quantity: props.moq })
      })
      const data = await res.json()
      if (res.ok) {
        setJoinedWaitingList(true)
        alert(`Vous avez rejoint la liste d'attente! Position: ${data.priority_score}`)
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isOutOfStock = props.stock === 0

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">{props.nom}</h2>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
          isOutOfStock
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-600'
        }`}>
          {isOutOfStock ? 'Rupture' : `Stock: ${props.stock}`}
        </span>
      </div>

      <p className="text-gray-600">Prix: <span className="font-semibold text-black">{props.prix} DT</span></p>
      <p className="text-gray-600">MOQ: <span className="font-semibold">{props.moq}</span></p>

      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <button onClick={decrease} className="bg-gray-200 px-3 py-1 rounded font-bold">-</button>
          <span className="font-semibold">{quantity}</span>
          <button onClick={increase} className="bg-gray-200 px-3 py-1 rounded font-bold">+</button>
        </div>
      )}

      {quantity === props.moq && !isOutOfStock && (
        <p className="text-red-500 text-sm">Quantité minimum atteinte!</p>
      )}

      {isOutOfStock ? (
        <button
          onClick={handleJoinWaitingList}
          disabled={joinedWaitingList}
          className="bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50 font-semibold"
        >
          {joinedWaitingList ? 'Sur la liste ✅' : "Rejoindre la liste d'attente"}
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Ajouter au panier
        </button>
      )}

      <button
        onClick={() => props.onDetailsClick()}
        className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
      >
        Details
      </button>
    </div>
  )
}

export default ProductCard