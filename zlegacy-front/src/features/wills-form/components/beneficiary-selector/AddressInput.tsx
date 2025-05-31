import React from "react";
import { motion } from "framer-motion";
import BeneficiaryInput from "../../BeneficiaryInput";

interface AddressInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  isRegistered: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  isRegistered,
}) => {
  return (
    <motion.div
      key="enter-address"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-3"
    >
      <BeneficiaryInput value={value} onChange={onChange} />

      {/* Message when address is valid but not registered */}
      {value &&
        value.startsWith("aleo") &&
        value.length > 30 &&
        !isRegistered && (
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: "var(--bg-warning)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              style={{ color: "var(--color-warning)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <div>
              <p className="font-medium">Address not registered</p>
              <p>
                This address is not registered as a beneficiary. Click the
                button below to add it first.
              </p>
            </div>
          </div>
        )}

      <div className="pt-2">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {isRegistered
            ? "This address is registered as a beneficiary."
            : "This address is not registered yet. You can continue with this address directly."}
        </p>
      </div>
    </motion.div>
  );
};

export default AddressInput;
