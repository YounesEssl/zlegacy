import React from "react";
import { motion } from "framer-motion";
import {
  HomeIcon,
  DocumentPlusIcon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  DocumentPlusIcon as DocumentPlusSolidIcon,
  UsersIcon as UsersSolidIcon,
  Cog6ToothIcon as CogSolidIcon,
} from "@heroicons/react/24/solid";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

interface SidebarProps {
  active: string;
  onNavigate: (route: string) => void;
}

const getSidebarItems = (isConnected: boolean) => [
  {
    label: "Dashboard",
    icon: HomeIcon,
    activeIcon: HomeSolidIcon,
    route: "dashboard",
    badge: null,
  },
  {
    label: "Create Will",
    icon: DocumentPlusIcon,
    activeIcon: DocumentPlusSolidIcon,
    route: "create",
    badge: null,
  },
  {
    label: "Beneficiaries",
    icon: UsersIcon,
    activeIcon: UsersSolidIcon,
    route: "beneficiaries",
    badge: isConnected ? null : "3",
  },
  {
    label: "Settings",
    icon: Cog6ToothIcon,
    activeIcon: CogSolidIcon,
    route: "settings",
    badge: null,
  },
];

const secondaryNavItems = [
  { label: "History", icon: DocumentDuplicateIcon, route: "history" },
];

const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate }) => {
  // Check if the wallet is connected
  const { connected } = useWallet();

  // Get the appropriate navigation items based on wallet connection status
  const primaryNavItems = getSidebarItems(connected);
  
  // Animation variants for menu items
  const itemVariants = {
    hover: { x: 3, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <aside
      className="hidden md:flex flex-col justify-between w-56 h-full border-r py-6 px-3 sticky top-0"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="space-y-4">
        <div className="mb-6">
          <div
            className="h-0.5 w-10 bg-gradient-to-r rounded-full mb-2"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--accent-primary), transparent)",
            }}
          ></div>
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Main Menu
          </p>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1.5">
          {primaryNavItems.map(
            ({ label, icon: Icon, activeIcon: ActiveIcon, route, badge }) => {
              const isActive = active === route;
              const IconToUse = isActive ? ActiveIcon : Icon;

              return (
                <motion.button
                  key={route}
                  whileHover="hover"
                  whileTap="tap"
                  variants={itemVariants}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? "var(--bg-accent)"
                      : "transparent",
                    color: isActive
                      ? "var(--accent-primary)"
                      : "var(--text-secondary)",
                    borderLeft: isActive
                      ? "2px solid var(--accent-primary)"
                      : "none",
                  }}
                  onClick={() => onNavigate(route)}
                >
                  <div className="flex items-center space-x-3">
                    <IconToUse className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className="flex items-center justify-center min-w-[1.25rem] h-5 rounded-full text-xs font-medium px-1.5"
                      style={{
                        backgroundColor:
                          badge === "New"
                            ? "var(--bg-tertiary)"
                            : "var(--bg-tertiary)",
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
            }
          )}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-6 space-y-1">
          <div className="mb-2">
            <div
              className="h-0.5 w-8 bg-gradient-to-r rounded-full mb-2"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--text-muted), transparent)",
              }}
            ></div>
            <p
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Tools
            </p>
          </div>

          {secondaryNavItems.map(({ label, icon: Icon, route }) => {
            const isActive = active === route;

            return (
              <motion.button
                key={route}
                whileHover="hover"
                whileTap="tap"
                variants={itemVariants}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150"
                style={{
                  backgroundColor: isActive
                    ? "var(--bg-accent)"
                    : "transparent",
                  color: isActive
                    ? "var(--text-secondary)"
                    : "var(--text-muted)",
                }}
                onClick={() => onNavigate(route)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
