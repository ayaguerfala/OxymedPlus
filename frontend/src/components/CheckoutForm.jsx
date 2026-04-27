import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import DeliveryMap from './DeliveryMap'

const CheckoutForm = ({ onClose }) => {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const { cart, getTotal } = useCart()
  const { user } = useAuth()

  const buildMessage = () => {
    let message = `Bonjour, je souhaite commander:\n\n`
    cart.forEach((item) => {
      message += `• ${item.nom} x${item.quantity} = ${(item.prix * item.quantity).toFixed(2)} DT\n`
    })
    message += `\nTotal: ${getTotal()} DT`
    message += `\n\nNom: ${prenom} ${nom}`
    if (selectedLocation) {
      message += `\n📍 Position: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
    }
    return encodeURIComponent(message)
  }

  const handleSend = async () => {
    if (!nom || !prenom) {
      alert('Veuillez entrer votre nom et prénom')
      return
    }

    setLoading(true)

    try {
      if (user) {
        const token = localStorage.getItem('oxymed_token')
        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            items: cart,
            total: getTotal(),
            client_nom: nom,
            client_prenom: prenom,
            delivery_lat: selectedLocation?.lat || null,
            delivery_lng: selectedLocation?.lng || null,
            delivery_address: selectedLocation
              ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
              : 'A confirmer'
          })
        })
      }
    } catch (err) {
      console.error('Order save error:', err)
    }

    const message = buildMessage()
    window.open(`https://wa.me/21653564981?text=${message}`, '_blank')
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-4">
        <h2 className="text-2xl font-bold mb-4">Finaliser la commande</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* MAP SECTION */}
        <div className="mt-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            {showMap ? 'Masquer la carte' : '📍 Choisir ma position de livraison'}
          </button>

          {selectedLocation && (
            <p className="text-green-600 text-sm mt-1">
              ✅ Position selectionnee: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </p>
          )}

          {showMap && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">
                Cliquez sur la carte pour choisir votre adresse de livraison
              </p>
              <DeliveryMap
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
          )}
        </div>

        <div className="mt-4 border rounded p-3 bg-gray-50">
          <h3 className="font-bold mb-2">Récapitulatif:</h3>
          {cart.map((item) => (
            <p key={item.id} className="text-sm text-gray-600">
              {item.nom} x{item.quantity} = {(item.prix * item.quantity).toFixed(2)} DT
            </p>
          ))}
          <p className="font-bold mt-2">Total: {getTotal()} DT</p>
        </div>

        {!user && (
          <p className="mt-2 text-sm text-orange-500">
            Connectez-vous pour sauvegarder votre commande.
          </p>
        )}

        <button
          onClick={handleSend}
          disabled={loading}
          className="mt-4 w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 font-bold disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Commander via WhatsApp 📱"}
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

export default CheckoutForm