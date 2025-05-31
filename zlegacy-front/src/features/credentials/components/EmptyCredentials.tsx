import React from 'react';
import { KeyRound, Search, FileQuestion, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImportButton } from './ImportButton';

interface EmptyCredentialsProps {
  onAddNew: () => void;
  connected: boolean;
  isFiltered?: boolean;
  searchTerm?: string;
  onImport?: (data: any[]) => Promise<boolean>;
}

export const EmptyCredentials: React.FC<EmptyCredentialsProps> = ({ 
  onAddNew, 
  connected, 
  isFiltered = false,
  searchTerm = '',
  onImport
}) => {
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div 
          className="p-4 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)' }}
        >
          <KeyRound size={40} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Wallet Not Connected</h2>
        <p className="text-center max-w-md mb-6" style={{ color: 'var(--text-secondary)' }}>
          Connect your Aleo wallet to securely store and manage your credentials on the blockchain.
        </p>
      </div>
    );
  }

  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div 
          className="p-4 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
        >
          <Search size={40} style={{ color: 'var(--text-muted)' }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No matching credentials</h2>
        <p className="text-center max-w-md mb-6" style={{ color: 'var(--text-secondary)' }}>
          No credentials match your search for "{searchTerm}". Try a different search term or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div 
        className="p-4 rounded-full mb-4"
        style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)' }}
      >
        <FileQuestion size={40} style={{ color: 'var(--accent-primary)' }} />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Stored Credentials</h2>
      <p className="text-center max-w-md mb-6" style={{ color: 'var(--text-secondary)' }}>
        Securely store your passwords, usernames, and other credentials encrypted on the Aleo blockchain.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <motion.button
          onClick={onAddNew}
          className="px-5 py-2 rounded-md flex items-center justify-center"
          style={{ 
            backgroundColor: 'var(--accent-primary)',
            color: 'white'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <KeyRound size={18} className="mr-2" />
          Add New Credential
        </motion.button>
        
        {onImport && (
          <motion.div
            className="px-5 py-2 rounded-md flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UploadCloud size={18} className="mr-2" style={{ color: 'var(--text-secondary)' }} />
            <ImportButton onImport={onImport} inline />
          </motion.div>
        )}
      </div>
    </div>
  );
};
