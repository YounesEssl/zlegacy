import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BeneficiarySearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Composant de recherche pour filtrer les bénéficiaires
 */
const BeneficiarySearch: React.FC<BeneficiarySearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
      </div>
      <input
        type="text"
        placeholder="Search beneficiaries..."
        value={searchTerm}
        onChange={onSearchChange}
        className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      />
    </div>
  );
};

export default BeneficiarySearch;
