const beneficiaryService = require("../services/beneficiaryService");
const userService = require("../services/userService");

const beneficiaryController = {
  /**
   * @param {Object} req
   * @param {Object} res
   */
  async getBeneficiaries(req, res) {
    try {
      const { walletAddress } = req.params;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      const user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const beneficiaries = await beneficiaryService.getBeneficiariesByUserId(
        user.id
      );

      return res.status(200).json({ beneficiaries });
    } catch (error) {
      console.error("Erreur lors de la récupération des bénéficiaires:", error);
      return res.status(500).json({
        error: "Erreur serveur lors de la récupération des bénéficiaires",
      });
    }
  },

  /**
   * @param {Object} req
   * @param {Object} res
   */
  async createBeneficiary(req, res) {
    try {
      const { walletAddress } = req.params;
      const beneficiaryData = req.body;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      if (!beneficiaryData.name || !beneficiaryData.name.trim()) {
        return res
          .status(400)
          .json({ error: "Le nom du bénéficiaire est requis" });
      }

      if (!beneficiaryData.address || !beneficiaryData.address.trim()) {
        return res
          .status(400)
          .json({ error: "L'adresse du bénéficiaire est requise" });
      }

      if (!beneficiaryService.validateAddress(beneficiaryData.address)) {
        return res
          .status(400)
          .json({ error: "L'adresse du bénéficiaire est invalide" });
      }

      const user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const beneficiary = await beneficiaryService.createBeneficiary(
        user.id,
        beneficiaryData
      );

      return res.status(201).json({
        message: "Bénéficiaire créé avec succès",
        beneficiary,
      });
    } catch (error) {
      console.error("Erreur lors de la création du bénéficiaire:", error);
      return res
        .status(500)
        .json({ error: "Erreur serveur lors de la création du bénéficiaire" });
    }
  },

  /**
   * @param {Object} req
   * @param {Object} res
   */
  async updateBeneficiary(req, res) {
    try {
      const { walletAddress, beneficiaryId } = req.params;
      const beneficiaryData = req.body;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      if (!beneficiaryId) {
        return res
          .status(400)
          .json({ error: "L'ID du bénéficiaire est requis" });
      }

      if (
        beneficiaryData.address &&
        !beneficiaryService.validateAddress(beneficiaryData.address)
      ) {
        return res
          .status(400)
          .json({ error: "L'adresse du bénéficiaire est invalide" });
      }

      const user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const beneficiary = await beneficiaryService.updateBeneficiary(
        beneficiaryId,
        user.id,
        beneficiaryData
      );

      return res.status(200).json({
        message: "Bénéficiaire mis à jour avec succès",
        beneficiary,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bénéficiaire:", error);

      if (error.message === "Bénéficiaire non trouvé ou non autorisé") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Erreur serveur lors de la mise à jour du bénéficiaire",
      });
    }
  },

  /**
   * @param {Object} req
   * @param {Object} res
   */
  async deleteBeneficiary(req, res) {
    try {
      const { walletAddress, beneficiaryId } = req.params;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      if (!beneficiaryId) {
        return res
          .status(400)
          .json({ error: "L'ID du bénéficiaire est requis" });
      }

      const user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      await beneficiaryService.deleteBeneficiary(beneficiaryId, user.id);

      return res.status(200).json({
        message: "Bénéficiaire supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du bénéficiaire:", error);

      if (error.message === "Bénéficiaire non trouvé ou non autorisé") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Erreur serveur lors de la suppression du bénéficiaire",
      });
    }
  },

  /**
   * @param {Object} req
   * @param {Object} res
   */
  async getBeneficiaryById(req, res) {
    try {
      const { walletAddress, beneficiaryId } = req.params;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      if (!beneficiaryId) {
        return res
          .status(400)
          .json({ error: "L'ID du bénéficiaire est requis" });
      }

      const user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const beneficiary = await beneficiaryService.getBeneficiaryById(
        beneficiaryId,
        user.id
      );

      if (!beneficiary) {
        return res.status(404).json({ error: "Bénéficiaire non trouvé" });
      }

      return res.status(200).json({ beneficiary });
    } catch (error) {
      console.error("Erreur lors de la récupération du bénéficiaire:", error);
      return res.status(500).json({
        error: "Erreur serveur lors de la récupération du bénéficiaire",
      });
    }
  },
};

module.exports = beneficiaryController;
