import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon } from "@heroicons/react/24/outline";
import MultiBeneficiarySelector from "./MultiBeneficiarySelector";
import AssetAllocationStep from "./components/AssetAllocationStep";
import CredentialsAllocationStep from "./components/CredentialsAllocationStep";

// Composants nouvellement extraits
import FormProgressBar from "./components/FormProgressBar";
import NoWalletError from "./components/NoWalletError";
import ReviewStep from "./components/ReviewStep";
import CompleteStep from "./components/CompleteStep";
import NoteStep from "./components/NoteStep";
import ExecutorStep from "./components/ExecutorStep";
// Suppression de l'import TransactionModeStep

// Hook personnalisé
import { useWillForm } from "./hooks/useWillForm";

import type { WillFormData } from "./types";
import { useWill, WillProvider } from "./WillContext";

interface CreateWillFormProps {
  testatorAddress: string;
  willIdToEdit?: string | null;
  onSubmit?: (data: WillFormData) => Promise<void>;
}

interface WillFormContentProps {
  testatorAddress: string;
  willIdToEdit?: string | null;
}

/**
 * Composant principal pour le contenu du formulaire de création de testament
 */
const WillFormContent: React.FC<WillFormContentProps> = ({
  testatorAddress,
  willIdToEdit,
}) => {
  // Utilisation du hook personnalisé pour la logique du formulaire
  const {
    steps,
    currentStep,
    progress,
    isSubmitting,
    submitStatus,
    transactionData,
    hasTestatorAddress,
    connected,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    beneficiaryAllocations,
    note,
    transactionMode,
    isEditMode,
    originalWill,
  } = useWillForm(testatorAddress, willIdToEdit);

  // Si l'utilisateur est connecté mais n'a pas d'adresse de testateur, afficher une erreur
  if (connected && !hasTestatorAddress) {
    return <NoWalletError />;
  }

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case "beneficiaries":
        return (
          <MultiBeneficiarySelector
            onContinue={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );

      case "assets":
        return (
          <AssetAllocationStep
            onPrevious={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );

      case "credentials":
        return (
          <CredentialsAllocationStep
            onPrevious={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );

      case "note":
        // On obtient la fonction setNote directement depuis le contexte
        const { setNote: updateNote } = useWill();
        return (
          <NoteStep
            note={note}
            setNote={updateNote} // On passe directement la fonction du contexte
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );
        
      case "executor":
        return (
          <ExecutorStep
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );

      case "review":
        return (
          <ReviewStep
            beneficiaryAllocations={beneficiaryAllocations}
            transactionMode={transactionMode}
            note={note}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            transactionData={transactionData}
            handleSubmit={handleSubmit}
            goToPreviousStep={goToPreviousStep}
          />
        );

      case "complete":
        return (
          <CompleteStep
            beneficiaryAllocations={beneficiaryAllocations}
            transactionMode={transactionMode}
            transactionData={transactionData}
          />
        );

      default:
        // Rediriger vers l'étape des bénéficiaires en cas d'étape non reconnue
        return (
          <MultiBeneficiarySelector
            onContinue={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-[95%] mx-auto">
      {isEditMode && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5 p-3 rounded-lg" 
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            borderLeft: '3px solid var(--accent-primary)',
            marginBottom: '1.5rem'
          }}
        >
          <div className="flex items-start space-x-3">
            <PencilIcon className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Edit Mode: "{originalWill?.title}"</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>This action will create a new will and revoke the old one.</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <FormProgressBar
        steps={steps}
        currentStep={currentStep}
        progress={progress}
      />

      <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
    </div>
  );
};

/**
 * Composant de création de testament qui enveloppe le contenu dans le provider
 */
const CreateWillForm: React.FC<CreateWillFormProps> = ({ testatorAddress, willIdToEdit }) => {
  return (
    <WillProvider testatorAddress={testatorAddress} willIdToEdit={willIdToEdit}>
      <WillFormContent testatorAddress={testatorAddress} willIdToEdit={willIdToEdit} />
    </WillProvider>
  );
};

export default CreateWillForm;
