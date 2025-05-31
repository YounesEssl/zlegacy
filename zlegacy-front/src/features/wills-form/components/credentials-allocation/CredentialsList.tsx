import React from "react";
import type { Credential, BeneficiaryAllocation } from "../../types";
import CredentialCard from "./CredentialCard";

interface CredentialsListProps {
  credentials: Credential[];
  beneficiaryAllocations: BeneficiaryAllocation[];
  credentialAllocations: any[];
  expandedCredentials: string[];
  visiblePasswords: Record<string, boolean>;
  onToggleExpand: (credentialId: string) => void;
  onTogglePassword: (credentialId: string) => void;
  onToggleAllocation: (credentialId: string, beneficiaryId: string) => void;
}

const CredentialsList: React.FC<CredentialsListProps> = ({
  credentials,
  beneficiaryAllocations,
  credentialAllocations,
  expandedCredentials,
  visiblePasswords,
  onToggleExpand,
  onTogglePassword,
  onToggleAllocation,
}) => {
  if (credentials.length === 0) {
    return (
      <div
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No credentials found. Add credentials to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <CredentialCard
          key={credential.id}
          credential={credential}
          beneficiaryAllocations={beneficiaryAllocations}
          credentialAllocations={credentialAllocations}
          isExpanded={expandedCredentials.includes(credential.id)}
          isPasswordVisible={!!visiblePasswords[credential.id]}
          onToggleExpand={() => onToggleExpand(credential.id)}
          onTogglePassword={() => onTogglePassword(credential.id)}
          onToggleAllocation={onToggleAllocation}
        />
      ))}
    </div>
  );
};

export default CredentialsList;
