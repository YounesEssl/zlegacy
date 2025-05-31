import React, { useState, useEffect, useRef } from 'react';
import type { Beneficiary, CryptoAsset } from '../../types';

interface BeneficiaryAllocationSliderProps {
  beneficiary: Beneficiary;
  asset: CryptoAsset;
  allocatedPercentage: number;
  allocatedAmount: number;
  onUpdateAllocation: (percentage: number) => void;
}

const BeneficiaryAllocationSlider: React.FC<BeneficiaryAllocationSliderProps> = ({
  beneficiary,
  asset,
  allocatedPercentage,
  allocatedAmount,
  onUpdateAllocation,
}) => {
  // Generate a unique ID for this slider
  const sliderId = `slider-${beneficiary.id}-${asset.symbol}`;
  // Local state for percentage (during sliding)
  const [localPercentage, setLocalPercentage] = useState(allocatedPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  
  // Update local percentage when allocation changes from outside
  useEffect(() => {
    if (!isDragging) {
      setLocalPercentage(allocatedPercentage);
    }
  }, [allocatedPercentage, isDragging]);

  // Handle slider interaction events
  const handleSliderStart = () => {
    setIsDragging(true);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPercentage(parseInt(e.target.value));
  };

  // Update allocation when slider is released
  const handleSliderRelease = () => {
    setIsDragging(false);
    if (localPercentage !== allocatedPercentage) {
      onUpdateAllocation(localPercentage);
    }
  };

  // Handle direct percentage input
  const handleDirectInput = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    const validValue = isNaN(numValue) ? 0 : Math.min(100, Math.max(0, numValue));
    setLocalPercentage(validValue);
    onUpdateAllocation(validValue);
  };

  // Calculate USD value
  const usdValue = (allocatedAmount / asset.balance) * asset.usdValue;

  // Format numbers
  const formatNumber = (num: number, decimals = 4) => {
    if (num === 0) return '0';
    
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  // Format USD
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="p-3 rounded-lg border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center mr-2"
            style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
          >
            <span style={{ color: "var(--accent-primary)", fontSize: "0.7rem" }}>
              {(beneficiary.name || "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ color: "var(--text-primary)" }}>
            {beneficiary.name || "Unnamed Beneficiary"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm">
            <input
              type="text"
              value={`${localPercentage}%`}
              onChange={(e) => handleDirectInput(e.target.value)}
              onBlur={handleSliderRelease}
              className="w-14 text-right px-1 py-0.5 rounded border text-sm font-medium"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)"
              }}
            />
          </div>
          <div className="flex flex-col text-xs text-right">
            <span style={{ color: "var(--text-secondary)" }}>
              {formatNumber(allocatedAmount)} {asset.symbol}
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              {formatUSD(usdValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative py-2">
        <input
          ref={sliderRef}
          id={sliderId}
          type="range"
          min="0"
          max="100"
          step="1"
          value={localPercentage}
          onChange={handleSliderChange}
          onMouseDown={handleSliderStart}
          onTouchStart={handleSliderStart}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          onKeyUp={handleSliderRelease}
          className="w-full appearance-none h-2 rounded-lg outline-none cursor-pointer"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        />
        
        {/* Markers for 0%, 25%, 50%, 75%, 100% */}
        <div className="flex justify-between text-xs pt-1" style={{ color: "var(--text-muted)" }}>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Custom CSS for slider */}
      <style>{`
        #${sliderId} {
          height: 8px;
          background: linear-gradient(
            to right,
            var(--accent-primary) 0%,
            var(--accent-primary) ${localPercentage}%,
            var(--bg-tertiary) ${localPercentage}%,
            var(--bg-tertiary) 100%
          );
        }
        #${sliderId}::-webkit-slider-thumb {
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
        #${sliderId}::-webkit-slider-thumb:hover,
        #${sliderId}::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        #${sliderId}::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          border: none;
          transition: transform 0.1s;
        }
        #${sliderId}::-moz-range-thumb:hover,
        #${sliderId}::-moz-range-thumb:active {
          transform: scale(1.1);
        }
        #${sliderId}::-ms-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          transition: transform 0.1s;
        }
        #${sliderId}::-ms-thumb:hover,
        #${sliderId}::-ms-thumb:active {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default BeneficiaryAllocationSlider;
