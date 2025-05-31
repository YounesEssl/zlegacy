import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import type { WillsFilters } from '../types';

interface WillsFiltersBarProps {
  filters: WillsFilters;
  onUpdateFilters: (filters: Partial<WillsFilters>) => void;
  totalWills: number;
}

const WillsFiltersBar: React.FC<WillsFiltersBarProps> = ({ 
  filters, 
  onUpdateFilters, 
  totalWills 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  

  

  
  const sortOptions = [
    { value: 'date', label: 'Last Modified' },
    { value: 'name', label: 'Name' }
  ];

  const toggleSort = () => {
    onUpdateFilters({
      sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Compteur */}
        <div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>
            {totalWills} will{totalWills !== 1 ? 's' : ''} found
          </h1>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search wills..."
              value={filters.search || ''}
              onChange={(e) => onUpdateFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            <MagnifyingGlassIcon 
              className="absolute left-3 top-2.5 w-5 h-5" 
              style={{ color: 'var(--text-muted)' }}
            />
          </div>
          
          {/* Bouton pour afficher/masquer les filtres */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg border flex items-center justify-center"
            style={{ 
              backgroundColor: showFilters ? 'var(--accent-primary-transparent)' : 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: showFilters ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
            aria-label="Filtres"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Panneau de filtres extensible */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mt-4"
      >
        <div className="p-4 rounded-lg border grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}>

          

          
          {/* Tri */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Sort by
            </label>
            <div className="flex">
              <div className="relative flex-grow">
                <select
                  value={filters.sortBy}
                  onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
                  className="w-full p-2 rounded-l-lg border-y border-l appearance-none focus:ring-2 focus:outline-none transition-all pr-10"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-2.5 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
              <button
                onClick={toggleSort}
                className="px-3 rounded-r-lg border-y border-r flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
                aria-label={filters.sortDirection === 'asc' ? 'Ascending sort' : 'Descending sort'}
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WillsFiltersBar;
