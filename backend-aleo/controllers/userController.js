const userService = require("../services/userService");

/**
 * Contrôleur pour gérer les opérations liées aux utilisateurs
 */
const userController = {
  /**
   * Crée un nouvel utilisateur lors de la connexion du wallet
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async connectWallet(req, res) {
    try {
      const { walletAddress, firstName, lastName } = req.body;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      let user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        if (!firstName || !lastName) {
          user = await userService.createUser(walletAddress, null, null);
          return res.status(202).json({
            message: "Utilisateur créé mais profil incomplet",
            user,
            profileComplete: false,
          });
        }

        user = await userService.createUser(walletAddress, firstName, lastName);
        return res.status(201).json({
          message: "Utilisateur créé avec succès",
          user,
          profileComplete: true,
        });
      }

      if (!user.firstName || !user.lastName) {
        if (firstName && lastName) {
          user = await userService.updateUser(walletAddress, {
            firstName,
            lastName,
          });
          return res.status(200).json({
            message: "Profil utilisateur complété avec succès",
            user,
            profileComplete: true,
          });
        }

        return res.status(202).json({
          message: "Utilisateur connecté mais profil incomplet",
          user,
          profileComplete: false,
        });
      }

      return res.status(200).json({
        message: "Utilisateur connecté avec succès",
        user,
        profileComplete: true,
      });
    } catch (error) {
      console.error("Erreur lors de la connexion du wallet:", error);
      return res
        .status(500)
        .json({ error: "Erreur serveur lors de la connexion du wallet" });
    }
  },

  /**
   * @param {Object} req
   * @param {Object} res
   */
  async updateUser(req, res) {
    try {
      const { walletAddress } = req.params;
      const userData = req.body;

      if (!walletAddress) {
        return res
          .status(400)
          .json({ error: "L'adresse du wallet est requise" });
      }

      const existingUser = await userService.getUserByWalletAddress(
        walletAddress
      );

      if (!existingUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const updatedUser = await userService.updateUser(walletAddress, userData);

      return res.status(200).json({
        message: "Utilisateur mis à jour avec succès",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return res.status(500).json({
        error: "Erreur serveur lors de la mise à jour de l'utilisateur",
      });
    }
  },
};

module.exports = userController;
