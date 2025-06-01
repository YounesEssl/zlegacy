const express = require("express");
const router = express.Router();
const credentialController = require("../controllers/credentialController");

router.get("/list/:walletAddress", credentialController.getCredentials);

router.get(
  "/detail/:walletAddress/:credentialId",
  credentialController.getCredentialById
);

router.post("/create/:walletAddress", credentialController.createCredential);

router.put(
  "/update/:walletAddress/:credentialId",
  credentialController.updateCredential
);

router.post(
  "/decrypt/:walletAddress/:credentialId",
  credentialController.getDecryptedField
);
router.delete(
  "/delete/:walletAddress/:credentialId",
  credentialController.deleteCredential
);

module.exports = router;
