import { useCallback, useEffect, useState } from "react";
import { useWallet as useAleoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { WalletName } from "@demox-labs/aleo-wallet-adapter-base";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

interface WalletHook {
  isConnected: boolean;
  walletAddress: string;
  network: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isWalletInstalled: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useWallet(): WalletHook {
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
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [network] = useState<string>(WalletAdapterNetwork.TestnetBeta);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  useEffect(() => {
    const checkWalletInstallation = () => {
      const isInstalled =
        typeof window !== "undefined" && (window as any).leo !== undefined;

      setIsWalletInstalled(isInstalled);
    };

    checkWalletInstallation();

    window.addEventListener("load", checkWalletInstallation);
    return () => {
      window.removeEventListener("load", checkWalletInstallation);
    };
  }, []);

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey);
    } else {
      setWalletAddress("");
    }
  }, [publicKey]);

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!(window as any).leo) {
        throw new Error("Leo Wallet n'est pas installé");
      }

      if (!wallet) {
        await select("Leo" as WalletName);
      }

      try {
        (connect as any)();
      } catch (e) {
        console.error("Erreur de connexion:", e);
        throw e;
      }

      // Récupérer l'adresse si elle n'est pas déjà définie
      if (!walletAddress && publicKey) {
        setWalletAddress(publicKey);
      }
    } catch (err: any) {
      console.error("Erreur lors de la connexion au wallet:", err);
      setError(err.message || "Erreur de connexion au wallet");
    } finally {
      setIsLoading(false);
    }
  }, [wallet, connect, select, publicKey, walletAddress]);

  const disconnectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await disconnect();
      setWalletAddress("");
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion du wallet:", err);
      setError(err.message || "Erreur de déconnexion du wallet");
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  useEffect(() => {
    if (!connected && walletAddress) {
      setWalletAddress("");
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
