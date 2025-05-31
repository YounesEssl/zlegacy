import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockKeyhole, Wallet, Grid, List, SlidersHorizontal, Check } from 'lucide-react';
import { CredentialItem } from './CredentialItem';
import type { Credential, CredentialType } from '../hooks/useCredentials';

interface FilterOptions {
  sortBy: 'title' | 'username' | 'updated';
  sortOrder: 'asc' | 'desc';
  view: 'list' | 'grid';
  walletTypes: string[];
}

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
  // Tab and filter state
  const [activeTab, setActiveTab] = useState<'all' | CredentialType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'title',
    sortOrder: 'asc',
    view: 'list',
    walletTypes: [],
  });
  
  // Visibility states
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<{id: string, field: string} | null>(null);
  
  // Extract all wallet types for filtering
  const allWalletTypes = [...new Set(
    credentials
      .filter(cred => cred.type === 'seedphrase' && cred.walletType)
      .map(cred => cred.walletType!)
  )];
  
  // Filter credentials based on active tab
  const filteredCredentials = credentials.filter(cred => {
    if (activeTab === 'all') return true;
    return cred.type === activeTab;
  });
  
  // Filter by wallet type if applicable
  const walletTypeFilteredCredentials = filteredCredentials.filter(cred => {
    if (filterOptions.walletTypes.length === 0) return true;
    if (cred.type !== 'seedphrase') return true;
    return filterOptions.walletTypes.includes(cred.walletType || '');
  });
  
  // Sort credentials
  const sortedCredentials = [...walletTypeFilteredCredentials].sort((a, b) => {
    let valA: any;
    let valB: any;
    
    switch (filterOptions.sortBy) {
      case 'title':
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
        break;
      case 'username':
        valA = a.username.toLowerCase();
        valB = b.username.toLowerCase();
        break;
      case 'updated':
        valA = new Date(a.lastUpdated).getTime();
        valB = new Date(b.lastUpdated).getTime();
        break;
      default:
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
    }
    
    const sortMultiplier = filterOptions.sortOrder === 'asc' ? 1 : -1;
    
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
  
  const toggleWalletTypeFilter = (type: string) => {
    setFilterOptions(prev => {
      if (prev.walletTypes.includes(type)) {
        return {
          ...prev,
          walletTypes: prev.walletTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          walletTypes: [...prev.walletTypes, type]
        };
      }
    });
  };
  
  const resetFilters = () => {
    setFilterOptions({
      sortBy: 'title',
      sortOrder: 'asc',
      view: 'list',
      walletTypes: [],
    });
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
  
  // Count stats for tab indicators
  const standardCount = credentials.filter(c => c.type === 'standard').length;
  const walletCount = credentials.filter(c => c.type === 'seedphrase').length;
  
  // Return null if no credentials
  if (credentials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div 
          className="flex p-1 rounded-xl bg-opacity-50 border w-full md:max-w-3xl"
          style={{ 
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)", 
          }}
        >
          {/* All tab */}
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-2.5 transition-all duration-200 ${activeTab === 'all' ? "" : "hover:bg-opacity-70"}`}
            style={{
              backgroundColor: activeTab === 'all' ? "var(--bg-primary)" : "transparent",
              color: activeTab === 'all' ? "var(--accent-primary)" : "var(--text-secondary)",
              boxShadow: activeTab === 'all' ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            <div className="flex items-center w-full">
              <div 
                className="p-1.5 rounded-full mr-3 flex items-center justify-center"
                style={{
                  backgroundColor: activeTab === 'all' ? `var(--accent-primary-light)` : "transparent",
                  color: activeTab === 'all' ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                <Grid size={16} />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-sm flex items-center">
                  All
                  <span 
                    className="ml-2 text-xs rounded-full px-2 py-0.5"
                    style={{ 
                      backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {credentials.length}
                  </span>
                </p>
                <p 
                  className="text-xs hidden sm:block"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  View all items
                </p>
              </div>
            </div>
          </button>
          
          {/* Credentials tab */}
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-2.5 transition-all duration-200 ${activeTab === 'standard' ? "" : "hover:bg-opacity-70"}`}
            style={{
              backgroundColor: activeTab === 'standard' ? "var(--bg-primary)" : "transparent",
              color: activeTab === 'standard' ? "var(--accent-primary)" : "var(--text-secondary)",
              boxShadow: activeTab === 'standard' ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            <div className="flex items-center w-full">
              <div 
                className="p-1.5 rounded-full mr-3 flex items-center justify-center"
                style={{
                  backgroundColor: activeTab === 'standard' ? `var(--accent-primary-light)` : "transparent",
                  color: activeTab === 'standard' ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                <LockKeyhole size={16} />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-sm flex items-center">
                  Credentials
                  <span 
                    className="ml-2 text-xs rounded-full px-2 py-0.5"
                    style={{ 
                      backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {standardCount}
                  </span>
                </p>
                <p 
                  className="text-xs hidden sm:block"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Passwords & login info
                </p>
              </div>
            </div>
          </button>
          
          {/* Wallets tab */}
          <button
            onClick={() => setActiveTab('seedphrase')}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 py-2.5 transition-all duration-200 ${activeTab === 'seedphrase' ? "" : "hover:bg-opacity-70"}`}
            style={{
              backgroundColor: activeTab === 'seedphrase' ? "var(--bg-primary)" : "transparent",
              color: activeTab === 'seedphrase' ? "var(--accent-primary)" : "var(--text-secondary)",
              boxShadow: activeTab === 'seedphrase' ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            <div className="flex items-center w-full">
              <div 
                className="p-1.5 rounded-full mr-3 flex items-center justify-center"
                style={{
                  backgroundColor: activeTab === 'seedphrase' ? `var(--accent-primary-light)` : "transparent",
                  color: activeTab === 'seedphrase' ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                <Wallet size={16} />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-sm flex items-center">
                  Wallets
                  <span 
                    className="ml-2 text-xs rounded-full px-2 py-0.5"
                    style={{ 
                      backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {walletCount}
                  </span>
                </p>
                <p 
                  className="text-xs hidden sm:block"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Seed phrases & wallet keys
                </p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="flex items-center space-x-3 relative justify-end w-full md:w-auto">
          {/* Grid/List Toggle Button */}
          <button
            onClick={() => setFilterOptions(prev => ({
              ...prev,
              view: prev.view === 'list' ? 'grid' : 'list'
            }))}
            className="p-2 md:p-3 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: filterOptions.view === 'grid' ? "var(--accent-primary)" : "var(--text-secondary)",
            }}
          >
            <motion.div
              initial={false}
              animate={{ 
                rotate: filterOptions.view === 'list' ? 0 : 180,
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 0.3 }}
            >
              {filterOptions.view === 'list' ? 
                <Grid size={18} /> : 
                <List size={18} />
              }
            </motion.div>
          </button>
          
          {/* Filters Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 md:p-3 rounded-lg flex items-center justify-center transition-all duration-200 relative"
              style={{
                backgroundColor: showFilters ? "var(--bg-primary)" : "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: showFilters ? "var(--accent-primary)" : "var(--text-secondary)",
              }}
            >
              <SlidersHorizontal 
                size={18} 
                style={{ 
                  color: showFilters ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              />
            </button>
            
            {/* Active filters indicator */}
            {filterOptions.walletTypes.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  color: 'white',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                }}
              >
                {filterOptions.walletTypes.length}
              </motion.div>
            )}
            
            {/* Ripple effect when filters button is clicked */}
            {showFilters && (
              <motion.div
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, var(--accent-primary-transparent) 0%, transparent 70%)'  
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div 
              className="p-4 rounded-lg mb-4 border"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)' 
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 
                  className="font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Filters & Sorting
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs underline"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sort By */}
                <div>
                  <label 
                    className="block text-sm mb-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Sort by
                  </label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={(e) => setFilterOptions(prev => ({
                      ...prev,
                      sortBy: e.target.value as any
                    }))}
                    className="w-full p-2 rounded-md text-sm"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <option value="title">Title</option>
                    <option value="username">Username/Name</option>
                    <option value="updated">Last Updated</option>
                  </select>
                </div>
                
                {/* Sort Order */}
                <div>
                  <label 
                    className="block text-sm mb-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Order
                  </label>
                  <select
                    value={filterOptions.sortOrder}
                    onChange={(e) => setFilterOptions(prev => ({
                      ...prev,
                      sortOrder: e.target.value as any
                    }))}
                    className="w-full p-2 rounded-md text-sm"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <option value="asc">Ascending (A-Z, Oldest)</option>
                    <option value="desc">Descending (Z-A, Newest)</option>
                  </select>
                </div>
                
                {/* View */}
                <div>
                  <label 
                    className="block text-sm mb-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    View
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterOptions(prev => ({ ...prev, view: 'list' }))}
                      className={`flex-1 p-2 rounded-md flex items-center justify-center ${
                        filterOptions.view === 'list' ? 'ring-2 ring-accent-primary' : ''
                      }`}
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: filterOptions.view === 'list' ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}
                    >
                      <List size={16} className="mr-2" />
                      <span className="text-sm">List</span>
                    </button>
                    <button
                      onClick={() => setFilterOptions(prev => ({ ...prev, view: 'grid' }))}
                      className={`flex-1 p-2 rounded-md flex items-center justify-center ${
                        filterOptions.view === 'grid' ? 'ring-2 ring-accent-primary' : ''
                      }`}
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: filterOptions.view === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}
                    >
                      <Grid size={16} className="mr-2" />
                      <span className="text-sm">Grid</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Wallet Type Filters (only show if in Wallets tab or All tab) */}
              {(activeTab === 'all' || activeTab === 'seedphrase') && allWalletTypes.length > 0 && (
                <div className="mt-4">
                  <label 
                    className="block text-sm mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Wallet Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allWalletTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleWalletTypeFilter(type)}
                        className="px-3 py-1 rounded-full text-xs flex items-center"
                        style={{ 
                          backgroundColor: filterOptions.walletTypes.includes(type) 
                            ? 'var(--accent-secondary)' 
                            : 'rgba(var(--text-muted-rgb), 0.1)',
                          color: filterOptions.walletTypes.includes(type) 
                            ? 'white' 
                            : 'var(--text-muted)'
                        }}
                      >
                        {filterOptions.walletTypes.includes(type) && (
                          <Check size={12} className="mr-1" />
                        )}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* No Results Message */}
      {sortedCredentials.length === 0 && (
        <div 
          className="p-8 rounded-lg text-center"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div 
            className="inline-block p-3 rounded-full mb-3"
            style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
          >
            <SlidersHorizontal size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 
            className="text-lg font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            No matching items
          </h3>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Try adjusting your filters or switch to a different tab
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-md text-sm"
            style={{ 
              backgroundColor: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Credentials Grid/List */}
      {sortedCredentials.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className={filterOptions.view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-4'
          }
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
              gridView={filterOptions.view === 'grid'}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};
