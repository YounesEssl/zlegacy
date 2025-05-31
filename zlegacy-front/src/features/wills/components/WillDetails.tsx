import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Will } from '../types';
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  LockClosedIcon,
  LockOpenIcon,
  DocumentTextIcon,
  ClockIcon,
  KeyIcon,
  CurrencyDollarIcon,
  FingerPrintIcon,
  ShieldCheckIcon,
  ChevronDownIcon, 
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface WillDetailsProps {
  will: Will;
  onBack: () => void;
}



const WillDetails: React.FC<WillDetailsProps> = ({ will, onBack }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // État pour les éléments expandables
  const [expandedCryptos, setExpandedCryptos] = useState<string[]>([]);
  const [expandedCredentials, setExpandedCredentials] = useState<string[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<string[]>([]);
  
  // Gestion des toggles
  const toggleCryptoExpansion = (cryptoId: string) => {
    setExpandedCryptos(prev =>
      prev.includes(cryptoId) ? prev.filter(id => id !== cryptoId) : [...prev, cryptoId]
    );
  };
  
  const toggleCredentialExpansion = (credentialId: string) => {
    setExpandedCredentials(prev =>
      prev.includes(credentialId) ? prev.filter(id => id !== credentialId) : [...prev, credentialId]
    );
  };
  
  const togglePasswordVisibility = (credentialId: string) => {
    setVisiblePasswords(prev =>
      prev.includes(credentialId) ? prev.filter(id => id !== credentialId) : [...prev, credentialId]
    );
  };
  
  // Obtenir l'icône du mode de transaction
  const getTransactionModeIcon = () => {
    if (will.transactionMode === 'private') {
      return <LockClosedIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />;
    }
    return <LockOpenIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />;
  };
  
  // Formatage des nombres
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Formatage des valeurs monétaires
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleEditWill = () => {
    navigate(`/wills/edit/${will.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header with back button and title */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-3 p-2 rounded-full"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <ArrowLeftIcon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Will Details</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View complete information about this will</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgb(79, 70, 229)', color: 'white' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEditWill}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300"
          style={{ 
            backgroundColor: 'rgba(79, 70, 229, 0.12)', 
            color: 'rgb(79, 70, 229)',
            border: '1px solid rgba(79, 70, 229, 0.3)'
          }}
        >
          <span>Edit Will</span>
        </motion.button>
      </div>

      {/* Will title card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 p-6 rounded-xl border"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderTop: '4px solid var(--accent-primary)'
        }}
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {will.title}
        </h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Created: {formatDate(will.createdAt)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {formatDate(will.updatedAt)}
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Transaction mode */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center mb-4">
              {getTransactionModeIcon()}
              <h3 className="text-lg font-semibold ml-2" style={{ color: 'var(--text-primary)' }}>
                {will.transactionMode === 'private' ? 'Private' : 'Public'} Transaction
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {will.transactionMode === 'private' 
                ? 'This will uses private transactions. All data is encrypted on the blockchain and only accessible to authorized parties.'
                : 'This will uses public transactions. The data is visible on the blockchain for transparency and auditability.'}
            </p>
          </div>
          
          {/* Crypto assets section */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold ml-2" style={{ color: 'var(--text-primary)' }}>
                Crypto Assets
              </h3>
            </div>

            <div className="space-y-4">
              {will.cryptoAssets && will.cryptoAssets.length > 0 ? (
                will.cryptoAssets.map(asset => {
                  // Calculer les allocations pour cet actif
                  const assetAllocations = will.assetAllocations
                    ? will.assetAllocations
                      .filter(alloc => alloc.assetId === asset.id)
                      .map(alloc => ({
                        beneficiaryId: alloc.beneficiaryId,
                        percentage: alloc.percentage || 0
                      }))
                    : [];
                  
                  // Calculer le total alloué pour cet actif
                  const totalAllocated = assetAllocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
                  
                  // Vérifier si cet actif est développé
                  const isExpanded = expandedCryptos.includes(asset.id);
                  
                  return (
                    <div key={asset.id} className="mb-4 rounded-lg overflow-hidden border"
                         style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      {/* En-tête de la carte */}
                      <div className="p-4 flex items-center justify-between cursor-pointer"
                           onClick={() => toggleCryptoExpansion(asset.id)}
                           style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                               style={{ backgroundColor: 'rgba(75, 131, 219, 0.1)' }}>
                            <span className="text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>
                              {asset.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {asset.symbol}
                            </h3>
                            <div className="flex items-center text-sm">
                              <span style={{ color: 'var(--text-secondary)' }}>
                                {formatNumber(asset.balance)} {asset.symbol}
                              </span>
                              {asset.value && (
                                <>
                                  <span className="mx-1" style={{ color: 'var(--text-muted)' }}>•</span>
                                  <span style={{ color: 'var(--text-secondary)' }}>
                                    {formatUSD(asset.value)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {totalAllocated}% allocated
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {100 - totalAllocated}% remaining
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                          )}
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full transition-all duration-300"
                             style={{ 
                               width: `${totalAllocated}%`, 
                               backgroundColor: totalAllocated > 100 ? 'var(--accent-danger)' : 'var(--accent-primary)'
                             }}>
                        </div>
                      </div>

                      {/* Corps développé */}
                      {isExpanded && (
                        <div className="p-4 space-y-4">
                          <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                            Allocation of this {asset.symbol} to beneficiaries
                          </div>

                          {will.beneficiaries.length === 0 ? (
                            <div className="p-3 text-sm rounded-md" 
                                 style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                              No beneficiaries defined.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {will.beneficiaries.map(beneficiary => {
                                // Trouver l'allocation existante pour ce bénéficiaire et cet actif
                                const allocation = assetAllocations.find(a => a.beneficiaryId === beneficiary.id);
                                const allocatedPercentage = allocation ? allocation.percentage : 0;
                                const allocatedAmount = (allocatedPercentage / 100) * asset.balance;
                                const allocatedValue = asset.value ? (allocatedPercentage / 100) * asset.value : 0;
                                
                                return (
                                  <div key={beneficiary.id} className="p-3 rounded-lg border"
                                       style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="flex items-center">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2"
                                             style={{ backgroundColor: beneficiary.relationColor || 'rgba(75, 131, 219, 0.1)' }}>
                                          <span style={{ color: 'var(--text-primary)', fontSize: '0.7rem' }}>
                                            {beneficiary.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <span style={{ color: 'var(--text-primary)' }}>{beneficiary.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center text-sm">
                                          <div className="w-14 text-right px-1 py-0.5 rounded border text-sm font-medium"
                                               style={{
                                                 backgroundColor: 'var(--bg-tertiary)',
                                                 borderColor: 'var(--border-color)',
                                                 color: 'var(--text-primary)'
                                               }}>
                                            {allocatedPercentage}%
                                          </div>
                                        </div>
                                        <div className="flex flex-col text-xs text-right">
                                          <span style={{ color: 'var(--text-secondary)' }}>
                                            {formatNumber(allocatedAmount)} {asset.symbol}
                                          </span>
                                          <span style={{ color: 'var(--text-muted)' }}>
                                            {formatUSD(allocatedValue)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative py-2">
                                      <div className="w-full h-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        <div 
                                          className="absolute top-2 h-2 rounded-lg"
                                          style={{
                                            width: `${allocatedPercentage}%`,
                                            backgroundColor: 'var(--accent-primary)',
                                            transition: 'width 0.3s ease'
                                          }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                  No crypto assets found in this will.
                </div>
              )}
            </div>
          </div>

          {/* Beneficiaries section */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center mb-4">
              <UserGroupIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold ml-2" style={{ color: 'var(--text-primary)' }}>
                Beneficiaries
              </h3>
            </div>
            
            <div className="space-y-4">
              {will.beneficiaries.map((beneficiary) => (
                <div 
                  key={beneficiary.id}
                  className="p-4 rounded-lg flex items-start justify-between"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div>
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: beneficiary.relationColor }}
                      />
                      <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {beneficiary.name}
                      </h4>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {beneficiary.relation ? beneficiary.relation.charAt(0).toUpperCase() + beneficiary.relation.slice(1) : 'Beneficiary'}
                    </p>
                    <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {beneficiary.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div 
                      className="text-lg font-semibold px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)',
                        color: 'var(--accent-primary)'
                      }}
                    >
                      {beneficiary.allocation}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Credentials section */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center mb-4">
              <KeyIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold ml-2" style={{ color: 'var(--text-primary)' }}>
                Passwords & Credentials
              </h3>
            </div>

            <div className="space-y-4">
              {will.credentials && will.credentials.length > 0 ? (
                will.credentials.map(credential => {
                  // Trouver les bénéficiaires qui ont accès à cet identifiant
                  const assignedBeneficiaries = will.credentialAllocations
                    ? will.beneficiaries.filter(b => {
                        return will.credentialAllocations?.some(
                          alloc => alloc.credentialId === credential.id && alloc.beneficiaryId === b.id
                        );
                      })
                    : [];
                  
                  // Déterminer si le mot de passe est visible ou non
                  const isPasswordVisible = visiblePasswords.includes(credential.id);
                  const isExpanded = expandedCredentials.includes(credential.id);
                  
                  return (
                    <div key={credential.id} className="mb-4 rounded-lg overflow-hidden border"
                         style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      {/* En-tête de la carte */}
                      <div className="p-4 flex items-center justify-between cursor-pointer"
                           onClick={() => toggleCredentialExpansion(credential.id)}
                           style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                               style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}>
                            <KeyIcon className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                          </div>
                          <div>
                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {credential.title}
                            </h3>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {credential.username}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {assignedBeneficiaries.length} beneficiaries
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                          )}
                        </div>
                      </div>

                      {/* Corps développé */}
                      {isExpanded && (
                        <div className="p-4 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Credential Details
                              </h4>
                              
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Username</div>
                                  <div className="p-2 rounded text-sm font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                    {credential.username}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Password</div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePasswordVisibility(credential.id);
                                      }}
                                      className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                                      style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
                                    >
                                      {isPasswordVisible ? (
                                        <>
                                          <EyeSlashIcon className="w-3 h-3" />
                                          Hide
                                        </>
                                      ) : (
                                        <>
                                          <EyeIcon className="w-3 h-3" />
                                          Show
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="p-2 rounded text-sm font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                    {isPasswordVisible ? credential.password : '••••••••••••'}
                                  </div>
                                </div>
                                
                                {credential.website && (
                                  <div>
                                    <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Website</div>
                                    <div className="p-2 rounded text-sm" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                      <a 
                                        href={credential.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-sm underline" 
                                        style={{ color: 'var(--accent-primary)' }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {credential.website}
                                      </a>
                                    </div>
                                  </div>
                                )}
                                
                                {credential.notes && (
                                  <div>
                                    <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Notes</div>
                                    <div className="p-2 rounded text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                      {credential.notes}
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Last Updated</div>
                                  <div className="p-2 rounded text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                    {formatDate(credential.lastUpdated)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Assigned Beneficiaries
                              </h4>
                              
                              {assignedBeneficiaries.length > 0 ? (
                                <div className="space-y-2">
                                  {assignedBeneficiaries.map(beneficiary => (
                                    <div key={beneficiary.id} className="p-3 rounded-lg flex items-center justify-between"
                                         style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                      <div className="flex items-center">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2"
                                             style={{ backgroundColor: beneficiary.relationColor || 'rgba(75, 131, 219, 0.1)' }}>
                                          <span style={{ color: 'var(--text-primary)', fontSize: '0.7rem' }}>
                                            {beneficiary.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {beneficiary.name}
                                          </div>
                                          {beneficiary.relation && (
                                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                              {beneficiary.relation.charAt(0).toUpperCase() + beneficiary.relation.slice(1)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-xs px-2 py-1 rounded-full"
                                             style={{ backgroundColor: 'rgba(var(--accent-secondary-rgb), 0.1)', color: 'var(--accent-secondary)' }}>
                                          Has Access
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 text-center rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                                  No beneficiaries assigned to this credential.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                  No credentials found in this will.
                </div>
              )}
            </div>
          </div>

          {/* Note section, if available */}
          {will.note && (
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="text-lg font-semibold ml-2" style={{ color: 'var(--text-primary)' }}>
                  Notes
                </h3>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  borderLeft: '3px solid var(--accent-primary)'
                }}
              >
                <p style={{ color: 'var(--text-secondary)' }}>{will.note}</p>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Right column */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-6"
        >

          
          {/* Digital Assets Summary */}
          <div className="p-5 rounded-xl border mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center mb-4">
              <FingerPrintIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold ml-2" style={{ color: 'var(--text-primary)' }}>
                Digital Assets Summary
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Credentials stats */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                       style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}>
                    <KeyIcon className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Credentials</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {will.credentials?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Crypto assets stats */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                       style={{ backgroundColor: 'rgba(75, 131, 219, 0.1)' }}>
                    <CurrencyDollarIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Crypto Assets</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {will.cryptoAssets?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Beneficiaries stats */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                       style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)' }}>
                    <UserGroupIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Beneficiaries</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {will.beneficiaries?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Allocations stats */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                       style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}>
                    <ShieldCheckIcon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Allocations</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {(will.assetAllocations?.length || 0) + (will.credentialAllocations?.length || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Blockchain details */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Blockchain Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Testator Address</p>
                <p className="font-mono text-sm break-all" style={{ color: 'var(--text-primary)' }}>
                  {will.testatorAddress}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Transaction Status</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--success)' }} />
                  <p style={{ color: 'var(--text-primary)' }}>Confirmed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WillDetails;
