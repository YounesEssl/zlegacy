import React from "react";
import { ChevronDownIcon, ChevronUpIcon, KeyIcon, UserCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Credential, BeneficiaryAllocation } from "../../types";
import { getBeneficiaryCredentials } from "../../utils/credentialUtils";
import Button from "../../../../components/ui/Button";

interface BeneficiaryCredentialsViewProps {
  beneficiaryAllocations: BeneficiaryAllocation[];
  credentials: Credential[];
  credentialAllocations: any[];
  expandedBeneficiaries: string[];
  onToggleBeneficiaryExpansion: (beneficiaryId: string) => void;
  onAllocateAllCredentials: (beneficiaryId: string) => void;
  onToggleCredentialAllocation: (credentialId: string, beneficiaryId: string) => void;
  filteredCredentials: Credential[];
}

const BeneficiaryCredentialsView: React.FC<BeneficiaryCredentialsViewProps> = ({
  beneficiaryAllocations,
  credentials,
  credentialAllocations,
  expandedBeneficiaries,
  onToggleBeneficiaryExpansion,
  onAllocateAllCredentials,
  onToggleCredentialAllocation,
  filteredCredentials,
}) => {
  if (beneficiaryAllocations.length === 0) {
    return (
      <div
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No beneficiaries found. Add beneficiaries in the previous step.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {beneficiaryAllocations.map(({ beneficiary }) => {
        const isExpanded = expandedBeneficiaries.includes(beneficiary.id);
        const allocatedCredentials = getBeneficiaryCredentials(
          beneficiary.id,
          credentials,
          credentialAllocations
        );
        
        // Calculate allocation stats
        const allocatedCount = allocatedCredentials.length;
        const totalCredentials = credentials.length;
        const allocationPercentage = totalCredentials > 0 
          ? Math.round((allocatedCount / totalCredentials) * 100) 
          : 0;

        return (
          <div
            key={beneficiary.id}
            className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Beneficiary header */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-opacity-80"
              onClick={() => onToggleBeneficiaryExpansion(beneficiary.id)}
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
                >
                  <UserCircleIcon
                    className="w-6 h-6"
                    style={{ color: "var(--accent-primary)" }}
                  />
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {beneficiary.name || "Unnamed Beneficiary"}
                  </h3>
                  <div
                    className="text-sm flex items-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <KeyIcon className="w-4 h-4 mr-1" />
                    {allocatedCredentials.length} of {totalCredentials} credentials
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-right mr-4">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {allocatedCount}/{totalCredentials} allocated
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {allocationPercentage}% of credentials
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAllocateAllCredentials(beneficiary.id);
                  }}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Allocate All
                </Button>
                {isExpanded ? (
                  <ChevronUpIcon
                    className="w-5 h-5"
                    style={{ color: "var(--text-secondary)" }}
                  />
                ) : (
                  <ChevronDownIcon
                    className="w-5 h-5"
                    style={{ color: "var(--text-secondary)" }}
                  />
                )}
              </div>
            </div>

            {/* Progress bar showing allocation percentage */}
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${allocationPercentage}%`, 
                  backgroundColor: "var(--accent-primary)"
                }}
              ></div>
            </div>
            
            {/* Expanded content with allocated credentials */}
            {isExpanded && (
              <div className="p-4">
                {allocatedCredentials.length === 0 ? (
                  <div
                    className="text-sm p-3 rounded-md"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-muted)",
                    }}
                  >
                    No credentials allocated to this beneficiary yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allocatedCredentials.map((credential) => (
                      <div
                        key={credential.id}
                        className="flex justify-between items-center p-3 rounded-md border transition-colors duration-200 hover:bg-opacity-90"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                            style={{ backgroundColor: "rgba(75, 131, 219, 0.05)" }}
                          >
                            <KeyIcon className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                          </div>
                          <div>
                            <div
                              className="font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {credential.title}
                            </div>
                            <div 
                              className="flex items-center text-xs"
                            >
                              <span style={{ color: "var(--text-secondary)" }}>
                                {credential.username}
                              </span>
                              {credential.website && (
                                <>
                                  <span className="mx-1" style={{ color: "var(--text-muted)" }}>•</span>
                                  <a 
                                    href={credential.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                    style={{ color: "var(--accent-primary)" }}
                                  >
                                    Website
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1"
                          onClick={() =>
                            onToggleCredentialAllocation(
                              credential.id,
                              beneficiary.id
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <div
                    className="text-sm font-medium mb-3 flex items-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Available Credentials
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filteredCredentials
                      .filter(
                        (cred) =>
                          !allocatedCredentials.some((ac) => ac.id === cred.id)
                      )
                      .map((credential) => (
                        <Button
                          key={credential.id}
                          variant="outline"
                          size="sm"
                          className="flex items-center bg-opacity-50 hover:bg-opacity-80 transition-colors duration-200"
                          onClick={() =>
                            onToggleCredentialAllocation(
                              credential.id,
                              beneficiary.id
                            )
                          }
                        >
                          <span 
                            className="w-4 h-4 rounded-full flex items-center justify-center mr-1"
                            style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
                          >
                            <span style={{ fontSize: "0.6rem", color: "var(--accent-primary)" }}>
                              {credential.title.charAt(0).toUpperCase()}
                            </span>
                          </span>
                          {credential.title}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BeneficiaryCredentialsView;
