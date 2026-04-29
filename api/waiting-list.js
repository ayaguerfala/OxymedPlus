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

const WaitingList = sequelize.define('WaitingList', {
  user_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  priority_score: DataTypes.INTEGER,
  status: DataTypes.ENUM('waiting', 'notified', 'converted', 'cancelled')
}, {
  tableName: 'waiting_list',
  timestamps: true
})

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

const calculatePriorityScore = async (userId, role) => {
  let score = 100
  if (role === 'medecin') score += 50
  const orderCount = await Order.count({ where: { user_id: userId } })
  score += orderCount * 10
  return score
}

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
      const { product_id, quantity } = req.body

      const existing = await WaitingList.findOne({
        where: { user_id: req.user.id, product_id, status: 'waiting' }
      })
      if (existing) {
        return res.status(400).json({ error: "Vous etes deja sur la liste d'attente" })
      }

      const priority_score = await calculatePriorityScore(req.user.id, req.user.role)

      const entry = await WaitingList.create({
        user_id: req.user.id,
        product_id,
        quantity,
        priority_score,
        status: 'waiting'
      })

      res.status(201).json({
        message: "Vous avez rejoint la liste d'attente",
        entry,
        priority_score
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'GET' && req.url === '/my-list') {
    try {
      const list = await WaitingList.findAll({
        where: { user_id: req.user.id },
        order: [['createdAt', 'DESC']]
      })
      res.json(list)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'GET' && req.url === '/all') {
    if (!adminMiddleware(req, res)) return
    try {
      const list = await WaitingList.findAll({
        order: [['priority_score', 'DESC'], ['createdAt', 'ASC']]
      })
      res.json(list)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(404).json({ error: 'Not found' })
  }
}