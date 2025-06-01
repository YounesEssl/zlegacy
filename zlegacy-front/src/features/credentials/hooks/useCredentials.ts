import { useState, useCallback, useEffect } from "react";
import { useWalletCustom } from "../../../contexts/wallet/context";
import type { Credential, NewCredentialFormData, CredentialFilters, ImportFormat } from "../types";
export type { Credential, NewCredentialFormData, CredentialFilters, ImportFormat };
import { 
  getCredentials as apiGetCredentials,
  createCredential as apiCreateCredential,
  updateCredential as apiUpdateCredential,
  deleteCredential as apiDeleteCredential,
  getDecryptedField as apiGetDecryptedField
} from "../../../api/credentialApi";

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { publicKey, walletConnected: connected } = useWalletCustom();
  
  // Mock data pour afficher quand l'utilisateur n'est pas connecté
  const mockCredentials: Credential[] = [
    {
      id: "1",
      name: "Exemple de credential",
      type: "standard",
      username: "utilisateur@exemple.com",
      hasPassword: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "demo",
      category: "exemple",
      url: "https://exemple.com",
      notes: "Ceci est un exemple de credential lorsque le portefeuille n'est pas connecté."
    },
    {
      id: "2",
      name: "Autre exemple",
      type: "standard",
      username: "autre@exemple.com",
      hasPassword: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "demo",
      category: "exemple",
      url: "https://autre-exemple.com",
      notes: "Un autre exemple de credential."
    }
  ];

  // Fonction pour récupérer les credentials
  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (connected && publicKey) {
        // Charger les credentials depuis l'API
        try {
          const fetchedCredentials = await apiGetCredentials(publicKey);
          setCredentials(fetchedCredentials);
          setError(null);
        } catch (error: unknown) {
          const apiError = error as Error;
          console.error('Erreur lors de la récupération des credentials:', apiError);
          setError(`Erreur API: ${apiError.message || 'Impossible de récupérer les credentials'}`);
        }
      } else {
        // Simuler un délai pour l'interface
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Afficher les données fictives uniquement si non connecté
        setCredentials(mockCredentials);
        setError("Wallet not connected");
      }
    } catch (err) {
      console.error("Error fetching credentials:", err);
      setError("Failed to load credentials");
      setCredentials(mockCredentials);
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  // Effet pour attendre la connexion du wallet avant de charger les données
  useEffect(() => {
    if (initialLoad) {
      if (connected && publicKey) {
        fetchCredentials();
        setInitialLoad(false);
      } else {
        const timer = setTimeout(() => {
          fetchCredentials();
          setInitialLoad(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [connected, publicKey, initialLoad, fetchCredentials]);
  
  // Effet pour recharger les données quand le wallet change après le chargement initial
  useEffect(() => {
    if (!initialLoad) {
      fetchCredentials();
    }
  }, [connected, publicKey, initialLoad, fetchCredentials]);

  const addCredential = useCallback(
    async (credential: NewCredentialFormData) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Tous les credentials sont de type standard
        const createData: NewCredentialFormData = {
          name: credential.name,
          type: "standard",
          username: credential.username,
          password: credential.password,
          url: credential.url,
          notes: credential.notes,
          category: credential.category || 'general'
        };

        // Appeler l'API pour créer le credential
        const createdCredential = await apiCreateCredential(publicKey, createData);

        // Mettre à jour l'état local
        setCredentials((prev) => [...prev, createdCredential]);
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
    async (id: string, credential: Partial<NewCredentialFormData>) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Préparer les données pour la mise à jour (seulement les champs non-null/undefined)
        const updateData: Partial<NewCredentialFormData> = {};

        if (credential.name !== undefined) updateData.name = credential.name;
        if (credential.type !== undefined) updateData.type = "standard";
        if (credential.username !== undefined) updateData.username = credential.username;
        if (credential.password !== undefined) updateData.password = credential.password;
        if (credential.url !== undefined) updateData.url = credential.url;
        if (credential.notes !== undefined) updateData.notes = credential.notes;
        if (credential.category !== undefined) updateData.category = credential.category;

        // Appeler l'API pour mettre à jour le credential
        const updatedCredential = await apiUpdateCredential(publicKey, id, updateData);

        // Mettre à jour l'état local
        setCredentials((prev) =>
          prev.map((cred) => (cred.id === id ? updatedCredential : cred))
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
        // Appeler l'API pour supprimer le credential
        await apiDeleteCredential(publicKey, id);

        // Mettre à jour l'état local
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
    async (importedData: any[]) => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Convertir les données importées au nouveau format
        const newCredentialsData: NewCredentialFormData[] = importedData.map((item) => ({
          name: item.title || item.name || "Untitled",
          type: "standard",
          username: item.username || item.user || item.email || "",
          password: item.password || "",
          url: item.website || item.url || "",
          notes: item.notes || "",
          category: item.category || "imported"
        }));

        // Créer chaque credential via l'API
        const createdCredentials = await Promise.all(
          newCredentialsData.map(cred => apiCreateCredential(publicKey, cred))
        );

        // Mettre à jour l'état local
        setCredentials((prev) => [...prev, ...createdCredentials]);
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

  // Fonction pour récupérer une donnée sensible déchiffrée
  const getDecryptedField = useCallback(
    async (id: string, fieldName: 'password') => {
      if (!connected || !publicKey) {
        setError("Wallet not connected");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Appeler l'API pour déchiffrer le champ demandé
        const decryptedValue = await apiGetDecryptedField(publicKey, id, fieldName);
        return decryptedValue;
      } catch (err) {
        console.error(`Error getting decrypted ${fieldName}:`, err);
        setError(`Failed to get ${fieldName}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, publicKey]
  );

  // Filtrer les credentials par type, terme de recherche et catégorie
  const filterCredentials = useCallback(
    (filters: CredentialFilters) => {
      if (!credentials.length) return [];
      
      return credentials.filter((cred) => {
        // Filtre par terme de recherche
        const searchMatch = !filters.searchTerm || 
          cred.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (cred.username && cred.username.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
          (cred.url && cred.url.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
          (cred.notes && cred.notes.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        
        // Filtre par catégorie
        const categoryMatch = !filters.category || filters.category === 'all' || cred.category === filters.category;
        
        // Tous les credentials sont de type standard
        const typeMatch = !filters.type || filters.type === 'all' || cred.type === filters.type;
        
        return searchMatch && categoryMatch && typeMatch;
      });
    },
    [credentials]
  );

  return {
    credentials,
    isLoading,
    error,
    addCredential,
    updateCredential,
    deleteCredential,
    importCredentials,
    getDecryptedField,
    filterCredentials,
    refreshCredentials: fetchCredentials,
  };
};
