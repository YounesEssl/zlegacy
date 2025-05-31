import React from 'react';
import { motion } from 'framer-motion';
import type { FormStep } from '../types';

interface FormProgressBarProps {
  steps: Array<{ id: FormStep; label: string }>;
  currentStep: FormStep;
  progress: number;
}

/**
 * Composant qui affiche la barre de progression pour le formulaire à étapes
 */
const FormProgressBar: React.FC<FormProgressBarProps> = ({ 
  steps, 
  currentStep, 
  progress 
}) => {
  if (currentStep === 'complete') return null;

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => {
          const isActive = currentStepIndex >= index;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${isCurrent ? "ring-2" : ""}
                `}
                style={{
                  backgroundColor: isActive
                    ? "var(--accent-primary)"
                    : "var(--bg-tertiary)",
                  color: isActive ? "white" : "var(--text-muted)",
                }}
              >
                {index + 1}
              </div>
              <span
                className="text-xs mt-1"
                style={{
                  color: isActive
                    ? "var(--accent-primary)"
                    : "var(--text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative pt-1">
        <div
          className="overflow-hidden h-2 text-xs flex rounded"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default FormProgressBar;
