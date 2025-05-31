import { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useWill } from "../WillContext";
import type { FormStep, TransactionStatus } from "../types";

/**
 * Custom hook to manage state and logic for the will creation form
 * @param testatorAddress The testator's address
 * @param willIdToEdit Optional - The ID of the will to edit
 */
export const useWillForm = (testatorAddress: string, willIdToEdit?: string | null) => {
  // Use the useWallet hook to check if the user is connected
  const { connected, publicKey } = useWallet();

  // Use the testament context
  const {
    beneficiaryAllocations,
    note,
    currentStep,
    setCurrentStep,
    isAllocationValid,
    totalAllocation,
    transactionMode,
    isEditMode,
    originalWill,
  } = useWill();

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Transaction data for blockchain tracking
  const [transactionData, setTransactionData] = useState<{
    blockHash: string;
    transactionId: string;
    confirmations: number;
    status: TransactionStatus;
    progress: number;
  }>({
    blockHash: "",
    transactionId: "",
    confirmations: 0,
    status: "pending",
    progress: 0,
  });

  // Check if testator address is available
  const hasTestatorAddress = !!testatorAddress;

  // Step configuration
  const steps: Array<{ id: FormStep; label: string }> = [
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "assets", label: "Assets" },
    { id: "credentials", label: "Credentials" },
    { id: "note", label: "Message" },
    { id: "executor", label: "Executor" },
    { id: "review", label: "Review" },
  ];

  // Progress calculation
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress =
    currentStepIndex >= 0
      ? Math.round((currentStepIndex / (steps.length - 1)) * 100)
      : 0;

  // Navigation handlers
  const goToNextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1].id;
      setCurrentStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1].id;
      setCurrentStep(prevStep);
    }
  };

  // Simulates transaction progress on the blockchain
  const simulateTransactionProgress = () => {
    // Stage 1: Transaction pending -> confirming
    setTimeout(() => {
      setTransactionData((prev) => ({
        ...prev,
        status: "confirming",
        confirmations: 1,
        progress: 35,
      }));

      // Stage 2: Confirmation progress
      setTimeout(() => {
        setTransactionData((prev) => ({
          ...prev,
          confirmations: 3,
          progress: 65,
        }));

        // Stage 3: Final confirmation
        setTimeout(() => {
          setTransactionData((prev) => ({
            ...prev,
            status: "confirmed",
            confirmations: 6,
            progress: 100,
          }));
        }, 2500);
      }, 2000);
    }, 1500);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllocationValid || beneficiaryAllocations.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call with real wallet address for connected user
      if (connected && publicKey) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate mock transaction data
        const mockBlockHash =
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
        const mockTransactionId =
          "0x" +
          Array.from({ length: 40 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");

        setTransactionData({
          blockHash: mockBlockHash,
          transactionId: mockTransactionId,
          confirmations: 0,
          status: "pending",
          progress: 10,
        });

        setSubmitStatus("success");

        // Simulate blockchain confirmations with progress
        simulateTransactionProgress();
      } else {
        // Simulate API call with demo data for disconnected user
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate mock transaction data for demo
        const mockBlockHash =
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
        const mockTransactionId =
          "0x" +
          Array.from({ length: 40 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");

        setTransactionData({
          blockHash: mockBlockHash,
          transactionId: mockTransactionId,
          confirmations: 0,
          status: "pending",
          progress: 10,
        });

        setSubmitStatus("success");

        // Simulate blockchain confirmations with progress
        simulateTransactionProgress();
      }

      setCurrentStep("complete");
    } catch (error) {
      console.error("Error submitting will:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're in edit mode, set appropriate initial step
  useEffect(() => {
    // Check if we're in edit mode (either through isEditMode from context or through willIdToEdit)
    const isEditing = isEditMode || !!willIdToEdit;
    
    if (isEditing) {
      // Log that we're in edit mode
      console.log(`Editing will ${willIdToEdit} in progress...`);
    }
  }, [isEditMode, currentStep, willIdToEdit]);

  return {
    steps,
    currentStep,
    currentStepIndex,
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
    isAllocationValid,
    totalAllocation,
    note,
    transactionMode,
    testatorAddress,
    isEditMode,
    originalWill,
  };
};
