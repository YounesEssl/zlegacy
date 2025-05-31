import { useCallback, useEffect, useState } from 'react';
import { useWallet as useAleoWallet } from '@demox-labs/aleo-wallet-adapter-react';
import type { WalletName } from '@demox-labs/aleo-wallet-adapter-base';
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

interface WalletHook {
  /** État de connexion du wallet */
  isConnected: boolean;
  /** Adresse du wallet au format aleo1... */
  walletAddress: string;
  /** Réseau actuel (Testnet ou Mainnet) */
  network: string;
  /** Fonction pour se connecter au wallet */
  connectWallet: () => Promise<void>;
  /** Fonction pour se déconnecter du wallet */
  disconnectWallet: () => Promise<void>;
  /** Vérifie si Leo Wallet est installé */
  isWalletInstalled: boolean;
  /** État de chargement pendant les opérations */
  isLoading: boolean;
  /** Message d'erreur si présent */
  error: string | null;
}

/**
 * Hook personnalisé pour gérer l'interaction avec Leo Wallet
 * Centralise la logique de connexion/déconnexion et l'état du wallet
 */
export function useWallet(): WalletHook {
  // Utiliser le hook fourni par l'adaptateur Leo Wallet
  const {
    wallet,
    connected,
    connecting,
    disconnecting,
    publicKey,
    disconnect,
    select,
    connect,
  } = useAleoWallet();

  // États locaux
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [network] = useState<string>(WalletAdapterNetwork.TestnetBeta);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  // Vérifie si Leo Wallet est installé dans le navigateur
  useEffect(() => {
    const checkWalletInstallation = () => {
      // Vérifier si l'objet Leo est injecté dans window
      const isInstalled = 
        typeof window !== 'undefined' && 
        (window as any).leo !== undefined;
      
      setIsWalletInstalled(isInstalled);
    };

    checkWalletInstallation();
    
    // Écouter les changements (extension installée pendant la session)
    window.addEventListener('load', checkWalletInstallation);
    return () => {
      window.removeEventListener('load', checkWalletInstallation);
    };
  }, []);

  // Mettre à jour l'adresse du wallet quand publicKey change
  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey);
    } else {
      setWalletAddress('');
    }
  }, [publicKey]);

  // Fonction pour connecter le wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si Leo Wallet est installé
      if (!(window as any).leo) {
        throw new Error("Leo Wallet n'est pas installé");
      }

      // Sélectionner l'adaptateur Leo Wallet s'il n'est pas déjà sélectionné
      if (!wallet) {
        await select('Leo' as WalletName);
      }

      // Se connecter au wallet - utiliser une approche pragmatique en contournant les problèmes de typage
      try {
        // Utiliser any pour contourner les problèmes d'interface de la bibliothèque
        // Cette approche fonctionne même si les types ne sont pas parfaitement alignés
        (connect as any)();
      } catch (e) {
        console.error('Erreur de connexion:', e);
        throw e;
      }
      
      // Récupérer l'adresse si elle n'est pas déjà définie
      if (!walletAddress && publicKey) {
        setWalletAddress(publicKey);
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion au wallet:', err);
      setError(err.message || "Erreur de connexion au wallet");
    } finally {
      setIsLoading(false);
    }
  }, [wallet, connect, select, publicKey, walletAddress]);

  // Fonction pour déconnecter le wallet
  const disconnectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await disconnect();
      setWalletAddress('');
    } catch (err: any) {
      console.error('Erreur lors de la déconnexion du wallet:', err);
      setError(err.message || "Erreur de déconnexion du wallet");
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  // En cas d'erreur ou de déconnexion inattendue, reset l'état
  useEffect(() => {
    if (!connected && walletAddress) {
      setWalletAddress('');
    }
  }, [connected, walletAddress]);

  return {
    isConnected: connected,
    walletAddress,
    network,
    connectWallet,
    disconnectWallet,
    isWalletInstalled,
    isLoading: isLoading || connecting || disconnecting,
    error,
  };
}
