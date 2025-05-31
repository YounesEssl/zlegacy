import type { BeneficiaryRelation } from '../types';

/**
 * Génère un ID unique pour un nouveau bénéficiaire
 * Dans une application réelle, cette logique serait sur le serveur
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Détermine la couleur en fonction de la relation
 */
export const getRelationColor = (relation: BeneficiaryRelation): string => {
  switch (relation) {
    case 'family':
      return 'rgb(59, 130, 246)'; // blue
    case 'friend':
      return 'rgb(16, 185, 129)'; // green
    case 'business':
      return 'rgb(217, 119, 6)'; // amber
    case 'child':
      return 'rgb(139, 92, 246)'; // purple
    case 'spouse':
      return 'rgb(239, 68, 68)'; // red
    case 'other':
    default:
      return 'rgb(156, 163, 175)'; // gray
  }
};

/**
 * Valide une adresse Aleo (simplifiée)
 */
export const validateAleoAddress = (address: string): boolean => {
  // Dans une application réelle, cette validation serait plus sophistiquée
  return address.startsWith('aleo') && address.length > 10;
};
