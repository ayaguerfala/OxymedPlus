const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Produit = sequelize.define('Produit', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  moq: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT
  },
  image_couverture: {
    type: DataTypes.STRING
  },
  galerie: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  modele_3d: {
    type: DataTypes.STRING
  },
  type_affichage: {
    type: DataTypes.ENUM('photo', 'galerie', '3D'),
    defaultValue: 'photo'
  },
  categorie: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'produits',
  timestamps: true
})

module.exports = Produit