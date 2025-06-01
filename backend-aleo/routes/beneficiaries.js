const express = require("express");
const router = express.Router();
const beneficiaryController = require("../controllers/beneficiaryController");

router.get("/list/:walletAddress", beneficiaryController.getBeneficiaries);

router.get(
  "/detail/:walletAddress/:beneficiaryId",
  beneficiaryController.getBeneficiaryById
);

router.post("/create/:walletAddress", beneficiaryController.createBeneficiary);

router.put(
  "/update/:walletAddress/:beneficiaryId",
  beneficiaryController.updateBeneficiary
);

router.delete(
  "/delete/:walletAddress/:beneficiaryId",
  beneficiaryController.deleteBeneficiary
);

module.exports = router;
