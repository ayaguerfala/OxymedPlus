import { useNavigate } from 'react-router-dom'
import useProductsAPI from '../hooks/useProductsAPI'

const Home = () => {
  const navigate = useNavigate()
  const { products } = useProductsAPI()
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-green-600 bg-opacity-50 text-green-100 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              🏥 Spécialiste en équipements médicaux depuis 2016
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Votre santé,<br />
              <span className="text-green-300">notre priorité</span>
            </h1>
            <p className="text-lg text-green-100 mb-10 max-w-xl leading-relaxed">
              OxymedPlus vous offre les meilleurs équipements médicaux certifiés —
              concentrateurs d'oxygène, CPAP, lits médicalisés — avec installation
              et assistance technique professionnelle à domicile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/catalogue')}
                className="bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-lg"
              >
                Voir le Catalogue →
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-800 transition"
              >
                Créer un compte
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-green-600 bg-opacity-30 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center">
                  <img
                    src="https://oxymedplus.com/storage/2024/11/OXYMED_PLUS-removebg-preview-1.png"
                    alt="OxymedPlus"
                    className="w-48 drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="bg-green-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "2016", label: "Fondée en" },
            { number: "500+", label: "Patients servis" },
            { number: "12+", label: "Produits médicaux" },
            { number: "24/7", label: "Assistance technique" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-green-300">{stat.number}</p>
              <p className="text-green-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            OxymedPlus propose une gamme complète de services médicaux à domicile
            et en institution, adaptés aux besoins de chaque patient.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🫁",
              title: "Assistance Respiratoire",
              desc: "Concentrateurs d'oxygène, appareils CPAP et ventilateurs non invasifs pour les patients souffrant de troubles respiratoires.",
              color: "bg-green-50 border-green-200"
            },
            {
              icon: "🛏️",
              title: "Lits Médicalisés",
              desc: "Lits médicalisés électriques à 2 et 3 articulations pour un confort optimal à domicile et en établissement de soins.",
              color: "bg-blue-50 border-blue-200"
            },
            {
              icon: "🔧",
              title: "Installation & Maintenance",
              desc: "Notre équipe technique assure l'installation, la mise en service et le suivi régulier de tous vos équipements médicaux.",
              color: "bg-purple-50 border-purple-200"
            },
          ].map((service, i) => (
            <div key={i} className={`${service.color} border-2 rounded-2xl p-8 hover:shadow-lg transition`}>
              <div className="text-5xl mb-5">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Produits Phares</h2>
            <p className="text-gray-500">Découvrez notre sélection d'équipements médicaux certifiés</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate('/catalogue')}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition cursor-pointer border border-gray-100 group"
              >
                {product.image_couverture ? (
                  <img
                    src={product.image_couverture}
                    alt={product.nom}
                    className="w-36 h-36 object-contain mx-auto mb-4 group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-36 h-36 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">💊</span>
                  </div>
                )}
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {product.categorie || 'Médical'}
                </span>
                <h3 className="text-base font-bold text-gray-800 mt-3 mb-1">{product.nom}</h3>
                <p className="text-green-700 font-bold text-lg">{product.prix} DT</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/catalogue')}
              className="bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-800 transition shadow-lg"
            >
              Voir tous les produits →
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos Catégories</h2>
          <p className="text-gray-500">Parcourez notre catalogue par catégorie d'équipements</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { name: "Concentrateurs d'oxygène", icon: "🫧", color: "hover:border-blue-500 hover:bg-blue-50" },
            { name: "CPAP / APAP", icon: "😴", color: "hover:border-green-500 hover:bg-green-50" },
            { name: "Ventilateurs non invasifs", icon: "💨", color: "hover:border-purple-500 hover:bg-purple-50" },
            { name: "Lits médicalisés", icon: "🛏️", color: "hover:border-orange-500 hover:bg-orange-50" },
            { name: "Masques", icon: "😷", color: "hover:border-red-500 hover:bg-red-50" },
            { name: "Accessoires", icon: "🔧", color: "hover:border-gray-500 hover:bg-gray-50" },
          ].map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate('/catalogue')}
              className={`bg-white border-2 border-gray-100 rounded-2xl p-6 text-center cursor-pointer transition shadow-sm ${cat.color}`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-semibold text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY US */}
      <div className="bg-green-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir OxymedPlus ?</h2>
            <p className="text-green-200 max-w-2xl mx-auto">
              Depuis 2016, nous accompagnons patients et professionnels de santé
              avec des équipements de qualité et un service irréprochable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "✅", title: "Produits Certifiés", desc: "Tous nos équipements sont certifiés et conformes aux normes médicales internationales." },
              { icon: "🚀", title: "Livraison Rapide", desc: "Installation et livraison à domicile dans toute la région de Sousse et ses environs." },
              { icon: "👨‍⚕️", title: "Espace Médecins", desc: "Accès prioritaire et avantages exclusifs pour les professionnels de santé vérifiés." },
              { icon: "📞", title: "Support 24/7", desc: "Notre équipe technique est disponible pour vous accompagner à tout moment." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-green-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div>
              <img
                src="https://oxymedplus.com/storage/2024/11/OXYMED_PLUS-removebg-preview-1.png"
                alt="OxymedPlus"
                className="h-12 mb-4"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                Spécialiste tunisien en équipements médicaux et services de soins à domicile depuis 2016.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-green-400">Navigation</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="cursor-pointer hover:text-white transition" onClick={() => navigate('/')}>Accueil</li>
                <li className="cursor-pointer hover:text-white transition" onClick={() => navigate('/catalogue')}>Catalogue</li>
                <li className="cursor-pointer hover:text-white transition">Qui sommes-nous</li>
                <li className="cursor-pointer hover:text-white transition">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-green-400">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 +216 73 201 473</li>
                <li>✉️ contact@oxymedplus.com</li>
                <li>📍 Immeuble El Amen, Avenue Hassouna Ayechi, Sousse 4000</li>
                <li>💬 WhatsApp: +216 40 434 198</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            © 2025 OxymedPlus — Tous droits réservés
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home 