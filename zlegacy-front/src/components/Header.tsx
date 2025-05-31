import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DocumentPlusIcon,
  DocumentIcon,
  UsersIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import "@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css";
import CustomWalletButton from "./CustomWalletButton";
import CryptoBalanceDisplay from "./wallet/CryptoBalanceDisplay";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import useCryptoBalance from "../hooks/useCryptoBalance";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { connected } = useWallet();
  const {
    balanceData,
    isLoading,
    refreshBalance,
  } = useCryptoBalance();

  const navigate = useNavigate();
  const location = useLocation();

  // Extract current page from URL
  const currentPage = location.pathname.substring(1) || "dashboard";

  // Définition des animations
  const activeTabColor = "var(--accent-primary)";
  const inactiveTabColor = "var(--text-secondary)";
  const activeTabBgColor = "var(--accent-primary-transparent)";
  const hoverBgColor = "rgba(59, 130, 246, 0.08)";

  // Styles des onglets
  const getTabStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? activeTabBgColor : "transparent",
    color: isActive ? activeTabColor : inactiveTabColor,
  });



  return (
    <header
      className="w-full h-auto min-h-16 flex flex-wrap items-center justify-between px-3 sm:px-4 lg:px-6 py-2 lg:py-3 sticky top-0 z-30 border-b backdrop-blur-md shadow-lg gap-2"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Logo and branding - Cliquable pour accéder au Dashboard */}
      <div 
        className="flex items-center space-x-1 flex-shrink-0 cursor-pointer group"
        onClick={() => navigate("/dashboard")}
      >
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="mr-2 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg"
        >
          <span className="text-white font-bold text-lg">N</span>
        </motion.div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 group-hover:scale-105 transition-transform">
            ZLegacy
          </span>
          <span
            className="text-[10px] -mt-1 font-semibold tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            ALEO WILLS
          </span>
        </div>
      </div>

      {/* Center - Navigation tabs */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-4 overflow-x-auto">
        {/* Navigation links */}
        <div className="flex space-x-2 mx-auto">

          <motion.div 
            className="relative" 
            whileHover={{ scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={getTabStyle(currentPage === "dashboard")}
              whileHover={{
                backgroundColor: currentPage === "dashboard" ? activeTabBgColor : hoverBgColor,
                color: currentPage === "dashboard" ? activeTabColor : "#3b82f6",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </motion.button>
            
            {/* Indicateur d'onglet */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 mx-auto rounded-full"
              initial={{ width: currentPage === "dashboard" ? "100%" : "0%", opacity: currentPage === "dashboard" ? 1 : 0 }}
              animate={{ width: currentPage === "dashboard" ? "100%" : "0%", opacity: currentPage === "dashboard" ? 1 : 0 }}
              whileHover={{ width: "80%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>

          <motion.div 
            className="relative" 
            whileHover={{ scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.button
              onClick={() => navigate("/wills")}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={getTabStyle(currentPage === "wills")}
              whileHover={{
                backgroundColor: currentPage === "wills" ? activeTabBgColor : hoverBgColor,
                color: currentPage === "wills" ? activeTabColor : "#3b82f6",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <DocumentIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Wills</span>
            </motion.button>
            
            {/* Indicateur d'onglet */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 mx-auto rounded-full"
              initial={{ width: currentPage === "wills" ? "100%" : "0%", opacity: currentPage === "wills" ? 1 : 0 }}
              animate={{ width: currentPage === "wills" ? "100%" : "0%", opacity: currentPage === "wills" ? 1 : 0 }}
              whileHover={{ width: "80%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>

          <motion.div 
            className="relative" 
            whileHover={{ scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.button
              onClick={() => navigate("/credentials")}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={getTabStyle(currentPage === "credentials")}
              whileHover={{
                backgroundColor: currentPage === "credentials" ? activeTabBgColor : hoverBgColor,
                color: currentPage === "credentials" ? activeTabColor : "#3b82f6",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <LockClosedIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Credentials</span>
            </motion.button>
            
            {/* Indicateur d'onglet */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 mx-auto rounded-full"
              initial={{ width: currentPage === "credentials" ? "100%" : "0%", opacity: currentPage === "credentials" ? 1 : 0 }}
              animate={{ width: currentPage === "credentials" ? "100%" : "0%", opacity: currentPage === "credentials" ? 1 : 0 }}
              whileHover={{ width: "80%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>

          <motion.div 
            className="relative" 
            whileHover={{ scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.button
              onClick={() => navigate("/beneficiaries")}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={getTabStyle(currentPage === "beneficiaries")}
              whileHover={{
                backgroundColor: currentPage === "beneficiaries" ? activeTabBgColor : hoverBgColor,
                color: currentPage === "beneficiaries" ? activeTabColor : "#3b82f6",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <UsersIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Beneficiaries</span>
            </motion.button>
            
            {/* Indicateur d'onglet */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 mx-auto rounded-full"
              initial={{ width: currentPage === "beneficiaries" ? "100%" : "0%", opacity: currentPage === "beneficiaries" ? 1 : 0 }}
              animate={{ width: currentPage === "beneficiaries" ? "100%" : "0%", opacity: currentPage === "beneficiaries" ? 1 : 0 }}
              whileHover={{ width: "80%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>

          <motion.div 
            className="relative" 
            whileHover={{ scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={getTabStyle(currentPage === "settings")}
              whileHover={{
                backgroundColor: currentPage === "settings" ? activeTabBgColor : hoverBgColor,
                color: currentPage === "settings" ? activeTabColor : "#3b82f6",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Cog6ToothIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </motion.button>
            
            {/* Indicateur d'onglet */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 mx-auto rounded-full"
              initial={{ width: currentPage === "settings" ? "100%" : "0%", opacity: currentPage === "settings" ? 1 : 0 }}
              animate={{ width: currentPage === "settings" ? "100%" : "0%", opacity: currentPage === "settings" ? 1 : 0 }}
              whileHover={{ width: "80%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Right - User actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto lg:ml-0">
        {/* Create a Will button - CTA principal avec effet de hover amélioré */}
        <div className="hidden sm:block relative overflow-hidden rounded-lg">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/create")}
            className="flex items-center space-x-2.5 pl-3 pr-5 py-2.5 rounded-lg shadow-md transition-all duration-100 relative z-10 overflow-hidden group"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Effet de brillance au survol */}
            <span
              className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-500 ease-out"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
            />
            <DocumentPlusIcon className="w-5 h-5 transform group-hover:rotate-6 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Create a Will</span>
          </motion.button>
        </div>

        {/* Version mobile - Icône uniquement avec effet de pulse */}
        <div className="sm:hidden relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/create")}
            className="flex items-center justify-center p-2 rounded-lg transition-all duration-75 relative z-10"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
              color: "white",
            }}
            aria-label="Create a Will"
          >
            <DocumentPlusIcon className="w-5 h-5" />
          </motion.button>
          <span
            className="absolute inset-0 rounded-lg bg-white opacity-10 animate-ping"
            style={{
              animationDuration: "2s",
              animationIterationCount: "infinite",
            }}
          />
        </div>

        {/* Balance display */}
        {connected && (
          <div
            className="mr-1 sm:mr-3 order-1 sm:order-none relative group"
          >
            <CryptoBalanceDisplay
              assets={balanceData?.assets || []}
              totalBalanceUsd={balanceData?.totalBalanceUsd || 0}
              isLoading={isLoading}
              onRefresh={refreshBalance}
            />
          </div>
        )}

        {/* Wallet connection avec design personnalisé */}
        <div className="order-0 sm:order-none">
          <CustomWalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
