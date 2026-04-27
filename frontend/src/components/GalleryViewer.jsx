import { useState } from 'react'

const GalleryViewer = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={images[currentIndex]}
        alt="product"
        className="w-full rounded-lg"
      />
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-gray-600">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={next}
          disabled={currentIndex === images.length - 1}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default GalleryViewer