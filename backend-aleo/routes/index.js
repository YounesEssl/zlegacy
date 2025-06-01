const express = require("express");
const router = express.Router();
const axios = require("axios");

const MOCK_API_BASE =
  process.env.MOCK_API_BASE || "https://ton-mock-railway.up.railway.app";

router.get("/death-certificate/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const fullUrl = `${MOCK_API_BASE}/deces/certificate/${hash}`;
    console.log("Proxy call URL:", fullUrl);

    const response = await axios.get(fullUrl);
    res.json(response.data);
  } catch (err) {
    console.error("Erreur proxy:", err);
    res
      .status(500)
      .json({ error: "Erreur proxy death_certificate", detail: err.message });
  }
});

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
