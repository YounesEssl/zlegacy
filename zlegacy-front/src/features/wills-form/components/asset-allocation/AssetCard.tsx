import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { CryptoAsset, BeneficiaryAllocation, AssetAllocation } from "../../types";
import BeneficiaryAllocationSlider from "./BeneficiaryAllocationSlider";


interface AssetCardProps {
  asset: CryptoAsset;
  beneficiaries: BeneficiaryAllocation[];
  assetAllocations: AssetAllocation[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateAllocation: (assetSymbol: string, beneficiaryId: string, percentage: number) => void;
  validationError?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  beneficiaries,
  assetAllocations,
  isExpanded,
  onToggleExpand,
  onUpdateAllocation,
  validationError,
}) => {
  // Calculer le total alloué pour cet actif
  const totalAllocated = assetAllocations
    .filter(a => a.assetSymbol === asset.symbol)
    .reduce((sum, alloc) => sum + alloc.percentage, 0);

  // Calculer le pourcentage restant à allouer
  const remainingPercentage = 100 - totalAllocated;

  // Format numbers for display
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format USD values
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div 
      className="mb-4 rounded-lg overflow-hidden border"
      style={{ 
        backgroundColor: "var(--bg-card)",
        borderColor: validationError ? "var(--accent-danger)" : "var(--border-color)" 
      }}
    >
      {/* En-tête de la carte */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={onToggleExpand}
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
          >
            <span className="text-lg font-semibold" style={{ color: "var(--accent-primary)" }}>
              {asset.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {asset.symbol}
            </h3>
            <div className="flex items-center text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                {formatNumber(asset.balance)} {asset.symbol}
              </span>
              <span className="mx-1" style={{ color: "var(--text-muted)" }}>•</span>
              <span style={{ color: "var(--text-secondary)" }}>
                {formatUSD(asset.usdValue)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {totalAllocated}% allocated
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {remainingPercentage}% remaining
            </div>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          ) : (
            <ChevronDownIcon className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          )}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${totalAllocated}%`, 
            backgroundColor: totalAllocated > 100 ? "var(--accent-danger)" : "var(--accent-primary)"
          }}
        ></div>
      </div>

      {/* Message d'erreur */}
      {validationError && (
        <div className="px-4 py-3 text-sm flex items-center gap-2 border-t" 
             style={{ 
               backgroundColor: "rgba(255, 86, 48, 0.08)", 
               color: "var(--accent-danger)",
               borderColor: "rgba(255, 86, 48, 0.2)"
             }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="font-medium">Allocation Error:</span> {validationError}
          </div>
        </div>
      )}

      {/* Corps développé */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
            Allocate this {asset.symbol} to your beneficiaries
          </div>

          {beneficiaries.length === 0 ? (
            <div 
              className="p-3 text-sm rounded-md" 
              style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
            >
              No beneficiaries defined. Please add beneficiaries in the previous step.
            </div>
          ) : (
            <div className="space-y-4">
              {beneficiaries.map(({ beneficiary }) => {
                // Trouver l'allocation existante pour ce bénéficiaire et cet actif
                const allocation = assetAllocations.find(
                  a => a.assetSymbol === asset.symbol && a.beneficiaryId === beneficiary.id
                );
                
                const allocatedPercentage = allocation ? allocation.percentage : 0;
                const allocatedAmount = allocation ? allocation.amount : 0;
                
                return (
                  <BeneficiaryAllocationSlider
                    key={beneficiary.id}
                    beneficiary={beneficiary}
                    asset={asset}
                    allocatedPercentage={allocatedPercentage}
                    allocatedAmount={allocatedAmount}
                    onUpdateAllocation={(percentage: number) => 
                      onUpdateAllocation(asset.symbol, beneficiary.id, percentage)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetCard;
