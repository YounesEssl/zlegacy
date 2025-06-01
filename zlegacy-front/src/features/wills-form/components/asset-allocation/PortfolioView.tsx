import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import type { CryptoAsset, BeneficiaryAllocation, AssetAllocation } from "../../types";

interface PortfolioViewProps {
  assets: CryptoAsset[];
  beneficiaries: BeneficiaryAllocation[];
  assetAllocations: AssetAllocation[];
  onUpdateAllocation: (assetSymbol: string, beneficiaryId: string, percentage: number, isPortfolioAllocation?: boolean) => void;
  validationErrors?: Record<string, string>; // Marqué comme optionnel
  onTotalExceeded?: (exceeded: boolean) => void; // Callback pour informer le parent si le total dépasse 100%
}

const PortfolioView: React.FC<PortfolioViewProps> = ({
  assets,
  beneficiaries,
  assetAllocations,
  onUpdateAllocation,
  onTotalExceeded,
  // Nous utiliserons validationErrors quand nous implémenterons la validation complète
}) => {
  // État local pour les pourcentages de portefeuille par bénéficiaire
  const [portfolioAllocations, setPortfolioAllocations] = useState<Record<string, number>>({});
  
  // Pas besoin de tracking pour le glissement car les changements sont appliqués en temps réel
  
  // Valeur totale du portefeuille en USD
  const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);
  
  // Calcul initial des allocations de portefeuille basé sur les allocations d'actifs existantes
  useEffect(() => {
    if (assets.length > 0 && beneficiaries.length > 0) {
      const newPortfolioAllocations: Record<string, number> = {};
      
      // Pour chaque bénéficiaire, calculer la valeur totale allouée
      beneficiaries.forEach(({ beneficiary }) => {
        let totalValueForBeneficiary = 0;
        
        // Parcourir tous les actifs pour ce bénéficiaire
        assets.forEach(asset => {
          // Trouver l'allocation pour cet actif et ce bénéficiaire
          const allocation = assetAllocations.find(
            alloc => alloc.assetSymbol === asset.symbol && alloc.beneficiaryId === beneficiary.id
          );
          
          if (allocation) {
            // Calculer la valeur en USD de cette allocation
            const valueAllocated = (allocation.percentage / 100) * asset.usdValue;
            totalValueForBeneficiary += valueAllocated;
          }
        });
        
        // Calculer le pourcentage du portefeuille total
        const portfolioPercentage = totalPortfolioValue > 0 
          ? (totalValueForBeneficiary / totalPortfolioValue) * 100 
          : 0;
        
        newPortfolioAllocations[beneficiary.id] = Math.round(portfolioPercentage * 10) / 10;
      });
      
      setPortfolioAllocations(newPortfolioAllocations);
    }
  }, [assets, beneficiaries, assetAllocations, totalPortfolioValue]);
  
  // Fonctions factices pour compatibilité avec les événements de l'UI
  const handleSliderStart = () => {};
  const handleSliderEnd = () => {};

  // Calculer le total actuel des allocations
  const calculateTotalAllocation = (allocations: Record<string, number> = portfolioAllocations) => {
    return Object.values(allocations).reduce((sum, value) => sum + value, 0);
  };

  // État pour stocker le dépassement total
  const [totalExceeded, setTotalExceeded] = useState(false);
  
  // Informer le parent quand le total dépasse 100%
  useEffect(() => {
    if (onTotalExceeded) {
      onTotalExceeded(totalExceeded);
    }
  }, [totalExceeded, onTotalExceeded]);

  // Mettre à jour l'allocation de portefeuille pour un bénéficiaire
  const handlePortfolioAllocationChange = (beneficiaryId: string, newPercentage: number) => {
    // Arrondir à 1 décimale et s'assurer que la valeur est dans la plage 0-100
    newPercentage = Math.min(100, Math.max(0, Math.round(newPercentage * 10) / 10));
    
    // Calculer le changement relatif par rapport à l'allocation précédente
    const newAllocations = { ...portfolioAllocations, [beneficiaryId]: newPercentage };
    const newTotal = calculateTotalAllocation(newAllocations);
    
    // Vérifier si le total dépasse 100%
    if (newTotal > 100.1) { // Autorise une petite marge d'erreur (0.1%) pour les erreurs d'arrondi
      setTotalExceeded(true);
    } else {
      setTotalExceeded(false);
      // Mettre à jour l'allocation pour ce bénéficiaire
      setPortfolioAllocations(newAllocations);
      
      // Appliquer l'allocation de portefeuille aux actifs individuels en temps réel
      // Cela est nécessaire pour que les allocations soient correctement affichées dans l'étape de revue
      applyPortfolioAllocationsToAssets(newAllocations);
    }
  };
  
  // Gérer la valeur directement saisie dans le champ texte
  const handleDirectTextInput = (beneficiaryId: string, value: string) => {
    // Nettoyer l'entrée et convertir en nombre
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(cleanValue);
    
    // Si c'est un nombre valide, mettre à jour l'allocation
    if (!isNaN(numValue)) {
      handlePortfolioAllocationChange(beneficiaryId, numValue);
    }
  };
  
  // Applique les allocations de portefeuille aux allocations par actif
  const applyPortfolioAllocationsToAssets = (newPortfolioAllocations: Record<string, number>) => {
    // Récupérer la valeur totale du portefeuille pour les calculs de proportion
    const totalPortfolioUsdValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);
    console.log('Total portfolio USD value:', totalPortfolioUsdValue);
    
    // D'abord, réinitialiser toutes les allocations existantes à 0
    Object.keys(newPortfolioAllocations).forEach(beneficiaryId => {
      assets.forEach(asset => {
        onUpdateAllocation(asset.symbol, beneficiaryId, 0, true);
      });
    });
    
    // Ensuite, appliquer les nouvelles allocations en proportion de la valeur
    Object.entries(newPortfolioAllocations)
      .filter(([_, percentage]) => percentage > 0)
      .forEach(([beneficiaryId, portfolioPercentage]) => {
        // Calculer la valeur USD totale allouée à ce bénéficiaire
        const allocatedUsdValue = (portfolioPercentage / 100) * totalPortfolioUsdValue;
        console.log(`Bénéficiaire ${beneficiaryId}: ${portfolioPercentage}% = $${allocatedUsdValue}`);
        
        // Pour chaque actif, calculer la portion qui correspond à sa part du portefeuille
        assets.forEach(asset => {
          // La proportion de cet actif dans le portefeuille total
          const assetProportion = totalPortfolioUsdValue > 0 ? asset.usdValue / totalPortfolioUsdValue : 0;
          
          // Le pourcentage de l'actif à allouer est le même que le pourcentage global du portefeuille
          // C'est-à-dire qu'on alloue le même pourcentage de chaque actif 
          // Par exemple, si on alloue 50% du portefeuille, on alloue 50% de chaque actif
          const assetAllocationPercentage = portfolioPercentage;
          
          console.log(`Asset ${asset.symbol}: proportion=${assetProportion.toFixed(4)}, allocation=${assetAllocationPercentage}%`);
          
          // Mise à jour de l'allocation pour cet actif
          onUpdateAllocation(asset.symbol, beneficiaryId, assetAllocationPercentage, true);
        });
      });
    
    console.log('Portfolio allocations applied to assets:', newPortfolioAllocations);
  };
  
  // Calcul du total alloué
  const totalAllocated = Object.values(portfolioAllocations).reduce((sum, pct) => sum + pct, 0);
  const remainingPercentage = Math.max(0, 100 - totalAllocated);
  
  // Format de nombre avec 1 décimale
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };
  
  // Format monétaire
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChartPieIcon className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
            <h3 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
              Portfolio Allocation
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Total:
            </span>
            <span 
              className={`text-sm font-medium ${totalExceeded ? 'text-red-500' : ''}`}
              style={{ color: totalExceeded ? 'var(--error)' : 'var(--text-primary)' }}
            >
              {calculateTotalAllocation().toFixed(1)}%
            </span>
            {totalExceeded && (
              <span className="text-xs text-red-500" style={{ color: 'var(--error)' }}>
                (Maximum 100%)
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Assign a percentage of your total portfolio ({formatCurrency(totalPortfolioValue)}) to each beneficiary. 
          Changes here will automatically update your individual asset allocations proportionally.
        </p>
      </div>
      
      {/* Résumé des allocations */}
      <div 
        className="p-4 rounded-lg mb-4"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="flex items-center justify-between">
          <span style={{ color: "var(--text-secondary)" }}>
            Portfolio Total
          </span>
          <span 
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {formatCurrency(totalPortfolioValue)}
          </span>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span style={{ color: "var(--text-secondary)" }}>
            Allocated
          </span>
          <span 
            className={`font-medium ${totalAllocated > 100 ? 'text-red-500 dark:text-red-400' : ''}`}
            style={{ color: totalAllocated > 100 ? undefined : "var(--accent-primary)" }}
          >
            {formatNumber(totalAllocated)}%
          </span>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span style={{ color: "var(--text-secondary)" }}>
            Remaining
          </span>
          <span 
            className={`font-medium ${totalAllocated > 100 ? 'text-red-500 dark:text-red-400' : ''}`}
            style={{ color: totalAllocated > 100 ? undefined : "var(--text-muted)" }}
          >
            {formatNumber(remainingPercentage)}%
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-3 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(100, totalAllocated)}%`,
              backgroundColor: totalAllocated > 100 ? 'var(--error)' : 'var(--accent-primary)'
            }}
          />
        </div>
        
        {/* Message d'erreur */}
        {totalAllocated > 100 && (
          <div className="mt-2 text-xs text-red-500 dark:text-red-400">
            Total allocation exceeds 100%. Please adjust.
          </div>
        )}
      </div>
      
      {/* Liste des bénéficiaires */}
      <div className="space-y-4">
        {beneficiaries.map(({ beneficiary }) => {
          const percentage = portfolioAllocations[beneficiary.id] || 0;
          const valueUSD = (percentage / 100) * totalPortfolioValue;
          
          return (
            <motion.div 
              key={beneficiary.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg border group hover:shadow-md transition-all duration-200"
              style={{ 
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-color)"
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: beneficiary.relationColor || "#4f46e5" }}
                  >
                    <span className="text-white text-xs font-medium">
                      {beneficiary.name?.substring(0, 1) || "?"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {beneficiary.name}
                    </h4>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {beneficiary.relation || "Beneficiary"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                    {formatNumber(percentage)}%
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {formatCurrency(valueUSD)}
                  </div>
                </div>
              </div>
              
              {/* Contrôles d'allocation */}
              <div className="py-2 space-y-2">
                {/* Slider et contrôles */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      id={`portfolio-slider-${beneficiary.id}`}
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={percentage}
                      onChange={(e) => handlePortfolioAllocationChange(beneficiary.id, parseFloat(e.target.value))}
                      onMouseDown={handleSliderStart}
                      onTouchStart={handleSliderStart}
                      onMouseUp={handleSliderEnd}
                      onTouchEnd={handleSliderEnd}
                      onKeyUp={handleSliderEnd}
                      className="w-full appearance-none h-2 rounded-lg outline-none cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    />
                  </div>
                  
                  <div className="mx-1 w-16">
                    <input
                      type="text"
                      value={`${percentage.toFixed(1)}%`}
                      onChange={(e) => handleDirectTextInput(beneficiary.id, e.target.value)}
                      onBlur={handleSliderEnd}
                      className="w-full text-center py-1 px-2 rounded-md text-sm font-medium"
                      style={{ 
                        backgroundColor: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-color)"
                      }}
                    />
                  </div>
                </div>
                
                {/* Marqueurs de pourcentage */}
                <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                
                {/* CSS personnalisé pour le slider */}
                <style>{`
                  #portfolio-slider-${beneficiary.id} {
                    height: 8px;
                    background: linear-gradient(
                      to right,
                      var(--accent-primary) 0%,
                      var(--accent-primary) ${percentage}%,
                      var(--bg-tertiary) ${percentage}%,
                      var(--bg-tertiary) 100%
                    );
                  }
                  #portfolio-slider-${beneficiary.id}::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    transition: transform 0.1s;
                  }
                  #portfolio-slider-${beneficiary.id}::-webkit-slider-thumb:hover,
                  #portfolio-slider-${beneficiary.id}::-webkit-slider-thumb:active {
                    transform: scale(1.1);
                  }
                  #portfolio-slider-${beneficiary.id}::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    border: none;
                    transition: transform 0.1s;
                  }
                  #portfolio-slider-${beneficiary.id}::-moz-range-thumb:hover,
                  #portfolio-slider-${beneficiary.id}::-moz-range-thumb:active {
                    transform: scale(1.1);
                  }
                  #portfolio-slider-${beneficiary.id}::-ms-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    transition: transform 0.1s;
                  }
                  #portfolio-slider-${beneficiary.id}::-ms-thumb:hover,
                  #portfolio-slider-${beneficiary.id}::-ms-thumb:active {
                    transform: scale(1.1);
                  }
                `}</style>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Message si aucun bénéficiaire */}
      {beneficiaries.length === 0 && (
        <div 
          className="text-center py-8 rounded-lg"
          style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
        >
          <p>No beneficiaries available. Please add beneficiaries in the previous step.</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
