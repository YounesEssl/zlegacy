import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import type { TransactionStatus as TransactionStatusType } from "../../types";
import { useWill } from "../../WillContext";

interface TransactionStatusProps {
  transactionData: {
    blockHash: string;
    transactionId: string;
    confirmations: number;
    status: TransactionStatusType;
    progress: number;
  };
}

const TransactionStatusComp: React.FC<TransactionStatusProps> = ({ transactionData }) => {
  const { status, progress, transactionId, blockHash, confirmations } = transactionData;
  
  // Get will data from context
  const { 
    beneficiaryAllocations, 
    assetAllocations, 
    credentialAllocations, 
    credentials,
    cryptoBalance,
    transactionMode
  } = useWill();

  // Ne pas afficher si nous n'avons pas encore soumis la transaction
  if (!transactionId || status === "pending" && progress === 0) {
    return null;
  }
  
  // Calculate total allocated USD value
  let totalAllocatedValueUSD = 0;
  if (cryptoBalance?.assets && assetAllocations.length > 0) {
    assetAllocations.forEach(allocation => {
      const asset = cryptoBalance.assets?.find(a => a.symbol === allocation.assetSymbol);
      if (asset) {
        const assetUsdRate = asset.usdValue / asset.balance;
        totalAllocatedValueUSD += allocation.amount * assetUsdRate;
      }
    });
  }
  
  // Count unique assets allocated
  const uniqueAssetsAllocated = Array.from(new Set(assetAllocations.map(alloc => alloc.assetSymbol))).length;
  
  // Format USD amount with no decimals
  const formatUsdAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  };

  // Obtenir l'icône et les couleurs en fonction du statut
  const getStatusContent = () => {
    switch (status) {
      case "confirmed":
        return {
          icon: <CheckCircleIcon className="w-5 h-5" />,
          color: "var(--accent-success)",
          label: "Transaction Confirmed",
          description: "Your will has been successfully recorded on the blockchain."
        };
      case "failed":
        return {
          icon: <ExclamationCircleIcon className="w-5 h-5" />,
          color: "var(--accent-danger)",
          label: "Transaction Failed",
          description: "There was an error recording your will on the blockchain."
        };
      case "confirming":
        return {
          icon: <ArrowPathIcon className="w-5 h-5 animate-spin" />,
          color: "var(--accent-primary)",
          label: "Waiting for Confirmations",
          description: `${confirmations}/6 confirmations received.`
        };
      default:
        return {
          icon: <ArrowPathIcon className="w-5 h-5 animate-spin" />,
          color: "var(--accent-primary)",
          label: "Processing Transaction",
          description: "Your will is being recorded on the blockchain."
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="space-y-4">
      {/* Transaction Success Card with animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border overflow-hidden" 
        style={{ borderColor: statusContent.color, borderWidth: "2px" }}
      >
        {/* Success header with gradient */}
        <div 
          className="p-4 relative overflow-hidden"
          style={{ 
            background: status === "confirmed" 
              ? "linear-gradient(to right, var(--accent-success-darker), var(--accent-success))" 
              : status === "failed"
                ? "linear-gradient(to right, var(--accent-danger-darker), var(--accent-danger))"
                : "linear-gradient(to right, var(--accent-primary-darker), var(--accent-primary))",
            color: "white"
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white transform -translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white transform translate-x-8 translate-y-8"></div>
          </div>
          
          <div className="relative z-10 flex items-center">
            <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-full">
              {statusContent.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{statusContent.label}</h3>
              <p className="text-sm opacity-90">{statusContent.description}</p>
            </div>
          </div>
        </div>
        
        {/* Will Summary */}
        {status === "confirmed" && (
          <div className="p-4 bg-opacity-5" style={{ backgroundColor: "var(--accent-success-transparent)" }}>
            <h4 className="font-semibold text-sm mb-3 flex items-center" style={{ color: "var(--text-primary)" }}>
              <DocumentCheckIcon className="w-4 h-4 mr-2" style={{ color: "var(--accent-success)" }} />
              Will Summary
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-2" style={{ color: "var(--accent-success)" }} />
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Beneficiaries</div>
                  <div className="font-medium" style={{ color: "var(--text-primary)" }}>{beneficiaryAllocations.length}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-4 h-4 mr-2" style={{ color: "var(--accent-success)" }} />
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Assets Allocated</div>
                  <div className="font-medium" style={{ color: "var(--text-primary)" }}>{uniqueAssetsAllocated} / {cryptoBalance?.assets?.length || 0}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <LockClosedIcon className="w-4 h-4 mr-2" style={{ color: "var(--accent-success)" }} />
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Credentials</div>
                  <div className="font-medium" style={{ color: "var(--text-primary)" }}>{credentialAllocations.length} / {credentials.length}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <ShieldCheckIcon className="w-4 h-4 mr-2" style={{ color: "var(--accent-success)" }} />
                <div>
                  <div style={{ color: "var(--text-muted)" }}>Privacy Mode</div>
                  <div className="font-medium" style={{ color: "var(--text-primary)" }}>{transactionMode === "private" ? "Private" : "Public"}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between items-center">
                <div style={{ color: "var(--text-secondary)" }}>Total Value Allocated</div>
                <div className="font-bold text-lg" style={{ color: "var(--accent-success)" }}>
                  {formatUsdAmount(totalAllocatedValueUSD)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress tracking */}
        <div className="p-4 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Blockchain Confirmation
            </div>
            <div className="text-xs font-medium" style={{ color: statusContent.color }}>
              {progress}%
            </div>
          </div>
          
          <div className="overflow-hidden h-2 text-xs flex rounded bg-opacity-20" style={{ backgroundColor: `${statusContent.color}30` }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
              style={{ backgroundColor: statusContent.color }}
            />
          </div>
          
          {status === "confirming" && (
            <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {confirmations}/6 confirmations received
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Transaction Details Card */}
      <div className="rounded-lg border p-4" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex items-center mb-3">
          <ClipboardDocumentIcon className="w-5 h-5 mr-2" style={{ color: "var(--accent-primary)" }} />
          <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Transaction Details
          </h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Transaction ID
            </div>
            <div className="text-xs break-all p-2 rounded flex items-center gap-2" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-secondary)" }}>
              <span className="truncate">{transactionId}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Block Hash
            </div>
            <div className="text-xs break-all p-2 rounded" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-secondary)" }}>
              {blockHash}
            </div>
          </div>
          
          <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Creation Date</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusComp;
