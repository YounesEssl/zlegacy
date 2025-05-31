/**
 * FICHIER DE REDIRECTION
 * 
 * Ce fichier redirige vers la nouvelle structure modulaire du contexte wallet.
 * Il permet une transition en douceur pour les composants existants qui importent
 * depuis l'ancien chemin src/contexts/WalletContext.tsx
 */

// Réexporter tous les types et hooks du module wallet
export * from './wallet';

// Réexporter le composant principal par défaut
export { default } from './wallet';
