import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useWill } from '../WillContext';
import type { Wallet } from '../types';
import WalletForm from './wallets/WalletForm';
import WalletList from './wallets/WalletList';
import WalletBeneficiarySelector from './wallets/WalletBeneficiarySelector';

interface WalletsStepProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const WalletsStep: React.FC<WalletsStepProps> = ({ goToNextStep, goToPreviousStep }) => {
  const { wallets, addWallet, updateWallet, beneficiaries } = useWill();
  
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);

  const handleAddWallet = () => {
    setCurrentWallet(null);
    setIsAddingWallet(true);
  };

  const handleEditWallet = (wallet: Wallet) => {
    setCurrentWallet(wallet);
    setIsAddingWallet(true);
  };

  const handleAllocateWallet = (wallet: Wallet) => {
    setCurrentWallet(wallet);
    setIsAllocating(true);
  };

  const handleSaveWallet = (walletData: Omit<Wallet, 'id' | 'createdAt'>) => {
    if (currentWallet) {
      // Update existing wallet
      updateWallet(currentWallet.id, walletData);
    } else {
      // Create new wallet
      const newWallet: Wallet = {
        ...walletData,
        id: Math.random().toString(36).substring(2, 12), // Simple ID generation
        createdAt: new Date().toISOString(),
      };
      
      addWallet(newWallet);
    }
    
    setIsAddingWallet(false);
    setCurrentWallet(null);
  };

  const handleCancel = () => {
    setIsAddingWallet(false);
    setIsAllocating(false);
    setCurrentWallet(null);
  };

  const canContinue = wallets.length > 0;

  if (isAddingWallet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-3xl mx-auto"
      >
        <WalletForm 
          initialData={currentWallet}
          onSave={handleSaveWallet}
          onCancel={handleCancel}
        />
      </motion.div>
    );
  }

  if (isAllocating && currentWallet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-3xl mx-auto"
      >
        <WalletBeneficiarySelector
          wallet={currentWallet}
          onCancel={handleCancel}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Wallet Information
        </h2>
        <p className="text-base mb-4" style={{ color: 'var(--text-secondary)' }}>
          Add any crypto wallets you wish to include in your testament
        </p>
      </div>

      <div className="bg-opacity-50 p-4 mb-6 rounded-lg flex items-center" style={{ backgroundColor: 'var(--bg-highlight)' }}>
        <ShieldExclamationIcon className="h-6 w-6 mr-3" style={{ color: 'var(--accent-primary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your wallet information is never stored on our servers. All data is encrypted and will be stored directly on the blockchain.
        </p>
      </div>

      {wallets.length > 0 ? (
        <WalletList 
          wallets={wallets}
          beneficiaries={beneficiaries}
          onEdit={handleEditWallet}
          onAllocate={handleAllocateWallet}
        />
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center mb-6"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="mb-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
            You haven't added any wallets yet
          </p>
          <button
            onClick={handleAddWallet}
            className="inline-flex items-center px-4 py-2 rounded-md"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-on-accent)' }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Wallet
          </button>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAddWallet}
            className="inline-flex items-center px-4 py-2 rounded-md"
            style={{ backgroundColor: 'var(--accent-secondary)', color: 'var(--text-on-accent)' }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Another Wallet
          </button>
        </div>
      )}

      <div className="mt-10 flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 rounded-md"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          Back
        </button>
        <button
          onClick={goToNextStep}
          disabled={!canContinue}
          className={`px-6 py-2 rounded-md ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: canContinue ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: 'var(--text-on-accent)' }}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default WalletsStep;
