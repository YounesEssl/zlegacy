import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { FieldGroup } from './FieldGroup';
import { ToggleReveal } from './ToggleReveal';
import type { Credential, NewCredentialFormData } from '../types';

interface CredentialsFormProps {
  onSubmit: (data: NewCredentialFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<Credential>;
  isEdit?: boolean;
}

export const CredentialsForm: React.FC<CredentialsFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<Credential>>({
    name: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    type: 'standard',
    ...initialData,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Soumission du credential avec le type:', formData.type);
      const success = await onSubmit({
        name: formData.name!,
        username: formData.username!,
        password: formData.password!,
        url: formData.url,
        notes: formData.notes,
        type: formData.type || 'standard' 
      });
      
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Error submitting credential:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 shadow-sm"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Credential' : 'Add New Credential'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-md transition-colors"
          style={{ backgroundColor: 'rgba(var(--text-muted-rgb), 0.1)' }}
          aria-label="Close form"
        >
          <X size={18} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
      
      <FieldGroup
        label="Name"
        htmlFor="name"
        error={errors.name}
        required
      >
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name || ''} 
          onChange={handleChange} 
          className="w-full p-2.5 rounded-md" 
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            border: errors.name ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          disabled={isSubmitting}
        />
      </FieldGroup>
      
      <FieldGroup
        label="Username"
        htmlFor="username"
        error={errors.username}
        required
      >
        <input
          id="username"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md outline-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.username ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="email@example.com"
        />
      </FieldGroup>
      
      <FieldGroup
        label="Password"
        htmlFor="password"
        error={errors.password}
        required
      >
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password || ''}
            onChange={handleChange}
            className="w-full p-2.5 pr-10 rounded-md outline-none"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)',
              border: errors.password ? '1px solid var(--error)' : '1px solid var(--border-color)', 
              color: 'var(--text-primary)'
            }}
            placeholder="••••••••"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <ToggleReveal
              initialVisible={showPassword}
              onToggle={setShowPassword}
            />
          </div>
        </div>
      </FieldGroup>
      
      <FieldGroup
        label="Website URL"
        htmlFor="url"
        error={errors.url}
      >
        <input
          id="url"
          name="url"
          value={formData.url || ''}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md outline-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.url ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="e.g. https://gmail.com"
        />
      </FieldGroup>
      
      <FieldGroup
        label="Notes"
        htmlFor="notes"
        error={errors.notes}
        description="Any additional information you want to store securely"
      >
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          className="w-full p-2.5 rounded-md outline-none resize-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.notes ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="Additional notes..."
        />
      </FieldGroup>
      
      <div className="flex justify-end space-x-3 mt-6">
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)' 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          Cancel
        </motion.button>
        
        <motion.button
          type="submit"
          className="px-4 py-2 rounded-md flex items-center"
          style={{ 
            backgroundColor: 'var(--accent-primary)',
            color: 'white' 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          <Save size={18} className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Credential'}
        </motion.button>
      </div>
    </motion.form>
  );
};
