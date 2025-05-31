import React from "react";
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { CryptoAsset, BeneficiaryAllocation, AssetAllocation } from "../../types";
import BeneficiaryAllocationSlider from "./BeneficiaryAllocationSlider";

interface BeneficiaryViewProps {
  beneficiaries: BeneficiaryAllocation[];
  assets: CryptoAsset[];
  assetAllocations: AssetAllocation[];
  expandedBeneficiaries: string[];
  onToggleBeneficiaryExpansion: (id: string) => void;
  onUpdateAllocation: (assetSymbol: string, beneficiaryId: string, percentage: number) => void;
  validationErrors?: {[key: string]: string};
}

const BeneficiaryView: React.FC<BeneficiaryViewProps> = ({
  beneficiaries,
  assets,
  assetAllocations,
  expandedBeneficiaries,
  onToggleBeneficiaryExpansion,
  onUpdateAllocation,
  validationErrors = {}
}) => {
  // Format USD values
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculer la valeur totale allouée à un bénéficiaire
  const calculateTotalValue = (beneficiaryId: string): number => {
    let totalValue = 0;
    
    // Pour chaque allocation d'actif de ce bénéficiaire
    const beneficiaryAllocations = assetAllocations.filter(
      alloc => alloc.beneficiaryId === beneficiaryId
    );
    
    beneficiaryAllocations.forEach(allocation => {
      const asset = assets.find(a => a.symbol === allocation.assetSymbol);
      if (asset) {
        // Calculer la valeur USD de cette allocation
        const usdValue = (allocation.amount / asset.balance) * asset.usdValue;
        totalValue += usdValue;
      }
    });
    
    return totalValue;
  };

  // Calculer le nombre d'actifs alloués à un bénéficiaire
  const countAllocatedAssets = (beneficiaryId: string): number => {
    return assetAllocations.filter(alloc => 
      alloc.beneficiaryId === beneficiaryId && alloc.percentage > 0
    ).length;
  };

  if (beneficiaries.length === 0) {
    return (
      <div className="p-6 text-center rounded-lg border" style={{ borderColor: "var(--border-color)" }}>
        <div 
          className="mb-3 mx-auto w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
        >
          <span className="text-xl font-semibold" style={{ color: "var(--accent-primary)" }}>?</span>
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
          No Beneficiaries
        </h3>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Please return to the previous step to add beneficiaries to your will.
        </p>
      </div>
    );
  }

  // Check if there are validation errors for any assets
  const hasOverallocationErrors = Object.keys(validationErrors).length > 0;
  
  return (
    <div className="space-y-4">
      {/* Afficher un message d'information seulement s'il y a des erreurs d'allocation */}
      {hasOverallocationErrors && (
        <div 
          className="p-4 rounded-lg border animate-pulse"
          style={{ 
            backgroundColor: 'var(--bg-danger-subtle)', 
            borderColor: 'var(--accent-danger)',
            color: 'var(--accent-danger)'
          }}
        >
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                Some assets are over-allocated
              </p>
              <p className="text-xs mt-1 opacity-90">
                You cannot allocate more than 100% of each cryptocurrency. Adjust the values to continue.
              </p>
            </div>
          </div>
        </div>
      )}
      {beneficiaries.map(({ beneficiary }) => {
        const isExpanded = expandedBeneficiaries.includes(beneficiary.id);
        const totalValue = calculateTotalValue(beneficiary.id);
        const allocatedAssets = countAllocatedAssets(beneficiary.id);
        
        return (
          <div 
            key={beneficiary.id}
            className="rounded-lg overflow-hidden border"
            style={{ 
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)" 
            }}
          >
            {/* En-tête de la carte */}
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => onToggleBeneficiaryExpansion(beneficiary.id)}
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
                >
                  <span className="text-lg font-semibold" style={{ color: "var(--accent-primary)" }}>
                    {(beneficiary.name || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {beneficiary.name || "Unnamed Beneficiary"}
                  </h3>
                  <div className="flex items-center text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>
                      {beneficiary.relation || "Unspecified relation"}
                    </span>
                    <span className="mx-1" style={{ color: "var(--text-muted)" }}>•</span>
                    <span 
                      className="truncate max-w-[150px]" 
                      style={{ color: "var(--text-secondary)" }}
                      title={beneficiary.address}
                    >
                      {beneficiary.address.substring(0, 6)}...
                      {beneficiary.address.substring(beneficiary.address.length - 4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-right mr-4">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {formatUSD(totalValue)}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {allocatedAssets} asset{allocatedAssets !== 1 ? 's' : ''} allocated
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUpIcon className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
                )}
              </div>
            </div>

            {/* Corps développé */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                  Allocate assets to {beneficiary.name || "this beneficiary"}
                </div>

                {assets.length === 0 ? (
                  <div 
                    className="p-3 text-sm rounded-md" 
                    style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
                  >
                    No assets available in your wallet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assets.map((asset) => {
                      // Trouver l'allocation existante pour ce bénéficiaire et cet actif
                      const allocation = assetAllocations.find(
                        a => a.assetSymbol === asset.symbol && a.beneficiaryId === beneficiary.id
                      );
                      
                      const allocatedPercentage = allocation ? allocation.percentage : 0;
                      const allocatedAmount = allocation ? allocation.amount : 0;
                      
                      return (
                        <BeneficiaryAllocationSlider
                          key={asset.symbol}
                          beneficiary={beneficiary}
                          asset={asset}
                          allocatedPercentage={allocatedPercentage}
                          allocatedAmount={allocatedAmount}
                          onUpdateAllocation={(percentage) => 
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
      })}
    </div>
  );
};

export default BeneficiaryView;
