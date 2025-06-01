export type VerificationMethod = "email" | "phone" | "biometric";
export type TransactionMode = "private" | "public";
export type TransactionStatus = "pending" | "confirming" | "confirmed" | "failed";
export type CurrencyUnit = "percentage" | "crypto" | "usd";
export interface CryptoAsset {
  symbol: string;
  balance: number;
  usdValue: number;
}

export interface CryptoBalance {
  symbol: string;  // Devise principale
  balance: number; // Solde de la devise principale
  usdValue: number; // Valeur en USD de la devise principale
  assets?: CryptoAsset[]; // Liste de tous les actifs disponibles
};

export interface AssetAllocation {
  assetSymbol: string;
  beneficiaryId: string;
  amount: number;
  percentage: number;
}

export type FormStep =
  | "beneficiaries"
  | "assets"
  | "credentials"
  | "wallets"
  | "note"
  | "executor"
  | "review"
  | "complete";

export type BeneficiaryRelation = "family" | "spouse" | "child" | "friend" | "business" | "other" | "ngo";

export interface Beneficiary {
  id: string;
  name?: string;
  address: string;
  createdAt: string;
  relation?: BeneficiaryRelation;
  relationColor?: string;
  // Champs supplémentaires pour les ONGs
  description?: string;
  category?: string;
  website?: string;
}

export interface BeneficiaryAllocation {
  beneficiary: Beneficiary;
  allocation: number;
}

export interface Credential {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  lastUpdated: string;
}

export interface CredentialAllocation {
  credentialId: string;
  beneficiaryId: string;
}

export type ExecutorType = "human" | "protocol" | "self-hosted";

export interface Executor {
  type: ExecutorType;
  name?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  details?: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: string;
  privateKey?: string;
  publicAddress?: string;
  additionalInfo?: string;
  createdAt: string;
  beneficiaryId?: string;
}

export interface WalletAllocation {
  walletId: string;
  beneficiaryId: string;
}

export interface WillFormData {
  beneficiaryAllocations: BeneficiaryAllocation[];
  credentialAllocations: CredentialAllocation[];
  walletAllocations?: WalletAllocation[];
  testatorAddress: string;
  note: string;
  transactionMode: TransactionMode;
  executor?: Executor;
}
