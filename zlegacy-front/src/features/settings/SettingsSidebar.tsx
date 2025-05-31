import React from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  PaintBrushIcon,
  BellIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import type { SettingsSection } from "./types";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

interface SidebarItem {
  id: SettingsSection;
  label: string;
  icon: React.ElementType;
  badge?: string | null;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const sidebarItems: SidebarItem[] = [
    { id: "account", label: "Account", icon: UserCircleIcon },
    { id: "appearance", label: "Appearance", icon: PaintBrushIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon, badge: "3" },
    { id: "privacy", label: "Privacy", icon: LockClosedIcon },
  ];

  const itemVariants = {
    rest: { x: 0 },
    hover: { x: 3, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <div
      className="p-4 rounded-xl border shadow-sm"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Version mobile : affichage horizontal pour petits écrans */}
      <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 -mx-1 px-1">
        {sidebarItems.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeSection === id;

          return (
            <motion.button
              key={id}
              whileHover="hover"
              whileTap="tap"
              variants={itemVariants}
              className="flex flex-col items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                backgroundColor: isActive ? "var(--bg-accent)" : "transparent",
                color: isActive
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
                border: isActive
                  ? "1px solid var(--accent-primary)"
                  : "1px solid transparent",
              }}
              onClick={() => onSectionChange(id)}
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-1" />
                {badge && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1rem] h-4 rounded-full text-[10px] font-bold px-1"
                    style={{
                      backgroundColor:
                        badge === "New"
                          ? "var(--accent-tertiary)"
                          : "var(--accent-primary)",
                      color: "white",
                    }}
                  >
                    {badge === "New" ? "N" : badge}
                  </span>
                )}
              </div>
              <span className="text-xs whitespace-nowrap">{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Version desktop : affichage vertical pour grands écrans */}
      <div className="hidden lg:block space-y-1">
        {sidebarItems.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeSection === id;

          return (
            <motion.button
              key={id}
              whileHover="hover"
              whileTap="tap"
              variants={itemVariants}
              className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive ? "var(--bg-accent)" : "transparent",
                color: isActive
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
                borderLeft: isActive
                  ? "2px solid var(--accent-primary)"
                  : "none",
              }}
              onClick={() => onSectionChange(id)}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
              {badge && (
                <span
                  className="flex items-center justify-center min-w-[1.25rem] h-5 rounded-full text-xs font-medium px-1.5"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color:
                      badge === "New"
                        ? "var(--accent-tertiary)"
                        : "var(--accent-primary)",
                    fontWeight: "bold",
                  }}
                >
                  {badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsSidebar;
