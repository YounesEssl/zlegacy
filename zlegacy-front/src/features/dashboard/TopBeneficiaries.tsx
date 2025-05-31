import React from "react";
import { motion } from "framer-motion";
import type { BeneficiarySummary } from "./types";
import { UsersIcon } from "@heroicons/react/24/solid";

interface TopBeneficiariesProps {
  beneficiaries: BeneficiarySummary[];
}

const TopBeneficiaries: React.FC<TopBeneficiariesProps> = ({
  beneficiaries,
}) => {
  return (
    <div className="nexa-card p-5">
      <div className="flex items-center mb-5">
        <UsersIcon
          className="w-5 h-5 mr-3"
          style={{ color: "var(--accent-primary)" }}
        />
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Top Beneficiaries
        </h2>
      </div>

      <div className="space-y-4">
        {beneficiaries.map((beneficiary) => (
          <motion.div
            key={beneficiary.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-lg p-3 cursor-pointer"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full mr-3 flex items-center justify-center font-bold"
                  style={{
                    background:
                      "linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))",
                    color: "white",
                  }}
                >
                  {beneficiary.name.charAt(0)}
                </div>
                <div>
                  <div
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {beneficiary.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {beneficiary.wills} will
                    {beneficiary.wills !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div
                className="px-2 py-1 rounded-md font-medium"
                style={{
                  backgroundColor: "var(--bg-accent)",
                  color: "var(--accent-primary)",
                }}
              >
                {beneficiary.allocation}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopBeneficiaries;
