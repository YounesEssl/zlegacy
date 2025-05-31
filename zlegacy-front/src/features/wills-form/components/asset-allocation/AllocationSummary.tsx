import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { CryptoAsset, AssetAllocation, BeneficiaryAllocation } from "../../types";

interface AllocationSummaryProps {
  assets: CryptoAsset[];
  assetAllocations: AssetAllocation[];
  beneficiaries: BeneficiaryAllocation[];
}

const AllocationSummary: React.FC<AllocationSummaryProps> = ({
  assets,
  assetAllocations,
  beneficiaries,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculer la valeur totale du portefeuille en USD
  const totalPortfolioValueUSD = assets.reduce((total, asset) => total + asset.usdValue, 0);

  // Calculer la valeur totale allouée en USD
  let totalAllocatedValueUSD = 0;

  if (assetAllocations.length > 0 && assets.length > 0) {
    assetAllocations.forEach(allocation => {
      const asset = assets.find(a => a.symbol === allocation.assetSymbol);
      if (asset) {
        const assetUsdRate = asset.usdValue / asset.balance;
        totalAllocatedValueUSD += allocation.amount * assetUsdRate;
      }
    });
  }

  // Calculer le pourcentage total alloué
  const totalAllocationPercentage = totalPortfolioValueUSD > 0
    ? Math.round((totalAllocatedValueUSD / totalPortfolioValueUSD) * 100)
    : 0;

  // Nombre d'actifs alloués (avec un pourcentage > 0)
  const allocatedAssetsCount = new Set(
    assetAllocations
      .filter(alloc => alloc.percentage > 0)
      .map(alloc => alloc.assetSymbol)
  ).size;

  // Format USD values
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div 
      className="p-4 rounded-lg border mb-4"
      style={{ 
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <h3 
        className="text-base font-medium mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Allocation Summary
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Valeur totale allouée */}
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Total Allocated Value
          </span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            {formatUSD(totalAllocatedValueUSD)}
          </span>
        </div>

        {/* Pourcentage total alloué */}
        <div className="flex flex-col">
          <div className="relative">
            <div className="flex items-center text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Total Allocated Percentage</span>
              <button
                className="ml-1 focus:outline-none"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                aria-label="Plus d'informations sur le pourcentage total alloué"
              >
                <InformationCircleIcon 
                  className="w-4 h-4" 
                  style={{ color: "var(--text-muted)" }} 
                />
              </button>
            </div>

            {/* Tooltip explicatif */}
            {showTooltip && (
              <div 
                className="absolute z-10 w-64 p-3 rounded-lg shadow-lg transition-opacity duration-200 top-6 left-0 mt-1"
                style={{ 
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(4px)"
                }}
              >
                <div>
                  <div className="flex items-center mb-1">
                    <InformationCircleIcon className="w-4 h-4 mr-1" style={{ color: "var(--accent-primary)" }} />
                    <h4 className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>
                      Allocated Percentage
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    This percentage represents the total value of allocated assets relative to the total portfolio value (calculated in USD).
                  </p>
                </div>
              </div>
            )}
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {totalAllocationPercentage}%
            </span>
          </div>
        </div>

        {/* Nombre d'actifs alloués */}
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Assets Allocated
          </span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            {allocatedAssetsCount} sur {assets.length}
          </span>
        </div>

        {/* Nombre de bénéficiaires */}
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Beneficiaries
          </span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            {beneficiaries.length}
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: "var(--text-muted)" }}>Allocation Progress</span>
          <span style={{ color: "var(--text-secondary)" }}>
            {totalAllocationPercentage}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${totalAllocationPercentage}%`, 
              backgroundColor: "var(--accent-primary)"
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AllocationSummary;
