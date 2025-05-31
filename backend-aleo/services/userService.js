const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Service pour gérer les utilisateurs de l'application web3
 */
class UserService {
  /**
   * Crée un nouvel utilisateur lors de la première connexion de wallet
   * @param {string} walletAddress - Adresse du wallet de l'utilisateur
   * @param {string} firstName - Prénom de l'utilisateur (optionnel)
   * @param {string} lastName - Nom de l'utilisateur (optionnel)
   * @returns {Promise<Object>} - L'utilisateur créé
   */
  async createUser(walletAddress, firstName = null, lastName = null) {
    try {
      const user = await prisma.user.create({
        data: {
          walletAddress,
          firstName,
          lastName,
        },
      });
      return user;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son adresse de wallet
   * @param {string} walletAddress - Adresse du wallet de l'utilisateur
   * @returns {Promise<Object|null>} - L'utilisateur trouvé ou null
   */
  async getUserByWalletAddress(walletAddress) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          walletAddress,
        },
      });
      return user;
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met à jour les informations d'un utilisateur
   * @param {string} walletAddress - Adresse du wallet de l'utilisateur
   * @param {Object} userData - Données à mettre à jour
   * @returns {Promise<Object>} - L'utilisateur mis à jour
   */
  async updateUser(walletAddress, userData) {
    try {
      const user = await prisma.user.update({
        where: {
          walletAddress,
        },
        data: userData,
      });
      return user;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
