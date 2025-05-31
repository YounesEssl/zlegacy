const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Route de diagnostic pour tester la connexion à la base de données */
router.get('/db-test', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Tester la connexion à la BDD
    await prisma.$connect();
    
    // Information sur la connexion
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), current_schema(), version()`;
    
    // Vérifier que la table User existe
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );
    `;
    
    res.json({
      status: 'success',
      message: 'Connexion à la base de données réussie',
      databaseInfo: dbInfo,
      tableExists: tableExists,
      env: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Configuré (valeur masquée)' : 'Non configuré'
      }
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Erreur de diagnostic:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du test de la base de données',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

/* Connexion wallet et création d'utilisateur si nécessaire */
router.post('/connect-wallet', userController.connectWallet);

/* Mise à jour des informations utilisateur */
router.put('/:walletAddress', userController.updateUser);

module.exports = router;
