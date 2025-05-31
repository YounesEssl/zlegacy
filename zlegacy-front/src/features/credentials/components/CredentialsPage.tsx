import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useCredentials } from "../hooks/useCredentials";
import type { Credential } from "../hooks/useCredentials";

// Import des composants modulaires
import { PageHeader } from "./PageHeader";
import { ToolbarActions } from "./ToolbarActions";
import { MainContent } from "./MainContent";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export const CredentialsPage: React.FC = () => {
  // Force re-render pour garantir que les changements d'état sont pris en compte
  const [renderKey, setRenderKey] = useState(0);
  const { connected } = useWallet();
  const {
    credentials,
    isLoading,
    error,
    addCredential,
    updateCredential,
    deleteCredential,
    importCredentials,
    refreshCredentials,
  } = useCredentials();

  // États UI
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les identifiants par recherche
  const filteredCredentials = credentials.filter((cred) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      cred.title.toLowerCase().includes(term) ||
      cred.username.toLowerCase().includes(term) ||
      (cred.website && cred.website.toLowerCase().includes(term))
    );
  });

  // Fonction simplifiée pour afficher le formulaire d'ajout
  const handleAddClick = () => {
    setEditingCredential(null);
    setShowAddForm(true);
    // Force le re-rendu complet du composant
    setRenderKey((prev) => prev + 1);
  };

  const handleEditClick = (credential: Credential) => {
    // Ensure we have a clean copy of the credential with all properties
    const fullCredential = credentials.find(c => c.id === credential.id) || credential;
    console.log("Editing credential:", fullCredential);
    
    // Set the editing credential and show the form
    setEditingCredential(fullCredential);
    setShowAddForm(true);
    
    // Force a re-render to ensure the form updates correctly
    setRenderKey(prev => prev + 1);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await deleteCredential(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingCredential(null);
  };

  const handleSubmit = async (data: Omit<Credential, "id" | "lastUpdated">) => {
    if (editingCredential) {
      return updateCredential(editingCredential.id, data);
    } else {
      return addCredential(data);
    }
  };

  // Trouver la credential à supprimer pour la confirmation
  const credentialToDelete = confirmDelete
    ? credentials.find((c) => c.id === confirmDelete)
    : undefined;

  return (
    <motion.div
      key={`credentials-page-${renderKey}`}
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-8">
        {/* En-tête de la page avec titre et contrôles */}
        <PageHeader
          title="Secure Credentials"
          subtitle="Encrypted storage for your sensitive information"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={refreshCredentials}
          onAdd={handleAddClick}
          isLoading={isLoading}
        />

        {/* Barre d'outils avec import/export */}
        <ToolbarActions
          credentials={credentials}
          onImport={importCredentials}
          connected={connected}
          showForm={showAddForm}
        />

        {/* Contenu principal (formulaire ou liste) */}
        <MainContent
          showAddForm={showAddForm}
          credentials={credentials}
          filteredCredentials={filteredCredentials}
          connected={connected}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          editingCredential={editingCredential}
          onSubmit={handleSubmit}
          onCancelForm={handleCancelForm}
          onAddNew={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onImport={importCredentials}
        />

        {/* Dialogue de confirmation de suppression */}
        <AnimatePresence>
          {confirmDelete && (
            <DeleteConfirmDialog
              credential={credentialToDelete}
              onConfirm={handleConfirmDelete}
              onCancel={() => setConfirmDelete(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
