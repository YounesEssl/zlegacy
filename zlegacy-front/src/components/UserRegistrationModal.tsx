import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string) => void;
  walletAddress: string;
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  walletAddress,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    
    onSubmit(firstName, lastName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" 
              style={{ borderColor: "var(--border-color)" }}>
              <h3 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                Complete Your Profile
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  Wallet Address
                </div>
                <div className="p-3 rounded-lg font-mono text-sm truncate" 
                  style={{ 
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-secondary)"
                  }}>
                  {walletAddress}
                </div>
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="firstName" 
                  className="block text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)"
                  }}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="lastName" 
                  className="block text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)"
                  }}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm" 
                  style={{
                    backgroundColor: "var(--accent-error-transparent)",
                    color: "var(--accent-error)"
                  }}>
                  {error}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)"
                  }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))",
                    color: "white"
                  }}
                >
                  Save Profile
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserRegistrationModal;
