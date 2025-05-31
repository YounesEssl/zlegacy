import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { checkTransactionStatus, createHeartbeatTransaction } from "./transactions";
import { convertPublicKeyToVaultId } from "./utils";
import { fetchProofOfLifeData } from "./api";
import type {
  LastSubmissionData,
  ProofOfLifeData,
  TransactionStatusResponse,
  WalletContextType,
} from "./types";

// Créer le contexte personnalisé avec des valeurs par défaut
const WalletContextCustom = createContext<WalletContextType>({
  submitHeartbeat: async () => ({
    success: false,
    error: "WalletContext not initialized",
  }),
  requestWalletPermissions: async () => ({
    success: false,
    error: "WalletContext not initialized",
  }),
  checkWalletPermissions: async () => ({
    granted: false,
    error: "WalletContext not initialized",
  }),
  checkTransactionStatus: async () => null,
  proofOfLifeData: {
    lastHeartbeat: null,
    nextDeadline: null,
    vaultId: "",
  },
  isSubmittingHeartbeat: false,
  lastSubmissionData: {
    timestamp: null,
    status: null,
    message: "",
  },
  walletConnected: false,
  publicKey: null,
});

// Hook pour accéder aux fonctionnalités du contexte personnalisé
export function useWalletCustom() {
  return useContext(WalletContextCustom);
}

