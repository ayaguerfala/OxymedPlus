const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Order = sequelize.define('Order', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'delivered'),
    defaultValue: 'pending'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  delivery_lat: {
    type: DataTypes.DECIMAL(10, 8)
  },
  delivery_lng: {
    type: DataTypes.DECIMAL(11, 8)
  },
  delivery_address: {
    type: DataTypes.TEXT
  },
  client_nom: {
    type: DataTypes.STRING
  },
  client_prenom: {
    type: DataTypes.STRING
  },
  whatsapp_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'orders',
  timestamps: true
})

module.exports = Order