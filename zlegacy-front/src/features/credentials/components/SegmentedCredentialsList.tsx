import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CredentialItem } from './CredentialItem';
import type { Credential } from '../hooks/useCredentials';

interface SegmentedCredentialsListProps {
  credentials: Credential[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export const SegmentedCredentialsList: React.FC<SegmentedCredentialsListProps> = ({
  credentials,
  onEdit,
  onDelete,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<{id: string, field: string} | null>(null);
  
  // According to our type definition, all credentials are 'standard' type
  const standardCredentials = credentials;
  // Currently no seedphrase credentials as they're not supported in the type
  const seedphraseCredentials: Credential[] = [];
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  const copyToClipboard = (text: string, id: string, field: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField({ id, field });
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };
  
  if (credentials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Standard Credentials Section */}
      {standardCredentials.length > 0 && (
        <section>
          <div className="flex items-center mb-4">
            <div 
              className="w-1 h-6 rounded-full mr-2"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            />
            <h2 
              className="text-xl font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Standard Credentials
              <span 
                className="ml-2 text-sm font-normal rounded-full px-2 py-0.5"
                style={{ 
                  backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)',
                  color: 'var(--accent-primary)'
                }}
              >
                {standardCredentials.length}
              </span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-4"
          >
            {standardCredentials.map(credential => (
              <CredentialItem
                key={credential.id}
                credential={credential}
                expanded={expandedId === credential.id}
                toggleExpand={toggleExpand}
                visiblePasswords={visiblePasswords}
                togglePasswordVisibility={togglePasswordVisibility}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard}
                formatDate={formatDate}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Crypto Wallets Section */}
      {seedphraseCredentials.length > 0 && (
        <section>
          <div className="flex items-center mb-4">
            <div 
              className="w-1 h-6 rounded-full mr-2"
              style={{ backgroundColor: 'var(--accent-secondary)' }}
            />
            <h2 
              className="text-xl font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Crypto Wallets
              <span 
                className="ml-2 text-sm font-normal rounded-full px-2 py-0.5"
                style={{ 
                  backgroundColor: 'rgba(var(--accent-secondary-rgb), 0.1)',
                  color: 'var(--accent-secondary)'
                }}
              >
                {seedphraseCredentials.length}
              </span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-4"
          >
            {seedphraseCredentials.map(credential => (
              <CredentialItem
                key={credential.id}
                credential={credential}
                expanded={expandedId === credential.id}
                toggleExpand={toggleExpand}
                visiblePasswords={visiblePasswords}
                togglePasswordVisibility={togglePasswordVisibility}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard}
                formatDate={formatDate}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
};