// Composant provider qui encapsule la logique d'interaction avec le wallet
export function WalletContextCustomProvider({
  children,
}: {
  children: ReactNode;
}) {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;

  // États locaux
  const [proofOfLifeData, setProofOfLifeData] = useState<ProofOfLifeData>({
    lastHeartbeat: null,
    nextDeadline: null,
    vaultId: "",
  });
  const [isSubmittingHeartbeat, setIsSubmittingHeartbeat] = useState(false);
  const [lastSubmissionData, setLastSubmissionData] =
    useState<LastSubmissionData>({
      timestamp: null,
      status: null,
    });

  // Mettre à jour le vaultId et récupérer les données réelles quand la clé publique change
  useEffect(() => {
    if (publicKey) {
      const vaultId = convertPublicKeyToVaultId(publicKey);
      
      // Mettre à jour le vaultId immédiatement
      setProofOfLifeData((prev) => ({
        ...prev,
        vaultId,
      }));
      
      // Récupérer les données réelles depuis l'API
      refreshProofOfLifeData(vaultId);
    }
  }, [publicKey]);
  
  // Fonction pour récupérer les données réelles depuis l'API
  const refreshProofOfLifeData = useCallback(async (vaultId: string) => {
    if (!vaultId) return;
    
    try {
      // Récupérer les données depuis l'API Aleo Explorer
      const realData = await fetchProofOfLifeData(vaultId);
      
      // Si nous avons récupéré les données, mettre à jour l'état
      if (realData.lastHeartbeatBlock !== null && 
          realData.currentBlock !== null && 
          realData.blockDifference !== null &&
          realData.lastHeartbeatDate !== null &&
          realData.expirationDate !== null) {
        
        // Utiliser directement les dates calculées par l'API
        setProofOfLifeData({
          lastHeartbeat: realData.lastHeartbeatDate,
          nextDeadline: realData.expirationDate,
          vaultId,
          // Ajouter les données brutes de la blockchain pour plus de détails
          blockData: {
            lastHeartbeatBlock: realData.lastHeartbeatBlock,
            currentBlock: realData.currentBlock,
            blockDifference: realData.blockDifference,
            isActive: realData.isActive || false
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données de Proof of Life:", error);
    }
  }, []);

  // Vérifier les permissions du wallet
  const checkWalletPermissions = useCallback(async () => {
    try {
      if (!wallet || !connected || !publicKey) {
        return {
          granted: false,
          error: "Wallet non disponible ou non connecté",
        };
      }

      return { granted: true };
    } catch (error) {
      return {
        granted: false,
        error: `Erreur lors de la vérification: ${error}`,
      };
    }
  }, [wallet, connected, publicKey]);

  // Demander les permissions du wallet
  const requestWalletPermissions = useCallback(async () => {
    try {
      // Vérifier si les permissions sont déjà accordées
      const permissionStatus = await checkWalletPermissions();
      if (permissionStatus.granted) {
        return { success: true };
      }

      // Connecter le wallet si ce n'est pas déjà fait
      if (!connected && wallet) {
        await wallet.connect(
          DecryptPermission.AutoDecrypt,
          WalletAdapterNetwork.TestnetBeta
        );
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de la demande de permissions: ${error}`,
      };
    }
  }, [wallet, connected, checkWalletPermissions]);

  // Fonction pour vérifier le statut d'une transaction
  const checkTxStatus = useCallback(
    async (txId: string): Promise<TransactionStatusResponse | null> => {
      return checkTransactionStatus(wallet, txId);
    },
    [wallet]
  );

  // Fonction pour soumettre un heartbeat sur la blockchain
  const submitHeartbeat = useCallback(async () => {
    setIsSubmittingHeartbeat(true);

    // 1. Vérifier si le wallet est disponible et connecté
    if (!wallet || !connected || !publicKey) {
      // Si le wallet n'est pas disponible, on essaie de demander les permissions
      await requestWalletPermissions();

      setIsSubmittingHeartbeat(false);
      return {
        success: false,
        error: "Wallet non connecté ou clé publique indisponible",
      };
    }

    // Vérifier que le wallet supporte requestTransaction
    if (!wallet.requestTransaction) {
      setIsSubmittingHeartbeat(false);
      return {
        success: false,
        error: "Ce wallet ne supporte pas requestTransaction",
      };
    }

    try {
      // 2. Vérifier les permissions
      const permissionStatus = await checkWalletPermissions();
      if (!permissionStatus.granted) {
        // Essayer de demander les permissions
        const permissionResult = await requestWalletPermissions();
        if (!permissionResult.success) {
          setIsSubmittingHeartbeat(false);
          return {
            success: false,
            error: permissionResult.error || "Permissions non accordées",
          };
        }
      }

      // 3. Créer et exécuter la transaction
      const currentVaultId = proofOfLifeData.vaultId;
      const aleoTransaction = createHeartbeatTransaction(
        publicKey,
        currentVaultId,
        0.028451 // frais en ALEO
      );

      // Exécuter la transaction via l'adaptateur wallet
      const txId = await wallet.requestTransaction(aleoTransaction);

      // Mettre à jour l'état avec le statut pending
      setLastSubmissionData({
        timestamp: Date.now(),
        status: "pending",
        txId,
      });

      // Vérifier le statut après un délai
      setTimeout(async () => {
        const status = await checkTxStatus(txId);

        if (status) {
          // Mettre à jour l'état en fonction du statut
          if (status.error) {
            setLastSubmissionData({
              timestamp: Date.now(),
              status: "error",
              txId,
              message: "Erreur lors de la transaction",
              error: status.error,
            });
          } else if (
            status.status === "finalized" ||
            status.status === "confirmed" ||
            status.status === "final"
          ) {
            setLastSubmissionData({
              timestamp: Date.now(),
              status: "success",
              txId,
              message: "Transaction confirmée",
            });

            // Mettre à jour temporairement les données de proof of life
            // La période est de 6 mois exactement (180 jours)
            const now = new Date();
            const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000; // 180 jours en ms
            
            setProofOfLifeData({
              lastHeartbeat: now,
              nextDeadline: new Date(now.getTime() + SIX_MONTHS_MS), // +6 mois exactement
              vaultId: currentVaultId,
              blockData: {
                // On n'a pas encore les données de bloc mises à jour, elles seront rafraîchies après
                lastHeartbeatBlock: 0, // Valeur temporaire pour satisfaire le typage
                currentBlock: 0, // Valeur temporaire pour satisfaire le typage
                blockDifference: 0, // Différence = 0 puisqu'on vient de soumettre
                isActive: true
              }
            });
            
            // Attendre un peu pour que la blockchain enregistre la transaction
            // puis récupérer les données réelles depuis l'API
            setTimeout(() => {
              refreshProofOfLifeData(currentVaultId);
            }, 30000); // 30 secondes d'attente
          }
        }
      }, 5000); // 5 secondes de délai

      return {
        success: true,
        txId,
      };
    } catch (error) {
      // Mettre à jour l'état avec l'erreur
      setLastSubmissionData({
        timestamp: Date.now(),
        status: "error",
        message: "Échec de la transaction",
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        success: false,
        error: `Erreur lors de la soumission: ${error}`,
      };
    } finally {
      setIsSubmittingHeartbeat(false);
    }
  }, [
    wallet,
    publicKey,
    connected,
    proofOfLifeData,
    checkWalletPermissions,
    requestWalletPermissions,
    checkTxStatus,
  ]);

  // Valeurs exposées par le contexte
  const contextValue = useMemo(
    () => ({
      submitHeartbeat,
      requestWalletPermissions,
      checkWalletPermissions,
      checkTransactionStatus: checkTxStatus,
      proofOfLifeData,
      isSubmittingHeartbeat,
      lastSubmissionData,
      walletConnected: connected,
      publicKey,
    }),
    [
      submitHeartbeat,
      requestWalletPermissions,
      checkWalletPermissions,
      checkTxStatus,
      proofOfLifeData,
      isSubmittingHeartbeat,
      lastSubmissionData,
      connected,
      publicKey,
    ]
  );

  return (
    <WalletContextCustom.Provider value={contextValue}>
      {children}
    </WalletContextCustom.Provider>
  );
}
