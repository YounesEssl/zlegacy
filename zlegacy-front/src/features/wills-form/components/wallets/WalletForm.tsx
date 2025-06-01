import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { Wallet } from '../../types';

type WalletFormData = Omit<Wallet, 'id' | 'createdAt'>;

interface WalletFormProps {
  initialData?: Wallet | null;
  onSave: (data: WalletFormData) => void;
  onCancel: () => void;
}

const WALLET_TYPES = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'solana', name: 'Solana' },
  { id: 'bsc', name: 'Binance Smart Chain' },
  { id: 'aleo', name: 'Aleo' },
  { id: 'other', name: 'Other' }
];

const WalletForm: React.FC<WalletFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<WalletFormData>({
    name: initialData?.name || '',
    type: initialData?.type || WALLET_TYPES[0].id,
    privateKey: initialData?.privateKey || '',
    publicAddress: initialData?.publicAddress || '',
    additionalInfo: initialData?.additionalInfo || '',
  });

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Validate form data
  const isFormValid = !!formData.name && !!formData.type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-lg p-6 mb-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        {initialData ? 'Edit Wallet' : 'Add New Wallet'}
      </h2>
      
      <div className="bg-opacity-50 p-4 mb-6 rounded-lg flex items-center" style={{ backgroundColor: 'var(--bg-highlight)' }}>
        <ShieldCheckIcon className="h-6 w-6 mr-3" style={{ color: 'var(--accent-primary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your wallet data is secured with encryption and stored directly in the smart contract.
          We never store your private keys on our servers.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Wallet Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="My Bitcoin Wallet"
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Wallet Type*
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            required
          >
            {WALLET_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="privateKey" className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Private Key
          </label>
          <div className="relative">
            <input
              id="privateKey"
              name="privateKey"
              type={showPrivateKey ? "text" : "password"}
              value={formData.privateKey}
              onChange={handleChange}
              placeholder="Enter your wallet's private key"
              className="w-full p-2 rounded-md pr-10"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              style={{ color: 'var(--text-secondary)' }}
            >
              {showPrivateKey ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="publicAddress" className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Public Address
          </label>
          <input
            id="publicAddress"
            name="publicAddress"
            type="text"
            value={formData.publicAddress}
            onChange={handleChange}
            placeholder="Enter your wallet's public address"
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="additionalInfo" className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Additional Information
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Enter any additional information about this wallet (e.g., storage location, hardware wallet info, etc.)"
            rows={3}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          />
        </div>

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
            type="submit"
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-md ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-on-accent)' }}
          >
            {initialData ? 'Update' : 'Save'} Wallet
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default WalletForm;
