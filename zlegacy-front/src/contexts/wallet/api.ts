/**
 * Services API pour interagir avec l'explorateur Aleo
 */

/**
 * Base URL de l'API Explorer Aleo
 */
const ALEO_EXPLORER_API_BASE = "https://api.explorer.provable.com/v1/testnet";

/**
 * Assure que le vault_id est au format correct pour Aleo (nombre suivi de "field")
 * @param vaultId - Identifiant du vault
 * @returns Identifiant au format Aleo (exemple: "1798999054field")
 */
export function ensureCorrectVaultIdFormat(vaultId: string): string {
  // Si le vaultId est déjà au bon format, le retourner tel quel
  if (vaultId.endsWith('field')) {
    return vaultId;
  }
  
  // Sinon, extraire le nombre et ajouter "field"
  const numericPart = vaultId.replace(/\D/g, '');
  if (numericPart) {
    return `${numericPart}field`;
  }
  
  // Par sécurité, retourner le vaultId original si on ne peut pas le formater
  return vaultId;
}

/**
 * Récupère la dernière activité d'un utilisateur depuis la blockchain
 * @param vaultId - Identifiant du vault (sera formaté si nécessaire)
 * @returns La hauteur du bloc de la dernière activité ou null en cas d'erreur
 */
export async function fetchLastActivity(vaultId: string): Promise<number | null> {
  try {
    // Assurer que le vaultId est au format correct pour Aleo
    const formattedVaultId = ensureCorrectVaultIdFormat(vaultId);
    
    const response = await fetch(
      `${ALEO_EXPLORER_API_BASE}/program/oracle_tls_v2.aleo/mapping/person_last_activity/${formattedVaultId}`
    );
    
    if (!response.ok) {
      throw new Error(`Explorer API returned ${response.status}`);
    }
    
    // L'API retourne une chaîne comme "7987535u32" - nous devons extraire le nombre
    const data = await response.text();
    const match = data.match(/(\d+)u32/);
    
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching last activity:", error);
    return null;
  }
}

/**
 * Récupère la hauteur du dernier bloc de la blockchain
 * @returns La hauteur du dernier bloc ou null en cas d'erreur
 */
export async function fetchLatestBlockHeight(): Promise<number | null> {
  try {
    const response = await fetch(`${ALEO_EXPLORER_API_BASE}/latest/height`);
    
    if (!response.ok) {
      throw new Error(`Explorer API returned ${response.status}`);
    }
    
    const height = await response.text();
    return parseInt(height, 10);
  } catch (error) {
    console.error("Error fetching latest block height:", error);
    return null;
  }
}

/**
 * Constantes pour la configuration du Proof of Life
 */
// Temps en secondes entre la génération de chaque bloc Aleo
const SECONDS_PER_BLOCK = 2;

// Nombre de blocs correspondant à 6 mois (heartbeat requis tous les 6 mois)
// 6 mois = 180 jours = 15552000 secondes = 7776000 blocs (avec 2 secondes par bloc)
const HEARTBEAT_FREQUENCY_BLOCKS = 15552000 / SECONDS_PER_BLOCK; // 7776000 blocs

/**
 * Calcule les données Proof of Life réelles basées sur les informations de la blockchain
 * @param vaultId - Identifiant du vault de l'utilisateur
 * @returns Données Proof of Life avec différence de blocs et timestamps
 */
export async function fetchProofOfLifeData(vaultId: string): Promise<{
  lastHeartbeatBlock: number | null;
  currentBlock: number | null;
  blockDifference: number | null;
  lastHeartbeatDate: Date | null;
  expirationDate: Date | null;
  isActive: boolean;
}> {
  // Valeurs par défaut
  const defaultData = {
    lastHeartbeatBlock: null,
    currentBlock: null,
    blockDifference: null,
    lastHeartbeatDate: null,
    expirationDate: null,
    isActive: false,
  };
  
  try {
    // Récupérer en parallèle pour optimiser
    const [lastActivity, latestBlock] = await Promise.all([
      fetchLastActivity(vaultId),
      fetchLatestBlockHeight()
    ]);
    
    // Si l'une des valeurs est manquante, on retourne les valeurs par défaut
    if (lastActivity === null || latestBlock === null) {
      return defaultData;
    }
    
    // Calculer la différence de blocs
    const blockDifference = latestBlock - lastActivity;
    
    // Déterminer si l'utilisateur est actif (si la différence est < 2x la fréquence requise)
    const isActive = blockDifference < (HEARTBEAT_FREQUENCY_BLOCKS * 2);
    
    // Calculer les dates exactes
    const secondsPerBlock = SECONDS_PER_BLOCK;
    const secondsSinceLastHeartbeat = blockDifference * secondsPerBlock;
    
    // Date du dernier heartbeat = maintenant - temps écoulé depuis le dernier heartbeat
    const lastHeartbeatDate = new Date(Date.now() - secondsSinceLastHeartbeat * 1000);
    
    // Date d'expiration = date du dernier heartbeat + 6 mois exactement
    const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000; // 180 jours en ms
    const expirationDate = new Date(lastHeartbeatDate.getTime() + SIX_MONTHS_MS);
    
    return {
      lastHeartbeatBlock: lastActivity,
      currentBlock: latestBlock,
      blockDifference,
      lastHeartbeatDate,
      expirationDate,
      isActive,
    };
  } catch (error) {
    console.error("Error fetching proof of life data:", error);
    return defaultData;
  }
}
