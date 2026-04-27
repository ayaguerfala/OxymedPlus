const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

router.post('/register', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    if (!user.is_active) {
      return res.status(401).json({ error: "Compte suspendu" })
    }

    if (user.role === 'medecin' && !user.is_approved) {
      return res.status(401).json({ error: "Compte en attente d'approbation" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
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
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router