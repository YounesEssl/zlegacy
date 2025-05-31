import React from 'react';
import { motion } from 'framer-motion';
import { useWills } from './hooks/useWills';
import WillsFiltersBar from './components/WillsFiltersBar';
import WillCard from './components/WillCard';
import EmptyWillsState from './components/EmptyWillsState';

const WillsPage: React.FC = () => {
  const { wills, totalWills, isLoading, error, filters, updateFilters } = useWills();
  
  // Détermine si l'état vide est dû aux filtres
  const isFilteredEmpty = totalWills > 0 && wills.length === 0;
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-8">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center">
            <motion.div
              className="w-2 h-12 rounded-full mr-3"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              initial={{ height: 0 }}
              animate={{ height: 40 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Digital Wills</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your blockchain-secured wills</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <WillsFiltersBar 
            filters={filters}
            onUpdateFilters={updateFilters}
            totalWills={totalWills}
          />
        </motion.div>
        
        {isLoading ? (
          <motion.div 
            className="flex flex-col justify-center items-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-b-transparent rounded-full animate-spin" 
                   style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}>
              </div>
              <div className="absolute top-1 left-1 w-14 h-14 border-4 border-l-transparent border-r-transparent rounded-full animate-spin" 
                   style={{ borderColor: 'var(--accent-secondary)', borderLeftColor: 'transparent', borderRightColor: 'transparent', animationDuration: '1.2s' }}>
              </div>
            </div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Loading your wills...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="rounded-lg p-4 flex items-start space-x-3"
            style={{ backgroundColor: 'rgba(var(--error-rgb), 0.1)', borderLeft: '4px solid var(--error)' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: 'var(--error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-medium" style={{ color: 'var(--error)' }}>Error loading wills</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          </motion.div>
        ) : wills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyWillsState isFiltered={isFilteredEmpty} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {wills.map((will, index) => (
              <motion.div
                key={will.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <WillCard will={will} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WillsPage;
