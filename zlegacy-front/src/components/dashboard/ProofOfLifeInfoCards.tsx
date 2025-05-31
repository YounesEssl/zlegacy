import React from 'react';
import { motion } from 'framer-motion';

interface ProofOfLifeInfoCardsProps {
  fillPercentage: number;
  remainingTime: string;
  nextDeadlineDate: Date | null;
}

/**
 * Composant affichant les trois cartes d'information:
 * - Pourcentage restant
 * - Temps restant
 * - Date limite
 */
const ProofOfLifeInfoCards: React.FC<ProofOfLifeInfoCardsProps> = ({
  fillPercentage,
  remainingTime,
  nextDeadlineDate
}) => {
  return (
    <div className="mb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* Pourcentage - Composant style jauge circulaire */}
        <div 
          className="backdrop-blur-sm p-3 relative overflow-hidden rounded-xl flex flex-col items-center justify-center group transition-all duration-300 hover:scale-105"
          style={{
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            backgroundColor: 'var(--bg-primary)',
            opacity: 0.95
          }}
        >
          {/* Utilisation d'un dégradé basé sur les variables CSS */}
          <div className="absolute inset-0 bg-gradient-to-br"
            style={{
              opacity: 0.2,
              background: fillPercentage > 60 ? 
                `linear-gradient(135deg, var(--accent-tertiary), transparent)` : 
                fillPercentage > 30 ? 
                `linear-gradient(135deg, var(--accent-secondary), transparent)` : 
                `linear-gradient(135deg, var(--accent-error), transparent)`
            }}
          />
          
          {/* Cercle de progression */}
          <div className="relative w-14 h-14 mb-1">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Cercle background */}
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-300 opacity-25" strokeWidth="3" />
              
              {/* Cercle de progression */}
              <circle 
                cx="18" cy="18" r="16" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray={`${Math.round(fillPercentage)}  100`}
                strokeDashoffset="0"
                transform="rotate(-90 18 18)"
                strokeWidth="3"
                className="transition-all duration-700 ease-in-out"
                style={{
                  stroke: fillPercentage > 60 ? "var(--accent-tertiary)" : 
                        fillPercentage > 30 ? "var(--accent-secondary)" : "var(--accent-error)",
                }}
              />
              
              {/* Texte central */}
              <text 
                x="18" y="19" 
                textAnchor="middle" 
                className="font-bold"
                style={{
                  fill: fillPercentage > 60 ? "var(--accent-tertiary)" : 
                      fillPercentage > 30 ? "var(--accent-secondary)" : "var(--accent-error)",
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                {Math.round(fillPercentage)}
              </text>
              
              {/* Symbole % */}
              <text 
                x="18" y="25" 
                textAnchor="middle" 
                className="font-medium"
                style={{
                  fill: fillPercentage > 60 ? "var(--accent-tertiary)" : 
                      fillPercentage > 30 ? "var(--accent-secondary)" : "var(--accent-error)",
                  fontSize: '7px',
                  opacity: 0.9
                }}
              >
                %
              </text>
            </svg>
          </div>
          
          <div className="flex items-center gap-1">
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ 
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-primary)', 
                opacity: 0.95
              }}
            >
              Remaining
            </span>
          </div>
        </div>
        
        {/* Temps restant - Composant style timer digital */}
        <div 
          className="backdrop-blur-sm p-3 relative overflow-hidden rounded-xl flex flex-col items-center justify-center group transition-all duration-300 hover:scale-105"
          style={{
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            backgroundColor: 'var(--bg-primary)',
            opacity: 0.95
          }}
        >
          {/* Utilisation d'un dégradé basé sur les variables CSS */}
          <div className="absolute inset-0 bg-gradient-to-br"
            style={{
              opacity: 0.2,
              background: `linear-gradient(135deg, var(--accent-primary), transparent)`
            }}
          />
          
          <div className="relative flex items-center mb-1">
            {/* Icône d'horloge animée */}
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <motion.path 
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ transformOrigin: "center" }}
                className="opacity-75" 
                strokeLinecap="round" 
                strokeWidth="2"
                d="M12 8v4l3 3"
                stroke="currentColor"
              />
            </svg>
            
            <span 
              className="text-xl font-mono font-bold"
              style={{ 
                color: `var(--text-primary)`,
                textShadow: `0 0 3px var(--accent-primary)`
              }}
            >
              {remainingTime}
            </span>
          </div>
          
          <div className="flex items-center">
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ 
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-primary)', 
                opacity: 0.95
              }}
            >
              Time Left
            </span>
          </div>
        </div>
        
        {/* Date limite - Composant style mini calendrier */}
        <div 
          className="backdrop-blur-sm p-3 relative overflow-hidden rounded-xl flex flex-col items-center justify-center group transition-all duration-300 hover:scale-105"
          style={{
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            backgroundColor: 'var(--bg-primary)',
            opacity: 0.95
          }}
        >
          {/* Utilisation d'un dégradé basé sur les variables CSS */}
          <div 
            className="absolute inset-0 bg-gradient-to-br" 
            style={{
              opacity: 0.2,
              background: `linear-gradient(135deg, var(--accent-secondary), transparent)`
            }}
          />
          
          {nextDeadlineDate ? (
            <div className="relative flex flex-col items-center mb-1 rounded-lg p-1 px-2" style={{ backgroundColor: 'var(--bg-primary)', opacity: 0.95 }}>
              {/* Partie mois + année */}
              <div className="text-xs font-medium uppercase tracking-wider"
                   style={{ 
                     color: `var(--accent-primary)`,
                     textShadow: `0px 0px 1px var(--shadow-sm)` 
                    }}>
                {nextDeadlineDate.toLocaleDateString(undefined, { month: 'short' })} {nextDeadlineDate.getFullYear()}
              </div>
              
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ 
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)', 
                  opacity: 0.95
                }}
              >    
                {nextDeadlineDate.getDate()}
              </span>
            </div>
          ) : (
            <div className="relative text-lg font-semibold mb-1"
                 style={{ color: 'var(--text-primary)' }}>
              Not set
            </div>
          )}
          
          <div className="flex items-center">
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ 
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-primary)', 
                opacity: 0.95
              }}
            >
              Deadline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofOfLifeInfoCards;
