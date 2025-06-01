const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class BeneficiaryService {
  /**
   * @param {string} userId
   * @param {Object} beneficiaryData
   * @returns {Promise<Object>}
   */
  async createBeneficiary(userId, beneficiaryData) {
    try {
      const beneficiary = await prisma.beneficiary.create({
        data: {
          userId,
          name: beneficiaryData.name,
          address: beneficiaryData.address,
          email: beneficiaryData.email || null,
          phone: beneficiaryData.phone || null,
          notes: beneficiaryData.notes || null,
        },
      });
      return beneficiary;
    } catch (error) {
      console.error("Erreur lors de la création du bénéficiaire:", error);
      throw error;
    }
  }

  /**
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getBeneficiariesByUserId(userId) {
    try {
      const beneficiaries = await prisma.beneficiary.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return beneficiaries;
    } catch (error) {
      console.error("Erreur lors de la récupération des bénéficiaires:", error);
      throw error;
    }
  }

  /**
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async getBeneficiaryById(id, userId) {
    try {
      const beneficiary = await prisma.beneficiary.findFirst({
        where: {
          id,
          userId,
        },
      });
      return beneficiary;
    } catch (error) {
      console.error("Erreur lors de la récupération du bénéficiaire:", error);
      throw error;
    }
  }

  /**
   * @param {string} id
   * @param {string} userId
   * @param {Object} beneficiaryData
   * @returns {Promise<Object>}
   */
  async updateBeneficiary(id, userId, beneficiaryData) {
    try {
      const existingBeneficiary = await this.getBeneficiaryById(id, userId);
      if (!existingBeneficiary) {
        throw new Error("Bénéficiaire non trouvé ou non autorisé");
      }

      const beneficiary = await prisma.beneficiary.update({
        where: {
          id,
        },
        data: beneficiaryData,
      });
      return beneficiary;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bénéficiaire:", error);
      throw error;
    }
  }

  /**
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async deleteBeneficiary(id, userId) {
    try {
      const existingBeneficiary = await this.getBeneficiaryById(id, userId);
      if (!existingBeneficiary) {
        throw new Error("Bénéficiaire non trouvé ou non autorisé");
      }

      const beneficiary = await prisma.beneficiary.delete({
        where: {
          id,
        },
      });
      return beneficiary;
    } catch (error) {
      console.error("Erreur lors de la suppression du bénéficiaire:", error);
      throw error;
    }
  }

  /**
   * @param {string} address
   * @returns {boolean}
   */
  validateAddress(address) {
    return address && address.startsWith("aleo") && address.length >= 16;
  }
}

module.exports = new BeneficiaryService();
