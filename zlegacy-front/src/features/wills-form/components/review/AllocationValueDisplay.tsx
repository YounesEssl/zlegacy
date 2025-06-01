import React from "react";
import { useWill } from "../../WillContext";
import useCryptoBalance from "../../../../hooks/useCryptoBalance";

// Utility function to format crypto amounts without trailing zeros
const formatCryptoAmount = (amount: number | string): string => {
  // Convert to number if it's a string
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  // Convert the number to a string with sufficient decimals
  const str = numberAmount.toFixed(8);
  // Remove unnecessary zeros at the end and the decimal point if needed
  return str.replace(/\.?0+$/, '');
};

// Format USD values with fewer decimals
const formatUsdAmount = (amount: number | string): string => {
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  // Round to whole number for USD values
  return Math.round(numberAmount).toString();
};

interface AllocationValueDisplayProps {
  allocation: number;
  beneficiaryId: string;
  showDetailedBreakdown?: boolean;
}

const AllocationValueDisplay: React.FC<AllocationValueDisplayProps> = ({
  allocation,
  beneficiaryId,
  showDetailedBreakdown = false,
}) => {
  const { cryptoBalance, assetAllocations } = useWill();
  const { balanceData } = useCryptoBalance();
  
  // IMPORTANT: Utiliser cryptoBalance du WillContext comme dans ReviewStep 
  // pour garantir une cohérence parfaite entre les deux calculs
  let totalPortfolioValueUSD = 0;
  if (cryptoBalance?.assets) {
    cryptoBalance.assets.forEach(asset => {
      totalPortfolioValueUSD += asset.usdValue;
    });
  }

  // Get specific asset allocations for this beneficiary
  const beneficiaryAssetAllocations = assetAllocations.filter(
    (alloc) => alloc.beneficiaryId === beneficiaryId
  );

  // Structure to hold detailed allocation data for each asset
  type DetailedAssetAllocation = {
    symbol: string;
    amount: number;
    usdValue: number;
    percentage: number;
  };

  // Calculate detailed allocations for each asset
  const detailedAllocations: DetailedAssetAllocation[] = [];
  
  if (cryptoBalance?.assets && beneficiaryAssetAllocations.length > 0) {
    // Log pour déboguer
    console.log('Building detailed allocations for beneficiary', beneficiaryId);
    console.log('Asset allocations:', beneficiaryAssetAllocations);
    
    beneficiaryAssetAllocations.forEach(allocation => {
      const asset = cryptoBalance.assets?.find(a => a.symbol === allocation.assetSymbol);
      if (asset) {
        // Si l'allocation utilise percentage, utilisez-la directement, sinon calculez-la
        const allocationPercentage = allocation.percentage || 0;
        const usdRate = asset.usdValue / asset.balance;
        
        // Calculer le montant en fonction du pourcentage si besoin
        const allocationAmount = allocation.amount || (allocationPercentage / 100) * asset.balance;
        
        // Ne pas ajouter d'allocations nulles
        if (allocationAmount > 0 || allocationPercentage > 0) {
          detailedAllocations.push({
            symbol: asset.symbol,
            amount: allocationAmount,
            usdValue: allocationAmount * usdRate,
            percentage: allocationPercentage || (allocationAmount / asset.balance) * 100
          });
        }
      }
    });

    // Sort by USD value (highest first)
    detailedAllocations.sort((a, b) => b.usdValue - a.usdValue);
  }

  // Calculate real crypto and USD values from specific allocations
  let realCryptoValues = {
    totalCryptoValue: 0,
    totalUsdValue: 0,
    realPercentage: 0,
    hasCustomAllocations: beneficiaryAssetAllocations.length > 0
  };

  // Si nous avons des allocations spécifiques et des données de solde réelles
  if (beneficiaryAssetAllocations.length > 0 && cryptoBalance?.assets) {
    
    // Réduire pour calculer les valeurs totales
    realCryptoValues = beneficiaryAssetAllocations.reduce((acc, allocation) => {
      const asset = cryptoBalance.assets?.find(a => a.symbol === allocation.assetSymbol);
      if (asset) {
        // Ajouter la valeur de l'actif alloué
        acc.totalCryptoValue += allocation.amount;
        
        // Calculer et ajouter la valeur équivalente en USD
        const usdRate = asset.usdValue / asset.balance;
        acc.totalUsdValue += allocation.amount * usdRate;
      }
      return acc;
    }, { totalCryptoValue: 0, totalUsdValue: 0, realPercentage: 0, hasCustomAllocations: true });
    
    // Calculer le pourcentage réel alloué (valeur totale en USD allouée / valeur totale du portefeuille en USD)
    // Utiliser la même formule que dans ReviewStep pour garantir la cohérence
    if (totalPortfolioValueUSD > 0) {
      // On n'arrondit pas ici pour éviter les erreurs d'arrondi dans la somme
      realCryptoValues.realPercentage = (realCryptoValues.totalUsdValue / totalPortfolioValueUSD) * 100;
    }
  }

  // Default value based on global percentage (used if no specific allocations)
  // Si aucune allocation spécifique n'est définie, n'affiche pas de valeur par défaut
  const defaultUsdValue = beneficiaryAssetAllocations.length > 0 
    ? (allocation / 100) * cryptoBalance.usdValue
    : 0;

  // Display all values simultaneously (percentage, crypto and USD)
  const formatValue = () => {
    // Use real asset allocations if available, otherwise default values
    const useRealValues = realCryptoValues.hasCustomAllocations && 
                        (realCryptoValues.totalCryptoValue > 0 || realCryptoValues.totalUsdValue > 0);
    
    // La valeur USD est maintenant directement utilisée dans le JSX
    // Le pourcentage est calculé directement dans les composants d'affichage pour garantir la cohérence

    // Basic summary view (default) - only showing percentage
    if (!showDetailedBreakdown) {
      // Récupérer le pourcentage sous forme de nombre pour l'affichage
      const percentValue = beneficiaryAssetAllocations.length > 0 && totalPortfolioValueUSD > 0
        ? Math.round((realCryptoValues.totalUsdValue / totalPortfolioValueUSD) * 100)
        : 0;
        
      return (
        <div className="flex items-center justify-end">
          <span 
            className="text-base font-medium" 
            style={{ color: "var(--text-primary)" }}
          >
            {percentValue}%
          </span>
        </div>
      );
    }
    
    // Ne gardons que les valeurs nécessaires pour la mise en page
    const cryptoSymbolColors = {
      ALEO: "#5C44FB",
      BTC: "#F7931A",
      ETH: "#627EEA",
      USDT: "#26A17B",
      XMR: "#FF6600"
    };
    
    // Vue détaillée moderne
    return (
      <div className="w-full p-4">
        {/* Gradient header with total values */}
        <div 
          className="p-4 rounded-xl mb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))", color: "white" }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white transform -translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white transform translate-x-8 translate-y-8"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-sm font-medium opacity-80 mb-1">Total Value Allocated</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold">${useRealValues ? formatUsdAmount(realCryptoValues.totalUsdValue) : formatUsdAmount(defaultUsdValue)}</div>
              <div className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">USD</div>
            </div>
          </div>
        </div>
        
        {/* Assets List */}
        {detailedAllocations.length > 0 ? (
          <div className="space-y-3">
            {detailedAllocations.map((asset) => {
              const color = cryptoSymbolColors[asset.symbol as keyof typeof cryptoSymbolColors] || "#7c8db5";
              return (
                <div 
                  key={asset.symbol} 
                  className="p-3 rounded-lg border flex items-center space-x-3 transition-all hover:shadow-sm"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
                >
                  {/* Asset Icon */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    <span className="text-base font-bold">{asset.symbol.charAt(0)}</span>
                  </div>
                  
                  {/* Asset Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {asset.symbol}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                          {formatCryptoAmount(asset.amount)}
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>/</span>
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {formatCryptoAmount(balanceData?.assets?.find(a => a.symbol === asset.symbol)?.balance || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-0.5">
                      <div 
                        className="text-xs px-1.5 py-0.5 rounded-full" 
                        style={{ backgroundColor: `${color}15`, color: color }}
                      >
                        {formatCryptoAmount(asset.percentage)}%
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        ${formatUsdAmount(asset.usdValue)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            className="py-5 rounded-lg flex flex-col items-center justify-center border border-dashed"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          >
            <svg className="w-8 h-8 mb-2 opacity-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01M15 9H15.01M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-sm">No specific assets allocated</div>
          </div>
        )}
      </div>
    );
  };

  return <>{formatValue()}</>;
};

export { AllocationValueDisplay };
export default AllocationValueDisplay;
