import React from "react";
import type { InputHTMLAttributes } from "react";

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  id: string;
  description?: string;
  icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  description,
  className = "",
  icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
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
        <input
          id={id}
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${className}`}
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
            borderWidth: "1px",
            borderStyle: "solid",
            // ringColor n'est pas une propriété CSS valide, elle est appliquée via focus:ring-2 en Tailwind
            cursor: props.disabled ? "not-allowed" : "text",
            opacity: props.disabled ? 0.7 : 1,
          }}
          {...props}
        />
        {icon}
      </div>
    </div>
  );
};

export default FormField;
