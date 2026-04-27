import { useState, useEffect } from 'react'

const useProductsAPI = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/produits')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Erreur lors du chargement des produits")
        setLoading(false)
      })
  }, [])

  return { products, loading, error }
}

export default useProductsAPI