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

export default async (req, res) => {
  if (!authMiddleware(req, res)) return

  try {
    await sequelize.authenticate()
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'GET' && req.url === '/') {
    try {
      const notifications = await Notification.findAll({
        where: { user_id: req.user.id },
        order: [['createdAt', 'DESC']]
      })
      res.json(notifications)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'GET' && req.url === '/unread-count') {
    try {
      const count = await Notification.count({
        where: { user_id: req.user.id, is_read: false }
      })
      res.json({ count })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'PUT' && req.url.match(/^\/\d+\/read$/)) {
    const id = req.url.split('/')[1]
    try {
      const notification = await Notification.findByPk(id)
      if (!notification) return res.status(404).json({ error: "Notification non trouvee" })
      await notification.update({ is_read: true })
      res.json({ message: "Notification marquee comme lue" })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'PUT' && req.url === '/read-all') {
    try {
      await Notification.update(
        { is_read: true },
        { where: { user_id: req.user.id, is_read: false } }
      )
      res.json({ message: "Toutes les notifications marquees comme lues" })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(404).json({ error: 'Not found' })
  }
}