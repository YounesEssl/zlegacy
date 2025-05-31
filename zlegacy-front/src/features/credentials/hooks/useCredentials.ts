import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

export type CredentialType = 'standard' | 'seedphrase';

export type Credential = {
  id: string;
  title: string;
  type: CredentialType;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  lastUpdated: string;
  // Fields specific to seedphrases
  walletType?: string;
  seedphrase?: string;
  derivationPath?: string;
};

export type ImportFormat = {
  title?: string;
  name?: string;
  username?: string;
  user?: string;
  email?: string;
  password?: string;
  website?: string;
  url?: string;
  notes?: string;
};

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { connected, publicKey } = useWallet();
  
  // Mock data to display when the user is not connected
  const mockCredentials: Credential[] = [
    {
      id: "1",
      title: "Gmail",
      type: "standard",
      username: "john.doe@gmail.com",
      password: "ExampleP@ss123!",
      website: "https://gmail.com",
      notes: "Account principal",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Facebook",
      type: "standard",
      username: "john.doe",
      password: "FB-SecureP@ss",
      website: "https://facebook.com",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Amazon",
      type: "standard",
      username: "john.doe@email.com",
      password: "Amz!Shopping2023",
      website: "https://amazon.com",
      notes: "Personal shopping account",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Ethereum Wallet",
      type: "seedphrase",
      username: "Main ETH Wallet",
      password: "", // No password as we use the seedphrase instead
      walletType: "Ethereum",
      seedphrase: "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12",
      derivationPath: "m/44'/60'/0'/0/0",
      notes: "Main wallet for ETH funds",
      lastUpdated: new Date().toISOString(),
    }
  ];

  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If the wallet is not connected, display mock data
      if (!connected || !publicKey) {
        // Simulate a delay for the interface
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Afficher les données fictives sans message d'erreur
        setCredentials(mockCredentials);
        // We set the error only to indicate the state at the hook level
        // but we won't display it in the interface
        setError("Wallet not connected");
      } else {
        // When the wallet is connected, simulate data retrieval
        // In a real case, we would make an API call to Aleo
        await new Promise((resolve) => setTimeout(resolve, 800));

        // For the demo, we return an empty array when the wallet is connected
        // Cela montrera l'état vide comme demandé
        setCredentials([]);
      }
    } catch (err) {
      console.error("Error fetching credentials:", err);
      setError("Failed to load credentials");
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const addCredential = useCallback(
    async (credential: Omit<Credential, "id" | "lastUpdated">) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate an Aleo call to store encrypted credentials
        await new Promise((resolve) => setTimeout(resolve, 600));

        const newCredential: Credential = {
          ...credential,
          id: Date.now().toString(),
          type: credential.type || "standard",
          lastUpdated: new Date().toISOString(),
        };

        setCredentials((prev) => [...prev, newCredential]);
        return true;
      } catch (err) {
        console.error("Error adding credential:", err);
        setError("Failed to add credential");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey]
  );

  const updateCredential = useCallback(
    async (id: string, updates: Partial<Credential>) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate an Aleo call to update encrypted credentials
        await new Promise((resolve) => setTimeout(resolve, 600));

        setCredentials((prev) =>
          prev.map((cred) =>
            cred.id === id
              ? {
                  ...cred,
                  ...updates,
                  lastUpdated: new Date().toISOString(),
                }
              : cred
          )
        );
        return true;
      } catch (err) {
        console.error("Error updating credential:", err);
        setError("Failed to update credential");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey]
  );

  const deleteCredential = useCallback(
    async (id: string) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate an Aleo call to delete credentials
        await new Promise((resolve) => setTimeout(resolve, 400));

        setCredentials((prev) => prev.filter((cred) => cred.id !== id));
        return true;
      } catch (err) {
        console.error("Error deleting credential:", err);
        setError("Failed to delete credential");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey]
  );

  const importCredentials = useCallback(
    async (importedData: ImportFormat[]) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate an Aleo call to store imported credentials
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newCredentials: Credential[] = importedData.map((item) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: item.title || item.name || "Untitled",
          type: "standard", // By default, imported credentials are of standard type
          username: item.username || item.user || item.email || "",
          password: item.password || "",
          website: item.website || item.url || "",
          notes: item.notes || "",
          lastUpdated: new Date().toISOString(),
        }));

        setCredentials((prev) => [...prev, ...newCredentials]);
        return true;
      } catch (err) {
        console.error("Error importing credentials:", err);
        setError("Failed to import credentials");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey]
  );

  return {
    credentials,
    isLoading,
    error,
    addCredential,
    updateCredential,
    deleteCredential,
    importCredentials,
    refreshCredentials: fetchCredentials,
  };
};
