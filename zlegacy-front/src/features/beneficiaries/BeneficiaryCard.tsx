import React from "react";
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Beneficiary } from "./types";

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  isSelected: boolean;
  onSelect: (beneficiary: Beneficiary) => void;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (id: string) => void;
}

const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        bg-[#1A1A1A] rounded-xl border overflow-hidden group cursor-pointer
        ${
          isSelected
            ? "border-blue-500 shadow-lg shadow-blue-500/10"
            : "border-gray-800 hover:border-gray-700"
        }
      `}
      onClick={() => onSelect(beneficiary)}
      style={{
        backgroundColor: "var(--bg-tertiary)",
        borderColor: isSelected
          ? "var(--accent-primary)"
          : "var(--border-color)",
        boxShadow: isSelected ? "0 4px 14px rgba(75, 131, 219, 0.15)" : "none",
      }}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <h3
              className="font-bold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              {beneficiary.name}
            </h3>
            {beneficiary.relation && (
              <span
                className="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: `${beneficiary.relationColor || '#6B7280'}20`,
                  color: beneficiary.relationColor || '#6B7280',
                  border: `1px solid ${beneficiary.relationColor || '#6B7280'}40`,
                }}
              >
                {beneficiary.relation.charAt(0).toUpperCase() + beneficiary.relation.slice(1)}
              </span>
            )}  
          </div>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(beneficiary);
              }}
              className="p-1 rounded-md hover:bg-gray-800 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(beneficiary.id);
              }}
              className="p-1 rounded-md hover:bg-red-500/20 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-grow space-y-2">
          <div
            className="font-mono text-sm px-2 py-1 rounded-md"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-muted)",
            }}
          >
            {formatAddress(beneficiary.address)}
          </div>

          {beneficiary.email && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {beneficiary.email}
            </p>
          )}

          {beneficiary.notes && (
            <p
              className="text-sm italic"
              style={{ color: "var(--text-muted)" }}
            >
              {beneficiary.notes}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between text-xs">
            <div
              className="flex items-center space-x-1"
              style={{ color: "var(--text-muted)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--accent-primary)" }}
              ></div>
              <span>
                {beneficiary.wills} will
                {beneficiary.wills !== 1 ? "s" : ""}
              </span>
            </div>

            {beneficiary.allocation !== undefined && (
              <span
                className="font-medium"
                style={{ color: "var(--accent-primary)" }}
              >
                {beneficiary.allocation}% allocated
              </span>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <div
          className="px-4 py-3 flex justify-between items-center border-t"
          style={{
            backgroundColor: "rgba(75, 131, 219, 0.1)",
            borderColor: "rgba(75, 131, 219, 0.2)",
          }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: "var(--accent-primary)" }}
          >
            Details
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Added on {beneficiary.createdAt}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default BeneficiaryCard;
