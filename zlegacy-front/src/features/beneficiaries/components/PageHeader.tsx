import React from "react";
import { motion } from "framer-motion";
import { Search, X, RefreshCw } from "lucide-react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import Button from "../../../components/ui/Button";
import { UserPlusIcon } from "@heroicons/react/24/outline";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh?: () => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onAdd,
  isLoading = false,
}) => {
  const { connected } = useWallet();

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className="flex items-center">
        <motion.div
          className="w-2 h-12 rounded-full mr-3"
          style={{ backgroundColor: "var(--accent-primary)" }}
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
        {connected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center w-full sm:w-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            <input
              type="text"
              placeholder="Search beneficiaries"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-1.5 pl-9 pr-3 rounded-md text-sm w-full"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 p-1 rounded-full"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {onRefresh && (
            <motion.button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-md flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
            </motion.button>
          )}

          <Button
            onClick={onAdd}
            variant="primary"
            disabled={isLoading}
            leftIcon={<UserPlusIcon className="w-4 h-4" />}
            className="whitespace-nowrap"
          >
            Add Beneficiary
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
