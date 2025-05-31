// Fonctions utilitaires pour le wallet

/**
 * Convertit une clé publique Aleo en identifiant unique pour le vault_id
 * @param publicKey La clé publique Aleo
 * @returns Un identifiant unique au format attendu par Aleo (nombre suivi de "field")
 */
export function convertPublicKeyToVaultId(publicKey: string): string {
  // Extraire une partie de la clé publique et la convertir en nombre
  // On prend les caractères du milieu pour éviter le préfixe 'aleo1'
  const keyPart = publicKey.substring(5, 14);

  // Créer un hash numérique simple
  let numericValue = 0;
  for (let i = 0; i < keyPart.length; i++) {
    numericValue += keyPart.charCodeAt(i);
  }

  // Format attendu par Aleo: nombre suivi de "field"
  return `${numericValue}field`;
}
