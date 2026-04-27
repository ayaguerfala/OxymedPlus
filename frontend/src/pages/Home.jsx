import { useNavigate } from 'react-router-dom'
import useProductsAPI from '../hooks/useProductsAPI'

const Home = () => {
  const navigate = useNavigate()
  const { products } = useProductsAPI()

  const featuredProducts = products.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}
      <div className="bg-blue-900 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Bienvenue sur Oxymed</h1>
        <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Votre plateforme de produits medicaux professionnels.
          Commandez facilement, recevez rapidement.
        </p>
        <button
          onClick={() => navigate('/catalogue')}
          className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition"
        >
          Voir le Catalogue →
        </button>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Pourquoi Oxymed?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Produits Certifies</h3>
            <p className="text-gray-600">Tous nos produits sont certifies et conformes aux normes medicales internationales.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Livraison Rapide</h3>
            <p className="text-gray-600">Commandez via WhatsApp et recevez vos produits directement a votre adresse.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pour les Medecins</h3>
            <p className="text-gray-600">Compte medecin avec priorite d'acces et avantages exclusifs pour les professionnels.</p>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Produits Phares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="border rounded-xl p-4 text-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💊</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{product.nom}</h3>
                <p className="text-blue-600 font-semibold mt-1">{product.prix} DT</p>
                <p className="text-gray-500 text-sm mt-1">MOQ: {product.moq}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/catalogue')}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition"
            >
              Voir tous les produits
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white py-8 px-4 text-center">
        <p className="text-blue-200">© 2026 Oxymed — Tous droits reserves</p>
        <p className="text-blue-300 text-sm mt-2">
          Contact: WhatsApp +216 53 564 981
        </p>
      </footer>

    </div>
  )
}

export default Home