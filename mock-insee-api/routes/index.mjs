import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const router = express.Router();

// Configure lowdb to use JSON file
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = "db.json";
const adapter = new JSONFile(file);

// Initialize with default data structure
const defaultData = { personnes: [] };
const db = new Low(adapter, defaultData);

// Read data from JSON file
await db.read();

router.get("/deces/certificate/:hash", (req, res) => {
  const hash = req.params.hash;
  const person = db.data.personnes.find((p) => p.hash === hash);

  if (!person) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    death_certificate: person.death_certificate,
    meta: {
      api_version: "1.0.0",
      server_id: "INSEE-API-TESTNET",
      response_id: `RESP-${Date.now()}-${hash}`,
      is_test_data: true,
    },
  });
});

router.get("/deces/tls-proof/:hash", (req, res) => {
  const hash = req.params.hash;
  const person = db.data.personnes.find((p) => p.hash === hash);

  if (!person) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    tls_proof: person.tls_proof,
    meta: {
      api_version: "1.0.0",
      server_id: "INSEE-API-TESTNET",
      response_id: `RESP-${Date.now()}-${hash}`,
      is_test_data: true,
    },
  });
});

router.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

export default router;
