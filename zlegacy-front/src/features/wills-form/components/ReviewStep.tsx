import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckIcon,
  UserGroupIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import type {
  BeneficiaryAllocation,
  TransactionStatus,
  TransactionMode,
  Credential,
} from "../types";
import { useWill } from "../WillContext";

// Import des composants modulaires
import BeneficiariesReview from "./review/BeneficiariesReview";
import TransactionModeReview from "./review/TransactionModeReview";
import NoteReview from "./review/NoteReview";

interface ReviewStepProps {
  beneficiaryAllocations: BeneficiaryAllocation[];
  transactionMode: TransactionMode;
  note?: string;
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
  transactionData: {
    blockHash: string;
    transactionId: string;
    confirmations: number;
    status: TransactionStatus;
    progress: number;
  };
  handleSubmit: (e: React.FormEvent) => void;
  goToPreviousStep: () => void;
}

/**
 * Component for the final review step of the will creation process
 */
const ReviewStep: React.FC<ReviewStepProps> = ({
  beneficiaryAllocations,
  transactionMode,
  note,
  isSubmitting,
  submitStatus,
  handleSubmit,
  goToPreviousStep,
}) => {
  // Get credentials and credential allocations from context
  const {
    credentialAllocations,
    credentials,
    beneficiaryAllocations: contextBeneficiaryAllocations,
    assetAllocations,
    cryptoBalance,
  } = useWill();

  // Calculate actual total allocation from context data
  const realAssetAllocations = new Map();

  // Initialiser les totaux pour chaque bénéficiaire à 0
  contextBeneficiaryAllocations.forEach((beneficiary) => {
    realAssetAllocations.set(beneficiary.beneficiary.id, 0);
  });

  // Calculer les allocations réelles pour chaque actif
  if (assetAllocations.length > 0) {
    // Pour chaque allocation d'actif
    assetAllocations.forEach((allocation) => {
      const beneficiaryId = allocation.beneficiaryId;
      const currentTotal = realAssetAllocations.get(beneficiaryId) || 0;
      realAssetAllocations.set(beneficiaryId, currentTotal + allocation.amount);
    });
  }

  // Variables pour stocker les montants totaux
  let totalAssetAllocated = 0;

  // Calculer le montant total alloué
  Array.from(realAssetAllocations.values()).forEach((amount) => {
    totalAssetAllocated += amount;
  });

  // Calculer le pourcentage total des allocations réelles
  // Calculer la valeur totale des actifs en USD
  let totalPortfolioValueUSD = 0;
  let totalAllocatedValueUSD = 0;

  if (cryptoBalance?.assets && cryptoBalance.assets.length > 0) {
    // Calculer la valeur totale du portefeuille
    cryptoBalance.assets.forEach((asset) => {
      totalPortfolioValueUSD += asset.usdValue;
    });

    // Calculer la valeur totale allouée
    if (assetAllocations.length > 0 && cryptoBalance.assets) {
      assetAllocations.forEach((allocation) => {
        const asset = cryptoBalance.assets?.find(
          (a) => a.symbol === allocation.assetSymbol
        );
        if (asset) {
          const assetUsdRate = asset.usdValue / asset.balance;
          totalAllocatedValueUSD += allocation.amount * assetUsdRate;
        }
      });
    }
  }

  // Calculer le pourcentage de la valeur totale allouée
  // Si aucun actif n'est alloué ou si le portefeuille est vide, l'allocation totale est 0%
  // Important: Ce pourcentage doit correspondre à la somme des pourcentages individuels des bénéficiaires
  const actualTotalAllocation =
    totalPortfolioValueUSD > 0
      ? Math.round((totalAllocatedValueUSD / totalPortfolioValueUSD) * 100)
      : 0;

  // État pour le tooltip d'explication du calcul d'allocation
  const [showAllocationTooltip, setShowAllocationTooltip] = useState(false);

  // Get credentials allocated to a specific beneficiary
  const getBeneficiaryCredentials = (beneficiaryId: string): Credential[] => {
    const allocationsForBeneficiary = credentialAllocations.filter(
      (alloc) => alloc.beneficiaryId === beneficiaryId
    );

    return allocationsForBeneficiary
      .map((alloc) =>
        credentials.find((cred) => cred.id === alloc.credentialId)
      )
      .filter(Boolean) as Credential[];
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Vérifier si des actifs ont été alloués
  const hasAllocatedAssets = assetAllocations.length > 0;

  // Vérifier si des mots de passe ont été alloués
  const hasAllocatedCredentials = credentialAllocations.length > 0;

  // Le formulaire est complet si au moins un bénéficiaire est ajouté ET (des actifs OU des mots de passe sont alloués)
  const isFormComplete =
    contextBeneficiaryAllocations.length > 0 &&
    (hasAllocatedAssets || hasAllocatedCredentials);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center mb-2">
        <DocumentTextIcon
          className="w-6 h-6 mr-2"
          style={{ color: "var(--accent-primary)" }}
        />
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Review Your Will
        </h2>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 bg-opacity-30 dark:bg-opacity-20 p-4 rounded-lg mb-5 flex items-start">
        <InformationCircleIcon
          className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
          style={{ color: "var(--accent-primary)" }}
        />
        <div>
          <p style={{ color: "var(--text-secondary)" }} className="mb-1">
            Please review all the details of your will before finalizing. This
            is the last step before creating your on-chain will.
          </p>
          <p style={{ color: "var(--text-muted)" }} className="text-sm">
            Tip: Make sure all allocations are correct as they cannot be changed
            once published.
          </p>
        </div>
      </div>

      {/* Summary statistics */}
      <div
        className="rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
            >
              <UserGroupIcon
                className="w-5 h-5"
                style={{ color: "var(--accent-primary)" }}
              />
            </div>
            <div>
              <div
                className="text-xs sm:text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Beneficiaries
              </div>
              <div
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {beneficiaryAllocations.length}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(75, 131, 219, 0.1)" }}
            >
              <CurrencyDollarIcon
                className="w-5 h-5"
                style={{ color: "var(--accent-primary)" }}
              />
            </div>
            <div>
              <div
                className="text-xs sm:text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Total Allocation
              </div>
              <div className="flex items-center">
                <div
                  className="text-lg sm:text-xl font-semibold mr-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {actualTotalAllocation}%
                </div>
                <button
                  className="focus:outline-none"
                  onMouseEnter={() => setShowAllocationTooltip(true)}
                  onMouseLeave={() => setShowAllocationTooltip(false)}
                  onClick={() =>
                    setShowAllocationTooltip(!showAllocationTooltip)
                  }
                  aria-label="More information about allocation percentage"
                >
                  <InformationCircleIcon
                    className="w-4 h-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>
                {/* Tooltip */}
                {showAllocationTooltip && (
                  <div
                    className="absolute z-10 w-64 p-3 rounded-lg shadow-lg transition-opacity duration-200 mt-10"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div>
                      <div className="flex items-center mb-1">
                        <InformationCircleIcon
                          className="w-4 h-4 mr-1"
                          style={{ color: "var(--accent-primary)" }}
                        />
                        <h4
                          className="font-medium text-xs"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Allocated Percentage
                        </h4>
                      </div>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        This percentage represents the total value of allocated
                        assets relative to the total portfolio value (calculated
                        in USD).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
              <div
                className="text-xs sm:text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Credentials
              </div>
              <div
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {credentials.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-3">
          {/* Beneficiary Review Section */}
          <div className="md:col-span-2 space-y-6 order-2 md:order-1">
            <BeneficiariesReview
              getBeneficiaryCredentials={getBeneficiaryCredentials}
            />
            <NoteReview note={note} />
          </div>

          <div className="space-y-6 order-1 md:order-2 mb-6 md:mb-0">
            <TransactionModeReview transactionMode={transactionMode} />

            {/* Summary Card */}
            <div
              className="rounded-lg border p-3 sm:p-4"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <div className="flex items-center mb-3">
                <DocumentTextIcon
                  className="w-5 h-5 mr-2"
                  style={{ color: "var(--accent-primary)" }}
                />
                <h4
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Will Details
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Privacy mode
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {transactionMode === "private" ? "Private" : "Public"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Personal note
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {note && note.trim() !== "" ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Assets allocated
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {/* Count unique assets that have been allocated */}
                    {
                      Array.from(
                        new Set(
                          assetAllocations.map((alloc) => alloc.assetSymbol)
                        )
                      ).length
                    }{" "}
                    / {cryptoBalance?.assets?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Credentials allocated
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {credentialAllocations.length} / {credentials.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Total value (USD)
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Math.round(totalAllocatedValueUSD))}
                  </span>
                </div>

                <div
                  className="pt-2 mt-2 border-t"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Creation date
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        {/* Mobile/tablet layout for info text - shown only on small screens */}
        <div className="block sm:hidden mb-4">
          {!isFormComplete && (
            <p
              className="text-xs mb-2 font-medium text-center"
              style={{ color: "var(--accent-danger)" }}
            >
              {contextBeneficiaryAllocations.length === 0
                ? "You must add at least one beneficiary"
                : "You must allocate at least one asset or password"}
            </p>
          )}
          <p
            className="text-xs mb-1 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            {transactionMode === "private"
              ? "Private transactions are irreversible and encrypted"
              : "Public transactions are visible to anyone on the blockchain"}
          </p>
          <p
            className="text-xs font-medium text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            Creating will submit to the Aleo network
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Previous
          </Button>

          <div className="hidden sm:block order-1 sm:order-2">
            {!isFormComplete && (
              <p
                className="text-xs mb-1 font-medium"
                style={{ color: "var(--accent-danger)" }}
              >
                {contextBeneficiaryAllocations.length === 0
                  ? "You must add at least one beneficiary"
                  : "You must allocate at least one asset or password"}
              </p>
            )}
            <p
              className="text-xs mb-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {transactionMode === "private"
                ? "Private transactions are irreversible and encrypted"
                : "Public transactions are visible to anyone on the blockchain"}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Creating will submit to the Aleo network
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormComplete}
            isLoading={isSubmitting}
            variant="primary"
            className="w-full sm:w-auto order-1 sm:order-3 relative overflow-hidden"
            rightIcon={<CheckIcon className="w-4 h-4" />}
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : submitStatus === "success" ? (
              <span>Will Created</span>
            ) : (
              <span>Create Will</span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewStep;
