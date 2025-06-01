import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useWill } from "../WillContext";
import useCryptoBalance from "../../../hooks/useCryptoBalance";
import NoWalletError from "./NoWalletError";
import Button from "../../../components/ui/Button";

// Import modular sub-components from the asset-allocation folder
import AssetList from "./asset-allocation/AssetList";

import AllocationSummary from "./asset-allocation/AllocationSummary";
import AllocationTabs from "./asset-allocation/AllocationTabs";
import BeneficiaryView from "./asset-allocation/BeneficiaryView";
import PortfolioView from "./asset-allocation/PortfolioView";

/**
 * Main component for the asset allocation step
 * Allows users to allocate percentages of their crypto assets to different beneficiaries
 */
const AssetAllocationStep: React.FC<{
  onPrevious?: () => void;
  onContinue?: () => void;
}> = ({ onPrevious, onContinue }) => {
  const navigate = useNavigate();

  // States and context
  const {
    beneficiaryAllocations,
    setAssetAllocations,
    assetAllocations: savedAllocations,
  } = useWill();
  const { balanceData, isLoading, refreshBalance } = useCryptoBalance();

  // State for expanded assets in the UI
  const [expandedAssets, setExpandedAssets] = useState<string[]>([]);

  // State for expanded beneficiaries
  const [expandedBeneficiaries, setExpandedBeneficiaries] = useState<string[]>(
    []
  );

  // State for local asset allocations
  const [localAssetAllocations, setLocalAssetAllocations] = useState<any[]>(
    savedAllocations || []
  );

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  
  // State pour suivre si le total des allocations de portefeuille dépasse 100%
  const [portfolioTotalExceeded, setPortfolioTotalExceeded] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<"assets" | "beneficiaries" | "portfolio">(
    "portfolio"
  );

  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for unallocated assets filter
  const [showOnlyUnallocated, setShowOnlyUnallocated] =
    useState<boolean>(false);

  // Initialize data when balance is loaded
  useEffect(() => {
    if (balanceData?.assets && balanceData.assets.length > 0) {
      // Expand the first asset by default
      setExpandedAssets([balanceData.assets[0].symbol]);

      // If beneficiaries exist, expand the first one by default
      if (beneficiaryAllocations.length > 0) {
        setExpandedBeneficiaries([beneficiaryAllocations[0].beneficiary.id]);
      }
    }
  }, [balanceData, beneficiaryAllocations]);

  // Toggle asset panel expansion
  const toggleAssetExpansion = (symbol: string) => {
    setExpandedAssets((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Toggle beneficiary panel expansion
  const toggleBeneficiaryExpansion = (id: string) => {
    setExpandedBeneficiaries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Update allocation for a specific asset and beneficiary
  const handleUpdateAssetAllocation = (
    assetSymbol: string,
    beneficiaryId: string,
    percentage: number,
    isPortfolioAllocation: boolean = false
  ) => {
    const asset = balanceData?.assets.find((a) => a.symbol === assetSymbol);
    if (!asset) return;

    // Ensure percentage is between 0 and 100
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    // Calculate amount based on percentage
    const amount = (percentage / 100) * asset.balance;

    console.log(
      `${isPortfolioAllocation ? 'PORTFOLIO' : 'DIRECT'} Allocation: ${assetSymbol} for ${beneficiaryId}: ` +
      `${percentage}% (${amount.toFixed(8)} ${assetSymbol})`
    );

    // Update local state
    setLocalAssetAllocations((prev) => {
      // Find existing allocation
      const existingIndex = prev.findIndex(
        (a) =>
          a.assetSymbol === assetSymbol && a.beneficiaryId === beneficiaryId
      );

      const newAllocations = [...prev];

      if (existingIndex >= 0) {
        // Update existing allocation
        newAllocations[existingIndex] = {
          ...newAllocations[existingIndex],
          amount,
          percentage,
        };
      } else {
        // Add new allocation
        newAllocations.push({
          assetSymbol,
          beneficiaryId,
          amount,
          percentage,
        });
      }

      // Validate the new allocations
      validateAllocations(newAllocations);

      return newAllocations;
    });

    // Also update the global context with the isPortfolioAllocation flag
    const { updateAssetAllocation } = useWill();
    if (updateAssetAllocation) {
      // Utiliser directement la fonction du contexte avec tous les paramètres
      updateAssetAllocation(assetSymbol, beneficiaryId, percentage, isPortfolioAllocation);
    }
  };

  // Validate all allocations
  const validateAllocations = (allocations = localAssetAllocations) => {
    // Reset errors
    const newErrors: { [key: string]: string } = {};

    if (balanceData?.assets) {
      // For each asset, verify that total allocation doesn't exceed 100%
      balanceData.assets.forEach((asset) => {
        const assetAllocs = allocations.filter(
          (a) => a.assetSymbol === asset.symbol
        );
        const totalPercentageAllocated = assetAllocs.reduce(
          (sum, alloc) => sum + alloc.percentage,
          0
        );

        if (totalPercentageAllocated > 100) {
          newErrors[
            asset.symbol
          ] = `Total allocation exceeds 100% for ${asset.symbol}`;
        }
      });
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if all allocations are valid
  const areAllocationsValid = () => {
    // Vérifier les erreurs de validation des allocations par actif
    const noValidationErrors = Object.keys(validationErrors).length === 0;
    
    // Vérifier aussi si l'allocation totale de portefeuille ne dépasse pas 100%
    return noValidationErrors && !portfolioTotalExceeded;
  };

  // Save allocations and continue
  const handleContinue = () => {
    if (validateAllocations()) {
      setAssetAllocations(localAssetAllocations);
      if (onContinue) {
        onContinue();
      } else {
        navigate("/wills/create/step4");
      }
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setAssetAllocations(localAssetAllocations);
    if (onPrevious) {
      onPrevious();
    } else {
      navigate("/wills/create/step2");
    }
  };

  // Filter assets based on search and filter
  const filteredAssets = balanceData?.assets
    ? balanceData.assets.filter((asset) => {
        // Search filter
        const matchesSearch = asset.symbol
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Unallocated assets filter
        const isAllocated =
          localAssetAllocations
            .filter((a) => a.assetSymbol === asset.symbol)
            .reduce((sum, alloc) => sum + alloc.percentage, 0) > 0;

        const matchesAllocationFilter = !showOnlyUnallocated || !isAllocated;

        return matchesSearch && matchesAllocationFilter;
      })
    : [];

  // Wallet error handling
  if (!balanceData && !isLoading) {
    return <NoWalletError />;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-2">
        <CurrencyDollarIcon
          className="w-6 h-6 mr-2"
          style={{ color: "var(--accent-primary)" }}
        />
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Asset Allocation
        </h2>
      </div>

      <div
        className="p-6 rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <p style={{ color: "var(--text-secondary)" }} className="mb-4">
          Choose which crypto assets you want to include in your will and what
          percentage of each asset to allocate to your beneficiaries. The equivalent
          amounts will be calculated automatically.
        </p>

        {/* Allocation Summary */}
        {!isLoading && balanceData?.assets && (
          <AllocationSummary
            assets={balanceData.assets}
            assetAllocations={localAssetAllocations}
            beneficiaries={beneficiaryAllocations}
          />
        )}

        {/* Navigation Tabs */}
        <AllocationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Filters and search - hidden for portfolio view */}
        {activeTab !== "portfolio" && (
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon
                className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                className="pl-9 pr-3 py-2 rounded-md w-full text-sm"
                placeholder={`Search for a${
                  activeTab === "assets" ? " crypto asset" : " beneficiary"
                }...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              />
            </div>

            {activeTab === "assets" && (
              <button
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  showOnlyUnallocated ? "font-medium" : ""
                }`}
                onClick={() => setShowOnlyUnallocated(!showOnlyUnallocated)}
                style={{
                  backgroundColor: showOnlyUnallocated
                    ? "var(--accent-primary-transparent)"
                    : "var(--bg-tertiary)",
                  color: showOnlyUnallocated
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                  border: "1px solid",
                  borderColor: showOnlyUnallocated
                    ? "var(--accent-primary)"
                    : "var(--border-color)",
                }}
              >
                <FunnelIcon className="w-4 h-4 mr-1" />
                Unallocated
              </button>
            )}


          </div>
        )}
        
        {/* Portfolio view */}

        {/* View based on active tab: assets, beneficiaries, or portfolio */}
        {activeTab === "assets" ? (
          <AssetList
            assets={filteredAssets}
            beneficiaries={beneficiaryAllocations}
            assetAllocations={localAssetAllocations}
            expandedAssets={expandedAssets}
            isLoading={isLoading}
            validationErrors={validationErrors}
            onToggleAssetExpansion={toggleAssetExpansion}
            onUpdateAllocation={handleUpdateAssetAllocation}
            onRefresh={refreshBalance}
          />
        ) : activeTab === "beneficiaries" ? (
          <BeneficiaryView
            assets={balanceData?.assets || []}
            beneficiaries={beneficiaryAllocations.filter(
              (b) =>
                b.beneficiary.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) || searchQuery === ""
            )}
            assetAllocations={localAssetAllocations}
            expandedBeneficiaries={expandedBeneficiaries}
            onToggleBeneficiaryExpansion={toggleBeneficiaryExpansion}
            onUpdateAllocation={handleUpdateAssetAllocation}
            validationErrors={validationErrors}
          />
        ) : (
          <PortfolioView
            assets={balanceData?.assets || []}
            beneficiaries={beneficiaryAllocations}
            assetAllocations={localAssetAllocations}
            onUpdateAllocation={handleUpdateAssetAllocation}
            validationErrors={validationErrors}
            onTotalExceeded={setPortfolioTotalExceeded}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between mt-6">
        <Button onClick={handleBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          variant="primary"
          disabled={!areAllocationsValid()}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default AssetAllocationStep;
