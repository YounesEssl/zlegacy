import { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useWill } from "../WillContext";
import { useWillSubmission } from "./useWillSubmission";
import type { FormStep } from "../types";

/**
 * Custom hook to manage the will creation form logic
 */
export function useWillForm(
  testatorAddress: string,
  willIdToEdit?: string | null
) {
  const { publicKey, connected } = useWallet();
  const hasTestatorAddress = !!testatorAddress;

  // Get data from the will context
  const {
    currentStep,
    setCurrentStep,
    beneficiaryAllocations,
    totalAllocation,
    isAllocationValid,
    note,
    transactionMode,
    isEditMode,
    originalWill,
  } = useWill();

  // Local state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [transactionData] = useState<any>(null);

  // Use our submission hook
  const { goToNextStep: submitGoToNextStep, submitWill } = useWillSubmission({
    onSuccess: () => {
      setSubmitStatus("success");
      setIsSubmitting(false);
    },
    onError: () => {
      setSubmitStatus("error");
      setIsSubmitting(false);
    },
  });

  // Define form steps
  // L'étape "complete" est définie mais cachée dans le stepper
  const allSteps = [
    { id: "beneficiaries" as FormStep, label: "Beneficiaries" },
    { id: "assets" as FormStep, label: "Assets" },
    { id: "credentials" as FormStep, label: "Credentials" },
    { id: "note" as FormStep, label: "Note" },
    { id: "executor" as FormStep, label: "Executor" },
    { id: "review" as FormStep, label: "Review" },
    { id: "complete" as FormStep, label: "Complete" },
  ];
  
  // Filtrer les étapes qui apparaissent dans le stepper (sans l'étape "complete")
  const steps = allSteps.filter(step => step.id !== "complete");

  // Calculate progress
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = Math.round((currentStepIndex / (steps.length - 2)) * 100);

  // Navigation between steps
  const goToNextStep = () => {
    submitGoToNextStep();
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    if (!connected || !publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitWill();
      // Step change is handled in the useWillSubmission hook
    } catch (error) {
      console.error("Error submitting will:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we're in edit mode and load data if necessary
  useEffect(() => {
    if (willIdToEdit && isEditMode && originalWill) {
      // Data is already loaded in the WillContext
      console.log("Editing will:", originalWill);
    }
  }, [willIdToEdit, isEditMode, originalWill]);

  return {
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
    totalAllocation,
    isAllocationValid,
    note,
    transactionMode,
    isEditMode,
    originalWill,
  };
}
