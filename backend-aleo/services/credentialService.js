const { PrismaClient } = require("@prisma/client");
const encryptionService = require("./encryptionService");
const userService = require("./userService");

const prisma = new PrismaClient();

const MASTER_KEY =
  process.env.ENCRYPTION_MASTER_KEY ||
  "default-master-key-change-in-production";

/**
 * @param {string} walletAddress
 * @returns {Promise<Array>}
 */
const getCredentialsByWalletAddress = async (walletAddress) => {
  try {
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const credentials = await prisma.credential.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    await Promise.all(
      credentials.map((cred) =>
        prisma.credential.update({
          where: { id: cred.id },
          data: { lastAccessed: new Date() },
        })
      )
    );

    return credentials.map((cred) => {
      const { seedPhrase, privateKey, password, ...safeCredential } = cred;
      return {
        ...safeCredential,
        hasSeedPhrase: !!seedPhrase,
        hasPrivateKey: !!privateKey,
        hasPassword: !!password,
      };
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des credentials:", error);
    throw error;
  }
};

/**
 * @param {string} walletAddress
 * @param {string} credentialId
 * @returns {Promise<Object>}
 */
const getCredentialById = async (walletAddress, credentialId) => {
  try {
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    const credential = await prisma.credential.findFirst({
      where: {
        id: credentialId,
        userId: user.id,
      },
    });

    if (!credential) {
      throw new Error("Credential non trouvé ou non autorisé");
    }

    await prisma.credential.update({
      where: { id: credentialId },
      data: { lastAccessed: new Date() },
    });

    const { seedPhrase, privateKey, password, ...safeCredential } = credential;
    return {
      ...safeCredential,
      hasSeedPhrase: !!seedPhrase,
      hasPrivateKey: !!privateKey,
      hasPassword: !!password,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du credential:", error);
    throw error;
  }
};

/**
 * @param {string} walletAddress
 * @param {Object} credentialData
 * @returns {Promise<Object>}
 */
const createCredential = async (walletAddress, credentialData) => {
  try {
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (!credentialData.name) {
      throw new Error("Le nom du credential est requis");
    }

    if (
      !credentialData.type ||
      !["standard", "wallet"].includes(credentialData.type)
    ) {
      throw new Error('Le type du credential doit être "standard" ou "wallet"');
    }

    const secureData = { ...credentialData, userId: user.id };

    if (secureData.password) {
      secureData.password = encryptionService.encrypt(
        secureData.password,
        MASTER_KEY
      );
    }

    if (secureData.seedPhrase) {
      secureData.seedPhrase = encryptionService.encrypt(
        secureData.seedPhrase,
        MASTER_KEY
      );
    }

    if (secureData.privateKey) {
      secureData.privateKey = encryptionService.encrypt(
        secureData.privateKey,
        MASTER_KEY
      );
    }

    const credential = await prisma.credential.create({
      data: secureData,
    });
    const { seedPhrase, privateKey, password, ...safeCredential } = credential;
    return {
      ...safeCredential,
      hasSeedPhrase: !!seedPhrase,
      hasPrivateKey: !!privateKey,
      hasPassword: !!password,
    };
  } catch (error) {
    console.error("Erreur lors de la création du credential:", error);
    throw error;
  }
};

/**
 * @param {string} walletAddress
 * @param {string} credentialId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
const updateCredential = async (walletAddress, credentialId, updateData) => {
  try {
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const existingCredential = await prisma.credential.findFirst({
      where: {
        id: credentialId,
        userId: user.id,
      },
    });

    if (!existingCredential) {
      throw new Error("Credential non trouvé ou non autorisé");
    }

    const secureUpdateData = { ...updateData };

    if (secureUpdateData.password) {
      secureUpdateData.password = encryptionService.encrypt(
        secureUpdateData.password,
        MASTER_KEY
      );
    }

    if (secureUpdateData.seedPhrase) {
      secureUpdateData.seedPhrase = encryptionService.encrypt(
        secureUpdateData.seedPhrase,
        MASTER_KEY
      );
    }

    if (secureUpdateData.privateKey) {
      secureUpdateData.privateKey = encryptionService.encrypt(
        secureUpdateData.privateKey,
        MASTER_KEY
      );
    }

    const updatedCredential = await prisma.credential.update({
      where: { id: credentialId },
      data: secureUpdateData,
    });
    const { seedPhrase, privateKey, password, ...safeCredential } =
      updatedCredential;
    return {
      ...safeCredential,
      hasSeedPhrase: !!seedPhrase,
      hasPrivateKey: !!privateKey,
      hasPassword: !!password,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du credential:", error);
    throw error;
  }
};

/**
 * @param {string} walletAddress
 * @param {string} credentialId
 * @param {string} fieldName
 * @returns {Promise<string>}
 */
const getDecryptedField = async (walletAddress, credentialId, fieldName) => {
  try {
    if (!["password", "seedPhrase", "privateKey"].includes(fieldName)) {
      throw new Error("Champ non autorisé pour le déchiffrement");
    }
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const credential = await prisma.credential.findFirst({
      where: {
        id: credentialId,
        userId: user.id,
      },
    });

    if (!credential) {
      throw new Error("Credential non trouvé ou non autorisé");
    }

    if (!credential[fieldName]) {
      throw new Error(`Le champ ${fieldName} n'existe pas dans ce credential`);
    }
    const decryptedValue = encryptionService.decrypt(
      credential[fieldName],
      MASTER_KEY
    );

    await prisma.credential.update({
      where: { id: credentialId },
      data: { lastAccessed: new Date() },
    });

    return decryptedValue;
  } catch (error) {
    console.error("Erreur lors du déchiffrement du champ:", error);
    throw error;
  }
};

/**
 * @param {string} walletAddress
 * @param {string} credentialId
 * @returns {Promise<boolean>}
 */
const deleteCredential = async (walletAddress, credentialId) => {
  try {
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    const credential = await prisma.credential.findFirst({
      where: {
        id: credentialId,
        userId: user.id,
      },
    });

    if (!credential) {
      throw new Error("Credential non trouvé ou non autorisé");
    }

    await prisma.credential.delete({
      where: { id: credentialId },
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du credential:", error);
    throw error;
  }
};

module.exports = {
  getCredentialsByWalletAddress,
  getCredentialById,
  createCredential,
  updateCredential,
  getDecryptedField,
  deleteCredential,
};
