import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FieldGroupProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  description?: string;
  required?: boolean;
}

export const FieldGroup: React.FC<FieldGroupProps> = ({
  label,
  htmlFor,
  error,
  children,
  description,
  required = false,
}) => {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--error)' }} className="ml-1">*</span>}
        </label>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium"
            style={{ color: 'var(--error)' }}
          >
            {error}
          </motion.p>
        )}
      </div>
      
      {children}
      
      {description && (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
    </motion.div>
  );
};
