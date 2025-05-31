import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, Check, X } from 'lucide-react';
import type { ImportFormat } from '../hooks/useCredentials';
import { useTheme } from '../../../contexts/ThemeContext';

interface ImportButtonProps {
  onImport: (data: ImportFormat[]) => Promise<boolean>;
  inline?: boolean;
}

export const ImportButton: React.FC<ImportButtonProps> = ({ onImport, inline = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme } = useTheme();

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const parseCSV = (content: string): ImportFormat[] => {
    const lines = content.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',').map(v => v.trim());
        const entry: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          if (index < values.length) {
            entry[header] = values[index];
          }
        });
        
        return entry as ImportFormat;
      });
  };
  
  const parseJSON = (content: string): ImportFormat[] => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [parsed];
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('loading');
    
    try {
      const content = await file.text();
      let parsedData: ImportFormat[] = [];
      
      if (file.name.endsWith('.csv')) {
        parsedData = parseCSV(content);
      } else if (file.name.endsWith('.json')) {
        parsedData = parseJSON(content);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }
      
      if (parsedData.length === 0) {
        throw new Error('No valid entries found in file');
      }
      
      const success = await onImport(parsedData);
      
      if (success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error('Failed to import credentials');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setTimeout(() => setStatus('idle'), 5000);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDismissError = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  const buttonColorClass = theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200';
  
  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {inline ? (
        <button
          onClick={handleImportClick}
          disabled={status === 'loading'}
          className="text-sm underline hover:no-underline"
          style={{ color: 'var(--accent-primary)' }}
        >
          Import from CSV/JSON
        </button>
      ) : (
        <motion.button
          onClick={handleImportClick}
          disabled={status === 'loading'}
          className={`flex items-center px-4 py-2 rounded-lg ${buttonColorClass} text-foreground`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={18} className="mr-2" />
          Import from Password Manager
        </motion.button>
      )}

      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${inline ? 'top-0 -mt-10' : 'top-full mt-2'} left-0 w-full p-2 rounded text-sm flex items-center`}
            style={{ 
              backgroundColor: 'rgba(var(--accent-primary-rgb), 0.15)', 
              color: 'var(--accent-primary)' 
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Upload size={16} className="mr-2" />
            </motion.div>
            Importing...
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${inline ? 'top-0 -mt-10' : 'top-full mt-2'} left-0 w-full p-2 rounded text-sm flex items-center`}
            style={{ 
              backgroundColor: 'rgba(var(--success-rgb), 0.15)', 
              color: 'var(--success)' 
            }}
          >
            <Check size={16} className="mr-2" />
            Credentials imported successfully!
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${inline ? 'top-0 -mt-10' : 'top-full mt-2'} left-0 w-full p-2 rounded text-sm flex items-center justify-between`}
            style={{ 
              backgroundColor: 'rgba(var(--error-rgb), 0.15)', 
              color: 'var(--error)' 
            }}
          >
            <div className="flex items-center">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-2">{errorMessage}</span>
            </div>
            <button
              onClick={handleDismissError}
              className="ml-2 p-1 rounded-full"
              style={{ backgroundColor: 'rgba(var(--error-rgb), 0.2)' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
