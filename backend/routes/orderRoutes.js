const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const Notification = require('../models/Notification')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

router.post('/', authMiddleware, async (req, res) => {
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
})

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (!order) return res.status(404).json({ error: "Commande non trouvee" })
    await order.update({ status: 'approved' })
    await Notification.create({
      user_id: order.user_id,
      type: 'order_approved',
      message: `Votre commande #${order.id} d'un montant de ${order.total} DT a ete approuvee!`
    })
    res.json({ message: "Commande approuvee", order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (!order) return res.status(404).json({ error: "Commande non trouvee" })
    await order.update({ status: 'rejected' })
    await Notification.create({
      user_id: order.user_id,
      type: 'order_rejected',
      message: `Votre commande #${order.id} a ete rejetee. Contactez-nous pour plus d'informations.`
    })
    res.json({ message: "Commande rejetee", order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router