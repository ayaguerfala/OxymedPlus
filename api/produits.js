const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
)

const Produit = sequelize.define('Produit', {
  nom: DataTypes.STRING,
  prix: DataTypes.DECIMAL(10, 2),
  moq: DataTypes.INTEGER,
  stock: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  image_couverture: DataTypes.STRING,
  galerie: DataTypes.JSON,
  modele_3d: DataTypes.STRING,
  type_affichage: DataTypes.ENUM('photo', 'galerie', '3D'),
  categorie: DataTypes.STRING,
  is_active: DataTypes.BOOLEAN
}, {
  tableName: 'produits',
  timestamps: true
})

export default async (req, res) => {
  try {
    await sequelize.authenticate()
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'GET') {
    try {
      const produits = await Produit.findAll({
        where: { is_active: true },
        order: [['createdAt', 'DESC']]
      })
      res.json(produits)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}