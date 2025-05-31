import React from 'react';
import { motion } from 'framer-motion';
import { DocumentPlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface EmptyWillsStateProps {
  isFiltered?: boolean;
}

const EmptyWillsState: React.FC<EmptyWillsStateProps> = ({ isFiltered = false }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div 
        className="w-20 h-20 mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      >
        <DocumentTextIcon className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
      </div>

      <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {isFiltered 
          ? 'No wills match your filters' 
          : 'No wills found'}
      </h2>
      
      <p className="text-base mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
        {isFiltered 
          ? 'Try modifying your filters or search query to find what you\'re looking for.' 
          : 'Create your first digital will to protect your assets and ensure their secure transfer to your beneficiaries.'}
      </p>

      {!isFiltered && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/create')}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg shadow-md transition-all"
          style={{
            background: "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <DocumentPlusIcon className="w-5 h-5" />
          <span className="font-medium">Create a Will</span>
        </motion.button>
      )}

      {isFiltered && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)'
          }}
        >
          <span>Reset Filters</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyWillsState;
