import { useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { useWill } from '../WillContext';
// Import API functions are commented out since we're not making API calls
// import { createWill, updateWill } from '../../../api/willApi';
import type { FormStep } from '../types';

interface UseWillSubmissionProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useWillSubmission = ({ onSuccess, onError }: UseWillSubmissionProps = {}) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    beneficiaryAllocations,
    note,
    transactionMode,
    isEditMode,
    willIdToEdit,
    currentStep,
    setCurrentStep
  } = useWill();

  // Validation for different steps
  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case 'beneficiaries':
        // Check if beneficiaries have been added
        return beneficiaryAllocations.length > 0;
        
      case 'assets':
        // For this step, we'll simply proceed to the next step
        return true;
        
      case 'credentials':
        // For this step, we'll simply proceed to the next step
        return true;
        
      case 'note':
        // No validation needed for the note
        return true;
        
      case 'executor':
        // For this step, we'll simply proceed to the next step
        return true;
        
      case 'review':
        // Check if all required elements are present
        return beneficiaryAllocations.length > 0;
        
      default:
        return true;
    }
  };

  // Move to the next step
  const goToNextStep = () => {
    // Validate the current step
    if (!validateStep(currentStep)) {
      setError(new Error('Validation failed for step ' + currentStep));
      return;
    }

    // Move to the next step based on the current step
    switch (currentStep) {
      case 'beneficiaries':
        setCurrentStep('assets');
        break;
      case 'assets':
        setCurrentStep('credentials');
        break;
      case 'credentials':
        setCurrentStep('note');
        break;
      case 'note':
        setCurrentStep('executor');
        break;
      case 'executor':
        setCurrentStep('review');
        break;
      case 'review':
        submitWill();
        break;
      default:
        break;
    }
  };

  // Submit the will
  const submitWill = async () => {
    if (!publicKey) {
      setError(new Error('You must be connected to create a will'));
      onError?.(new Error('You must be connected to create a will'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const willData = {
        title: `Will - ${new Date().toLocaleDateString()}`,
        beneficiaryAllocations,
        note: note || '',
        transactionMode,
      };

      console.log('Will data to be submitted:', willData);

      // Skipping API calls for now
      if (isEditMode && willIdToEdit) {
        // Would update an existing will
        console.log('Would update will with ID:', willIdToEdit);
        console.log('API call to updateWill skipped as requested');
      } else {
        // Would create a new will
        console.log('Would create a new will');
        console.log('API call to createWill skipped as requested');
      }
      
      // Simulate a successful response
      // No need to store the response since we're not using it
      console.log('Simulated response:', { id: 'mock-will-id', ...willData });

      // Move to the confirmation step
      setCurrentStep('complete');
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting the will:', err);
      setError(err instanceof Error ? err : new Error('An error occurred'));
      onError?.(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    goToNextStep,
    submitWill,
    validateStep,
    currentStep
  };
};
