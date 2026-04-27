const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const count = await Notification.count({
      where: { user_id: req.user.id, is_read: false }
    })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id)
    if (!notification) return res.status(404).json({ error: "Notification non trouvee" })
    await notification.update({ is_read: true })
    res.json({ message: "Notification marquee comme lue" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    )
    res.json({ message: "Toutes les notifications marquees comme lues" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router