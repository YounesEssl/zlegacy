import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter le thème clair/sombre de l'application
 * et réagir aux changements de thème
 */
export const useThemeDetector = () => {
  // État initial du thème (par défaut: sombre)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // Détecter le thème actuel et configurer un observateur pour les changements
  useEffect(() => {
    // Vérifier le thème initial
    const checkTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      setIsDarkMode(isDark);
    };
    
    // Vérification initiale
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
    
    // Nettoyer l'observateur
    return () => observer.disconnect();
  }, []);

  return { isDarkMode };
};

export default useThemeDetector;
