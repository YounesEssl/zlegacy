import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { AssetBalance, CryptoAsset } from "../types/crypto";
import axios from "axios";

// Function to retrieve real data from Aleo wallet using the wallet adapter
const fetchRealBalanceData = async (wallet: any): Promise<AssetBalance> => {
  try {
    // Retrieve Aleo USD price (optional)
    let aleoPriceUsd = 0.19; // Current market price
    let aleoChange24h = 0;

    try {
      const priceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=aleo&vs_currencies=usd&include_24hr_change=true"
      );
      if (priceResponse.data && priceResponse.data.aleo) {
        aleoPriceUsd = priceResponse.data.aleo.usd || aleoPriceUsd;
        aleoChange24h = priceResponse.data.aleo.usd_24h_change || 0;
      }
    } catch (error) {
      console.warn("Error fetching Aleo price:", error);
      // Continue with default price
    }

    // Initialize assets array
    const assets: CryptoAsset[] = [];
    let aleoBalance = 0;

    // Method 1: Try accessing wallet.balance property if available
    if (wallet.balance !== undefined) {
      if (typeof wallet.balance === "number") {
        aleoBalance = wallet.balance;
      } else if (typeof wallet.balance === "string") {
        aleoBalance = parseFloat(wallet.balance);
      } else if (typeof wallet.balance === "function") {
        // If it's a function, call it
        try {
          const balanceResult = await wallet.balance();
          if (typeof balanceResult === "number") {
            aleoBalance = balanceResult;
          } else if (typeof balanceResult === "string") {
            aleoBalance = parseFloat(balanceResult);
          }
        } catch (error) {
          console.warn("Error calling wallet.balance():", error);
        }
      }
    }

    // Method 2: Try requestRecordPlaintexts if available (available in newer versions of the adapter)
    if (aleoBalance === 0 && wallet.requestRecordPlaintexts) {
      try {
        const plaintexts = await wallet.requestRecordPlaintexts("credits.aleo");

        if (plaintexts && Array.isArray(plaintexts)) {
          plaintexts.forEach((plaintext) => {
            try {
              // Parse plaintext to extract values
              // Possible format: { microcredits: "5000000" }
              if (typeof plaintext === "object" && plaintext.microcredits) {
                const value = parseInt(plaintext.microcredits, 10);
                if (!isNaN(value)) {
                  aleoBalance += value / 1000000; // Convert microcredits to ALEO
                }
              } else if (typeof plaintext === "string") {
                // Try to parse JSON if it's a string
                try {
                  const parsed = JSON.parse(plaintext);
                  if (parsed.microcredits) {
                    const value = parseInt(parsed.microcredits, 10);
                    if (!isNaN(value)) {
                      aleoBalance += value / 1000000;
                    }
                  }
                } catch {}
              }
            } catch (error) {
              console.warn("Error parsing plaintext:", error);
            }
          });
        }
      } catch (error) {
        console.warn("Error using requestRecordPlaintexts:", error);
      }
    }

    // Method 3: Use requestRecords as before
    if (aleoBalance === 0 && wallet.requestRecords) {
      try {
        const records = await wallet.requestRecords("credits.aleo");

        // Parse records to extract balances
        if (records && Array.isArray(records)) {
          let totalMicroCredits = 0;

          records.forEach((record) => {
            try {
              // Check if it's a credits.aleo record
              if (typeof record === "string" && record.includes("u64")) {
                // Extraire la valeur du solde (exemple simple)
                const valueMatch = record.match(/(\d+)u64/);
                if (valueMatch && valueMatch[1]) {
                  const value = parseInt(valueMatch[1], 10);
                  if (!isNaN(value)) {
                    totalMicroCredits += value;
                  }
                }
              } else if (typeof record === "object") {
                // Vérifier si le record a une propriété data contenant microcredits
                if (record.data && record.data.microcredits) {
                  // Gère '5000000u64.private', '10000u64', etc.
                  const creditString = record.data.microcredits;
                  const valueMatch =
                    typeof creditString === "string"
                      ? creditString.match(/^(\d+)/)
                      : null;

                  if (valueMatch && valueMatch[1]) {
                    const value = parseInt(valueMatch[1], 10);
                    if (!isNaN(value)) {
                      totalMicroCredits += value;
                    }
                  }
                }
                // Vérifier aussi le format où microcredits est directement sur l'objet
                else if (record.microcredits) {
                  // Gère '5000000u64.private', '10000u64', etc.
                  const creditString = record.microcredits;
                  const valueMatch =
                    typeof creditString === "string"
                      ? creditString.match(/^(\d+)/)
                      : null;

                  if (valueMatch && valueMatch[1]) {
                    const value = parseInt(valueMatch[1], 10);
                    if (!isNaN(value)) {
                      totalMicroCredits += value;
                    }
                  }
                }
              }
            } catch (parseError) {
              console.warn("Error parsing record:", parseError, record);
            }
          });

          // Convertir les microcrédits en ALEO
          aleoBalance = totalMicroCredits / 1000000;
        }
      } catch (error) {
        console.warn("Error using requestRecords:", error);
      }
    }
    // Ajouter ALEO à la liste des actifs
    assets.push({
      symbol: "ALEO",
      name: "Aleo",
      balance: aleoBalance,
      usdValue: aleoBalance * aleoPriceUsd,
      change24h: aleoChange24h,
      color: "#4B83DB",
    });

    // Calculer la valeur totale en USD
    const totalBalanceUsd = assets.reduce(
      (total, asset) => total + asset.usdValue,
      0
    );

    return {
      assets,
      totalBalanceUsd,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Error fetching real balance:", error);
    // En cas d'erreur, retourner des données par défaut
    return {
      assets: [
        {
          symbol: "ALEO",
          name: "Aleo",
          balance: 0,
          usdValue: 0,
          change24h: 0,
          color: "#4B83DB",
        },
      ],
      totalBalanceUsd: 0,
      lastUpdated: new Date(),
    };
  }
};

