import React, { useRef, useEffect, useState } from "react";

interface LiquidWaveProps {
  fillPercentage: number;
  color?: string;
  className?: string;
  isDarkMode?: boolean;
}

const LiquidWave: React.FC<LiquidWaveProps> = ({ 
  fillPercentage, 
  color,
  className = "",
  isDarkMode = true,
}) => {
  // Détecter si on est en mode clair ou sombre
  const [isDarkModeState, setIsDarkModeState] = useState(isDarkMode);
  
  // Détecter le thème actuel
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      setIsDarkModeState(isDark);
    };
    
    checkTheme();
    
    // Observer les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  // Référence au canvas pour l'animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Clamp fillPercentage entre 0 et 100
  const clampedFill = Math.max(0, Math.min(100, fillPercentage));
  
  // Déterminer la couleur en fonction du pourcentage en utilisant les variables CSS
  const getComputedColor = () => {
    // Utiliser getComputedStyle pour obtenir les couleurs du thème actuel
    const accentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
    const accentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim();
    const accentError = getComputedStyle(document.documentElement).getPropertyValue('--accent-error').trim();
    
    if (clampedFill > 60) {
      return accentPrimary || "#3b82f6"; // Bleu
    } else if (clampedFill > 30) {
      return accentSecondary || "#f59e0b"; // Jaune/Orange
    } else {
      return accentError || "#ef4444"; // Rouge
    }
  };
  
  const waveColor = color || getComputedColor();
  
  // Animation des vagues
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let increment = 0;
    
    // Ajuster la taille du canvas pour qu'il occupe tout l'espace disponible
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    // Initialiser la taille du canvas
    resizeCanvas();
    
    // Réagir aux changements de taille de la fenêtre
    window.addEventListener('resize', resizeCanvas);
    
    // Fonction pour dessiner les vagues avec extension sur la droite
    const renderWave = () => {
      if (!ctx || !canvas) return;
      
      // Effacer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Définir le niveau de remplissage (0 = vide, 1 = plein)
      const fillLevel = (100 - clampedFill) / 100 * canvas.height;
      
      // Configuration des vagues
      const wave1Config = {
        color: waveColor,
        amplitude: 10, // Hauteur des vagues
        frequency: 0.01, // Fréquence pour des vagues plus larges
        speed: 0.04, // Vitesse pour une animation plus lente
        opacity: 0.5, // Opacité pour plus de transparence
        phase: increment // Phase qui change avec le temps
      };
      
      const wave2Config = {
        color: waveColor,
        amplitude: 8, // Plus petit pour la seconde vague
        frequency: 0.015, 
        speed: 0.03,
        opacity: 0.3, // Plus transparent
        phase: increment * 0.7 // Phase différente
      };
      
      // Dessiner le fond semi-transparent avec opacité adaptée au thème
      // Mode clair: opacité plus élevée pour une meilleure visibilité
      const bgOpacity = isDarkModeState ? '50' : '75'; // 31% en mode sombre, 46% en mode clair
      ctx.fillStyle = `${waveColor}${bgOpacity}`;
      // Extension du rectangle de remplissage pour s'assurer qu'il couvre tout l'espace
      ctx.fillRect(0, fillLevel, canvas.width + 10, canvas.height);
      
      // Fonction pour dessiner une vague
      const drawWave = (config: typeof wave1Config) => {
        ctx.beginPath();
        ctx.moveTo(0, fillLevel);
        
        // Dessiner la courbe ondulante avec extension sur la droite
        // Augmenter la largeur pour s'assurer que ça va jusqu'au bord
        for (let x = 0; x <= canvas.width + 20; x += 10) {
          const y = fillLevel + Math.sin(x * config.frequency + config.phase) * config.amplitude;
          ctx.lineTo(x, y);
        }
        
        // Compléter le chemin pour remplir jusqu'au bas avec extension à droite
        ctx.lineTo(canvas.width + 20, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Appliquer le style et remplir
        ctx.fillStyle = `${config.color}${Math.round(config.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      };
      
      // Dessiner les deux vagues
      drawWave(wave1Config);
      drawWave(wave2Config);
      
      // Incrémenter pour animer (vitesse réduite)
      increment += 0.02;
      
      // Continuer l'animation
      animationFrameId = requestAnimationFrame(renderWave);
    };
    
    // Démarrer l'animation
    renderWave();
    
    // Nettoyer lors du démontage
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [clampedFill, waveColor]);
  
  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      {/* Canvas pour l'animation des vagues - ajustement pour étendre plus vers la droite */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-[102%] h-full left-0"
        style={{ zIndex: 1 }}
      />
      
      {/* Bulles améliorées qui remontent à travers le liquide */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2, pointerEvents: 'none' }}>
        {/* Fonction pour déterminér si une bulle doit être affichée selon le niveau de remplissage */}
        {(() => {
          // Seulement générer des bulles si le niveau est > 5%
          if (clampedFill < 5) return null;
          
          // Nombres de bulles adapté au niveau de liquide
          const smallBubbleCount = Math.max(3, Math.floor(clampedFill / 10));
          const mediumBubbleCount = Math.max(2, Math.floor(clampedFill / 20));
          const largeBubbleCount = Math.max(1, Math.floor(clampedFill / 30));
          
          // Les bulles à afficher
          const bubbles = [];
          
          // Petites bulles
          for (let i = 0; i < smallBubbleCount; i++) {
            const size = 2 + Math.random() * 4;
            // Position en pourcentage depuis le bas, en commençant sous la zone visible
            // Positionner les bulles en-dehors de la zone visible (-10% à -5%) pour qu'elles apparaissent progressivement
            const bottomPos = -10 + Math.random() * 5;
            
            bubbles.push(
              <div 
                key={`small-bubble-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${5 + Math.random() * 90}%`,
                  bottom: `${bottomPos}%`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))',
                  boxShadow: '0 0 2px rgba(255, 255, 255, 0.4)',
                  animation: `${i % 3 === 0 ? 'bubble-rise' : i % 3 === 1 ? 'bubble-rise-alt' : 'bubble-rise-third'} ${5 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 15}px)`,
                }}
              />
            );
          }
          
          // Bulles moyennes
          for (let i = 0; i < mediumBubbleCount; i++) {
            const size = 4 + Math.random() * 7;
            // Position en pourcentage depuis le bas, en commençant sous la zone visible
            // Positionner les bulles moyennes un peu plus bas (-15% à -10%)
            const bottomPos = -15 + Math.random() * 5;
            
            bubbles.push(
              <div 
                key={`medium-bubble-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${10 + Math.random() * 80}%`,
                  bottom: `${bottomPos}%`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1))',
                  boxShadow: isDarkModeState ? 
                    'inset 0 0 1px 0px var(--text-primary)' : 
                    'inset 0 0 1px 1px var(--card-border)',
                  border: isDarkModeState ? 
                    '1px solid var(--border-light)' : 
                    '1px solid var(--border-color)',
                  animation: `${i % 3 === 0 ? 'bubble-rise' : i % 3 === 1 ? 'bubble-rise-alt' : 'bubble-rise-third'} ${5 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 20}px)`,
                }}
              />
            );
          }
          
          // Grosses bulles - seulement si assez de liquide
          if (clampedFill > 20) {
            for (let i = 0; i < largeBubbleCount; i++) {
              const size = 8 + Math.random() * 10;
              // Position en pourcentage depuis le bas, en commençant sous la zone visible
              // Positionner les grosses bulles encore plus bas (-20% à -15%)
              const bottomPos = -20 + Math.random() * 5;
              
              bubbles.push(
                <div 
                  key={`large-bubble-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${15 + Math.random() * 70}%`,
                    bottom: `${bottomPos}%`,
                    background: isDarkModeState ? 
                      'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.05))' : 
                      'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3))',
                    boxShadow: `0 0 3px var(--border-light)`,
                    animation: `${i % 3 === 0 ? 'bubble-rise' : i % 3 === 1 ? 'bubble-rise-alt' : 'bubble-rise-third'} ${6 + Math.random() * 3}s linear infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                    transform: `translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 25}px) scale(${0.8 + Math.random() * 0.4})`,
                  }}
                />
              );
            }
          }
          
          return bubbles;
        })()}
      </div>
    </div>
  );
};

export default LiquidWave;
