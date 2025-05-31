import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CredentialsForm } from "./CredentialsForm";
import { SeedphraseForm } from "./SeedphraseForm";
import { CredentialTypeSelector } from "./CredentialTypeSelector";
import { CredentialsTabView } from "./CredentialsTabView";
import { EmptyCredentials } from "./EmptyCredentials";
import type { Credential, CredentialType } from "../hooks/useCredentials";

interface MainContentProps {
  showAddForm: boolean;
  credentials: Credential[];
  filteredCredentials: Credential[];
  connected: boolean;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  editingCredential: Credential | null;
  onSubmit: (data: Omit<Credential, "id" | "lastUpdated">) => Promise<boolean>;
  onCancelForm: () => void;
  onAddNew: () => void;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
  onImport: (data: any[]) => Promise<boolean>;
}

export const MainContent: React.FC<MainContentProps> = ({
  showAddForm,
  credentials,
  filteredCredentials,
  connected,
  isLoading,
  error,
  searchTerm,
  editingCredential,
  onSubmit,
  onCancelForm,
  onAddNew,
  onEdit,
  onDelete,
  onImport,
}) => {
  // State to track the selected credential type
  // Make sure to update this when editingCredential changes
  const [selectedType, setSelectedType] = useState<CredentialType>(
    editingCredential?.type || 'standard'
  );
  
  // Update selectedType when editingCredential changes
  React.useEffect(() => {
    if (editingCredential) {
      setSelectedType(editingCredential.type);
    }
  }, [editingCredential]);

  return (
    <AnimatePresence mode="wait">
      {/* Debugging info */}
      {showAddForm === true ? (
        /* Add or edit form */
        <>
          {/* Type selector only when adding (not in edit mode) */}
          {!editingCredential && (
            <CredentialTypeSelector
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />
          )}

          {/* Display the appropriate form based on the type */}
          {(editingCredential?.type === 'seedphrase' || (!editingCredential && selectedType === 'seedphrase')) ? (
            <SeedphraseForm
              key="seedphrase-form"
              onSubmit={onSubmit}
              onCancel={onCancelForm}
              initialData={editingCredential || undefined}
              isEdit={!!editingCredential}
            />
          ) : (
            <CredentialsForm
              key="standard-form"
              onSubmit={onSubmit}
              onCancel={onCancelForm}
              initialData={editingCredential || undefined}
              isEdit={!!editingCredential}
            />
          )}
        </>
      ) : (
        /* Main content (list or empty state) */
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {/* Display errors except "Wallet not connected" */}
          {error && error !== "Wallet not connected" && (
            <motion.div
              className="rounded-lg p-4 flex flex-col sm:flex-row items-start gap-3 mb-6"
              style={{
                backgroundColor: "rgba(var(--error-rgb), 0.1)",
                borderLeft: "4px solid var(--error)",
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                style={{ color: "var(--error)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3
                  className="font-medium"
                  style={{ color: "var(--error)" }}
                >
                  Error loading credentials
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Loading indicator */}
          {isLoading ? (
            <motion.div
              className="flex flex-col justify-center items-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative w-16 h-16">
                <div
                  className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-b-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "var(--accent-primary)",
                    borderTopColor: "transparent",
                    borderBottomColor: "transparent",
                  }}
                ></div>
                <div
                  className="absolute top-1 left-1 w-14 h-14 border-4 border-l-transparent border-r-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "var(--accent-secondary)",
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    animationDuration: "1.2s",
                  }}
                ></div>
              </div>
              <p
                className="mt-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Loading your credentials...
              </p>
            </motion.div>
          ) : !connected ? (
            /* If the wallet is not connected, display mock data */
            <CredentialsTabView
              credentials={filteredCredentials}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : filteredCredentials.length > 0 ? (
            /* If the wallet is connected and there is data, display the list */
            <CredentialsTabView
              credentials={filteredCredentials}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            /* If the wallet is connected but there is no data, display the empty state */
            <EmptyCredentials
              onAddNew={onAddNew}
              connected={connected}
              isFiltered={
                !!(
                  searchTerm &&
                  credentials.length > 0 &&
                  filteredCredentials.length === 0
                )
              }
              searchTerm={searchTerm}
              onImport={onImport}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
