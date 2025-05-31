import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  KeyIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import { useWill } from "../WillContext";
import { mockCredentials } from "../mocks/credentials";
import { isCredentialAllocatedToBeneficiary } from "../utils/credentialUtils";

// Import sub-components
import AllocationTabs from "./credentials-allocation/AllocationTabs";
import CredentialSearch from "./credentials-allocation/CredentialSearch";
import CredentialsList from "./credentials-allocation/CredentialsList";
import BeneficiaryCredentialsView from "./credentials-allocation/BeneficiaryCredentialsView";

interface CredentialsAllocationStepProps {
  onPrevious: () => void;
  onContinue: () => void;
}

/**
 * Credentials allocation step for will creation
 * Allows users to allocate access credentials to different beneficiaries
 */
const CredentialsAllocationStep: React.FC<CredentialsAllocationStepProps> = ({
  onPrevious,
  onContinue,
}) => {
  const {
    beneficiaryAllocations,
    credentials,
    setCredentials,
    credentialAllocations,
    setCredentialAllocations,
  } = useWill();

  // State for visible passwords
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  // State for active tab - default is "beneficiaries"
  const [activeTab, setActiveTab] = useState<"credentials" | "beneficiaries">(
    "beneficiaries"
  );

  // State for search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for expanded credentials and beneficiaries
  const [expandedCredentials, setExpandedCredentials] = useState<string[]>([]);
  const [expandedBeneficiaries, setExpandedBeneficiaries] = useState<string[]>(
    []
  );

  // Initialize mock credentials if needed
  useEffect(() => {
    if (credentials.length === 0) {
      setCredentials(mockCredentials);
    }

    // Expand the first credential and beneficiary by default
    if (credentials.length > 0 && expandedCredentials.length === 0) {
      setExpandedCredentials([credentials[0].id]);
    }

    if (
      beneficiaryAllocations.length > 0 &&
      expandedBeneficiaries.length === 0
    ) {
      setExpandedBeneficiaries([beneficiaryAllocations[0].beneficiary.id]);
    }
  }, [
    credentials,
    setCredentials,
    expandedCredentials,
    expandedBeneficiaries,
    beneficiaryAllocations,
  ]);

  // Toggle password visibility
  const togglePassword = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle credential expansion
  const toggleCredentialExpansion = (credentialId: string) => {
    setExpandedCredentials((prev) =>
      prev.includes(credentialId)
        ? prev.filter((id) => id !== credentialId)
        : [...prev, credentialId]
    );
  };

  // Toggle beneficiary expansion
  const toggleBeneficiaryExpansion = (beneficiaryId: string) => {
    setExpandedBeneficiaries((prev) =>
      prev.includes(beneficiaryId)
        ? prev.filter((id) => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    );
  };

  // Toggle credential allocation to a beneficiary
  const toggleCredentialAllocation = (
    credentialId: string,
    beneficiaryId: string
  ) => {
    if (
      isCredentialAllocatedToBeneficiary(
        credentialId,
        beneficiaryId,
        credentialAllocations
      )
    ) {
      // If already allocated, remove the specific allocation for this beneficiary
      setCredentialAllocations(
        credentialAllocations.filter(
          (alloc) =>
            !(
              alloc.credentialId === credentialId &&
              alloc.beneficiaryId === beneficiaryId
            )
        )
      );
    } else {
      // If not allocated yet, add a new allocation
      setCredentialAllocations([
        ...credentialAllocations,
        {
          credentialId,
          beneficiaryId,
        },
      ]);
    }
  };

  // Function to allocate all credentials to a beneficiary
  const allocateAllCredentials = (beneficiaryId: string) => {
    // Create a new set of allocations
    const newAllocations = [...credentialAllocations];

    // For each credential filtered by search, check if it's already allocated to this beneficiary
    filteredCredentials.forEach((credential) => {
      const isAlreadyAllocated = isCredentialAllocatedToBeneficiary(
        credential.id,
        beneficiaryId,
        credentialAllocations
      );

      // If not yet allocated, add the allocation
      if (!isAlreadyAllocated) {
        newAllocations.push({
          credentialId: credential.id,
          beneficiaryId,
        });
      }
    });

    // Update allocations
    setCredentialAllocations(newAllocations);
  };

  // Filter credentials based on search query
  const filteredCredentials = credentials.filter(
    (credential) =>
      credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (credential.website &&
        credential.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (credential.notes &&
        credential.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center mb-2">
        <KeyIcon
          className="w-6 h-6 mr-2"
          style={{ color: "var(--accent-primary)" }}
        />
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Credentials Allocation
        </h2>
      </div>

      <div
        className=" rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="bg-blue-50 dark:bg-blue-900 bg-opacity-30 dark:bg-opacity-20 p-4 rounded-lg mb-5 flex items-start">
          <ShieldCheckIcon
            className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
            style={{ color: "var(--accent-primary)" }}
          />
          <div>
            <p style={{ color: "var(--text-secondary)" }} className="mb-1">
              Allocate your credentials and passwords to your beneficiaries.
              Each beneficiary will only receive the credentials you
              specifically assign to them.
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">
              Tip: You can allocate the same credential to multiple
              beneficiaries if needed.
            </p>
          </div>
        </div>

        {/* Summary statistics */}
        <div
          className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg"
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
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                Total Credentials
              </div>
              <div
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {credentials.length}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
            >
              <KeyIcon
                className="w-5 h-5"
                style={{ color: "var(--accent-primary)" }}
              />
            </div>
            <div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                Allocated Credentials
              </div>
              <div
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {credentialAllocations.length}
              </div>
            </div>
          </div>


        </div>

        {/* Navigation Tabs */}
        <AllocationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Search bar */}
        <CredentialSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={
            activeTab === "credentials"
              ? "Search for credentials by title, username, or website..."
              : "Search for beneficiaries by name..."
          }
        />

        {/* View by credentials/beneficiaries based on active tab */}
        {activeTab === "credentials" ? (
          <CredentialsList
            credentials={filteredCredentials}
            beneficiaryAllocations={beneficiaryAllocations}
            credentialAllocations={credentialAllocations}
            expandedCredentials={expandedCredentials}
            visiblePasswords={visiblePasswords}
            onToggleExpand={toggleCredentialExpansion}
            onTogglePassword={togglePassword}
            onToggleAllocation={toggleCredentialAllocation}
          />
        ) : (
          <BeneficiaryCredentialsView
            beneficiaryAllocations={beneficiaryAllocations.filter(
              (b) =>
                b.beneficiary.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) || searchQuery === ""
            )}
            credentials={credentials}
            credentialAllocations={credentialAllocations}
            expandedBeneficiaries={expandedBeneficiaries}
            onToggleBeneficiaryExpansion={toggleBeneficiaryExpansion}
            onAllocateAllCredentials={allocateAllCredentials}
            onToggleCredentialAllocation={toggleCredentialAllocation}
            filteredCredentials={filteredCredentials}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex justify-between">
          <Button onClick={onPrevious} variant="outline">
            Previous
          </Button>
          <Button
            onClick={onContinue}
            variant="primary"
            disabled={
              credentials.length > 0 && credentialAllocations.length === 0
            }
          >
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CredentialsAllocationStep;
