import React from "react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import type { Beneficiary } from "./types";

interface BeneficiaryDetailsProps {
  beneficiary: Beneficiary;
  onClose: () => void;
}

const BeneficiaryDetails: React.FC<BeneficiaryDetailsProps> = ({
  beneficiary,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {beneficiary.name}
            </h3>
            {beneficiary.relation && (
              <span
                className="ml-3 px-3 py-1 text-sm font-medium rounded-full"
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
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Adresse */}
        <div>
          <h4 className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            Address
          </h4>
          <div
            className="font-mono text-sm p-3 rounded-lg break-all"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            {beneficiary.address}
          </div>
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
              Email
            </h4>
            <p style={{ color: "var(--text-primary)" }}>
              {beneficiary.email || "–"}
            </p>
          </div>
          <div>
            <h4 className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
              Phone
            </h4>
            <p style={{ color: "var(--text-primary)" }}>
              {beneficiary.phone || "–"}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h4 className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            Notes
          </h4>
          <p
            className="p-3 rounded-lg min-h-[60px]"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            {beneficiary.notes || "No notes added"}
          </p>
        </div>

        {/* Statistiques */}
        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h4
                className="text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Wills
              </h4>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {beneficiary.wills}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h4
                className="text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Allocation
              </h4>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--accent-primary)" }}
              >
                {beneficiary.allocation}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BeneficiaryDetails;
