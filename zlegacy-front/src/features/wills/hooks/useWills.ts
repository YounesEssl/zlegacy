import { useState, useEffect } from "react";
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import type { Will, WillsFilters } from "../types";

// Demo data for wills
export const demoWills: Will[] = [
  {
    id: "1",
    title: "Primary Will",
    createdAt: "2025-04-12T10:30:00Z",
    updatedAt: "2025-05-01T14:22:00Z",

    beneficiaries: [
      {
        id: "1",
        name: "Sophie Martin",
        address: "aleo1abc...def1",
        allocation: 60,
        relation: "spouse",
        relationColor: "#4f46e5",
      },
      {
        id: "2",
        name: "Lucas Martin",
        address: "aleo1ghi...jkl2",
        allocation: 40,
        relation: "child",
        relationColor: "#0ea5e9",
      },
    ],
    cryptoAssets: [
      {
        id: "crypto1",
        symbol: "BTC",
        name: "Bitcoin",
        balance: 3.45,
        price: 65000,
        value: 224250,
        icon: "btc-icon.svg"
      },
      {
        id: "crypto2",
        symbol: "ETH",
        name: "Ethereum",
        balance: 28.7,
        price: 3500,
        value: 100450,
        icon: "eth-icon.svg"
      }
    ],
    credentials: [
      {
        id: "cred1",
        title: "Coinbase Account",
        username: "myemail@example.com",
        password: "My.Secret.Passw0rd",
        website: "https://coinbase.com",
        notes: "Cold storage wallet with seed phrase in safe",
        lastUpdated: "2025-04-01T14:22:00Z"
      },
      {
        id: "cred2",
        title: "Google Account",
        username: "myaccount@gmail.com",
        password: "G00gl3.P@ssword!",
        website: "https://accounts.google.com",
        notes: "Recovery email: backup@example.com",
        lastUpdated: "2025-03-15T10:30:00Z"
      }
    ],
    assetAllocations: [
      { beneficiaryId: "1", assetId: "crypto1", percentage: 100 },
      { beneficiaryId: "2", assetId: "crypto2", percentage: 100 }
    ],
    credentialAllocations: [
      { beneficiaryId: "1", credentialId: "cred1" },
      { beneficiaryId: "2", credentialId: "cred2" }
    ],
    verificationMethod: "email",
    transactionMode: "private",
    testatorAddress: "aleo1xyz...789",
    note: "This is my primary will that includes all my digital assets and accounts.",
    verificationDate: "2025-05-01T14:22:00Z",
  },
  {
    id: "2",
    title: "Crypto Assets Will",
    createdAt: "2025-04-20T09:15:00Z",
    updatedAt: "2025-04-20T09:15:00Z",

    beneficiaries: [
      {
        id: "3",
        name: "Marc Dubois",
        address: "aleo1mno...pqr3",
        allocation: 100,
        relation: "family",
        relationColor: "#22c55e",
      },
    ],
    cryptoAssets: [
      {
        id: "crypto3",
        symbol: "ALEO",
        name: "Aleo",
        balance: 5000,
        price: 8.5,
        value: 42500,
        icon: "aleo-icon.svg"
      },
      {
        id: "crypto4",
        symbol: "SOL",
        name: "Solana",
        balance: 150,
        price: 120,
        value: 18000,
        icon: "sol-icon.svg"
      }
    ],
    credentials: [
      {
        id: "cred3",
        title: "Hardware Wallet Access",
        username: "Trezor Device",
        password: "PIN: 457812",
        notes: "Seed phrase stored in safety deposit box",
        lastUpdated: "2025-04-10T09:15:00Z"
      }
    ],
    assetAllocations: [
      { beneficiaryId: "3", assetId: "crypto3", percentage: 100 },
      { beneficiaryId: "3", assetId: "crypto4", percentage: 100 }
    ],
    credentialAllocations: [
      { beneficiaryId: "3", credentialId: "cred3" }
    ],
    verificationMethod: "biometric",
    transactionMode: "public",
    testatorAddress: "aleo1xyz...789",
    note: "Will dedicated specifically to my cryptocurrency assets.",
  },
  {
    id: "3",
    title: "Secondary Will",
    createdAt: "2025-03-05T16:40:00Z",
    updatedAt: "2025-04-10T11:20:00Z",

    beneficiaries: [
      {
        id: "4",
        name: "Julie White",
        address: "aleo1stu...vwx4",
        allocation: 50,
        relation: "family",
        relationColor: "#22c55e",
      },
      {
        id: "5",
        name: "Thomas Black",
        address: "aleo1yza...bcd5",
        allocation: 50,
        relation: "friend",
        relationColor: "#f59e0b",
      },
    ],
    cryptoAssets: [
      {
        id: "crypto5",
        symbol: "DOGE",
        name: "Dogecoin",
        balance: 10000,
        price: 0.12,
        value: 1200,
        icon: "doge-icon.svg"
      }
    ],
    credentials: [
      {
        id: "cred4",
        title: "Password Manager",
        username: "masteruser",
        password: "D8%jK2!pL9@zF",
        website: "https://1password.com",
        notes: "Contains all secondary passwords",
        lastUpdated: "2025-02-20T16:40:00Z"
      },
      {
        id: "cred5",
        title: "Email Account",
        username: "personal@example.com",
        password: "Em@il.P@ssw0rd.2025",
        website: "https://mail.example.com",
        lastUpdated: "2025-03-01T11:20:00Z"
      }
    ],
    assetAllocations: [
      { beneficiaryId: "5", assetId: "crypto5", percentage: 100 }
    ],
    credentialAllocations: [
      { beneficiaryId: "4", credentialId: "cred4" },
      { beneficiaryId: "4", credentialId: "cred5" }
    ],
    verificationMethod: "phone",
    testatorAddress: "aleo1xyz...789",
    note: "Draft secondary will for non-financial digital assets.",
  },
];

export function useWills() {
  const { connected } = useWallet();
  const [wills, setWills] = useState<Will[]>([]);
  const [filteredWills, setFilteredWills] = useState<Will[]>([]);
  const [filters, setFilters] = useState<WillsFilters>({
    search: "",
    sortBy: "date",
    sortDirection: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les testaments
  const fetchWills = async (): Promise<Will[]> => {
    try {
      setIsLoading(true);
      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Afficher un état vide si le portefeuille est connecté
      // Sinon, montrer les données de démo pour les utilisateurs non connectés
      let willsData: Will[];
      if (connected) {
        // L'utilisateur est connecté mais aucun testament n'est trouvé (empty state)
        willsData = [];
      } else {
        // L'utilisateur n'est pas connecté, montrer les données de démo
        willsData = demoWills;
      }
      setWills(willsData);
      setError(null);
      return willsData;
    } catch (err) {
      setError("Unable to load wills");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les testaments au montage du composant
  useEffect(() => {
    fetchWills();
  }, [connected]);

  // Appliquer les filtres et le tri
  useEffect(() => {
    let result = [...wills];

    // Recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (will) =>
          will.title.toLowerCase().includes(searchLower) ||
          will.beneficiaries.some((b) =>
            b.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Tri
    if (filters.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
          case "date":
            comparison =
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            break;
          case "name":
            comparison = a.title.localeCompare(b.title);
            break;
        }

        return filters.sortDirection === "asc" ? comparison : -comparison;
      });
    }

    setFilteredWills(result);
  }, [wills, filters]);

  const updateFilters = (newFilters: Partial<WillsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    wills: filteredWills,
    totalWills: wills.length,
    isLoading,
    error,
    filters,
    updateFilters,
    fetchWills,
  };
}
