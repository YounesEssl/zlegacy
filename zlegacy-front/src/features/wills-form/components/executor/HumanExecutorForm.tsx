import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { Executor } from '../../types';

interface HumanExecutorFormProps {
  formData: Partial<Executor>;
  updateFormData: (data: Partial<Executor>) => void;
}

/**
 * Human Executor Form Component
 * 
 * Form for entering details about a human executor who will manage the will execution
 */
const HumanExecutorForm: React.FC<HumanExecutorFormProps> = ({
  formData,
  updateFormData
}) => {
  // Update a single field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  return (
    <div className="bg-opacity-50 rounded-xl p-5 animate-fadeIn"
      style={{ backgroundColor: 'var(--bg-tertiary)' }}>
      <h3 className="text-lg font-medium mb-4"
        style={{ color: 'var(--text-primary)' }}>
        Human Executor Details
      </h3>
      
      <div className="mb-4 p-3 rounded-lg flex items-start space-x-3"
        style={{ backgroundColor: 'var(--bg-info)', color: 'var(--text-info)' }}>
        <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          The person you designate as executor will be responsible for ensuring your digital assets are distributed according to your wishes. Choose someone you trust completely.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label 
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
            placeholder="Enter executor's full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label 
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Wallet Address *
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
            placeholder="aleo1..."
            required
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            The executor must have an Aleo wallet to manage the assets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              placeholder="Email for notifications"
            />
          </div>
          
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              placeholder="Alternate contact method"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: 'var(--bg-warning-subtle)' }}>
          <p className="text-sm" style={{ color: 'var(--text-warning)' }}>
            <strong>Important:</strong> Make sure the executor is aware of their role and has agreed to serve in this capacity. They will only be notified after the will is executed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HumanExecutorForm;
