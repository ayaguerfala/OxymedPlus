const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const sequelize = require('./config/database')
const Produit = require('./models/Produit')
const User = require('./models/UserModel')
const Order = require('./models/Order')
const WaitingList = require('./models/WaitingList')
const Notification = require('./models/Notification')
const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const waitingListRoutes = require('./routes/waitingListRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/waiting-list', waitingListRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalOrders = await Order.count()
    const pendingOrders = await Order.count({ where: { status: 'pending' } })
    const totalUsers = await User.count()
    const activeProducts = await Produit.count({ where: { is_active: true } })
    res.json({
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      total_users: totalUsers,
      active_products: activeProducts
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.findAll({
      where: { is_active: true }
    })
    res.json(produits)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/produits/:id', async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id)
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouve" })
    }
    res.json(produit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

sequelize.sync({ alter: false }).then(() => {
  console.log('Database connected and synced!')
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}).catch((err) => {
  console.error('Database connection failed:', err)
})