import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface BeneficiaryInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

const BeneficiaryInput: React.FC<BeneficiaryInputProps> = ({
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Simulate Aleo address validation
  const validateAddress = (address: string): boolean => {
    // This is a simple placeholder for Aleo address validation
    // In a real implementation, you'd use a proper validation function
    return address.startsWith("aleo") && address.length >= 16;
  };

  // Valider l'adresse uniquement lorsque la valeur change
  useEffect(() => {
    if (value) {
      const valid = validateAddress(value);
      setIsValid(valid);
      setErrorMessage(valid ? "" : "Invalid Aleo address format");
    } else {
      setIsValid(null);
      setErrorMessage("");
    }
  }, [value]);
  
  // Notifier le parent des changements de validation
  useEffect(() => {
    // N'appeler onChange que lorsque isValid change, pas à chaque rendu
    if (value) {
      onChange(value, isValid || false);
    } else {
      onChange("", false);
    }
  }, [value, isValid]);

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "var(--text-secondary)" }}
      >
        Beneficiary Address
      </label>

      <div
        className="relative rounded-xl border transition-all duration-200"
        style={{
          borderColor:
            isValid === false
              ? "var(--accent-error)"
              : isValid === true
              ? "var(--accent-tertiary)"
              : isFocused
              ? "var(--accent-primary)"
              : "var(--border-color)",
          boxShadow: isFocused ? "0 8px 16px rgba(75, 131, 219, 0.15)" : "none",
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value, isValid || false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter Aleo address (aleo...)"
          className="w-full py-3 px-4 pr-12 rounded-xl focus:outline-none placeholder:text-gray-400"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {value && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isValid ? (
                <CheckCircleIcon
                  className="h-6 w-6"
                  style={{ color: "var(--accent-tertiary)" }}
                />
              ) : (
                <XCircleIcon
                  className="h-6 w-6"
                  style={{ color: "var(--accent-error)" }}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatedErrorMessage show={!!errorMessage} message={errorMessage} />
    </div>
  );
};

interface AnimatedErrorMessageProps {
  show: boolean;
  message: string;
}

const AnimatedErrorMessage: React.FC<AnimatedErrorMessageProps> = ({
  show,
  message,
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: show ? "auto" : 0,
        opacity: show ? 1 : 0,
      }}
      className="overflow-hidden"
    >
      {show && (
        <p className="text-sm" style={{ color: "var(--accent-error)" }}>
          {message}
        </p>
      )}
    </motion.div>
  );
};

export default BeneficiaryInput;
