import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWill } from '../../WillContext';
import type { Wallet, Beneficiary } from '../../types';

interface WalletBeneficiarySelectorProps {
  wallet: Wallet;
  onCancel: () => void;
}

const WalletBeneficiarySelector: React.FC<WalletBeneficiarySelectorProps> = ({ wallet, onCancel }) => {
  const { addWalletAllocation, removeWalletAllocation, walletAllocations, beneficiaries = [] } = useWill();
  
  // Find current allocation for this wallet
  const currentAllocation = walletAllocations.find(a => a.walletId === wallet.id);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(
    currentAllocation?.beneficiaryId || ''
  );

  const handleSave = () => {
    if (selectedBeneficiaryId) {
      // First remove any existing allocation
      walletAllocations.find(a => a.walletId === wallet.id) && removeWalletAllocation(wallet.id);
      
      // Then add the new allocation
      addWalletAllocation({
        walletId: wallet.id,
        beneficiaryId: selectedBeneficiaryId
      });
    } else {
      // If no beneficiary selected, remove the allocation
      walletAllocations.find(a => a.walletId === wallet.id) && removeWalletAllocation(wallet.id);
    }
    
    onCancel(); // Close the selector
  };

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiaryId(beneficiary.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-lg p-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Assign Beneficiary for {wallet.name}
      </h2>
      
      <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Select a beneficiary who will receive this wallet when your will is executed.
      </p>
      
      {beneficiaries.length === 0 ? (
        <div className="text-center py-6">
          <p style={{ color: 'var(--text-secondary)' }}>
            You need to add beneficiaries first.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto py-2">
          {beneficiaries.map((beneficiary: Beneficiary) => (
            <div 
              key={beneficiary.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors`}
              style={{ 
                backgroundColor: selectedBeneficiaryId === beneficiary.id ? 'var(--color-primary-600)' : 'transparent'
              }}
              onClick={() => handleSelectBeneficiary(beneficiary)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: beneficiary.relationColor || 'var(--accent-secondary)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--text-on-accent)' }}>
                      {beneficiary.name ? beneficiary.name.substring(0, 1).toUpperCase() : 'B'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {beneficiary.name || beneficiary.address.substring(0, 10) + '...'}
                    </h4>
                    {beneficiary.relation && (
                      <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                        {beneficiary.relation}
                      </p>
                    )}
                  </div>
                </div>
                <div 
                  className="w-5 h-5 rounded-full border-2"
                  style={{ 
                    borderColor: selectedBeneficiaryId === beneficiary.id 
                      ? 'var(--accent-primary)' 
                      : 'var(--border-color)',
                    backgroundColor: selectedBeneficiaryId === beneficiary.id 
                      ? 'var(--accent-primary)' 
                      : 'transparent'
                  }}
                >
                  {selectedBeneficiaryId === beneficiary.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'white' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-md"
          style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-on-accent)' }}
        >
          {currentAllocation ? 'Update' : 'Assign'} Beneficiary
        </button>
      </div>
    </motion.div>
  );
};

export default WalletBeneficiarySelector;
