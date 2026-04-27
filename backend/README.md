# Oxymed — Plateforme Medicale

Application web medicale avec catalogue 2D/3D, gestion des commandes, liste d'attente et tableau de bord admin.

## Stack Technique
- Frontend: React.js + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Base de donnees: MySQL + Sequelize
- Auth: JWT + bcrypt

## Installation

### 1. Cloner le projet
cd oxymed-project

### 2. Installer les dependances backend
cd backend
npm install

### 3. Configurer .env
Copier .env.example et remplir les valeurs

### 4. Demarrer MySQL (XAMPP)

### 5. Lancer le serveur
npm run dev

### 6. Build frontend (production)
cd frontend
npm run build

## Acces
- Application: http://localhost:3001
- API: http://localhost:3001/api
- phpMyAdmin: http://localhost/phpmyadmin

## Comptes de test
- Admin: admin@oxymed.com / admin123
- Client: test@oxymed.com / test123