import {
  Transaction,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import type { TransactionStatusResponse } from "./types";

// Définition du type Wallet pour les fonctions qui en ont besoin
type Wallet = {
  transactionStatus?: (
    txId: string
  ) => Promise<string | Record<string, any> | null>;
  requestTransaction?: (transaction: any) => Promise<string>;
  [key: string]: any;
};

/**
 * Vérifier le statut d'une transaction
 * @param wallet Le wallet Aleo
 * @param txId L'identifiant de la transaction
 * @returns L'état de la transaction avec des informations supplémentaires
 */
export async function checkTransactionStatus(
  wallet: Wallet | null,
  txId: string
): Promise<TransactionStatusResponse | null> {
  if (!wallet) {
    return null;
  }

  try {
    // Utiliser la méthode transactionStatus de l'adaptateur
    // Vérifier si la méthode transactionStatus existe sur le wallet
    if (!wallet.transactionStatus) {
      return {
        status: "error",
        transaction_id: txId,
        error: "Méthode transactionStatus non disponible",
      };
    }

    const statusResult = await wallet.transactionStatus(txId);

    // Si le statut est null ou undefined, retourner un statut générique
    if (!statusResult) {
      return {
        status: "pending",
        transaction_id: txId,
        message: "Statut non disponible (null ou undefined)",
      };
    }

    // Différents adaptateurs peuvent avoir différents formats de réponse
    if (typeof statusResult === "string") {
      // Cas où le statut est retourné sous forme de chaîne
      return {
        status: statusResult,
        transaction_id: txId,
        message: `Statut de la transaction: ${statusResult}`,
      };
    } else if (typeof statusResult === "object") {
      // Cas où le statut est retourné sous forme d'objet
      const typedStatus = statusResult as any;
      return {
        status: typedStatus.status || "pending",
        transaction_id: txId,
        message: typedStatus.message || "Statut disponible",
        error: typedStatus.error,
      };
    }

    // Format par défaut si aucun des cas précédents ne correspond
    return {
      status: "pending",
      transaction_id: txId,
      message: "Statut en attente ou non disponible",
    };
  } catch (error) {
    return {
      status: "error",
      transaction_id: txId,
      error: `Erreur lors de la vérification du statut: ${error}`,
    };
  }
}

/**
 * Créer une transaction heartbeat
 * @param publicKey La clé publique du wallet
 * @param vaultId L'identifiant du vault
 * @param fee Les frais de transaction en ALEO
 * @returns La transaction formatée pour l'adaptateur
 */
export function createHeartbeatTransaction(
  publicKey: string,
  vaultId: string,
  fee: number = 0.028451
): Transaction {
  const timestamp = Math.floor(Date.now() / 1000);
  const activitySignature = `${timestamp}field`;
  
  // Créer un hash de métadonnées significatif pour l'activité de l'utilisateur
  // Format: nombre suivi de "field" comme requis par Aleo
  
  // Extraire un nombre à partir de la clé publique (si disponible)
  let publicKeyNumber = 0;
  if (publicKey) {
    // Extraire uniquement les chiffres de la clé publique et prendre les 8 premiers
    const numericPart = publicKey.replace(/[^0-9]/g, '').slice(0, 8);
    if (numericPart.length > 0) {
      publicKeyNumber = parseInt(numericPart, 10) % 1000000000;
    }
  }
  
  // Créer un nombre déterministe basé sur le timestamp et la clé publique
  // Timestamp + hash de clé publique pour garantir l'unicité et la traçabilité
  const metadataNumber = (
    timestamp * 1000 + 
    publicKeyNumber
  ) % 1000000000;
  
  const metadataHash = `${metadataNumber}field`;
  const feeInMicrocredits = Math.floor(fee * 1000000);

  return Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    "oracle_tls_v2.aleo",
    "submit_heartbeat",
    [
      vaultId, // master_vault_id
      activitySignature, // activity_signature - timestamp d'activité
      metadataHash, // metadata_hash - hash généré
    ],
    feeInMicrocredits,
    false // Utiliser des frais publics (fee_public) en mettant feePrivate à false
  );
}
