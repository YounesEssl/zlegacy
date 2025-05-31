import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import AssetCard from "./AssetCard";
import type { CryptoAsset, BeneficiaryAllocation, AssetAllocation } from "../../types";

interface AssetListProps {
  assets: CryptoAsset[];
  beneficiaries: BeneficiaryAllocation[];
  assetAllocations: AssetAllocation[];
  expandedAssets: string[];
  isLoading: boolean;
  validationErrors: Record<string, string>;
  onToggleAssetExpansion: (symbol: string) => void;
  onUpdateAllocation: (assetSymbol: string, beneficiaryId: string, percentage: number) => void;
  onRefresh: () => void;
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  beneficiaries,
  assetAllocations,
  expandedAssets,
  isLoading,
  validationErrors,
  onToggleAssetExpansion,
  onUpdateAllocation,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin mr-2">
          <ArrowPathIcon className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
        </div>
        <span style={{ color: "var(--text-secondary)" }}>
          Loading balance data...
        </span>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="p-6 text-center rounded-lg border" style={{ borderColor: "var(--border-color)" }}>
        <div 
          className="mb-3 mx-auto w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
        >
          <ArrowPathIcon className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
          No assets found
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          No assets have been detected in your connected wallet.
        </p>
        <button
          className="px-4 py-2 rounded-md text-sm font-medium"
          onClick={onRefresh}
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          <ArrowPathIcon className="w-4 h-4 inline mr-2" />
          Refresh data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.symbol}
          asset={asset}
          beneficiaries={beneficiaries}
          assetAllocations={assetAllocations}
          isExpanded={expandedAssets.includes(asset.symbol)}
          onToggleExpand={() => onToggleAssetExpansion(asset.symbol)}
          onUpdateAllocation={onUpdateAllocation}
          validationError={validationErrors[asset.symbol]}
        />
      ))}
    </div>
  );
};

export default AssetList;
