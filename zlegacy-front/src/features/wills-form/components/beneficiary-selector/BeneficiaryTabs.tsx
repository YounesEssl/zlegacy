import React from "react";
import { UserGroupIcon, UserPlusIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

interface BeneficiaryTabsProps {
  currentMode: "select" | "enter" | "ngo";
  onModeChange: (mode: "select" | "enter" | "ngo") => void;
}

const BeneficiaryTabs: React.FC<BeneficiaryTabsProps> = ({
  currentMode,
  onModeChange,
}) => {
  // Définir les onglets et leurs propriétés
  const tabs = [
    {
      id: "select",
      label: "Select Existing",
      icon: <UserGroupIcon className="w-4 h-4" />,
      description: "Choose from your existing beneficiaries",
    },
    {
      id: "enter",
      label: "Enter Address",
      icon: <UserPlusIcon className="w-4 h-4" />,
      description: "Add a new beneficiary by wallet address",
    },
    {
      id: "ngo",
      label: "Select NGO",
      icon: <GlobeAltIcon className="w-4 h-4" />,
      description: "Support charitable organizations",
    },
  ];

  return (
    <div className="mb-6">
      <div 
        className="flex p-1 rounded-xl bg-opacity-50 mb-1 border"
        style={{ 
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)", 
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-2.5 transition-all duration-200 ${currentMode === tab.id ? "" : "hover:bg-opacity-70"}`}
            style={{
              backgroundColor: currentMode === tab.id ? "var(--bg-primary)" : "transparent",
              color: currentMode === tab.id ? "var(--accent-primary)" : "var(--text-secondary)",
              boxShadow: currentMode === tab.id ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
            onClick={() => onModeChange(tab.id as "select" | "enter" | "ngo")}
          >
            <div className="flex items-center">
              <div 
                className="p-1.5 rounded-full mr-3"
                style={{
                  backgroundColor: currentMode === tab.id ? `var(--accent-primary-light)` : "transparent",
                  color: currentMode === tab.id ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                {tab.icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{tab.label}</p>
                <p 
                  className="text-xs hidden md:block"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {tab.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BeneficiaryTabs;
