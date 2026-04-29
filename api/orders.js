const jwt = require('jsonwebtoken')
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

const Order = sequelize.define('Order', {
  user_id: DataTypes.INTEGER,
  items: DataTypes.JSON,
  total: DataTypes.DECIMAL(10, 2),
  delivery_lat: DataTypes.DECIMAL(10, 8),
  delivery_lng: DataTypes.DECIMAL(11, 8),
  delivery_address: DataTypes.STRING,
  client_nom: DataTypes.STRING,
  client_prenom: DataTypes.STRING,
  status: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
  whatsapp_sent: DataTypes.BOOLEAN
}, {
  tableName: 'orders',
  timestamps: true
})

const Notification = sequelize.define('Notification', {
  user_id: DataTypes.INTEGER,
  type: DataTypes.STRING,
  message: DataTypes.TEXT,
  is_read: DataTypes.BOOLEAN
}, {
  tableName: 'notifications',
  timestamps: true
})

const authMiddleware = (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Token manquant" })
    return false
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    return true
  } catch (err) {
    res.status(401).json({ error: "Token invalide" })
    return false
  }
}

const adminMiddleware = (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: "Acces refuse - Admin uniquement" })
    return false
  }
  return true
}

export default async (req, res) => {
  if (!authMiddleware(req, res)) return

  try {
    await sequelize.authenticate()
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'POST' && req.url === '/') {
    try {
      const { items, total, delivery_lat, delivery_lng, delivery_address, client_nom, client_prenom } = req.body

      const order = await Order.create({
        user_id: req.user.id,
        items,
        total,
        delivery_lat,
        delivery_lng,
        delivery_address,
        client_nom,
        client_prenom,
        status: 'pending',
        whatsapp_sent: true
      })

      res.status(201).json({
        message: "Commande enregistree avec succes",
        order
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'GET' && req.url === '/my-orders') {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user.id },
        order: [['createdAt', 'DESC']]
      })
      res.json(orders)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'GET' && req.url === '/all') {
    if (!adminMiddleware(req, res)) return
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']]
      })
      res.json(orders)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(404).json({ error: 'Not found' })
  }
}