const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const Produit = require('../models/Produit')
const Notification = require('../models/Notification')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/users/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
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
})

router.put('/users/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
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
})

router.put('/users/:id/suspend', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: "Utilisateur non trouve" })
    await user.update({ is_active: false })
    res.json({ message: "Compte suspendu", user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await Produit.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nom, prix, moq, stock, description, type_affichage, categorie } = req.body
    const product = await Produit.create({
      nom, prix, moq, stock, description, type_affichage, categorie, is_active: true
    })
    res.status(201).json({ message: "Produit cree", product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Produit.findByPk(req.params.id)
    if (!product) return res.status(404).json({ error: "Produit non trouve" })
    await product.update(req.body)
    res.json({ message: "Produit mis a jour", product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/products/:id/toggle', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Produit.findByPk(req.params.id)
    if (!product) return res.status(404).json({ error: "Produit non trouve" })
    await product.update({ is_active: !product.is_active })
    res.json({ message: "Statut mis a jour", product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router