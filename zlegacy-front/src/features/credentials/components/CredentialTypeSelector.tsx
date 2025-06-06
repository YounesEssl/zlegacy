import React from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole } from 'lucide-react';

interface CredentialTypeSelectorProps {
  selectedType: 'standard';
  onSelectType: (type: 'standard') => void;
}

export const CredentialTypeSelector: React.FC<CredentialTypeSelectorProps> = ({
  selectedType,
  onSelectType
}) => {
  return (
    <div className="mb-6">
      <h3 
        className="text-sm font-medium mb-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        Type of credential to add
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <motion.button
          type="button"
          onClick={() => onSelectType('standard')}
          className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
            selectedType === 'standard' ? 'ring-2' : ''
          }`}
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            boxShadow: selectedType === 'standard' ? '0 0 0 2px var(--accent-primary)' : 'none',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ 
              backgroundColor: selectedType === 'standard' 
                ? 'var(--accent-primary)' 
                : 'rgba(var(--text-muted-rgb), 0.1)'
            }}
          >
            <LockKeyhole 
              size={20} 
              style={{ 
                color: selectedType === 'standard' 
                  ? 'white' 
                  : 'var(--text-secondary)'
              }} 
            />
          </div>
          <div className="text-left">
            <h4 
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Standard Credential
            </h4>
            <p 
              className="text-xs mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Username, password, website...
            </p>
          </div>
        </motion.button>
        
        {/* L'option wallet credential a été supprimée */}
      </div>
    </div>
  );
};
