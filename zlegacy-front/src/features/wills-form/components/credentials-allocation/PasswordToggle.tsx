import React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({ 
  isVisible, 
  onToggle,
  size = "md" 
}) => {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  
  return (
    <button
      onClick={onToggle}
      className="p-1 rounded-md transition-colors hover:bg-opacity-10 hover:bg-gray-500"
      style={{ color: "var(--text-secondary)" }}
      aria-label={isVisible ? "Hide password" : "Show password"}
      type="button"
    >
      {isVisible ? (
        <EyeSlashIcon className={iconSize} />
      ) : (
        <EyeIcon className={iconSize} />
      )}
    </button>
  );
};

export default PasswordToggle;
