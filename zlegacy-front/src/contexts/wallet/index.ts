// Point d'entrée central pour le module wallet
import { createAleoWalletProviders } from './adapters';
import { WalletContextCustomProvider } from './context';

// Exporter les types
export * from './types';

// Exporter les utilitaires
export * from './utils';

// Exporter les fonctions de transaction
export * from './transactions';

// Exporter le contexte et les hooks
export * from './context';

// Exporter le composant des adaptateurs de base
export { AleoWalletProvidersBase } from './adapters';

// Créer et exporter le provider composé
const AleoWalletProviders = createAleoWalletProviders(WalletContextCustomProvider);
export { AleoWalletProviders };

// Export par défaut pour faciliter l'importation
export default AleoWalletProviders;
