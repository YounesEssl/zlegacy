import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { FieldGroup } from './FieldGroup';
import { ToggleReveal } from './ToggleReveal';
import type { Credential } from '../hooks/useCredentials';

interface CredentialsFormProps {
  onSubmit: (data: Omit<Credential, 'id' | 'lastUpdated'>) => Promise<boolean>;
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
    title: '',
    username: '',
    password: '',
    website: '',
    notes: '',
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
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
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
      const success = await onSubmit({
        title: formData.title!,
        username: formData.username!,
        password: formData.password!,
        website: formData.website,
        notes: formData.notes,
        type: 'seedphrase'
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
        label="Title"
        htmlFor="title"
        error={errors.title}
        required
      >
        <input
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md outline-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.title ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="e.g. Gmail, Netflix, Bank"
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
        label="Website"
        htmlFor="website"
        error={errors.website}
      >
        <input
          id="website"
          name="website"
          value={formData.website || ''}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md outline-none"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            border: errors.website ? '1px solid var(--error)' : '1px solid var(--border-color)', 
            color: 'var(--text-primary)'
          }}
          placeholder="https://example.com"
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
