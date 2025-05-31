import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

// Hooks personnalisés
import { useBeneficiaries } from "./hooks/useBeneficiaries";

// Composants
import BeneficiaryGrid from "./components/BeneficiaryGrid";
import BeneficiaryEmptyState from "./components/BeneficiaryEmptyState";
import BeneficiaryModals from "./components/BeneficiaryModals";
import { PageHeader } from "./components/PageHeader";

/**
 * Composant principal de la liste des bénéficiaires
 */
const BeneficiariesList: React.FC = () => {
  // Vérifier si l'utilisateur est connecté avec un portefeuille
  const { connected, publicKey } = useWallet();

  // Utiliser notre hook personnalisé pour la gestion des bénéficiaires
  const {
    // États
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 max-w-6xl"
    >
      <div className="w-full">
        {/* En-tête avec titre, recherche et bouton d'ajout */}
        <PageHeader
          title="Beneficiaries"
          subtitle="Manage who will receive your digital assets"
          searchTerm={searchTerm}
          setSearchTerm={(value) => handleSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
          onAdd={() => setIsAddingBeneficiary(true)}
          isLoading={false}
        />

        {/* Espacement après l'en-tête */}
        <div className="h-6"></div>

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
      </div>
      
      {/* Bouton flottant d'ajout sur mobile (hors du flux principal) */}
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
      
      {/* Modals (en dehors du flux principal) */}
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
  );
};

export default BeneficiariesList;
