import React from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  isAlert?: boolean;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  isAlert = false,
  children,
}) => {
  return (
    <div
      className={`rounded-xl p-6 border ${isAlert ? "border-red-500/20" : ""}`}
      style={{
        backgroundColor: isAlert
          ? "rgba(239, 68, 68, 0.05)"
          : "var(--bg-secondary)",
        borderColor: isAlert ? "var(--accent-error)" : "var(--border-color)",
      }}
    >
      <div className="mb-5">
        <h2
          className="text-lg font-bold"
          style={{
            color: isAlert ? "var(--accent-error)" : "var(--text-primary)",
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SettingsSection;
