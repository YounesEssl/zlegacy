import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, ExternalLink, Clock, Copy, Wallet, LockKeyhole } from 'lucide-react';
import { ToggleReveal } from './ToggleReveal';
import type { Credential } from '../hooks/useCredentials';

interface CredentialItemProps {
  credential: Credential;
  expanded: boolean;
  toggleExpand: (id: string) => void;
  visiblePasswords: Record<string, boolean>;
  togglePasswordVisibility: (id: string) => void;
  copiedField: {id: string, field: string} | null;
  copyToClipboard: (text: string, id: string, field: string) => void;
  formatDate: (dateString: string) => string;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
  gridView?: boolean;
}

export const CredentialItem: React.FC<CredentialItemProps> = ({
  credential,
  expanded,
  toggleExpand,
  visiblePasswords,
  togglePasswordVisibility,
  copiedField,
  copyToClipboard,
  formatDate,
  onEdit,
  onDelete,
  gridView = false,
}) => {
  const isWallet = credential.type === 'seedphrase';
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg overflow-hidden shadow-sm ${
        expanded ? (isWallet ? 'ring-2 ring-accent-secondary' : 'ring-2 ring-accent-primary') : ''
      } ${gridView ? 'h-full flex flex-col' : ''}`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
      layout
    >
      <div
        className="p-4 cursor-pointer flex items-start justify-between"
        onClick={() => toggleExpand(credential.id)}
      >
        <div className="flex-1 flex items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
            style={{ 
              backgroundColor: isWallet 
                ? 'rgba(var(--accent-secondary-rgb), 0.15)' 
                : 'rgba(var(--accent-primary-rgb), 0.15)'
            }}
          >
            {isWallet ? (
              <Wallet 
                size={18} 
                style={{ 
                  color: 'var(--accent-secondary)'
                }} 
              />
            ) : (
              <LockKeyhole 
                size={18} 
                style={{ 
                  color: 'var(--accent-primary)'
                }} 
              />
            )}
          </div>
          <div>
            <h3 
              className="font-medium text-lg" 
              style={{ color: 'var(--text-primary)' }}
            >
              {credential.title}
            </h3>
            <p 
              className="text-sm mt-1 truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isWallet ? (
                <>
                  {credential.walletType} Wallet
                  {credential.username && ` • ${credential.username}`}
                </>
              ) : (
                credential.username
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(credential);
            }}
            className="p-1.5 rounded-full transition-colors z-10"
            style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 size={16} style={{ color: 'var(--text-muted)' }} />
          </motion.button>
          
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(credential.id);
            }}
            className="p-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444'
            }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: 'rgba(239, 68, 68, 0.2)'
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div 
            className="p-4 pt-0 space-y-3"
            style={{
              borderTop: '1px solid var(--border-color)',
            }}
          >
            {isWallet ? (
              // Crypto wallet specific details
              <>
                <div className="flex justify-between items-center">
                  <div 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Wallet Type
                  </div>
                </div>
                <div 
                  className="p-2 rounded"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>
                    {credential.walletType || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Recovery Phrase
                  </div>
                  <div className="flex items-center space-x-1">
                    <motion.button
                      onClick={() => copyToClipboard(credential.seedphrase || '', credential.id, 'seedphrase')}
                      className="p-1 rounded-full transition-colors"
                      style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedField?.id === credential.id && copiedField?.field === 'seedphrase' ? (
                        <span 
                          className="text-xs font-medium"
                          style={{ color: 'var(--success)' }}
                        >
                          Copied!
                        </span>
                      ) : (
                        <Copy size={14} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </motion.button>
                    <ToggleReveal
                      initialVisible={visiblePasswords[credential.id] || false}
                      onToggle={() => togglePasswordVisibility(credential.id)}
                      size="sm"
                    />
                  </div>
                </div>
                <div 
                  className="p-2 rounded font-mono text-sm"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  {visiblePasswords[credential.id] ? (
                    <span style={{ color: 'var(--text-primary)' }}>
                      {credential.seedphrase || 'Not available'}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>•••• •••• •••• •••• •••• ••••</span>
                  )}
                </div>
                
                {credential.derivationPath && (
                  <>
                    <div className="flex justify-between items-center">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Derivation Path
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(credential.derivationPath || '', credential.id, 'path')}
                        className="p-1 rounded-full transition-colors"
                        style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copiedField?.id === credential.id && copiedField?.field === 'path' ? (
                          <span 
                            className="text-xs font-medium"
                            style={{ color: 'var(--success)' }}
                          >
                            Copied!
                          </span>
                        ) : (
                          <Copy size={14} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </motion.button>
                    </div>
                    <div 
                      className="p-2 rounded font-mono text-sm"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>
                        {credential.derivationPath}
                      </span>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Standard credential details
              <>
                <div className="flex justify-between items-center">
                  <div 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Username
                  </div>
                  <motion.button
                    onClick={() => copyToClipboard(credential.username, credential.id, 'username')}
                    className="p-1 rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField?.id === credential.id && copiedField?.field === 'username' ? (
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--success)' }}
                      >
                        Copied!
                      </span>
                    ) : (
                      <Copy size={14} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </motion.button>
                </div>
                <div 
                  className="p-2 rounded"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>
                    {credential.username}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Password
                  </div>
                  <div className="flex items-center space-x-1">
                    <motion.button
                      onClick={() => copyToClipboard(credential.password, credential.id, 'password')}
                      className="p-1 rounded-full transition-colors"
                      style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedField?.id === credential.id && copiedField?.field === 'password' ? (
                        <span 
                          className="text-xs font-medium"
                          style={{ color: 'var(--success)' }}
                        >
                          Copied!
                        </span>
                      ) : (
                        <Copy size={14} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </motion.button>
                    <ToggleReveal
                      initialVisible={visiblePasswords[credential.id] || false}
                      onToggle={() => togglePasswordVisibility(credential.id)}
                      size="sm"
                    />
                  </div>
                </div>
                <div 
                  className="p-2 rounded"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  {visiblePasswords[credential.id] ? (
                    <span style={{ color: 'var(--text-primary)' }}>
                      {credential.password}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>••••••••••••</span>
                  )}
                </div>
                
                {credential.website && (
                  <>
                    <div className="flex justify-between items-center">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Website
                      </div>
                      <div className="flex items-center">
                        <motion.a
                          href={credential.website.startsWith('http') ? credential.website : `https://${credential.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-full transition-colors"
                          style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
                        </motion.a>
                      </div>
                    </div>
                    <div 
                      className="p-2 rounded"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <span 
                        className="text-sm truncate block"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {credential.website}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
            
            {credential.notes && (
              <>
                <div 
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Notes
                </div>
                <div 
                  className="p-2 rounded"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <p 
                    className="text-sm whitespace-pre-wrap"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {credential.notes}
                  </p>
                </div>
              </>
            )}
            
            <div 
              className="flex items-center text-xs pt-2 border-t mt-2"
              style={{ 
                color: 'var(--text-muted)',
                borderColor: 'var(--border-color)'
              }}
            >
              <Clock size={12} className="mr-1" />
              Last updated: {formatDate(credential.lastUpdated)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
