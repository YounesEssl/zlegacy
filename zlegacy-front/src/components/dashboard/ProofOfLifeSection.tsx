import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWalletCustom } from '../../contexts/WalletContext';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import LiquidWave from '../LiquidWave';
import ProofOfLifeButton from './ProofOfLifeButton';
import ProofOfLifeInfoCards from './ProofOfLifeInfoCards';
import { bubbleAnimation } from './AnimationStyles';
import useThemeDetector from './useThemeDetector';

/**
 * Section "Proof of Life" complète intégrant:
 * - L'animation de vagues liquides
 * - Les informations de statut
 * - Les cartes d'information (pourcentage, timer, deadline)
 * - Le bouton "I'm Alive!"
 */
const ProofOfLifeSection: React.FC = () => {
  const { isDarkMode } = useThemeDetector();
  const { connected } = useWallet();
  const { 
    submitHeartbeat, 
    proofOfLifeData, 
    isSubmittingHeartbeat, 
    requestWalletPermissions, 
    checkWalletPermissions 
  } = useWalletCustom();
  
  // Proof of Life button state
  const [lastProofDate, setLastProofDate] = useState<Date | null>(null);
  const [nextDeadlineDate, setNextDeadlineDate] = useState<Date | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [txStatus, setTxStatus] = useState<{success?: boolean; message?: string; txId?: string} | null>(null);
  
  // État pour le guide d'autorisation - initialiser à false pour ne pas l'afficher automatiquement
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  // statut des permissions - utilisé pour l'interface utilisateur conditionnelle
  const [permissionStatus, setPermissionStatus] = useState<'unchecked' | 'checking' | 'granted' | 'denied'>('granted'); // Présumons que les permissions sont accordées par défaut

  // État pour le pourcentage de remplissage et l'animation
  const [fillPercentage, setFillPercentage] = useState(100);
  const [isAnimatingFill, setIsAnimatingFill] = useState(false);
  const [targetFillPercentage, setTargetFillPercentage] = useState(100);

  // Utiliser les données de preuve de vie du contexte wallet
  useEffect(() => {
    if (proofOfLifeData.lastHeartbeat) {
      setLastProofDate(proofOfLifeData.lastHeartbeat);
    }
    
    if (proofOfLifeData.nextDeadline) {
      setNextDeadlineDate(proofOfLifeData.nextDeadline);
    } else {
      // Si pas de deadline, calculer une par défaut
      const lastDate = 
        lastProofDate || new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000);
      
      const deadline = new Date(lastDate);
      deadline.setMonth(deadline.getMonth() + 6);
      setNextDeadlineDate(deadline);
    }
  }, [proofOfLifeData, lastProofDate]);

  // Update remaining time counter and calculate target fill percentage
  useEffect(() => {
    if (!nextDeadlineDate) return;

    const updateRemainingTime = () => {
      const now = new Date();
      const diff = nextDeadlineDate.getTime() - now.getTime();

      // Période totale (6 mois en millisecondes)
      const totalPeriod = 6 * 30 * 24 * 60 * 60 * 1000; // approximation de 6 mois

      if (diff <= 0) {
        setRemainingTime("Expired");
        setTargetFillPercentage(0);
        return;
      }

      // Calculate days, hours, minutes
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setRemainingTime(`${days}d ${hours}h ${minutes}m`);

      // Calculate fill percentage (100% quand nouveau, diminue progressivement)
      // On part de la date de dernière preuve + 6 mois (totalPeriod)
      const lastProofTime = lastProofDate
        ? lastProofDate.getTime()
        : nextDeadlineDate.getTime() - totalPeriod;
      const elapsedTime = now.getTime() - lastProofTime;
      const remainingPercentage = Math.max(
        0,
        100 - (elapsedTime / totalPeriod) * 100
      );

      // Si nous ne sommes pas en train d'animer, mettre à jour directement
      if (!isAnimatingFill) {
        setFillPercentage(remainingPercentage);
      }

      // Toujours mettre à jour la cible
      setTargetFillPercentage(remainingPercentage);
    };

    // Update immediately and then every minute
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, [nextDeadlineDate, lastProofDate, isAnimatingFill]);

  // Animation du remplissage
  useEffect(() => {
    // Si nous ne sommes pas en train d'animer, ne rien faire
    if (!isAnimatingFill) return;

    // Calculer la différence entre la cible et le niveau actuel
    const diff = targetFillPercentage - fillPercentage;
    const absValue = Math.abs(diff);

    // Si la différence est négligeable, terminer l'animation
    if (absValue < 0.5) {
      setFillPercentage(targetFillPercentage);
      setIsAnimatingFill(false);
      return;
    }

    // Calculer le pas d'animation (plus rapide pour les grands écarts)
    const step = Math.max(0.5, absValue * 0.05); // 5% de la différence ou au moins 0.5

    // Créer un timer pour animer progressivement
    const timer = setTimeout(() => {
      // Augmenter ou diminuer en fonction de la direction
      if (diff > 0) {
        setFillPercentage((prev) =>
          Math.min(targetFillPercentage, prev + step)
        );
      } else {
        setFillPercentage((prev) =>
          Math.max(targetFillPercentage, prev - step)
        );
      }
    }, 16); // ~60fps

    return () => clearTimeout(timer);
  }, [isAnimatingFill, fillPercentage, targetFillPercentage]);

  // Vérifier les autorisations du portefeuille
  const verifyWalletPermissions = async () => {
    setPermissionStatus('checking');
    
    try {
      const permissionCheck = await checkWalletPermissions();
      
      if (permissionCheck.granted) {
        setPermissionStatus('granted');
        setShowPermissionGuide(false);
        return true;
      } else {
        setPermissionStatus('denied');
        // Ne pas afficher automatiquement le guide, juste indiquer l'erreur
        // setShowPermissionGuide(true);
        return false;
      }
    } catch (error) {
      console.error('Error checking wallet permissions:', error);
      setPermissionStatus('denied');
      setShowPermissionGuide(true);
      return false;
    }
  };
  
  // Demander des autorisations explicites au portefeuille
  const handleRequestPermissions = async () => {
    try {
      setPermissionStatus('checking');
      const result = await requestWalletPermissions();
      
      if (result.success) {
        setPermissionStatus('granted');
        setShowPermissionGuide(false);
        setTxStatus({
          success: true,
          message: "Autorisations accordées. Vous pouvez maintenant cliquer sur 'I'm Alive!'"
        });
      } else {
        setPermissionStatus('denied');
        setTxStatus({
          success: false,
          message: `Erreur d'autorisation: ${result.error || "Impossible d'obtenir les autorisations du portefeuille"}`
        });
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setPermissionStatus('denied');
      setTxStatus({
        success: false,
        message: `Erreur: ${(error as Error).message}`
      });
    }
  };
  
  // Vérifier automatiquement les autorisations au chargement du composant
  // Désactivé pour éviter l'affichage du guide lorsque les permissions sont déjà accordées
  /*
  useEffect(() => {
    if (connected) {
      verifyWalletPermissions();
    }
  }, [connected]);
  */
  
  // Handle proof of life button click
  const handleProofOfLife = async () => {
    // Vérifier que le wallet est connecté
    if (!connected) {
      setTxStatus({
        success: false,
        message: "Portefeuille non connecté. Veuillez connecter votre portefeuille pour continuer."
      });
      return;
    }
    
    // Vérifier les autorisations - mais ne pas bloquer si l'utilisateur indique avoir déjà les permissions
    const hasPermissions = await verifyWalletPermissions();
    if (!hasPermissions) {
      // Afficher un message d'erreur mais permettre à l'utilisateur de continuer
      setTxStatus({
        success: false,
        message: "Avertissement: Vérifiez que votre portefeuille est bien autorisé. Nous allons essayer quand même."
      });
      // Afficher le guide uniquement sur demande de l'utilisateur via un bouton
      // ou s'il y a une erreur réelle plus tard
      // setShowPermissionGuide(true);
      // Ne pas bloquer la transaction - continuons même si la vérification échoue
      // return;
    }
    
    // Simuler l'animation du bouton
    setIsButtonPressed(true);
    
    try {
      // Appeler la fonction submitHeartbeat du WalletContext
      const result = await submitHeartbeat();
      
      if (result.success) {
        // En cas de succès, mettre à jour les informations
        const now = new Date();
        setLastProofDate(now);
        
        // Démarrer l'animation de remplissage vers 100%
        setTargetFillPercentage(100);
        setIsAnimatingFill(true);
        
        // Afficher le succès
        setTxStatus({
          success: true,
          message: "Transaction envoyée avec succès!",
          txId: result.txId
        });
      } else {
        // En cas d'échec, afficher l'erreur
        setTxStatus({
          success: false,
          message: `Erreur: ${result.error || "Échec de la transaction"}`
        });
      }
    } catch (error) {
      // Gérer les erreurs inattendues
      setTxStatus({
        success: false,
        message: `Erreur inattendue: ${(error as Error).message}`
      });
    } finally {
      // Réinitialiser l'animation du bouton après un court délai
      setTimeout(() => setIsButtonPressed(false), 500);
    }
  };

  return (
    <motion.div
      className="w-full mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div
        className="relative overflow-hidden rounded-xl shadow-lg border nexa-card"
        style={{
          minHeight: "300px", /* Hauteur minimum adaptée mais peut s'étendre sur mobile */
          height: "auto", /* Permet de s'étendre en hauteur si nécessaire */
          background: `linear-gradient(to bottom right, var(--bg-secondary), var(--bg-tertiary))`,
          borderColor: `var(--border-color)`
        }}
      >
        {/* Conteneur du liquide sur toute la hauteur */}
        <div className="absolute inset-0 overflow-hidden">
          <LiquidWave fillPercentage={fillPercentage} isDarkMode={isDarkMode} />
        </div>

        {/* Overlay pour améliorer la lisibilité - utilise les variables CSS */}
        <div className="absolute inset-0 z-[1]" style={{
          background: `linear-gradient(to top, var(--bg-accent), transparent)`
        }} />
        
        {/* Styles pour les animations des bulles */}
        <style>{bubbleAnimation}</style>

        {/* Nouvelle disposition responsive */}
        <div className="relative z-10 min-h-full flex flex-col md:flex-row md:items-stretch p-4">
          
          {/* Colonne gauche - Informations et Timer */}
          <div className="w-full md:w-1/2 flex flex-col justify-between relative z-10 gap-2 pb-16 md:pb-0"> {/* Ajout de padding-bottom uniquement sur mobile pour éviter le chevauchement */}
            
            {/* Header avec titre uniquement - avec un fond semi-transparent pour améliorer la lisibilité */}
            <div className="flex items-center mb-1">
              <h2 
                className="text-xl font-bold flex items-center px-3 py-1 rounded-lg"
                style={{ 
                  color: `var(--text-primary)`,
                  backgroundColor: 'var(--bg-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: 0.95
                }}
              >
                <HeartSolidIcon 
                  className="w-5 h-5 mr-2" 
                  style={{ 
                    color: fillPercentage > 60 ? "var(--accent-tertiary)" : 
                          fillPercentage > 30 ? "var(--accent-secondary)" : "var(--accent-error)" 
                  }} 
                />
                Proof of Life
              </h2>
            </div>
            
            {/* Message d'explication concis */}
            <p 
              className="text-sm mb-2 max-w-md px-3 py-2 rounded-lg"
              style={{ 
                color: `var(--text-primary)`,
                backgroundColor: 'var(--bg-primary)',
                boxShadow: 'var(--shadow-sm)',
                opacity: 0.9
              }}
            >
              Your digital assets will be transferred if no proof of life is provided.
            </p>

            {/* Badge de statut bien visible */}
            <div className="mb-3">
              <div 
                className="inline-flex items-center px-3 py-1.5 rounded-full text-white font-medium text-sm shadow-lg"
                style={{
                  backgroundColor: fillPercentage > 60 ? "rgba(16, 185, 129, 0.9)" : 
                                fillPercentage > 30 ? "rgba(245, 158, 11, 0.9)" : "rgba(239, 68, 68, 0.9)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse bg-white" />
                {fillPercentage > 60 ? "Healthy" : fillPercentage > 30 ? "Warning" : "Critical"}
              </div>
            </div>
            
            {/* Cartes d'information (pourcentage, timer, deadline) */}
            <ProofOfLifeInfoCards
              fillPercentage={fillPercentage}
              remainingTime={remainingTime}
              nextDeadlineDate={nextDeadlineDate}
            />
          </div>
          
          {/* Bouton "I'm Alive!" avec positionnement absolu */}
          <ProofOfLifeButton 
            isButtonPressed={isButtonPressed || isSubmittingHeartbeat} 
            handleProofOfLife={handleProofOfLife} 
            className={permissionStatus === 'denied' ? 'opacity-90' : ''}
          />
          
          {/* Affichage du statut de transaction */}
          {txStatus && (
            <div className={`absolute bottom-20 right-5 z-30 p-3 rounded-lg shadow-lg transition-all duration-300 ${txStatus.success ? 'bg-green-500/90' : 'bg-red-500/90'}`}>
              <p className="text-white text-sm font-medium">{txStatus.message}</p>
              {txStatus.txId && (
                <p className="text-white/80 text-xs mt-1 truncate max-w-xs">
                  TX: {txStatus.txId.substring(0, 10)}...{txStatus.txId.substring(txStatus.txId.length - 6)}
                </p>
              )}
              <button 
                className="absolute top-1 right-1 text-white/70 hover:text-white"
                onClick={() => setTxStatus(null)}
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Guide d'aide pour les problèmes d'autorisation de Leo Wallet */}
          {showPermissionGuide && (
            <div 
              className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="relative bg-card max-w-lg w-full rounded-xl p-6 shadow-xl"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <button 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPermissionGuide(false)}
                >
                  ✕
                </button>
                
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                  Autorisation de Portefeuille Requise
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-warning)', color: 'var(--text-warning)' }}>
                    <p className="text-sm">
                      Pour utiliser la fonctionnalité "I'm Alive!", votre portefeuille Leo Wallet doit accorder des autorisations spéciales à notre application.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Instructions :</h4>
                    <ol className="list-decimal pl-5 space-y-2" style={{ color: 'var(--text-secondary)' }}>
                      <li>Assurez-vous que l'extension Leo Wallet est installée et active dans votre navigateur</li>
                      <li>Ouvrez l'extension Leo Wallet en cliquant sur son icône dans la barre d'outils</li>
                      <li>Connectez-vous à votre portefeuille si ce n'est pas déjà fait</li>
                      <li>Allez dans les paramètres de l'extension (icône d'engrenage)</li>
                      <li>Recherchez "Permissions" ou "Sites autorisés" et vérifiez que notre site est autorisé</li>
                      <li>Actualisez la page si nécessaire</li>
                    </ol>
                  </div>
                  
                  <div className="flex justify-center space-x-3 pt-2">
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-white"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                      onClick={handleRequestPermissions}
                    >
                      Demander les autorisations
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)' 
                      }}
                      onClick={() => setShowPermissionGuide(false)}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProofOfLifeSection;
