import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import CreateWillForm from "../features/wills-form/CreateWillForm";
import BeneficiariesComponent from "../components/BeneficiariesComponent";
import DashboardComponent from "../components/DashboardComponent";
import SettingsLayout from "../features/settings/SettingsLayout.js";
import { WillsPage } from "../features/wills";
import WillDetailsPage from "../features/wills/WillDetailsPage";

import {
  HomeIcon,
  DocumentIcon,
  UsersIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { CredentialsPage } from "../features/credentials/components/CredentialsPage.js";

const mobileNavItems = [
  { label: "Dashboard", icon: HomeIcon, route: "dashboard" },
  { label: "Wills", icon: DocumentIcon, route: "wills" },
  { label: "Credentials", icon: LockClosedIcon, route: "credentials" },
  { label: "Beneficiaries", icon: UsersIcon, route: "beneficiaries" },
  { label: "Settings", icon: Cog6ToothIcon, route: "settings" },
];

const HomePage: React.FC = () => {
  const { publicKey } = useWallet();

  const navigate = useNavigate();
  const { page = "dashboard" } = useParams<{ page: string }>();

  const location = useLocation();
  const isEditPage = location.pathname.startsWith("/wills/edit/");
  const isDetailsPage = location.pathname.match(/^\/wills\/[^/]+$/);
  const willId =
    isEditPage || isDetailsPage ? location.pathname.split("/").pop() : null;

  const validPages = [
    "dashboard",
    "create",
    "wills",
    "credentials",
    "beneficiaries",
    "security",
    "settings",
    "history",
    "docs",
  ];
  const active = isDetailsPage
    ? "willDetails"
    : isEditPage
    ? "edit"
    : validPages.includes(page)
    ? page
    : "dashboard";

  const setActive = (route: string) => {
    navigate(`/${route}`);
  };
  useEffect(() => {
    const handleOnline = () => console.log("Application is online");
    const handleOffline = () => console.log("Application is offline");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const BottomNav = () => (
    <nav
      className="fixed bottom-0 left-0 right-0 flex lg:hidden justify-around border-t py-2 z-40"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        borderColor: "var(--border-color)",
      }}
    >
      {mobileNavItems.map(({ label, icon: Icon, route }) => (
        <button
          key={route}
          className="flex flex-col items-center px-2 py-1 text-xs font-medium transition-colors duration-150 focus:outline-none"
          style={{
            color:
              active === route ? "var(--accent-primary)" : "var(--text-muted)",
          }}
          onClick={() => setActive(route)}
        >
          <Icon className="w-6 h-6 mb-0.5" />
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <main
          className="flex-1 flex flex-col items-center px-4 pt-6 pb-24 md:pb-6 overflow-y-auto"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {active === "dashboard" && (
            <div className="w-full py-4 px-1 md:px-4">
              <DashboardComponent />
            </div>
          )}
          {active === "create" && (
            <div className="w-full py-4 px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-[95%] mx-auto"
              >
                <CreateWillForm testatorAddress={publicKey || ""} />
              </motion.div>
            </div>
          )}
          {active === "edit" && (
            <div className="w-full py-4 px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-[95%] mx-auto"
              >
                <CreateWillForm
                  testatorAddress={publicKey || ""}
                  willIdToEdit={willId}
                />
              </motion.div>
            </div>
          )}
          {active === "wills" && (
            <div className="w-full py-4 px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto"
              >
                <WillsPage />
              </motion.div>
            </div>
          )}
          {active === "willDetails" && willId && (
            <div className="w-full py-4 px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <WillDetailsPage />
              </motion.div>
            </div>
          )}
          {active === "credentials" && (
            <div className="w-full py-4 px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto w-full"
              >
                <CredentialsPage />
              </motion.div>
            </div>
          )}
          {active === "beneficiaries" && (
            <div className="w-full py-4 px-1 md:px-4">
              <BeneficiariesComponent />
            </div>
          )}
          {active === "settings" && (
            <div className="w-full py-4 px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto"
              >
                <SettingsLayout />
              </motion.div>
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default HomePage;
