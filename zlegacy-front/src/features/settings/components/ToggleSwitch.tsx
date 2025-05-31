import React from "react";
import { motion } from "framer-motion";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  // Définir les dimensions pour différentes tailles
  let width, height, thumbSize, translateX;
  
  switch (size) {
    case "sm":
      width = "w-8"; // 2rem = 32px
      height = "h-4"; // 1rem = 16px
      thumbSize = "w-3 h-3"; // 0.75rem = 12px
      translateX = 16; // Distance à déplacer en pixels
      break;
    case "lg":
      width = "w-14"; // 3.5rem = 56px
      height = "h-7"; // 1.75rem = 28px
      thumbSize = "w-6 h-6"; // 1.5rem = 24px
      translateX = 28; // Distance à déplacer en pixels
      break;
    default: // md
      width = "w-11"; // 2.75rem = 44px
      height = "h-6"; // 1.5rem = 24px
      thumbSize = "w-5 h-5"; // 1.25rem = 20px
      translateX = 20; // Distance à déplacer en pixels
  }

  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`${width} ${height} flex items-center rounded-full px-0.5 cursor-pointer relative ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{
        backgroundColor: checked ? "var(--accent-primary)" : "var(--bg-tertiary)",
        border: `1px solid ${checked ? "var(--accent-primary)" : "var(--border-color)"}`,
        transition: "background-color 0.2s, border-color 0.2s"
      }}
    >
      <motion.div
        className={`${thumbSize} rounded-full shadow-md absolute ${disabled ? "cursor-not-allowed" : ""}`}
        initial={false}
        animate={{
          left: checked ? translateX : 2,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          backgroundColor: checked ? "white" : "var(--text-muted)",
          transition: "background-color 0.2s"
        }}
      />
    </div>
  );
};

export default ToggleSwitch;
