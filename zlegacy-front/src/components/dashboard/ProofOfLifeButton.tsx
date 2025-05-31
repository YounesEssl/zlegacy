import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface ProofOfLifeButtonProps {
  isButtonPressed: boolean;
  handleProofOfLife: () => void;
  className?: string; // Prop optionnelle pour les styles personnalisés
}

/**
 * Bouton "I'm Alive!" avec animations avancées
 */
const ProofOfLifeButton: React.FC<ProofOfLifeButtonProps> = ({ 
  isButtonPressed, 
  handleProofOfLife,
  className = '' // Valeur par défaut vide
}) => {
  return (
    <div className="absolute bottom-5 right-5 z-20">
      <motion.button
        onClick={handleProofOfLife}
        whileHover={{
          scale: 1.05,
          y: -5,
        }}
        whileTap={{ 
          scale: 0.95,
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
        }}
        animate={isButtonPressed ? { 
          scale: [1, 1.2, 1],
          boxShadow: "0 15px 25px rgba(0, 0, 0, 0.4)",
        } : {
          y: [0, -3, 0],
          boxShadow: ['0 10px 25px rgba(0, 0, 0, 0.3)', '0 15px 30px rgba(0, 0, 0, 0.4)', '0 10px 25px rgba(0, 0, 0, 0.3)'],
        }}
        transition={{ 
          duration: 0.4,
          y: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2
          },
          boxShadow: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2
          }
        }}
        className={`relative overflow-hidden group px-6 py-4 rounded-2xl font-bold tracking-wide ${className}`}
        style={{
          background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          transform: 'perspective(1000px) rotateX(5deg)',
        }}
      >
        {/* Effet de brillance au survol avec animation automatique */}
        <span 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            transform: 'skewX(-45deg) translateX(-150%)',
            animation: 'shine 2s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
        
        {/* Animation d'onde du bouton */}
        <span className="absolute inset-0 scale-[1.5] rounded-2xl">
          <span className="absolute inset-0 rounded-2xl bg-pink-600/30 animate-ping" style={{ animationDuration: '3s' }} />
        </span>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <motion.div
              animate={{ 
                scale: isButtonPressed ? [1, 1.4, 1] : [1, 1.2, 1],
                rotate: isButtonPressed ? [0, 15, -5, 0] : 0,
              }}
              transition={{ 
                repeat: isButtonPressed ? 0 : Infinity, 
                duration: isButtonPressed ? 0.5 : 1.2
              }}
              className="relative z-10"
            >
              {isButtonPressed ? (
                <HeartSolidIcon className="w-8 h-8 text-white drop-shadow-lg" />
              ) : (
                <HeartIcon className="w-8 h-8 text-white drop-shadow-lg" />
              )}
            </motion.div>
            {!isButtonPressed && (
              <span className="absolute inset-0 rounded-full animate-ping bg-white/50" 
                style={{ animationDuration: '1.5s' }}
              />
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-lg">I'm Alive!</span>
            <span className="text-white/80 text-xs -mt-1">Click to confirm</span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default ProofOfLifeButton;
