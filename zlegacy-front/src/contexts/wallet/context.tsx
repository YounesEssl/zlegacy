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
import { connectWallet as apiConnectWallet } from "../../api/userApi";
import type {
  LastSubmissionData,
  ProofOfLifeData,
  TransactionStatusResponse,
  UserState,
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
  userState: {
    isRegistered: false,
    isRegistrationModalOpen: false,
    userData: null,
    isLoading: false,
    error: null,
  },
  registerUser: async () => false,
  openRegistrationModal: () => {},
  closeRegistrationModal: () => {},
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
  
  // User registration state
  const [userState, setUserState] = useState<UserState>({
    isRegistered: false,
    isRegistrationModalOpen: false,
    userData: null,
    isLoading: false,
    error: null,
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

      // Check if user is registered when wallet is connected
      checkUserRegistration(publicKey);
    }
  }, [publicKey]);
  
  // Check if user is already registered in the database
  const checkUserRegistration = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return;
    
    try {
      setUserState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
      
      const response = await apiConnectWallet({ walletAddress });
      
      if (response && response.user) {
        // Use the profileComplete flag from the backend
        const isProfileComplete = response.profileComplete === true;
        
        if (!isProfileComplete) {
          // User exists but needs to complete profile information
          setUserState({
            isRegistered: false, // Not fully registered
            isRegistrationModalOpen: true, // Show modal to complete registration
            userData: response.user, // Keep user data for reference
            isLoading: false,
            error: null
          });
          console.log('Profile incomplete, showing registration modal');
        } else {
          // User exists with complete profile
          setUserState({
            isRegistered: true,
            isRegistrationModalOpen: false,
            userData: response.user,
            isLoading: false,
            error: null
          });
          console.log('Profile complete, user fully registered');
        }
      } else {
        // User doesn't exist, show registration modal
        setUserState({
          isRegistered: false,
          isRegistrationModalOpen: true,
          userData: null,
          isLoading: false,
          error: null
        });
        console.log('User does not exist, showing registration modal');
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
      setUserState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check user registration'
      }));
    }
  }, []);
  
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

  // User registration handlers
  const registerUser = useCallback(async (firstName: string, lastName: string) => {
    if (!publicKey) return false;
    
    try {
      setUserState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
      
      const response = await apiConnectWallet({
        walletAddress: publicKey,
        firstName,
        lastName
      });
      
      if (response && response.user) {
        setUserState({
          isRegistered: true,
          isRegistrationModalOpen: false,
          userData: response.user,
          isLoading: false,
          error: null
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering user:', error);
      setUserState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to register user'
      }));
      return false;
    }
  }, [publicKey]);
  
  const openRegistrationModal = useCallback(() => {
    setUserState(prev => ({
      ...prev,
      isRegistrationModalOpen: true
    }));
  }, []);
  
  const closeRegistrationModal = useCallback(() => {
    setUserState(prev => ({
      ...prev,
      isRegistrationModalOpen: false
    }));
  }, []);

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
      userState,
      registerUser,
      openRegistrationModal,
      closeRegistrationModal
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
      userState,
      registerUser,
      openRegistrationModal,
      closeRegistrationModal
    ]
  );

  return (
    <WalletContextCustom.Provider value={contextValue}>
      {children}
    </WalletContextCustom.Provider>
  );
}
