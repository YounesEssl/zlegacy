import React from "react";
import { KeyIcon, UserGroupIcon } from "@heroicons/react/24/outline";

interface AllocationTabsProps {
  activeTab: "credentials" | "beneficiaries";
  setActiveTab: (tab: "credentials" | "beneficiaries") => void;
}

const AllocationTabs: React.FC<AllocationTabsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div 
      className="flex rounded-lg mb-4 p-1"
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    >
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
          activeTab === "credentials" ? "shadow-sm" : ""
        }`}
        onClick={() => setActiveTab("credentials")}
        style={{
          backgroundColor: activeTab === "credentials" ? "var(--bg-card)" : "transparent",
          color: activeTab === "credentials" ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        <KeyIcon className="w-4 h-4 mr-2" />
        By Credentials
      </button>
    </div>
  );
};

export default AllocationTabs;
