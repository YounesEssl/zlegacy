import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowTopRightOnSquareIcon, ShieldCheckIcon, ClockIcon, KeyIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import type { BeneficiaryAllocation, TransactionMode } from '../types';
import { useWill } from '../WillContext';

interface CompleteStepProps {
  beneficiaryAllocations: BeneficiaryAllocation[];
  transactionMode: TransactionMode;
  transactionData: {
    blockHash: string;
    transactionId: string;
    confirmations: number;
    status: 'pending' | 'confirming' | 'confirmed' | 'failed';
    progress: number;
  };
}

/**
 * Composant affiché lorsque la création du testament est terminée
 */
const CompleteStep: React.FC<CompleteStepProps> = ({
  beneficiaryAllocations,
  transactionMode,
  transactionData
}) => {
  const { assetAllocations, credentialAllocations } = useWill();
  
  // Format date for transaction timestamp
  const formatDate = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);
  };
  
  // Get status info based on transaction status
  const getStatusDetails = () => {
    const { status, confirmations } = transactionData;
    
    switch (status) {
      case 'confirmed':
        return {
          bgColor: "rgba(34, 197, 94, 0.1)",
          textColor: "var(--accent-success)",
          icon: <CheckIcon className="h-8 w-8" style={{ color: "var(--accent-success)" }} />,
          title: "Will Created Successfully",
          description: "Your will has been successfully created and recorded on the blockchain.",
          statusText: `Confirmed (${confirmations} confirmations)`
        };
      case 'failed':
        return {
          bgColor: "rgba(239, 68, 68, 0.1)",
          textColor: "var(--accent-danger)",
          icon: <CheckIcon className="h-8 w-8" style={{ color: "var(--accent-danger)" }} />,
          title: "Transaction Failed",
          description: "There was a problem creating your will. Please try again.",
          statusText: "Failed"
        };
      default:
        return {
          bgColor: "rgba(75, 131, 219, 0.1)",
          textColor: "var(--accent-primary)",
          icon: <ClockIcon className="h-8 w-8" style={{ color: "var(--accent-primary)" }} />,
          title: "Processing Transaction",
          description: "Your will is being created. This process may take a few minutes.",
          statusText: "In progress"
        };
    }
  };
  
  // Count unique assets allocated
  const uniqueAssetsCount = useMemo(() => {
    // Simplify the count of unique assets 
    const uniqueAssets = new Set<string>();
    
    if (assetAllocations) {
      assetAllocations.forEach(asset => {
        if (asset.percentage > 0) {
          uniqueAssets.add(asset.assetSymbol);
        }
      });
    }
    
    return uniqueAssets.size;
  }, [assetAllocations]);
  
  // Count credentials allocated to beneficiaries
  const credentialsCount = (() => {
    if (!credentialAllocations) return 0;
    return credentialAllocations.filter(cred => cred.beneficiaryId).length;
  })();
  
  const statusDetails = getStatusDetails();
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };
  
  // Item animations for cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      key="complete-step"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Main header with status icon */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ backgroundColor: statusDetails.bgColor }}
        >
          {statusDetails.icon}
        </div>
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {statusDetails.title}
        </h2>
        <p
          className="mt-2 max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          {statusDetails.description}
        </p>
      </motion.div>

      {/* Will Summary Card */}
      <motion.div
        className="rounded-lg border shadow-sm p-4"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Will Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Beneficiaries */}
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: "var(--accent-primary)" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Beneficiaries
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {beneficiaryAllocations.length}
              </p>
            </div>
          </div>
          
          {/* Assets */}
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: "var(--accent-success)" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Assets Allocated
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {uniqueAssetsCount}
              </p>
            </div>
          </div>
          
          {/* Credentials */}
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(234, 179, 8, 0.1)" }}
            >
              <KeyIcon className="w-5 h-5" style={{ color: "var(--accent-warning)" }} />
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Allocated Credentials
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {credentialsCount}
              </p>
            </div>
          </div>
          
          {/* Privacy Mode */}
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{ 
                backgroundColor: transactionMode === "private" 
                  ? "rgba(34, 197, 94, 0.1)" 
                  : "rgba(75, 131, 219, 0.1)" 
              }}
            >
              <ShieldCheckIcon 
                className="w-5 h-5" 
                style={{ 
                  color: transactionMode === "private" 
                    ? "var(--accent-success)" 
                    : "var(--accent-primary)" 
                }} 
              />
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Mode
              </p>
              <p
                className="text-xl font-bold capitalize"
                style={{ 
                  color: transactionMode === "private" 
                    ? "var(--accent-success)" 
                    : "var(--accent-primary)" 
                }}
              >
                {transactionMode}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span 
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Transaction Progress
            </span>
            <span 
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {transactionData.progress}%
            </span>
          </div>
          <div 
            className="w-full h-2 rounded-full overflow-hidden" 
            style={{ backgroundColor: "var(--bg-input)" }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${transactionData.progress}%`,
                backgroundColor: statusDetails.textColor 
              }}
            ></div>
          </div>
        </div>
        
        {/* Creation date */}
        <div className="text-center mt-6">
          <p 
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Created on {formatDate()}
          </p>
        </div>
      </motion.div>

      {/* Transaction Details Card */}
      <motion.div
        className="rounded-lg border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
      >
        <div 
          className="p-3 border-b" 
          style={{ borderColor: "var(--border-color)" }}
        >
          <h4
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Transaction Details
          </h4>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Transaction ID:
            </span>
            <a
              href={`https://explorer.aleo.org/transaction/${transactionData.transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs font-mono hover:underline"
              style={{ color: "var(--accent-primary)" }}
            >
              {transactionData.transactionId.substring(0, 10)}...{transactionData.transactionId.substring(transactionData.transactionId.length - 6)}
              <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Block Hash:
            </span>
            <a
              href={`https://explorer.aleo.org/block/${transactionData.blockHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs font-mono hover:underline"
              style={{ color: "var(--accent-primary)" }}
            >
              {transactionData.blockHash.substring(0, 10)}...{transactionData.blockHash.substring(transactionData.blockHash.length - 6)}
              <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Status:
            </span>
            <span
              className="text-xs font-medium px-2 py-1 rounded"
              style={{ 
                backgroundColor: statusDetails.bgColor,
                color: statusDetails.textColor
              }}
            >
              {statusDetails.statusText}
            </span>
          </div>
        </div>
        
        <div className="p-3 border-t bg-gradient-to-r from-transparent via-slate-50 to-transparent dark:via-slate-800">
          <a
            href={`https://explorer.aleo.org/transaction/${transactionData.transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-sm font-medium transition-colors"
            style={{ color: "var(--accent-primary)" }}
          >
            View Full Details on Explorer
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
      </motion.div>

      {/* Placeholder pour d'autres informations si nécessaire */}

      {/* Action Button */}
      <motion.div 
        className="flex justify-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={() => (window.location.href = "/")}
          variant="primary"
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CompleteStep;
