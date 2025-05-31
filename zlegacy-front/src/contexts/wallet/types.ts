// Types pour le système wallet Aleo

// Types pour le système Proof of Life
/**
 * Données de preuve de vie
 */
export interface ProofOfLifeData {
  lastHeartbeat: Date | null; // Date du dernier heartbeat
  nextDeadline: Date | null; // Date limite avant expiration
  vaultId: string; // Identifiant du vault sur la blockchain
  blockData?: {
    lastHeartbeatBlock: number; // Hauteur du bloc du dernier heartbeat
    currentBlock: number; // Hauteur du bloc actuel
    blockDifference: number; // Différence entre les blocs (actuel - dernier)
    isActive: boolean; // Indique si l'utilisateur est considéré comme actif
  };
}

// Type pour le statut de la dernière soumission
export interface LastSubmissionData {
  status: "success" | "error" | "pending" | null;
  timestamp: number | null;
  message?: string;
  txId?: string;
  error?: string;
}

// Type pour les réponses de statut de transaction
export interface TransactionStatusResponse {
  status: string;
  transaction_id: string;
  message?: string;
  error?: string;
}

export interface WalletContextType {
  submitHeartbeat: () => Promise<{
    success: boolean;
    txId?: string;
    error?: string;
  }>;
  requestWalletPermissions: () => Promise<{ success: boolean; error?: string }>;
  checkWalletPermissions: () => Promise<{ granted: boolean; error?: string }>;
  checkTransactionStatus: (
    txId: string
  ) => Promise<TransactionStatusResponse | null>;
  proofOfLifeData: ProofOfLifeData;
  isSubmittingHeartbeat: boolean;
  lastSubmissionData: LastSubmissionData;
  walletConnected: boolean;
  publicKey: string | null;
}
