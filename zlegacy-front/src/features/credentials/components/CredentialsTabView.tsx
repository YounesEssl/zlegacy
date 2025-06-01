import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CredentialItem } from './CredentialItem';
import type { Credential } from '../types';

// Interface supprimée car les options de filtres ont été retirées

interface CredentialsTabViewProps {
  credentials: Credential[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export const CredentialsTabView: React.FC<CredentialsTabViewProps> = ({
  credentials,
  onEdit,
  onDelete,
}) => {
  // Les états pour les tabs et filtres ont été supprimés
  
  // Visibility states
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<{id: string, field: string} | null>(null);
  
  // Nous n'avons plus besoin d'extraire les types de wallet
  
  // Aucun filtrage n'est nécessaire maintenant
  
  // Sort credentials par nom (alphabétique)
  const sortedCredentials = [...credentials].sort((a, b) => {
    // Tri alphabétique par nom
    const valA = a.name.toLowerCase();
    const valB = b.name.toLowerCase();
    
    // Ordre ascendant par défaut
    const sortMultiplier = 1;
    
    if (valA < valB) return -1 * sortMultiplier;
    if (valA > valB) return 1 * sortMultiplier;
    return 0;
  });
  
  // Toggle functions
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Nous n'avons plus besoin de filtrer par type de wallet
  
  // Fonction de réinitialisation des filtres supprimée
  
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
  
  // Nous n'avons plus besoin de compter les types car il n'y a que des credentials standard
  
  // Return null if no credentials
  if (credentials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Les tabs et boutons de filtres ont été supprimés */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Credentials
          <span 
            className="ml-2 text-xs rounded-full px-2 py-0.5 align-middle"
            style={{ 
              backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)',
              color: 'var(--text-muted)'
            }}
          >
            {credentials.length}
          </span>
        </h3>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Manage your passwords and login information
        </p>
      </div>
      
      {/* Credentials Grid/List */}
      {sortedCredentials.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 space-y-3"
        >
          {sortedCredentials.map(credential => (
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
      )}
    </div>
  );
};
