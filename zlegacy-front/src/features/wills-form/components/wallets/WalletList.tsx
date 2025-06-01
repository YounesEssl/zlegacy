import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, UserIcon } from '@heroicons/react/24/outline';
import type { Wallet, Beneficiary } from '../../types';

interface WalletListProps {
  wallets: Wallet[];
  onEdit: (wallet: Wallet) => void;
  onAllocate: (wallet: Wallet) => void;
  beneficiaries: Beneficiary[];
}

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  onEdit,
  onAllocate,
  beneficiaries
}) => {
  // Helper to get wallet type display name
  const getWalletTypeName = (typeId: string) => {
    const walletTypes: Record<string, string> = {
      'ethereum': 'Ethereum',
      'bitcoin': 'Bitcoin',
      'solana': 'Solana',
      'bsc': 'Binance Smart Chain',
      'aleo': 'Aleo',
      'other': 'Other'
    };
    return walletTypes[typeId] || typeId;
  };

  // Helper to get beneficiary name by ID
  const getBeneficiaryName = (beneficiaryId?: string) => {
    if (!beneficiaryId) return null;
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    return beneficiary ? beneficiary.name || beneficiary.address.substring(0, 10) + '...' : null;
  };

  if (wallets.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
          No wallets added yet
        </p>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Add your first wallet to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wallets.map((wallet) => (
        <motion.div
          key={wallet.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {wallet.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {getWalletTypeName(wallet.type)}
              </p>
              
              {wallet.publicAddress && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Address: {wallet.publicAddress.substring(0, 15)}...
                </p>
              )}
              
              {getBeneficiaryName(wallet.beneficiaryId) && (
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: 'var(--bg-highlight)', color: 'var(--accent-primary)' }}
                >
                  <UserIcon className="h-3 w-3 mr-1" />
                  Assigned to: {getBeneficiaryName(wallet.beneficiaryId)}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(wallet)}
                className="p-1 rounded-full"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                title="Edit wallet"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onAllocate(wallet)}
                className="p-1 rounded-full"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                title="Assign beneficiary"
              >
                <UserIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WalletList;
