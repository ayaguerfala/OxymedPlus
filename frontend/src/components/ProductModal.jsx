import GalleryViewer from './GalleryViewer'
import Viewer3D from './Viewer3D'

const ProductModal = ({ product, onClose }) => {
  if (!product) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2">{product.nom}</h2>
        <p className="text-gray-600 mb-1">Prix: <span className="font-semibold text-black">{product.prix} DT</span></p>
        <p className="text-gray-600 mb-4">MOQ: <span className="font-semibold">{product.moq}</span></p>

        {product.type_affichage === "galerie" && (
          <GalleryViewer images={product.galerie} />
        )}
        {product.type_affichage === "photo" && (
          <img src={product.galerie[0]} alt={product.nom} className="w-full rounded-lg" />
        )}
        {product.type_affichage === "3D" && (
          <Viewer3D />
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}

export default ProductModal