/**
 * Types pour la gestion des credentials
 */

export interface Credential {
  id: string;
  name: string;
  type: 'standard';
  category?: string;
  username?: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed?: string;
  userId: string;
  
  // Champs sensibles (seront chiffrés dans le backend, mais nécessaires pour les mises à jour)
  password?: string;
  
  // Flags pour indiquer la présence de données sensibles
  hasPassword: boolean;
}

export interface NewCredentialFormData {
  name: string;
  type: 'standard';
  category?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
}

export interface CredentialFilters {
  searchTerm?: string;
  type?: 'standard' | 'all';
  category?: string | null;
}

export interface ImportFormat {
  [key: string]: string | undefined;
  title?: string;
  name?: string;
  username?: string;
  user?: string;
  email?: string;
  password?: string;
  website?: string;
  url?: string;
  notes?: string;
  category?: string;
}
