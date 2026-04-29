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

  if (req.method === 'GET') {
    try {
      const user = await User.findByPk(req.user.id)
      res.json({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved,
        telephone: user.telephone,
        cnom: user.cnom
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}