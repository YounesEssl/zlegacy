import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  CubeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import type { CryptoAsset } from '../../types/crypto';

interface CryptoBalanceDisplayProps {
  assets: CryptoAsset[];
  totalBalanceUsd: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const CryptoBalanceDisplay: React.FC<CryptoBalanceDisplayProps> = ({
  assets,
  totalBalanceUsd,
  isLoading = false,
  onRefresh
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Format balance in USD with appropriate precision
  const formatUsdBalance = (amount: number): string => {
    if (!Number.isFinite(amount)) {
      // Handle invalid amount
      return '$0.00';
    }
    
    // Ensure we use valid values for maximumFractionDigits (must be 0-20)
    const maxDigits = amount >= 1000 ? 0 : 2;
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDigits
      }).format(amount);
    } catch (error) {
      console.error('Error formatting USD balance:', error);
      return '$' + amount.toFixed(2);
    }
  };
  
  // Format token amount with appropriate precision
  const formatTokenAmount = (amount: number): string => {
    if (amount < 0.001) return amount.toFixed(6);
    if (amount < 0.01) return amount.toFixed(4);
    if (amount < 1) return amount.toFixed(3);
    if (amount < 1000) return amount.toFixed(2);
    return amount.toFixed(1);
  };
  

  
  // Obtenir la crypto-monnaie actuellement sélectionnée
  const selectedAsset = assets.length > selectedAssetIndex ? assets[selectedAssetIndex] : null;
  
  return (
    <div className="relative wallet-balance-container" ref={dropdownRef}>
      <div 
        className="flex items-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
      >
        {isLoading ? (
          <div 
            className="flex items-center rounded-lg px-2 py-1"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin mr-2"
              style={{ borderColor: 'var(--accent-primary) var(--accent-primary) transparent' }}
            ></div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Loading...
            </span>
          </div>
        ) : (
          <div 
            className="flex items-center rounded-lg px-2 py-1 transition-colors"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            {selectedAsset && (
              <>
                <div className="flex items-center">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center mr-1.5"
                    style={{ backgroundColor: `${selectedAsset.color}20` }}
                  >
                    {selectedAsset.iconUrl ? (
                      <img 
                        src={selectedAsset.iconUrl} 
                        alt={selectedAsset.symbol} 
                        className="w-3 h-3"
                      />
                    ) : (
                      <CubeIcon 
                        className="w-3 h-3" 
                        style={{ color: selectedAsset.color }}
                      />
                    )}
                  </div>
                  <span className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>
                    {formatTokenAmount(selectedAsset.balance)} {selectedAsset.symbol}
                  </span>
                </div>
                
                <ChevronDownIcon 
                  className={`w-3 h-3 ml-1 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                  style={{ color: "var(--text-secondary)" }}
                />
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Dropdown des cryptos */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-1 w-60 rounded-lg shadow-xl z-50 overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div 
              className="p-2 flex justify-between items-center border-b" 
              style={{ borderColor: "var(--border-color)" }}
            >
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Balance: {formatUsdBalance(totalBalanceUsd)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh?.();
                }}
                className="p-1 rounded-full transition-colors"
                style={{ color: "var(--text-secondary)" }}
                disabled={isLoading}
              >
                <ArrowPathIcon className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {/* Liste des cryptos */}
            <div className="max-h-80 overflow-y-auto">
              {assets.map((asset, index) => (
                <div 
                  key={asset.symbol}
                  className="p-2 flex items-center justify-between hover:bg-opacity-10 transition-colors cursor-pointer"
                  style={{ 
                    borderBottom: "1px solid var(--border-color)",
                    backgroundColor: index === selectedAssetIndex 
                      ? "var(--accent-primary-transparent)" 
                      : "transparent"
                  }}
                  onClick={() => {
                    setSelectedAssetIndex(index);
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                      style={{ 
                        backgroundColor: `${asset.color}20`
                      }}
                    >
                      {asset.iconUrl ? (
                        <img src={asset.iconUrl} alt={asset.symbol} className="w-4 h-4" />
                      ) : (
                        <CubeIcon className="w-4 h-4" style={{ color: asset.color }} />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <span 
                          className="text-xs font-medium" 
                          style={{ color: "var(--text-primary)" }}
                        >
                          {asset.symbol}
                        </span>
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {formatTokenAmount(asset.balance)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {formatUsdBalance(asset.usdValue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CryptoBalanceDisplay;
