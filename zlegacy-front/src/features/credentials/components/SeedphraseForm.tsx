import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FieldGroup } from './FieldGroup';
import type { Credential } from '../hooks/useCredentials';

// Liste des types de portefeuilles les plus courants
const WALLET_TYPES = [
  { id: 'ethereum', name: 'Ethereum (ETH)', path: "m/44'/60'/0'/0/0" },
  { id: 'bitcoin', name: 'Bitcoin (BTC)', path: "m/44'/0'/0'/0/0" },
  { id: 'aleo', name: 'Aleo (ALEO)', path: "m/44'/0'/0'/0/0" },
  { id: 'solana', name: 'Solana (SOL)', path: "m/44'/501'/0'/0'" },
  { id: 'polkadot', name: 'Polkadot (DOT)', path: "m/44'/354'/0'/0/0" },
  { id: 'cardano', name: 'Cardano (ADA)', path: "m/1852'/1815'/0'/0/0" },
  { id: 'other', name: 'Autre', path: '' },
];

interface SeedphraseFormProps {
  onSubmit: (data: Omit<Credential, 'id' | 'lastUpdated'>) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<Credential>;
  isEdit?: boolean;
}

export const SeedphraseForm: React.FC<SeedphraseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<Credential>>({    
    type: 'seedphrase',
    username: '', // Used as the wallet name
    walletType: 'ethereum',
    seedphrase: '',
    derivationPath: WALLET_TYPES[0].path,
    notes: '',
    ...initialData,
  });
  
  // State to manage individual seedphrase words
  const [seedphraseWords, setSeedphraseWords] = useState<string[]>(
    (initialData?.seedphrase || '').split(/\s+/).filter(Boolean).length > 0 
      ? (initialData?.seedphrase || '').split(/\s+/).filter(Boolean)
      : Array(12).fill('')
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSeedphrase, setShowSeedphrase] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Automatic update of the derivation path when the wallet type changes
    if (name === 'walletType' && value !== 'other') {
      const selectedWallet = WALLET_TYPES.find(wallet => wallet.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        derivationPath: selectedWallet?.path || prev.derivationPath
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username?.trim()) {
      newErrors.username = 'Wallet name is required';
    }
    
    // Validate the seedphrase words
    const filledWords = seedphraseWords.filter(word => word.trim().length > 0);
    if (filledWords.length === 0) {
      newErrors.seedphrase = 'Recovery phrase is required';
    } else if (filledWords.length !== seedphraseWords.length) {
      newErrors.seedphrase = `All word fields must be filled (${filledWords.length}/${seedphraseWords.length} filled)`;
    }
    
    if (formData.walletType === 'other' && !formData.derivationPath?.trim()) {
      newErrors.derivationPath = 'Derivation path is required for this wallet type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle changes to seedphrase word inputs
  const handleSeedphraseWordChange = (index: number, value: string) => {
    const newWords = [...seedphraseWords];
    newWords[index] = value;
    setSeedphraseWords(newWords);
    
    // Update the full seedphrase in formData
    const fullSeedphrase = newWords.join(' ');
    setFormData(prev => ({ ...prev, seedphrase: fullSeedphrase }));
    
    // Clear error if it exists
    if (errors.seedphrase) {
      setErrors(prev => ({ ...prev, seedphrase: '' }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a title based on wallet type and name if not provided
      const title = `${formData.walletType} Wallet - ${formData.username}`;
      
      const success = await onSubmit({
        title: title,
        type: 'seedphrase',
        username: formData.username!, // Wallet name
        password: '', // Empty string but still provided to satisfy the type
        walletType: formData.walletType,
        seedphrase: seedphraseWords.join(' '),
        derivationPath: formData.derivationPath,
        notes: formData.notes,
      });
      
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Error submitting seedphrase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 shadow-sm"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">        
        <h2 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Wallet' : 'Add New Wallet'}
        </h2>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="p-1.5 rounded-md transition-colors"
        style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
        aria-label="Close form"
      >
        <X size={18} style={{ color: 'var(--text-muted)' }} />
      </button>

      {/* Warning banner */}
      <div 
        className="mb-6 p-4 rounded-lg flex items-start space-x-3"
        style={{ 
          backgroundColor: 'rgba(var(--warning-rgb), 0.1)',
          border: '1px solid var(--warning)'
        }}
      >
        <AlertCircle size={20} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Important Information
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Recovery phrases (seedphrases) are extremely sensitive. They will be encrypted before storage, but never share them outside of this application.
          </p>
        </div>
      </div>

      <FieldGroup
        label="Wallet Name"
        htmlFor="username"
        error={errors.username}
      >
        <input
          id="username"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md outline-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.username ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="e.g. Main Wallet"
        />
      </FieldGroup>

      <FieldGroup
        label="Wallet Type"
        htmlFor="walletType"
        error={errors.walletType}
      >
        <select
          id="walletType"
          name="walletType"
          value={formData.walletType || 'ethereum'}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md outline-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.walletType ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
        >
          {WALLET_TYPES.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </FieldGroup>

      <FieldGroup
        label="Recovery Phrase"
        htmlFor="seedphrase"
        error={errors.seedphrase}
        required={true}
        description="Enter each word of your seed phrase in order"
      >
        <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
          {seedphraseWords.map((word, index) => (
            <div key={`word-${index}`} className="relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs"
                   style={{ color: 'var(--text-muted)' }}>
                {index + 1}.
              </div>
              <input
                id={`seedphrase-word-${index}`}
                value={word}
                onChange={(e) => handleSeedphraseWordChange(index, e.target.value)}
                className="w-full p-2 pl-7 rounded-md outline-none font-mono text-sm"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: errors.seedphrase ? '1px solid var(--error)' : '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder={`Word ${index + 1}`}
                type={showSeedphrase ? 'text' : 'password'}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={() => setShowSeedphrase(!showSeedphrase)}
            className="flex items-center gap-1 text-xs p-1 rounded hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-muted)' }}
          >
            {showSeedphrase ? (
              <>
                <EyeOff size={14} />
                <span>Hide words</span>
              </>
            ) : (
              <>
                <Eye size={14} />
                <span>Show words</span>
              </>
            )}
          </button>
        </div>
      </FieldGroup>

      {formData.walletType === 'other' && (
        <FieldGroup
          label="Derivation Path"
          htmlFor="derivationPath"
          error={errors.derivationPath}
          required={formData.walletType === 'other'}
          description="Standard format for BIP44 derivation path"
        >
          <input
            id="derivationPath"
            name="derivationPath"
            value={formData.derivationPath || ''}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md outline-none font-mono"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)',
              border: errors.derivationPath ? '1px solid var(--error)' : '1px solid var(--border-color)', 
              color: 'var(--text-primary)'
            }}
            placeholder="m/44'/60'/0'/0/0"
          />
        </FieldGroup>
      )}
      

      
      <FieldGroup
        label="Notes"
        htmlFor="notes"
        error={errors.notes}
        description="Additional information about this wallet"
      >
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-2.5 rounded-md outline-none resize-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.notes ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="Additional information..."
        />
      </FieldGroup>
      
      <div className="flex justify-end space-x-3 mt-6">
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)' 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          Cancel
        </motion.button>
        
        <motion.button
          type="submit"
          className="px-4 py-2 rounded-md flex items-center"
          style={{ 
            backgroundColor: 'var(--accent-primary)',
            color: 'white' 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          <Save size={18} className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save'}
        </motion.button>
      </div>
    </motion.form>
  );
};
