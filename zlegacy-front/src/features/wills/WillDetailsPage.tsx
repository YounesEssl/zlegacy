import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WillDetails from './components/WillDetails';
import type { Will } from './types';

// Importer directement les données de démo
import { demoWills } from './hooks/useWills';

const WillDetailsPage: React.FC = () => {
  const { willId } = useParams<{ willId: string }>();
  const navigate = useNavigate();
  
  const [will, setWill] = useState<Will | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadWillDetails = () => {
      if (!willId) {
        setError('Invalid will ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Loading will with ID:', willId);
        
        // Utiliser directement les données de démo importées
        const foundWill = demoWills.find((w: Will) => w.id === willId);
        console.log('Found will:', foundWill);
        
        if (foundWill) {
          setWill(foundWill);
        } else {
          setError('Will not found');
        }
      } catch (err) {
        setError('Failed to load will details');
        console.error('Error loading will details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Ajouter un petit délai pour simuler le chargement et éviter le flash d'UI
    const timer = setTimeout(() => {
      loadWillDetails();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [willId]);
  
  const handleBack = () => {
    navigate('/wills');
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-b-transparent rounded-full animate-spin" 
               style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}>
          </div>
          <div className="absolute top-1 left-1 w-14 h-14 border-4 border-l-transparent border-r-transparent rounded-full animate-spin" 
               style={{ borderColor: 'var(--accent-secondary)', borderLeftColor: 'transparent', borderRightColor: 'transparent', animationDuration: '1.2s' }}>
          </div>
        </div>
        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Loading will details...</p>
      </div>
    );
  }
  
  if (error || !will) {
    return (
      <motion.div 
        className="rounded-lg p-4 flex items-start space-x-3 max-w-lg mx-auto mt-8"
        style={{ backgroundColor: 'rgba(var(--error-rgb), 0.1)', borderLeft: '4px solid var(--error)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: 'var(--error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 className="font-medium" style={{ color: 'var(--error)' }}>Error</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error || 'Will not found'}</p>
          <button 
            className="mt-3 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            onClick={handleBack}
          >
            Return to Wills
          </button>
        </div>
      </motion.div>
    );
  }
  
  return <WillDetails will={will} onBack={handleBack} />;
};

export default WillDetailsPage;