// Function to simulate data if real data is not available
const fetchMockBalanceData = async (): Promise<AssetBalance> => {
  // Create mock assets synchronized with WillContext with realistic market prices
  const assets: CryptoAsset[] = [
    {
      symbol: "ALEO",
      name: "Aleo",
      balance: 2584.75,
      usdValue: 491.10, // $0.19 per ALEO (current price)
      change24h: 3.2,
      color: "#4B83DB",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 1.28,
      usdValue: 3225.60, // $2,520 per ETH (current price)
      change24h: 1.8,
      color: "#627EEA",
    },
    {
      symbol: "USDT",
      name: "Tether",
      balance: 5000.0,
      usdValue: 5000.0, // $1 per USDT (stable)
      change24h: 0.1,
      color: "#26A17B",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 0.12,
      usdValue: 6000.0, // $50,000 per BTC (current price)
      change24h: 2.4,
      color: "#F7931A",
    },
  ];

  const totalBalanceUsd = assets.reduce(
    (total, asset) => total + asset.usdValue,
    0
  );

  return {
    assets,
    totalBalanceUsd,
    lastUpdated: new Date(),
  };
};

export const useCryptoBalance = () => {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const [balanceData, setBalanceData] = useState<AssetBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser useRef pour éviter les re-renders
  const lastFetchTimeRef = useRef<number>(0);
  const fetchIntervalRef = useRef<number | null>(null);

  const fetchBalance = useCallback(async () => {
    // Si pas connecté, utiliser les données mock
    if (!connected || !publicKey) {
      const mockData = await fetchMockBalanceData();
      setBalanceData(mockData);
      return;
    }

    // Avoid too frequent calls
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 10000) {
      return;
    }

    // Avoid simultaneous calls
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    lastFetchTimeRef.current = now;

    try {
      // Always try to retrieve real data when connected
      const data = await fetchRealBalanceData(wallet);

      // Even if balance is 0, display real data
      setBalanceData(data);
    } catch (err) {
      console.error("Error fetching real balance:", err);
      setError("Failed to load balance data");

      // In case of error, display a balance of 0 rather than mock data
      setBalanceData({
        assets: [
          {
            symbol: "ALEO",
            name: "Aleo",
            balance: 0,
            usdValue: 0,
            change24h: 0,
            color: "#4B83DB",
          },
        ],
        totalBalanceUsd: 0,
        lastUpdated: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, wallet, isLoading]);

  // Main effect to manage connection and intervals
  useEffect(() => {
    // Clear previous interval
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }

    // Immediate fetch (mock if not connected, real if connected)
    fetchBalance();

    if (connected && publicKey) {
      // Set refresh interval only if connected
      fetchIntervalRef.current = setInterval(() => {
        fetchBalance();
      }, 120000); // 2 minutes
    }

    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, [connected, publicKey]); // Dépendances minimales

  // Manual refresh function
  const refreshBalance = useCallback(() => {
    // Force refresh by resetting the timer
    lastFetchTimeRef.current = 0;
    fetchBalance();
  }, [fetchBalance]);

  return {
    balanceData,
    isLoading,
    error,
    refreshBalance,
  };
};

export default useCryptoBalance;
