import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProductCard = (props) => {
  const [quantity, setQuantity] = useState(props.moq || 1)
  const [joinedWaitingList, setJoinedWaitingList] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const increase = () => setQuantity(quantity + 1)

  const decrease = () => {
    if (quantity > (props.moq || 1)) setQuantity(quantity - 1)
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/?showRegister=true')
      return
    }
    addToCart(props, quantity)
  }

  const handleJoinWaitingList = async () => {
    if (!user) {
      navigate('/?showRegister=true')
      return
    }
    try {
      const token = localStorage.getItem('oxymed_token')
      const res = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: props.id, quantity: props.moq || 1 }),
      })
      const data = await res.json()
      if (res.ok) {
        setJoinedWaitingList(true)
        alert("Vous avez rejoint la liste d'attente!")
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isOutOfStock = props.stock === 0
  const isAdmin = user?.role === 'admin'

  if (isAdmin) {
    return (
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
        {props.image_couverture ? (
          <img
            src={props.image_couverture}
            alt={props.nom}
            className="w-full h-44 object-contain rounded-lg bg-gray-50 p-2"
          />
        ) : (
          <div className="w-full h-44 bg-green-50 rounded-lg flex items-center justify-center">
            <span className="text-5xl">💊</span>
          </div>
        )}

        <div className="flex justify-between items-start">
          <h2 className="text-base font-bold text-gray-800 flex-1 mr-2">{props.nom}</h2>
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
              isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {isOutOfStock ? 'Rupture' : `Stock: ${props.stock}`}
          </span>
        </div>

        {props.categorie && <p className="text-xs text-green-600 font-semibold">{props.categorie}</p>}

        <p className="text-gray-600 text-sm">
          Prix: <span className="font-bold text-green-800 text-base">{props.prix} DT</span>
        </p>

        <button
          onClick={() => props.onDetailsClick()}
          className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-semibold text-sm border mt-auto"
        >
          Détails
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      {props.image_couverture ? (
        <img
          src={props.image_couverture}
          alt={props.nom}
          className="w-full h-44 object-contain rounded-lg bg-gray-50 p-2"
        />
      ) : (
        <div className="w-full h-44 bg-green-50 rounded-lg flex items-center justify-center">
          <span className="text-5xl">💊</span>
        </div>
      )}

      <div className="flex justify-between items-start">
        <h2 className="text-base font-bold text-gray-800 flex-1 mr-2">{props.nom}</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
            isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}
        >
          {isOutOfStock ? 'Rupture' : `Stock: ${props.stock}`}
        </span>
      </div>

      {props.categorie && <p className="text-xs text-green-600 font-semibold">{props.categorie}</p>}

      <p className="text-gray-600 text-sm">
        Prix: <span className="font-bold text-green-800 text-base">{props.prix} DT</span>
      </p>

      <p className="text-gray-500 text-sm">
        MOQ: <span className="font-semibold">{props.moq}</span>
      </p>

      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <button onClick={decrease} className="bg-gray-200 px-3 py-1 rounded-lg font-bold hover:bg-gray-300">
            -
          </button>
          <span className="font-semibold text-lg">{quantity}</span>
          <button onClick={increase} className="bg-gray-200 px-3 py-1 rounded-lg font-bold hover:bg-gray-300">
            +
          </button>
        </div>
      )}

      {quantity === (props.moq || 1) && !isOutOfStock && (
        <p className="text-red-500 text-xs">Quantité minimum atteinte!</p>
      )}

      {isOutOfStock ? (
        <button
          onClick={handleJoinWaitingList}
          disabled={joinedWaitingList}
          className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 font-semibold text-sm"
        >
          {joinedWaitingList ? 'Sur la liste ✅' : "Rejoindre la liste d'attente"}
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-semibold text-sm"
        >
          Ajouter au panier
        </button>
      )}

      <button
        onClick={() => props.onDetailsClick()}
        className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-semibold text-sm border"
      >
        Détails
      </button>
    </div>
  )
}

export default ProductCard