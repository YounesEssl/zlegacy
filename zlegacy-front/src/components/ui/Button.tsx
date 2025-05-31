import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  children,
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-xl flex items-center justify-center transition-all";

  // Styles avec variables CSS pour compatibilité avec les thèmes
  const getVariantClasses = () => {
    return {
      primary:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25",
      secondary: "hover:bg-opacity-80 transition-all duration-200",
      outline: "bg-transparent hover:bg-opacity-10 transition-all duration-200",
    };
  };

  // Obtention des classes de variante
  const variantClasses = getVariantClasses();

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2.5",
    lg: "text-lg px-6 py-3",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Style dynamique en fonction de la variante
  const getStyle = () => {
    switch (variant) {
      case "primary":
        return {};
      case "secondary":
        return {
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-primary)",
        };
      case "outline":
        return {
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || isLoading ? disabledClasses : ""}
        ${className}
      `}
      style={getStyle()}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}

      {children}

      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
