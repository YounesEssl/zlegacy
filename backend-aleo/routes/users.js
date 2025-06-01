const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/db-test", async (req, res) => {
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.$connect();

    const dbInfo =
      await prisma.$queryRaw`SELECT current_database(), current_schema(), version()`;

    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );
    `;

    res.json({
      status: "success",
      message: "Connexion à la base de données réussie",
      databaseInfo: dbInfo,
      tableExists: tableExists,
      env: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL
          ? "Configuré (valeur masquée)"
          : "Non configuré",
      },
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error("Erreur de diagnostic:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors du test de la base de données",
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
});

router.post("/connect", userController.connectWallet);

router.put("/:walletAddress", userController.updateUser);

module.exports = router;
