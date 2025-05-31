import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, ServerIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import type { ExecutorType } from '../../types';

interface ExecutorTypeSelectorProps {
  selectedType: ExecutorType | null;
  onSelectType: (type: ExecutorType) => void;
}

/**
 * ExecutorTypeSelector Component
 * 
 * A visual selector that allows users to choose between three executor types:
 * - Human executor (individual person)
 * - Protocol-hosted executor (managed by Nexa)
 * - Self-hosted executor (managed by the user)
 */
const ExecutorTypeSelector: React.FC<ExecutorTypeSelectorProps> = ({
  selectedType,
  onSelectType
}) => {
  // Options data with icons and descriptions
  const executorOptions = [
    {
      type: 'human' as ExecutorType,
      title: 'Human Executor',
      description: 'Appoint a trusted person to handle the execution of your will',
      icon: UserCircleIcon,
      benefits: [
        'Personal oversight of the process',
        'Can make discretionary decisions',
        'Full trust in someone close to you'
      ]
    },
    {
      type: 'protocol' as ExecutorType,
      title: 'Protocol-Hosted',
      description: 'Let the Nexa protocol automatically handle execution',
      icon: ServerIcon,
      benefits: [
        'Fully automated execution',
        'No dependence on human availability',
        'Maximum privacy and security'
      ]
    },
    {
      type: 'self-hosted' as ExecutorType,
      title: 'Self-Hosted',
      description: 'Run your own executor node on your infrastructure',
      icon: ComputerDesktopIcon,
      benefits: [
        'Complete control over execution',
        'Independence from third parties',
        'Advanced customization options'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {executorOptions.map((option) => {
        const isSelected = selectedType === option.type;
        
        return (
          <motion.div
            key={option.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectType(option.type)}
            className={`
              p-4 rounded-xl cursor-pointer transition-all duration-200 border
              ${isSelected 
                ? 'ring-2 ring-offset-2 border-transparent' 
                : 'hover:shadow-md'
              }
            `}
            style={{
              backgroundColor: isSelected ? 'var(--bg-selected)' : 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="flex flex-col items-center text-center h-full">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: isSelected 
                    ? 'var(--accent-primary-translucent)' 
                    : 'var(--bg-tertiary)'
                }}
              >
                <option.icon 
                  className="w-8 h-8" 
                  style={{ 
                    color: isSelected 
                      ? 'var(--accent-primary)' 
                      : 'var(--text-secondary)' 
                  }} 
                />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {option.description}
              </p>
              
              <div className="mt-auto w-full">
                <div 
                  className="text-xs font-medium p-1 rounded mb-1"
                  style={{ 
                    backgroundColor: isSelected 
                      ? 'var(--accent-primary-translucent)' 
                      : 'var(--bg-tertiary)',
                    color: isSelected 
                      ? 'var(--accent-primary)' 
                      : 'var(--text-secondary)'
                  }}
                >
                  Key Benefits
                </div>
                <ul className="text-xs text-left space-y-1 pl-2">
                  {option.benefits.map((benefit, index) => (
                    <li 
                      key={index} 
                      className="flex items-start"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="mr-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ExecutorTypeSelector;
