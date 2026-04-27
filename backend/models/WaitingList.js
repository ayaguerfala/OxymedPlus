const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const WaitingList = sequelize.define('WaitingList', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  priority_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('waiting', 'notified', 'converted', 'cancelled'),
    defaultValue: 'waiting'
  }
}, {
  tableName: 'waiting_list',
  timestamps: true
})

module.exports = WaitingList