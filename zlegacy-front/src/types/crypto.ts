export interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number; // pourcentage de changement sur 24h
  iconUrl?: string;
  color: string;
}

export interface AssetBalance {
  assets: CryptoAsset[];
  totalBalanceUsd: number;
  lastUpdated: Date;
}

export type TokenDisplayMode = 'compact' | 'expanded' | 'detailed';

export const TokenDisplayModes = {
  COMPACT: 'compact' as TokenDisplayMode,
  EXPANDED: 'expanded' as TokenDisplayMode,
  DETAILED: 'detailed' as TokenDisplayMode
};
