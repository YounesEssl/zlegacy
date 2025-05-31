import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import { useWill } from '../WillContext';
import type { Executor, ExecutorType } from '../types';
import ExecutorTypeSelector from './executor/ExecutorTypeSelector';
import HumanExecutorForm from './executor/HumanExecutorForm';
import ProtocolExecutorInfo from './executor/ProtocolExecutorInfo';
import SelfHostedExecutorForm from './executor/SelfHostedExecutorForm';

interface ExecutorStepProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

/**
 * Executor Selection Step Component
 * 
 * This component allows users to choose between different types of executors:
 * - Human executor (person physically responsible)
 * - Protocol-hosted executor (managed by the Nexa protocol)
 * - Self-hosted executor (managed by the user themselves)
 */
const ExecutorStep: React.FC<ExecutorStepProps> = ({
  goToNextStep,
  goToPreviousStep
}) => {
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };
  
  const { executor, setExecutor } = useWill();
  const [selectedType, setSelectedType] = useState<ExecutorType | null>(
    executor?.type || null
  );
  
  // Set default selection if none exists
  useEffect(() => {
    if (!selectedType) {
      setSelectedType('protocol');
    }
  }, [selectedType]);

  // Local state for form data
  const [formData, setFormData] = useState<Partial<Executor>>(executor || {
    type: 'protocol'
  });

  // Handle type selection
  const handleTypeSelect = (type: ExecutorType) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  // Update form data
  const updateFormData = (data: Partial<Executor>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Save and continue
  const handleContinue = () => {
    setExecutor(formData as Executor);
    goToNextStep();
  };

  // Check if the form is valid
  const isFormValid = () => {
    if (!selectedType) return false;
    
    switch (selectedType) {
      case 'human':
        return !!(formData.name && formData.address);
      case 'protocol':
        return true; // Protocol-hosted executors don't need additional info
      case 'self-hosted':
        return !!(formData.address && formData.details);
      default:
        return false;
    }
  };

  // Render form based on selected type
  const renderForm = () => {
    switch (selectedType) {
      case 'human':
        return (
          <HumanExecutorForm 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 'protocol':
        return <ProtocolExecutorInfo />;
      case 'self-hosted':
        return (
          <SelfHostedExecutorForm 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="executor-step"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <h2
        className="text-2xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Choose an Executor
      </h2>
      <p style={{ color: "var(--text-secondary)" }}>
        Select how your will should be executed after your passing. The executor is responsible for ensuring your digital assets are distributed according to your wishes.
      </p>

      <ExecutorTypeSelector 
        selectedType={selectedType} 
        onSelectType={handleTypeSelect} 
      />

      <div className="mt-8">
        {renderForm()}
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>

        <Button
          onClick={handleContinue}
          rightIcon={<ArrowRightIcon className="w-4 h-4" />}
          disabled={!isFormValid()}
        >
          Continue to Review
        </Button>
      </div>
    </motion.div>
  );
};

export default ExecutorStep;
