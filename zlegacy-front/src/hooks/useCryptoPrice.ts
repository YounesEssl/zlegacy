import { useState, useEffect } from 'react';

interface CoinPrice {
  [key: string]: {
    usd: number;
  };
}

/**
 * Hook personnalisé pour récupérer les prix des crypto-monnaies depuis CoinGecko
 * @param coinIds Les identifiants des crypto-monnaies sur CoinGecko (ex: 'bitcoin', 'ethereum', 'aleo')
 * @returns Un objet contenant les prix en USD et l'état de chargement
 */
export const useCryptoPrice = (coinIds: string[]) => {
  const [prices, setPrices] = useState<CoinPrice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!coinIds.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const idsParam = coinIds.join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPrices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching crypto prices:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        
        // Valeurs par défaut en cas d'erreur
        const defaultPrices: CoinPrice = {};
        coinIds.forEach(id => {
          defaultPrices[id] = { usd: getDefaultPrice(id) };
        });
        setPrices(defaultPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    // Actualiser les prix toutes les 5 minutes
    const intervalId = setInterval(fetchPrices, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [coinIds.join(',')]);

  // Fonction pour obtenir un prix par défaut en cas d'erreur
  const getDefaultPrice = (coinId: string): number => {
    const defaultPrices: Record<string, number> = {
      'bitcoin': 63000,
      'ethereum': 3400,
      'aleo': 10.5,
      'tether': 1,
      'usd-coin': 1,
      'binancecoin': 580,
      'solana': 150,
    };

    return defaultPrices[coinId] || 1;
  };

  return { prices, loading, error };
};

// Mapping entre les symboles de crypto et les identifiants CoinGecko
export const cryptoIdMap: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'ALEO': 'aleo',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'BNB': 'binancecoin',
  'SOL': 'solana',
};

// Fonction utilitaire pour convertir un symbole en id CoinGecko
export const symbolToId = (symbol: string): string => {
  return cryptoIdMap[symbol] || symbol.toLowerCase();
};

// Fonction utilitaire pour obtenir le prix d'une crypto par son symbole
export const getPriceBySymbol = (prices: CoinPrice | null, symbol: string): number => {
  if (!prices) return 0;
  
  const id = symbolToId(symbol);
  return prices[id]?.usd || 0;
};
