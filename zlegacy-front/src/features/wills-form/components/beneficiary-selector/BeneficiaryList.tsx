import React from "react";
import { motion } from "framer-motion";
import type { Beneficiary } from "../../types";
import BeneficiaryCard from "./BeneficiaryCard";

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[];
  selectedBeneficiaryIds: Set<string>;
  onSelect: (beneficiary: Beneficiary) => void;
  formatAddress: (address: string) => string;
}

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({
  beneficiaries,
  selectedBeneficiaryIds,
  onSelect,
  formatAddress,
}) => {
  return (
    <motion.div
      key="select-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-3"
    >
      {beneficiaries.length > 0 ? (
        <>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Select beneficiaries to add to your will:
          </p>

          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {beneficiaries.map((beneficiary) => (
              <BeneficiaryCard
                key={beneficiary.id}
                beneficiary={beneficiary}
                isSelected={selectedBeneficiaryIds.has(beneficiary.id)}
                onClick={onSelect}
                formatAddress={formatAddress}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p
            className="mb-2 text-lg font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            No Beneficiaries
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            You haven't added any beneficiaries yet.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BeneficiaryList;
