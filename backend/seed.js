require('dotenv').config()
const sequelize = require('./config/database')
const Produit = require('./models/Produit')

const seedProducts = async () => {
  await sequelize.sync({ force: false })

  await Produit.bulkCreate([
    {
      nom: "Savon Oceana",
      prix: 24.90,
      moq: 6,
      stock: 100,
      description: "Savon naturel aux extraits marins",
      type_affichage: "galerie",
      categorie: "Hygiene",
      is_active: true
    },
    {
      nom: "Creme Hydra",
      prix: 39.90,
      moq: 3,
      stock: 50,
      description: "Creme hydratante pour le visage",
      type_affichage: "galerie",
      categorie: "Soins",
      is_active: true
    },
    {
      nom: "Gel Douche",
      prix: 15.90,
      moq: 12,
      stock: 200,
      description: "Gel douche parfume aux fleurs",
      type_affichage: "photo",
      categorie: "Hygiene",
      is_active: true
    },
    {
      nom: "Serum Visage",
      prix: 59.90,
      moq: 2,
      stock: 30,
      description: "Serum anti-age concentre",
      type_affichage: "3D",
      categorie: "Soins",
      is_active: true
    },
    {
      nom: "Masque Argile",
      prix: 19.90,
      moq: 6,
      stock: 75,
      description: "Masque purifiant a l'argile verte",
      type_affichage: "galerie",
      categorie: "Soins",
      is_active: true
    }
  ])

  console.log("Products added successfully!")
  process.exit()
}

seedProducts()