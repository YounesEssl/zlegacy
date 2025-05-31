import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlusIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

// Hooks personnalisés
import { useBeneficiaries } from './hooks/useBeneficiaries';

// Composants
import BeneficiarySearch from './components/BeneficiarySearch';
import BeneficiaryGrid from './components/BeneficiaryGrid';
import BeneficiaryEmptyState from './components/BeneficiaryEmptyState';
import BeneficiaryModals from './components/BeneficiaryModals';

/**
 * Composant principal de la liste des bénéficiaires
 */
const BeneficiariesList: React.FC = () => {
  // Vérifier si l'utilisateur est connecté avec un portefeuille
  const { connected, publicKey } = useWallet();

  // Utiliser notre hook personnalisé pour la gestion des bénéficiaires
  const {
    // États
    beneficiaries,
    filteredBeneficiaries,
    searchTerm,
    isAddingBeneficiary,
    isEditingBeneficiary,
    selectedBeneficiary,
    beneficiaryToEdit,
    newBeneficiary,
    
    // Actions
    loadBeneficiaries,
    handleSearchChange,
    handleNewBeneficiaryChange,
    handleAddressChange,
    handleEditBeneficiary,
    handleSaveBeneficiary,
    handleAddBeneficiary,
    handleDeleteBeneficiary,
    handleSelectBeneficiary,
    setIsAddingBeneficiary,
    setIsEditingBeneficiary,
    setSelectedBeneficiary,
    setBeneficiaryToEdit,
  } = useBeneficiaries();

  // Charger les données initiales
  useEffect(() => {
    loadBeneficiaries(connected, publicKey || undefined);
  }, [connected, publicKey]);

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* En-tête avec titre et bouton d'ajout */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Beneficiaries
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage who will receive your digital assets
            </p>
          </div>

          {/* Bouton pour ajouter un bénéficiaire */}
          <Button
            onClick={() => setIsAddingBeneficiary(true)}
            variant="primary"
            leftIcon={<UserPlusIcon className="w-4 h-4" />}
          >
            Add Beneficiary
          </Button>
        </div>

        {/* Recherche de bénéficiaires */}
        {beneficiaries.length > 0 && (
          <BeneficiarySearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        )}

        {/* Liste des bénéficiaires ou état vide */}
        {filteredBeneficiaries.length > 0 ? (
          <BeneficiaryGrid
            beneficiaries={filteredBeneficiaries}
            onSelect={handleSelectBeneficiary}
            onEdit={handleEditBeneficiary}
            onDelete={handleDeleteBeneficiary}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <BeneficiaryEmptyState
              isConnected={connected && !!publicKey}
              onAddBeneficiary={() => setIsAddingBeneficiary(true)}
            />
          </div>
        )}

        {/* Bouton flottant d'ajout (visible uniquement sur mobile et avec des bénéficiaires existants) */}
        {filteredBeneficiaries.length > 0 && (
          <div className="fixed bottom-6 right-6 md:hidden">
            <Button
              onClick={() => setIsAddingBeneficiary(true)}
              variant="primary"
              className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            >
              <PlusIcon className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Tous les modals (détails, ajout, édition) */}
        <BeneficiaryModals
          isAddingBeneficiary={isAddingBeneficiary}
          isEditingBeneficiary={isEditingBeneficiary}
          selectedBeneficiary={selectedBeneficiary}
          beneficiaryToEdit={beneficiaryToEdit}
          newBeneficiary={newBeneficiary}
          onCloseAddForm={() => setIsAddingBeneficiary(false)}
          onCloseEditForm={() => {
            setIsEditingBeneficiary(false);
            setBeneficiaryToEdit(null);
          }}
          onCloseDetails={() => setSelectedBeneficiary(null)}
          onNewBeneficiaryChange={handleNewBeneficiaryChange}
          onAddressChange={handleAddressChange}
          onAddBeneficiary={handleAddBeneficiary}
          onSaveBeneficiary={handleSaveBeneficiary}
        />
      </motion.div>
    </div>
  );
};

export default BeneficiariesList;
