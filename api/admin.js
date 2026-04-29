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

const User = sequelize.define('User', {
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.ENUM('client', 'medecin', 'admin'),
  is_approved: DataTypes.BOOLEAN,
  is_active: DataTypes.BOOLEAN,
  telephone: DataTypes.STRING,
  cnom: DataTypes.STRING
}, {
  tableName: 'users',
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
  if (!adminMiddleware(req, res)) return

  try {
    await sequelize.authenticate()
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'GET' && req.url === '/users') {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      })
      res.json(users)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'PUT' && req.url.match(/^\/users\/\d+\/approve$/)) {
    const id = req.url.split('/')[2]
    try {
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ error: "Utilisateur non trouve" })
      await user.update({ is_approved: true })
      await Notification.create({
        user_id: user.id,
        type: 'account_approved',
        message: `Votre compte medecin a ete approuve! Vous pouvez maintenant vous connecter.`
      })
      res.json({ message: "Compte approuve", user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'PUT' && req.url.match(/^\/users\/\d+\/reject$/)) {
    const id = req.url.split('/')[2]
    try {
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ error: "Utilisateur non trouve" })
      await user.update({ is_approved: false, is_active: false })
      await Notification.create({
        user_id: user.id,
        type: 'account_rejected',
        message: `Votre compte medecin a ete rejete. Contactez-nous pour plus d'informations.`
      })
      res.json({ message: "Compte rejete", user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(404).json({ error: 'Not found' })
  }
}