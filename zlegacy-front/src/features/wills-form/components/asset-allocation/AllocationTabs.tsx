import React from "react";
import { CurrencyDollarIcon, UserGroupIcon, ChartPieIcon } from "@heroicons/react/24/outline";

interface AllocationTabsProps {
  activeTab: "assets" | "beneficiaries" | "portfolio";
  setActiveTab: (tab: "assets" | "beneficiaries" | "portfolio") => void;
}

const AllocationTabs: React.FC<AllocationTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div 
      className="flex rounded-lg mb-4 p-1"
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    >
      <button
        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === "portfolio" ? "shadow-sm" : ""
        }`}
        onClick={() => setActiveTab("portfolio")}
        style={{
          backgroundColor: activeTab === "portfolio" ? "var(--bg-card)" : "transparent",
          color: activeTab === "portfolio" ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        <ChartPieIcon className="w-4 h-4 mr-2" />
        Portfolio
      </button>
      <button
        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === "beneficiaries" ? "shadow-sm" : ""
        }`}
        onClick={() => setActiveTab("beneficiaries")}
        style={{
          backgroundColor: activeTab === "beneficiaries" ? "var(--bg-card)" : "transparent",
          color: activeTab === "beneficiaries" ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        <UserGroupIcon className="w-4 h-4 mr-2" />
        By Beneficiaries
      </button>
      <button
        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === "assets" ? "shadow-sm" : ""
        }`}
        onClick={() => setActiveTab("assets")}
        style={{
          backgroundColor: activeTab === "assets" ? "var(--bg-card)" : "transparent",
          color: activeTab === "assets" ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
        By Assets
      </button>
    </div>
  );
};

export default AllocationTabs;
