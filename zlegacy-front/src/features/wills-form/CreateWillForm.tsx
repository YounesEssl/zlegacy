import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon } from "@heroicons/react/24/outline";
import MultiBeneficiarySelector from "./MultiBeneficiarySelector";
import AssetAllocationStep from "./components/AssetAllocationStep";
import CredentialsAllocationStep from "./components/CredentialsAllocationStep";

// Newly extracted components
import FormProgressBar from "./components/FormProgressBar";
import NoWalletError from "./components/NoWalletError";
import ReviewStep from "./components/ReviewStep";
import CompleteStep from "./components/CompleteStep";
import NoteStep from "./components/NoteStep";
import ExecutorStep from "./components/ExecutorStep";
// Removed TransactionModeStep import

// Custom hook
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
 * Main component for the will creation form content
 */
const WillFormContent: React.FC<WillFormContentProps> = ({
  testatorAddress,
  willIdToEdit,
}) => {
  // Using the custom hook for form logic
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

  // If the user is connected but doesn't have a testator address, display an error
  if (connected && !hasTestatorAddress) {
    return <NoWalletError />;
  }

  // Render content based on the current step
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
        // Get the setNote function directly from the context
        const { setNote: updateNote } = useWill();
        return (
          <NoteStep
            note={note}
            setNote={updateNote} // Pass the context function directly
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
        // Redirect to the beneficiaries step if the step is not recognized
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
 * Will creation component that wraps the content in the provider
 */
const CreateWillForm: React.FC<CreateWillFormProps> = ({ testatorAddress, willIdToEdit }) => {
  return (
    <WillProvider testatorAddress={testatorAddress} willIdToEdit={willIdToEdit}>
      <WillFormContent testatorAddress={testatorAddress} willIdToEdit={willIdToEdit} />
    </WillProvider>
  );
};

export default CreateWillForm;
