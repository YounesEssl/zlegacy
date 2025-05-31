import React from "react";
import { ChevronDownIcon, ChevronUpIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { Credential } from "../../types";
import type { BeneficiaryAllocation } from "../../types";
import Button from "../../../../components/ui/Button";
import PasswordToggle from "./PasswordToggle";
import { isCredentialAllocatedToBeneficiary } from "../../utils/credentialUtils";

interface CredentialCardProps {
  credential: Credential;
  beneficiaryAllocations: BeneficiaryAllocation[];
  credentialAllocations: any[];
  isExpanded: boolean;
  isPasswordVisible: boolean;
  onToggleExpand: () => void;
  onTogglePassword: () => void;
  onToggleAllocation: (credentialId: string, beneficiaryId: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  beneficiaryAllocations,
  credentialAllocations,
  isExpanded,
  isPasswordVisible,
  onToggleExpand,
  onTogglePassword,
  onToggleAllocation,
}) => {
  // Get the beneficiary IDs that this credential is allocated to
  const allocatedBeneficiaryIds = credentialAllocations
    .filter((alloc) => alloc.credentialId === credential.id)
    .map((alloc) => alloc.beneficiaryId);

  // Calculate allocation stats
  const totalAllocated = allocatedBeneficiaryIds.length;
  const totalBeneficiaries = beneficiaryAllocations.length;
  const allocationPercentage = totalBeneficiaries > 0 
    ? Math.round((totalAllocated / totalBeneficiaries) * 100) 
    : 0;

  return (
    <div
      className="mb-4 rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Card header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-opacity-80"
        onClick={onToggleExpand}
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
          >
            <LockClosedIcon
              className="w-5 h-5"
              style={{ color: "var(--accent-primary)" }}
            />
          </div>
          <div>
            <h3
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {credential.title}
            </h3>
            <div className="flex items-center text-sm">
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
                    onClick={(e) => e.stopPropagation()}
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

        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {totalAllocated}/{totalBeneficiaries} allocated
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {allocationPercentage}% of beneficiaries
            </div>
          </div>
          <div className="mr-3" onClick={(e) => e.stopPropagation()}>
            <PasswordToggle
              isVisible={isPasswordVisible}
              onToggle={onTogglePassword}
            />
          </div>
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

      {/* Expanded content */}
      {isExpanded && (
        <div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credential.website && (
                <div>
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Website
                  </div>
                  <a
                    href={credential.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    {credential.website}
                  </a>
                </div>
              )}

              {credential.lastUpdated && (
                <div>
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Last Updated
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {new Date(credential.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {credential.notes && (
              <div className="mt-4">
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Notes
                </div>
                <div
                  className="text-sm p-3 rounded whitespace-pre-wrap"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {credential.notes}
                </div>
              </div>
            )}
          </div>

          <div
            className="p-4 border-t"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="mb-4">
              <div
                className="text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </div>
              <div
                className="font-mono text-sm p-2 rounded"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {isPasswordVisible ? credential.password : "••••••••••••"}
              </div>
            </div>

            <div>
              <div
                className="text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Allocate to a beneficiary
              </div>

              <div className="flex flex-wrap gap-2">
                {beneficiaryAllocations.map((item) => {
                  const beneficiary = item.beneficiary;
                  const isAllocated = isCredentialAllocatedToBeneficiary(
                    credential.id,
                    beneficiary.id,
                    credentialAllocations
                  );

                  return (
                    <Button
                      key={beneficiary.id}
                      onClick={() =>
                        onToggleAllocation(credential.id, beneficiary.id)
                      }
                      variant={isAllocated ? "secondary" : "outline"}
                      size="sm"
                      className="flex items-center"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center mr-1"
                        style={{
                          backgroundColor: "rgba(75, 131, 219, 0.1)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--accent-primary)",
                            fontSize: "0.7rem",
                          }}
                        >
                          {(beneficiary.name || "?").charAt(0).toUpperCase()}
                        </span>
                      </span>
                      {beneficiary.name || "Unnamed"}
                      {isAllocated && " ✓"}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialCard;
