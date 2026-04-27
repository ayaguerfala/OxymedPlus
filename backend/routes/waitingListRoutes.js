const express = require('express')
const router = express.Router()
const WaitingList = require('../models/WaitingList')
const Order = require('../models/Order')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

const calculatePriorityScore = async (userId, role) => {
  let score = 100
  if (role === 'medecin') score += 50
  const orderCount = await Order.count({ where: { user_id: userId } })
  score += orderCount * 10
  return score
}

router.post('/', authMiddleware, async (req, res) => {
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
})

router.get('/my-list', authMiddleware, async (req, res) => {
  try {
    const list = await WaitingList.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/position/:product_id', authMiddleware, async (req, res) => {
  try {
    const allWaiting = await WaitingList.findAll({
      where: { product_id: req.params.product_id, status: 'waiting' },
      order: [['priority_score', 'DESC'], ['createdAt', 'ASC']]
    })

    const position = allWaiting.findIndex(
      (entry) => entry.user_id === req.user.id
    ) + 1

    res.json({
      position,
      total: allWaiting.length
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await WaitingList.findByPk(req.params.id)
    if (!entry) return res.status(404).json({ error: "Entree non trouvee" })
    if (entry.user_id !== req.user.id) {
      return res.status(403).json({ error: "Acces refuse" })
    }
    await entry.update({ status: 'cancelled' })
    res.json({ message: "Vous avez quitte la liste d'attente" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const list = await WaitingList.findAll({
      order: [['priority_score', 'DESC'], ['createdAt', 'ASC']]
    })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router