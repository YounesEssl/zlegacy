const credentialService = require("../services/credentialService");

/**
 * @param {Object} req
 * @param {Object} res
 */
const getCredentials = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({ error: "Adresse de wallet requise" });
    }

    const credentials = await credentialService.getCredentialsByWalletAddress(
      walletAddress
    );

    return res.status(200).json({ credentials });
  } catch (error) {
    console.error("Erreur dans getCredentials:", error);
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

/**
 * @param {Object} req
 * @param {Object} res
 */
const getCredentialById = async (req, res) => {
  try {
    const { walletAddress, credentialId } = req.params;

    if (!walletAddress || !credentialId) {
      return res
        .status(400)
        .json({ error: "Adresse de wallet et ID du credential requis" });
    }

    const credential = await credentialService.getCredentialById(
      walletAddress,
      credentialId
    );

    return res.status(200).json({ credential });
  } catch (error) {
    console.error("Erreur dans getCredentialById:", error);

    if (
      error.message.includes("non trouvé") ||
      error.message.includes("non autorisé")
    ) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

/**
 * @param {Object} req
 * @param {Object} res
 */
const createCredential = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const credentialData = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Adresse de wallet requise" });
    }

    if (!credentialData || !credentialData.name || !credentialData.type) {
      return res.status(400).json({ error: "Données de credential invalides" });
    }

    const credential = await credentialService.createCredential(
      walletAddress,
      credentialData
    );

    return res.status(201).json({
      message: "Credential créé avec succès",
      credential,
    });
  } catch (error) {
    console.error("Erreur dans createCredential:", error);

    if (
      error.message.includes("requis") ||
      error.message.includes("doit être")
    ) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("Utilisateur non trouvé")) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

/**
 * @param {Object} req
 * @param {Object} res
 */
const updateCredential = async (req, res) => {
  try {
    const { walletAddress, credentialId } = req.params;
    const updateData = req.body;

    if (!walletAddress || !credentialId) {
      return res
        .status(400)
        .json({ error: "Adresse de wallet et ID du credential requis" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "Aucune donnée de mise à jour fournie" });
    }

    const credential = await credentialService.updateCredential(
      walletAddress,
      credentialId,
      updateData
    );

    return res.status(200).json({
      message: "Credential mis à jour avec succès",
      credential,
    });
  } catch (error) {
    console.error("Erreur dans updateCredential:", error);

    if (
      error.message.includes("non trouvé") ||
      error.message.includes("non autorisé")
    ) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

/**
 * @param {Object} req
 * @param {Object} res
 */
const getDecryptedField = async (req, res) => {
  try {
    const { walletAddress, credentialId } = req.params;
    const { fieldName } = req.body;

    if (!walletAddress || !credentialId) {
      return res
        .status(400)
        .json({ error: "Adresse de wallet et ID du credential requis" });
    }

    if (
      !fieldName ||
      !["password", "seedPhrase", "privateKey"].includes(fieldName)
    ) {
      return res
        .status(400)
        .json({ error: "Nom de champ invalide ou non autorisé" });
    }

    const decryptedValue = await credentialService.getDecryptedField(
      walletAddress,
      credentialId,
      fieldName
    );

    return res.status(200).json({
      [fieldName]: decryptedValue,
    });
  } catch (error) {
    console.error("Erreur dans getDecryptedField:", error);

    if (
      error.message.includes("non trouvé") ||
      error.message.includes("non autorisé")
    ) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("n'existe pas")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

/**
 * @param {Object} req
 * @param {Object} res
 */
const deleteCredential = async (req, res) => {
  try {
    const { walletAddress, credentialId } = req.params;

    if (!walletAddress || !credentialId) {
      return res
        .status(400)
        .json({ error: "Adresse de wallet et ID du credential requis" });
    }

    await credentialService.deleteCredential(walletAddress, credentialId);

    return res.status(200).json({
      message: "Credential supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur dans deleteCredential:", error);

    if (
      error.message.includes("non trouvé") ||
      error.message.includes("non autorisé")
    ) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

module.exports = {
  getCredentials,
  getCredentialById,
  createCredential,
  updateCredential,
  getDecryptedField,
  deleteCredential,
};
