import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Option {
  label: string;
  value: any;
}

interface SelectFieldProps {
  label: string;
  id: string;
  value: any;
  options: Option[];
  onChange: (value: any) => void;
  description?: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  options,
  onChange,
  description,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trouver l'option sélectionnée
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  // Fermer le menu déroulant si l'utilisateur clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: "auto" },
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </label>
      {description && (
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      )}
      <div className="relative">
        <div
          className={`w-full px-4 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span>{selectedOption.label}</span>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            style={{ color: "var(--text-secondary)" }}
          />
        </div>

        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 z-10 mt-1 rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="max-h-60 overflow-auto py-1">
                {options.map((option) => (
                  <div
                    key={option.label}
                    className="px-4 py-2 hover:cursor-pointer transition-colors"
                    style={{
                      backgroundColor:
                        option.value === value
                          ? "var(--bg-accent)"
                          : "transparent",
                      color:
                        option.value === value
                          ? "var(--accent-primary)"
                          : "var(--text-primary)",
                    }}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SelectField;
