import React from "react";
import { motion } from "framer-motion";
import {
  CurrencyDollarIcon,
  CubeIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import type { CurrencyUnit } from "./types";

interface CurrencyUnitSelectorProps {
  selected: CurrencyUnit;
  onChange: (unit: CurrencyUnit) => void;
}

const CurrencyUnitSelector: React.FC<CurrencyUnitSelectorProps> = ({
  selected,
  onChange,
}) => {
  // Options de devise avec leurs configurations
  const unitOptions: Array<{
    id: CurrencyUnit;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "percentage",
      label: "Percentage",
      icon: <HashtagIcon className="w-5 h-5" />,
      description: "Allocate by percentage of total assets",
    },
    {
      id: "crypto",
      label: "Crypto",
      icon: <CubeIcon className="w-5 h-5" />,
      description: "View allocation in cryptocurrency",
    },
    {
      id: "usd",
      label: "USD",
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      description: "View allocation in USD equivalent",
    },
  ];

  return (
    <div className="bg-opacity-50 rounded-xl p-2" style={{ backgroundColor: "var(--bg-tertiary)" }}>
      <div className="flex gap-2">
        {unitOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex-1 rounded-lg px-3 py-2.5 transition-all duration-200 ease-out ${
              selected === option.id ? "" : "hover:bg-opacity-80"
            }`}
            style={{
              backgroundColor:
                selected === option.id
                  ? "var(--accent-primary)"
                  : "var(--bg-secondary)",
              color:
                selected === option.id
                  ? "white"
                  : "var(--text-secondary)",
            }}
          >
            {selected === option.id && (
              <motion.div
                layoutId="selectedUnit"
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: "var(--accent-primary)" }}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <div className="relative flex flex-col items-center z-10">
              <div className="mb-1">{option.icon}</div>
              <span className="font-medium text-sm">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      <div 
        className="mt-2 px-3 py-2 text-xs rounded-lg"
        style={{ 
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-muted)" 
        }}
      >
        {unitOptions.find(option => option.id === selected)?.description}
      </div>
    </div>
  );
};

export default CurrencyUnitSelector;
