import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import type { Beneficiary } from "../../types";

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  isSelected: boolean;
  onClick: (beneficiary: Beneficiary) => void;
  formatAddress: (address: string) => string;
}

const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
  isSelected,
  onClick,
  formatAddress,
}) => {
  return (
    <div
      key={beneficiary.id}
      className={`relative p-3 rounded-lg transition-all duration-200 flex justify-between items-center cursor-pointer border group ${isSelected ? "ring-1 border-opacity-100" : "border-opacity-70 hover:border-opacity-100 hover:scale-[1.01] hover:shadow-md"}`}
      style={{
        backgroundColor: isSelected
          ? `${beneficiary.relationColor || "#0EA5E9"}15`
          : "var(--bg-secondary)",
        borderColor: isSelected
          ? beneficiary.relationColor || "#0EA5E9"
          : "var(--border-color)",
        boxShadow: isSelected
          ? `0 0 0 1px ${beneficiary.relationColor || "#0EA5E9"}40`
          : "none",
      }}
      onClick={() => onClick(beneficiary)}
    >
      <div className="flex gap-3 items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{
            backgroundColor: beneficiary.relationColor || "#6B7280",
          }}
        >
          {beneficiary.name
            ? beneficiary.name.charAt(0).toUpperCase()
            : beneficiary.address.charAt(5).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {beneficiary.name || "Unnamed Beneficiary"}
            </h3>
            {beneficiary.relation && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${
                    beneficiary.relationColor || "#6B7280"
                  }20`,
                  color: beneficiary.relationColor || "#6B7280",
                  border: `1px solid ${
                    beneficiary.relationColor || "#6B7280"
                  }40`,
                }}
              >
                {beneficiary.relation.charAt(0).toUpperCase() +
                  beneficiary.relation.slice(1)}
              </span>
            )}
          </div>
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {formatAddress(beneficiary.address)}
          </p>
          {beneficiary.description && (
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {beneficiary.description.substring(0, 80)}
              {beneficiary.description.length > 80 ? "..." : ""}
            </p>
          )}
        </div>
      </div>
      <div className="transition-transform duration-200 group-hover:scale-110">
        <PlusCircleIcon
          className="w-5 h-5 transition-colors duration-200"
          style={{ color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)" }}
        />
      </div>
    </div>
  );
};

export default BeneficiaryCard;
