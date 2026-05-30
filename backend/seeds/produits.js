require('dotenv').config()
const sequelize = require('../config/database')
const Produit = require('../models/Produit')

const seedProducts = async () => {
  await sequelize.sync({ force: false })
  await Produit.destroy({ where: {} })

  await Produit.bulkCreate([
    {
      nom: "Concentrateur d'oxygène GCE M50",
      prix: 2500.00,
      moq: 1,
      stock: 10,
      description: "Concentrateur d'oxygène stationnaire GCE M50, idéal pour une utilisation à domicile et en institution.",
      image_couverture: "https://oxymedplus.com/storage/2021/06/Concentrateur-d'oxygene-GCE-M5099963.png",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2021/06/Concentrateur-d'oxygene-GCE-M5099963.png"
      ]),
      type_affichage: "galerie",
      categorie: "Concentrateur d'oxygène",
      is_active: true
    },
    {
      nom: "Concentrateur d'oxygène GCE OC-E10",
      prix: 3200.00,
      moq: 1,
      stock: 8,
      description: "Concentrateur d'oxygène GCE OC-E10, haute performance pour assistance respiratoire.",
      image_couverture: "https://oxymedplus.com/storage/2021/06/OC-E80_8788-1-300x227.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2021/06/OC-E80_8788-1-300x227.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Concentrateur d'oxygène",
      is_active: true
    },
    {
      nom: "Concentrateur d'oxygène GCE Portable ZEN-O",
      prix: 4500.00,
      moq: 1,
      stock: 5,
      description: "Concentrateur d'oxygène portable GCE ZEN-O, léger et performant pour une utilisation en déplacement.",
      image_couverture: "https://oxymedplus.com/storage/2021/06/zeno_product_page_image-300x227.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2021/06/zeno_product_page_image-300x227.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Concentrateur d'oxygène",
      is_active: true
    },
    {
      nom: "Cpap Point 3",
      prix: 1800.00,
      moq: 1,
      stock: 12,
      description: "Appareil CPAP pour le traitement du syndrome d'apnée du sommeil.",
      image_couverture: "https://oxymedplus.com/storage/2021/06/unnamed-file-300x200.png",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2021/06/unnamed-file-300x200.png"
      ]),
      type_affichage: "galerie",
      categorie: "CPAP",
      is_active: true
    },
    {
      nom: "HOFFRICHTER TREND III BILEVEL",
      prix: 5500.00,
      moq: 1,
      stock: 4,
      description: "Ventilateur non invasif HOFFRICHTER TREND III BILEVEL pour assistance respiratoire avancée.",
      image_couverture: "https://oxymedplus.com/storage/2023/01/Trend-III-Series-Bilevel-ST-600x600-1-300x300.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2023/01/Trend-III-Series-Bilevel-ST-600x600-1-300x300.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Ventilateur non invasif",
      is_active: true
    },
    {
      nom: "Lit Médicalisé",
      prix: 1200.00,
      moq: 1,
      stock: 6,
      description: "Lit médicalisé électrique pour patients à domicile et en institution.",
      image_couverture: "https://oxymedplus.com/storage/2021/06/lit-electrique-300x300.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2021/06/lit-electrique-300x300.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Lit médicalisé",
      is_active: true
    },
    {
      nom: "Lit médicalisé à 2 articulations",
      prix: 1400.00,
      moq: 1,
      stock: 5,
      description: "Lit médicalisé facilement montable à 2 articulations pour un confort optimal.",
      image_couverture: "https://oxymedplus.com/storage/2023/09/lit-medicalise-facilement-montable-illico-300x300.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2023/09/lit-medicalise-facilement-montable-illico-300x300.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Lit médicalisé",
      is_active: true
    },
    {
      nom: "Lit médicalisé à 3 articulations",
      prix: 1600.00,
      moq: 1,
      stock: 4,
      description: "Lit médicalisé électrique à 3 articulations pour une position optimale du patient.",
      image_couverture: "https://oxymedplus.com/storage/2021/06/lit-medicalise-electrique-euro-1402-hms-vilgo-300x300.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2021/06/lit-medicalise-electrique-euro-1402-hms-vilgo-300x300.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Lit médicalisé",
      is_active: true
    },
    {
      nom: "Masque Hoffrichter Cirri Nasal",
      prix: 350.00,
      moq: 1,
      stock: 20,
      description: "Masque nasal Hoffrichter Cirri Comfort pour CPAP, confort optimal et ajustement précis.",
      image_couverture: "https://oxymedplus.com/storage/2023/01/hoffrichter-cirri-comfort-nasal-mask-limited-size-on-sale-600x600-1-300x300.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2023/01/hoffrichter-cirri-comfort-nasal-mask-limited-size-on-sale-600x600-1-300x300.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Masques",
      is_active: true
    },
    {
      nom: "Masque Hoffrichter Cirri Facial",
      prix: 380.00,
      moq: 1,
      stock: 15,
      description: "Masque facial complet Hoffrichter Cirri pour CPAP, couvrant nez et bouche.",
      image_couverture: "https://oxymedplus.com/storage/2022/08/hoffrichter-cirri-full-face-mask-500x500-1-300x300.png",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2022/08/hoffrichter-cirri-full-face-mask-500x500-1-300x300.png"
      ]),
      type_affichage: "galerie",
      categorie: "Masques",
      is_active: true
    },
    {
      nom: "Circuit Respiratoire Standard",
      prix: 120.00,
      moq: 2,
      stock: 30,
      description: "Circuit respiratoire standard compatible avec la plupart des appareils CPAP et ventilateurs.",
      image_couverture: "https://oxymedplus.com/storage/2023/01/zyro-image-300x162.jpg",
      galerie: JSON.stringify([
        "https://oxymedplus.com/storage/2023/01/zyro-image-300x162.jpg"
      ]),
      type_affichage: "galerie",
      categorie: "Accessoires",
      is_active: true
    }
  ])

  console.log("Real products added successfully!")
  process.exit()
}

seedProducts()