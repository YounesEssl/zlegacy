import type { Credential, CredentialAllocation } from "../types";

/**
 * Check if a credential is allocated to a specific beneficiary
 */
export const isCredentialAllocatedToBeneficiary = (
  credentialId: string,
  beneficiaryId: string,
  credentialAllocations: CredentialAllocation[]
): boolean => {
  return credentialAllocations.some(
    (alloc) =>
      alloc.credentialId === credentialId &&
      alloc.beneficiaryId === beneficiaryId
  );
};

/**
 * Get all credentials allocated to a beneficiary
 */
export const getBeneficiaryCredentials = (
  beneficiaryId: string,
  credentials: Credential[],
  credentialAllocations: CredentialAllocation[]
): Credential[] => {
  const allocationsForBeneficiary = credentialAllocations.filter(
    (alloc) => alloc.beneficiaryId === beneficiaryId
  );
  
  return allocationsForBeneficiary
    .map((alloc) => {
      return credentials.find((cred) => cred.id === alloc.credentialId);
    })
    .filter(Boolean) as Credential[];
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
