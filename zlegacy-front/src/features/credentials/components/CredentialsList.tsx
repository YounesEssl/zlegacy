import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ExternalLink, Clock, Copy } from 'lucide-react';
import { ToggleReveal } from './ToggleReveal';
import type { Credential } from '../hooks/useCredentials';

interface CredentialListProps {
  credentials: Credential[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export const CredentialList: React.FC<CredentialListProps> = ({
  credentials,
  onEdit,
  onDelete,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<{id: string, field: string} | null>(null);
  
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
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  
  const listVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    },
  };

  if (credentials.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={listVariants}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {credentials.map((credential) => (
        <motion.div
          key={credential.id}
          variants={cardVariants}
          transition={{ duration: 0.3 }}
          className={`bg-card border border-border rounded-lg overflow-hidden shadow-sm ${
            expandedId === credential.id ? 'ring-2 ring-primary' : ''
          }`}
          layout
        >
          <div
            className="p-4 cursor-pointer flex items-start justify-between"
            onClick={() => toggleExpand(credential.id)}
          >
            <div className="flex-1">
              <h3 className="font-medium text-lg">{credential.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {credential.username}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(credential);
                }}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit2 size={16} className="text-muted-foreground" />
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(credential.id);
                }}
                className="p-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',  // Rouge subtil qui fonctionne dans les deux thèmes
                  color: '#ef4444'  // Rouge fixe pour assurer une bonne visibilité dans les deux thèmes
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(239, 68, 68, 0.2)'  // Rouge un peu plus intense au survol
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Delete credential"
                title="Delete credential"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence>
            {expandedId === credential.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border"
              >
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Username</div>
                    <div className="flex items-center">
                      <motion.button
                        onClick={() => copyToClipboard(credential.username, credential.id, 'username')}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copiedField?.id === credential.id && copiedField?.field === 'username' ? (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">Copied!</span>
                        ) : (
                          <Copy size={14} className="text-muted-foreground" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-background dark:bg-black/20 p-2 rounded">
                    <span className="text-foreground">{credential.username}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Password</div>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        onClick={() => copyToClipboard(credential.password, credential.id, 'password')}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copiedField?.id === credential.id && copiedField?.field === 'password' ? (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">Copied!</span>
                        ) : (
                          <Copy size={14} className="text-muted-foreground" />
                        )}
                      </motion.button>
                      <ToggleReveal
                        initialVisible={visiblePasswords[credential.id] || false}
                        onToggle={() => togglePasswordVisibility(credential.id)}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-background dark:bg-black/20 p-2 rounded">
                    {visiblePasswords[credential.id] ? (
                      <span className="text-foreground">{credential.password}</span>
                    ) : (
                      <span className="text-muted-foreground">••••••••••••</span>
                    )}
                  </div>
                  
                  {credential.website && (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Website</div>
                        <div className="flex items-center">
                          <motion.a
                            href={credential.website.startsWith('http') ? credential.website : `https://${credential.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ExternalLink size={14} className="text-muted-foreground" />
                          </motion.a>
                        </div>
                      </div>
                      <div className="bg-background dark:bg-black/20 p-2 rounded">
                        <span className="text-foreground text-sm truncate block">
                          {credential.website}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {credential.notes && (
                    <>
                      <div className="text-sm font-medium">Notes</div>
                      <div className="bg-background dark:bg-black/20 p-2 rounded">
                        <p className="text-foreground text-sm whitespace-pre-wrap">
                          {credential.notes}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border mt-2">
                    <Clock size={12} className="mr-1" />
                    Last updated: {formatDate(credential.lastUpdated)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};
