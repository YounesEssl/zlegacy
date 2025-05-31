import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { LeoWalletAdapter, PuzzleWalletAdapter } from "aleo-adapters";
import { useMemo } from "react";
import type { ReactNode } from "react";
// Import dynamique pour éviter les références circulaires

/**
 * Crée un wrapper pour les adaptateurs de wallet officiels (sans le provider personnalisé)
 * Cela évite les imports circulaires avec le fichier context.tsx
 */
export function AleoWalletProvidersBase({ children }: { children: ReactNode }) {
  // Liste des adaptateurs wallet supportés
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Nexa",
      }),
      // PuzzleWalletAdapter avec les permissions requises
      new PuzzleWalletAdapter({
        programIdPermissions: {
          [WalletAdapterNetwork.TestnetBeta]: ["oracle_tls_v2.aleo"],
        },
      }),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.AutoDecrypt}
      network={WalletAdapterNetwork.TestnetBeta}
      programs={["oracle_tls_v2"]}
      autoConnect
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
}

/**
 * Wrapper pour tous les providers wallet
 * Cette fonction sera exportée par index.ts après avoir importé le provider personnalisé
 */
export function createAleoWalletProviders(
  WalletContextCustomProvider: React.ComponentType<{ children: ReactNode }>
) {
  return function AleoWalletProviders({ children }: { children: ReactNode }) {
    return (
      <AleoWalletProvidersBase>
        <WalletContextCustomProvider>{children}</WalletContextCustomProvider>
      </AleoWalletProvidersBase>
    );
  };
}

// Export par défaut pour faciliter l'importation
// L'export concret de la fonction composée se fera dans index.ts
export default createAleoWalletProviders;
