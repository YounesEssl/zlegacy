import React from "react";
import { motion } from "framer-motion";
import { LockClosedIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import type { TransactionMode } from "./types";

interface TransactionModeSelectorProps {
  selected: TransactionMode;
  onChange: (mode: TransactionMode) => void;
}

interface ModeOption {
  id: TransactionMode;
  label: string;
  icon: React.FC<React.ComponentProps<"svg">>;
  description: string;
  benefits: string[];
}

const TransactionModeSelector: React.FC<TransactionModeSelectorProps> = ({
  selected,
  onChange,
}) => {
  // Define mode options with detailed descriptions and benefits
  const modeOptions: ModeOption[] = [
    {
      id: "private",
      label: "Private Transaction",
      icon: LockClosedIcon,
      description:
        "Your will details will be fully encrypted on the blockchain.",
      benefits: [
        "Complete privacy for your will details",
        "Only designated beneficiaries can access the information",
        "Protected from blockchain analysis and surveillance",
        "Recommended for sensitive asset allocations",
      ],
    },
    {
      id: "public",
      label: "Public Transaction",
      icon: GlobeAltIcon,
      description:
        "Your will will be recorded publicly on the blockchain.",
      benefits: [
        "Greater transparency for your beneficiaries",
        "Easier verification of will validity",
        "Potentially lower transaction fees",
        "Suitable for non-sensitive allocations",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {modeOptions.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.icon;

          return (
            <motion.div
              key={option.id}
              className={`flex-1 relative rounded-xl p-5 cursor-pointer overflow-hidden border-2 hover:scale-[1.01] ${
                isSelected ? "border-opacity-100" : "border-opacity-30"
              }`}
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: isSelected
                  ? "var(--accent-primary)"
                  : "var(--border-color)",
                boxShadow: isSelected
                  ? "0 0 15px rgba(75, 131, 219, 0.15)"
                  : "none",
                transition: "transform 0s",
              }}
              onClick={() => onChange(option.id)}
              whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
            >
              {/* Background gradient effect when selected */}
              {isSelected && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      "radial-gradient(circle at top right, var(--accent-primary), transparent 70%)",
                  }}
                />
              )}

              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-full ${
                    isSelected ? "bg-opacity-100" : "bg-opacity-50"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--accent-primary-transparent)"
                      : "var(--bg-tertiary)",
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{
                      color: isSelected
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3
                    className="font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {option.label}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {option.description}
                  </p>

                  <ul className="space-y-2">
                    {option.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="mr-2 w-1.5 h-1.5 rounded-full inline-block"
                          style={{
                            backgroundColor: isSelected
                              ? "var(--accent-primary)"
                              : "var(--text-muted)",
                          }}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-3 h-3 rounded-full"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionModeSelector;
