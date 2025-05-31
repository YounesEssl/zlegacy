import React from "react";
import {
  CurrencyDollarIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { useWill } from "../../WillContext";
import type { CurrencyUnit } from "../../types";

const CurrencyUnitSelector: React.FC = () => {
  const { currencyUnit, setCurrencyUnit } = useWill();

  // Les différentes unités possibles
  const units: Array<{ value: CurrencyUnit; icon: JSX.Element; label: string }> = [
    { 
      value: "percentage", 
      icon: <HashtagIcon className="w-4 h-4" />,
      label: "Percentage"
    },
    { 
      value: "crypto", 
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      label: "Crypto"
    },
    { 
      value: "usd", 
      icon: <CurrencyDollarIcon className="w-4 h-4" />,
      label: "USD"
    }
  ];

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {units.map((unit) => (
        <button
          key={unit.value}
          type="button"
          onClick={() => setCurrencyUnit(unit.value)}
          className={`flex items-center px-3 py-1.5 text-xs font-medium ${
            currencyUnit === unit.value
              ? "bg-primary text-white"
              : "bg-muted hover:bg-muted-hover"
          } ${unit.value === "percentage" ? "rounded-l-lg" : ""} ${
            unit.value === "usd" ? "rounded-r-lg" : ""
          }`}
          style={{
            backgroundColor: currencyUnit === unit.value 
              ? "var(--accent-primary)" 
              : "var(--bg-muted)",
            color: currencyUnit === unit.value 
              ? "white" 
              : "var(--text-secondary)",
            borderRight: unit.value !== "usd" 
              ? "1px solid var(--border-color)" 
              : "none"
          }}
        >
          <span className="mr-1.5">{unit.icon}</span>
          {unit.label}
        </button>
      ))}
    </div>
  );
};

export { CurrencyUnitSelector };
export default CurrencyUnitSelector;
