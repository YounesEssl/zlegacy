import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import type { Executor } from '../../types';

interface SelfHostedExecutorFormProps {
  formData: Partial<Executor>;
  updateFormData: (data: Partial<Executor>) => void;
}

/**
 * Self-Hosted Executor Form Component
 * 
 * Form for entering details about a self-hosted executor node
 * This is an advanced option for users who want to run their own executor
 */
const SelfHostedExecutorForm: React.FC<SelfHostedExecutorFormProps> = ({
  formData,
  updateFormData
}) => {
  // Update a single field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  return (
    <div className="bg-opacity-50 rounded-xl p-5 animate-fadeIn"
      style={{ backgroundColor: 'var(--bg-tertiary)' }}>
      <h3 className="text-lg font-medium mb-4"
        style={{ color: 'var(--text-primary)' }}>
        Self-Hosted Executor Configuration
      </h3>
      
      <div className="mb-4 p-3 rounded-lg flex items-start space-x-3"
        style={{ 
          backgroundColor: 'var(--bg-warning-subtle)', 
          color: 'var(--text-warning)' 
        }}>
        <CodeBracketIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          <strong>Advanced Option:</strong> Self-hosting requires technical knowledge and ongoing maintenance of an executor node. Only select this if you're familiar with blockchain infrastructure.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label 
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Node Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
            placeholder="Enter your executor node address"
            required
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            This should be the public address of your executor node.
          </p>
        </div>
        
        <div className="space-y-2">
          <label 
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Configuration Details *
          </label>
          <textarea
            name="details"
            value={formData.details || ''}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
            placeholder="Enter node configuration details, backup procedures, and maintenance notes"
            required
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}>
            Self-Hosted Requirements
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h5 className="text-xs font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}>
                Hardware Requirements
              </h5>
              <ul className="text-xs space-y-1 pl-2"
                style={{ color: 'var(--text-secondary)' }}>
                <li>• 4+ CPU cores</li>
                <li>• 8GB+ RAM</li>
                <li>• 100GB+ SSD storage</li>
                <li>• Stable internet connection</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h5 className="text-xs font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}>
                Software Requirements
              </h5>
              <ul className="text-xs space-y-1 pl-2"
                style={{ color: 'var(--text-secondary)' }}>
                <li>• Linux OS (Ubuntu 20.04+ recommended)</li>
                <li>• Docker & Docker Compose</li>
                <li>• Nexa Executor Node software</li>
                <li>• Regular security updates</li>
              </ul>
            </div>
          </div>
          
          <div className="p-3 rounded-lg border-l-4"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderLeftColor: 'var(--accent-secondary)'
            }}>
            <p className="text-xs"
              style={{ color: 'var(--text-secondary)' }}>
              <strong>Note:</strong> You will need to keep your node online 24/7 to ensure proper execution of your will when needed. Consider redundancy options to prevent single points of failure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfHostedExecutorForm;
