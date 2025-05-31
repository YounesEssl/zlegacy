// Types for the wills management feature
import type { VerificationMethod, TransactionMode } from '../wills-form/types';

export interface Credential {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  lastUpdated: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price?: number;
  value?: number;
  icon?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'crypto' | 'password' | 'document' | 'other';
  value?: string;
  details?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  address: string; // Blockchain address
  allocation: number; // Percentage (0-100)
  relation?: string;
  relationColor?: string;
}

export interface AssetAllocation {
  beneficiaryId: string;
  assetId: string;
  percentage?: number;
}

export interface CredentialAllocation {
  beneficiaryId: string;
  credentialId: string;
}

export type Will = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  beneficiaries: Beneficiary[];
  cryptoAssets?: CryptoAsset[];
  credentials?: Credential[];
  assetAllocations?: AssetAllocation[];
  credentialAllocations?: CredentialAllocation[];
  note?: string; // Description or notes about the will
  verificationMethod: VerificationMethod;
  transactionMode?: TransactionMode;
  verificationDate?: string;
  testatorAddress: string; // Creator's blockchain address
};

// États pour les filtres et la recherche
export interface WillsFilters {
  search?: string;
  sortBy?: 'date' | 'name';
  sortDirection?: 'asc' | 'desc';
}
