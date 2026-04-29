const bcrypt = require('bcryptjs')
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

export default async (req, res) => {
  try {
    await sequelize.authenticate()
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'POST') {
    if (req.url === '/register') {
      const { nom, prenom, email, password, telephone, role, cnom } = req.body

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ error: "Email deja utilise" })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = await User.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        telephone,
        role: role || 'client',
        cnom: cnom || null,
        is_approved: role === 'client' ? true : false
      })

      res.status(201).json({
        message: role === 'medecin'
          ? "Compte medecin cree. En attente d'approbation."
          : "Compte cree avec succes.",
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          is_approved: user.is_approved
        }
      })
    } else if (req.url === '/login') {
      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(400).json({ error: "Email ou mot de passe incorrect" })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ error: "Email ou mot de passe incorrect" })
      }

      if (!user.is_active) {
        return res.status(400).json({ error: "Compte desactive" })
      }

      if (user.role === 'medecin' && !user.is_approved) {
        return res.status(400).json({ error: "Compte en attente d'approbation" })
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        message: "Connexion reussie",
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          is_approved: user.is_approved
        }
      })
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}