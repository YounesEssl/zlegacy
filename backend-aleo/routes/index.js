const express = require("express");
const router = express.Router();
const axios = require("axios");

// Récupère l’URL de ton API Railway mock depuis .env
const MOCK_API_BASE =
  process.env.MOCK_API_BASE || "https://ton-mock-railway.up.railway.app";

// Proxy pour récupérer le death_certificate
router.get("/death-certificate/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const fullUrl = `${MOCK_API_BASE}/deces/certificate/${hash}`;
    console.log("Proxy call URL:", fullUrl); // 👈 AJOUTE CE LOG

    const response = await axios.get(fullUrl);
    res.json(response.data);
  } catch (err) {
    console.error("Erreur proxy:", err); // 👈 AJOUTE CE LOG
    res
      .status(500)
      .json({ error: "Erreur proxy death_certificate", detail: err.message });
  }
});

// Proxy pour récupérer le tls_proof
router.get("/tls-proof/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const response = await axios.get(
      `${MOCK_API_BASE}/deces/tls-proof/${hash}`
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur proxy tls_proof", detail: err.message });
  }
});

module.exports = router;
