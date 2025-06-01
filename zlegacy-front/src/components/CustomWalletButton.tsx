import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWalletCustom } from "../contexts/wallet";
import {
  WalletIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

const walletButtonClass = `
  hidden absolute opacity-0 
  wallet-adapter-button-trigger
`;

const FormatAddress = ({ address }: { address: string | null }) => {
  if (!address) return null;

  const formatted = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;

  return (
    <span
      className="font-mono"
      data-tooltip-id="full-address-tooltip"
      data-tooltip-content={address}
    >
      {formatted}
    </span>
  );
};

const CustomWalletButton: React.FC = () => {
  const {
    wallet,
    connected,
    connecting,
    disconnecting,
    publicKey,
    disconnect,
  } = useWallet();

  const { userState } = useWalletCustom();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".wallet-dropdown-container")) {
        setShowDropdown(false);
        setShowConfirmDisconnect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
    }
  };

  const handleDisconnect = () => {
    if (showConfirmDisconnect) {
      disconnect();
      setShowDropdown(false);
      setShowConfirmDisconnect(false);
    } else {
      setShowConfirmDisconnect(true);
    }
  };

  const getWalletName = () => {
    if (!wallet) return "Wallet";

    return wallet.adapter.name;
  };

  const getWalletIcon = () => {
    return <WalletIcon className="w-4 h-4" />;
  };

  if (!connected) {
    return (
      <div className="relative inline-block">
        {/* Hidden original button to handle connection */}
        <WalletMultiButton className={walletButtonClass} />

        {/* Our custom button that will trigger click on the original button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center justify-center gap-2 
            bg-gradient-to-r from-blue-600 to-blue-500 
            hover:from-blue-500 hover:to-blue-400
            text-white font-medium py-2 px-4 rounded-lg 
            shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30
            transition-all duration-300
            ${connecting || disconnecting ? "opacity-70 cursor-wait" : ""}
          `}
          onClick={() => {
            // Trigger click on the original button
            document
              .querySelector(".wallet-adapter-button-trigger")
              ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          }}
          disabled={connecting || disconnecting}
        >
          {connecting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              {getWalletIcon()}
              <span className="ml-2">Connect</span>
            </>
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative inline-block wallet-dropdown-container">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-2 
          bg-gradient-to-r from-blue-800/40 to-blue-700/40
          hover:from-blue-700/40 hover:to-blue-600/40
          border border-blue-700/50
          text-white font-medium py-2 px-4 rounded-lg 
          shadow-md
          transition-all duration-200
        `}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {getWalletIcon()}
        <FormatAddress address={publicKey} />
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <Tooltip
        id="full-address-tooltip"
        place="bottom"
        className="z-50 max-w-xs break-all"
      />

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="p-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <div className="flex items-center gap-2">
                {getWalletIcon()}
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {getWalletName()}
                </span>
              </div>
              <div
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--accent-primary-transparent)",
                  border: "1px solid var(--accent-primary-muted)",
                }}
              >
                <span
                  className="text-xs"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Testnet
                </span>
              </div>
            </div>

            {userState.userData && (
              <div
                className="p-3"
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <div
                  className="text-xs mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  User
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userState.userData.firstName} {userState.userData.lastName}
                </div>
              </div>
            )}

            <div
              className="p-3"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <div
                className="text-xs mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Address
              </div>
              <div className="flex items-center justify-between">
                <div
                  className="text-sm font-mono truncate max-w-[200px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {publicKey || "Not connected"}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                  onClick={copyAddress}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      Copied
                    </span>
                  ) : (
                    "Copy"
                  )}
                </motion.button>
              </div>
            </div>

            <div className="p-3">
              <button
                className="w-full py-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
                style={{
                  backgroundColor: showConfirmDisconnect
                    ? "var(--accent-error-transparent)"
                    : "var(--accent-primary-transparent)",
                  color: showConfirmDisconnect
                    ? "var(--accent-error)"
                    : "var(--accent-primary)",
                }}
                onClick={handleDisconnect}
              >
                {showConfirmDisconnect ? (
                  <>
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <span>Confirm Disconnect</span>
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Disconnect</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomWalletButton;
