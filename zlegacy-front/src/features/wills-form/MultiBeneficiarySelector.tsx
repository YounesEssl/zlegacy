import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { Beneficiary, BeneficiaryRelation } from "./types";
import { useWill } from "./WillContext";

// Import des services API
import { getBeneficiaries } from "../../api/beneficiaryApi";

// Import des sous-composants modulaires
import {
  BeneficiaryTabs,
  BeneficiaryList,
  AddressInput,
  NGOList,
  NavigationButtons
} from "./components/beneficiary-selector";

// Nous utilisons un spinner personnalisé directement dans le composant

interface MultiBeneficiarySelectorProps {
  onContinue: () => void;
  onPrevious?: () => void;
}

const MultiBeneficiarySelector: React.FC<MultiBeneficiarySelectorProps> = ({
  onContinue,
  onPrevious,
}) => {
  const { connected, publicKey } = useWallet();
  const { beneficiaryAllocations, addBeneficiary, removeBeneficiary } = useWill();

  const [mode, setMode] = useState<"select" | "enter" | "ngo">("select");
  const [manualAddress, setManualAddress] = useState("");
  const [availableBeneficiaries, setAvailableBeneficiaries] = useState<Beneficiary[]>([]);
  const [availableNGOs, setAvailableNGOs] = useState<Beneficiary[]>([]);

  // Calculate selected beneficiary IDs for filtering
  const selectedBeneficiaryIds = new Set(
    beneficiaryAllocations.map((item) => item.beneficiary.id)
  );

  // État pour le chargement des données
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Charger les bénéficiaires depuis le backend si l'utilisateur est connecté
  useEffect(() => {
    // Si l'utilisateur est connecté, charger les bénéficiaires réels depuis l'API
    if (connected && publicKey) {
      const fetchBeneficiaries = async () => {
        try {
          setIsLoading(true);
          setLoadError(null);
          console.log(`Chargement des bénéficiaires pour l'adresse: ${publicKey}`);
          
          // Appel à l'API pour récupérer les bénéficiaires
          const beneficiariesData = await getBeneficiaries(publicKey);
          console.log('Bénéficiaires chargés:', beneficiariesData);
          
          // Filtrer les bénéficiaires NGO et standard en vérifiant la valeur de relation
          const standardBeneficiaries = beneficiariesData.filter(b => b.relation !== 'ngo' as BeneficiaryRelation);
          const ngoBeneficiaries = beneficiariesData.filter(b => b.relation === 'ngo' as BeneficiaryRelation);
          
          setAvailableBeneficiaries(standardBeneficiaries);
          setAvailableNGOs(ngoBeneficiaries);
        } catch (error) {
          console.error('Erreur lors du chargement des bénéficiaires:', error);
          setLoadError('Impossible de charger vos bénéficiaires. Veuillez réessayer.');
          // En cas d'erreur, on initialise avec des tableaux vides
          setAvailableBeneficiaries([]);
          setAvailableNGOs([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBeneficiaries();
    } else {
      // Sinon utiliser des données de démonstration pour les besoins de l'interface
      setAvailableBeneficiaries([
        {
          id: "1",
          name: "Alice Smith",
          address: "aleo1p8ld3xgv76vu475kh3f6up9zpy33myzmehnjjjrrzu7yrszt98yqekg0p9",
          createdAt: "2025-04-15",
          relation: "family",
          relationColor: "#4F46E5",
        },
        {
          id: "2",
          name: "Bob Johnson",
          address: "aleo1zklvpj0x4jmwjp0k58rylj5wlzz3lqwy5chhfmxnsjt8etm5qgfq9wn54y",
          createdAt: "2025-05-01",
          relation: "friend",
          relationColor: "#F59E0B",
        },
      ]);
      
      // Définir les ONGs de démonstration
      setAvailableNGOs([
        {
          id: "ngo1",
          name: "Ocean Conservation Fund",
          address: "aleo1ngofund25gvc785chj39awe479fgsh374hdj8247ndv73jkh347hfr89x2",
          createdAt: "2025-01-10",
          relation: "ngo",
          relationColor: "#0EA5E9",
          description: "Dedicated to protecting ocean ecosystems and marine life worldwide.",
          category: "Environment",
          website: "www.oceanconservation.org"
        },
        {
          id: "ngo2",
          name: "Global Education Initiative",
          address: "aleo1educ473hdj8974hfskljahf77834hdj83md7slkgh4739mdh374jxk374h",
          createdAt: "2025-02-15",
          relation: "ngo",
          relationColor: "#22C55E",
          description: "Providing educational resources to underprivileged communities.",
          category: "Education",
          website: "www.globaledu.org"
        },
        {
          id: "ngo3",
          name: "Humanitarian Relief Network",
          address: "aleo1humt74jd83kf73jdh843hr83hf874hd48374hd83h4d374fnd374hdj47",
          createdAt: "2025-03-20",
          relation: "ngo",
          relationColor: "#EF4444",
          description: "Emergency response and long-term support for crisis-affected populations.",
          category: "Humanitarian",
          website: "www.reliefnetwork.org"
        },
      ]);
    }
  }, [connected, publicKey]);

  // Filter out beneficiaries that are already selected
  const filteredBeneficiaries = availableBeneficiaries.filter(
    (beneficiary) => !selectedBeneficiaryIds.has(beneficiary.id)
  );

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleModeChange = (newMode: "select" | "enter" | "ngo") => {
    setMode(newMode);
    // Reset the manual address when switching to select or ngo mode
    if (newMode === "select" || newMode === "ngo") {
      setManualAddress("");
    }
  };

  const handleManualAddressChange = (address: string, _isValid: boolean) => {
    setManualAddress(address);
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    addBeneficiary(beneficiary);
  };

  const handleBeneficiaryRemove = (beneficiaryId: string) => {
    removeBeneficiary(beneficiaryId);
  };

  const isAddressRegistered = availableBeneficiaries.some(
    (b) => b.address === manualAddress
  );

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        Add Beneficiaries
      </h2>
      <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
        Add people or organizations that will receive your assets.
      </p>

      {/* Affichage de l'état de chargement */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin" 
                 style={{ borderTopColor: "var(--accent-primary)" }}>
            </div>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Loading your beneficiaries...
            </p>
          </div>
        </div>
      )}

      {/* Affichage des erreurs */}
      {loadError && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 rounded-lg"
          style={{ backgroundColor: "#FEE2E2", borderLeft: "3px solid #EF4444" }}
        >
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-red-700">{loadError}</p>
              <button 
                className="text-sm text-red-600 hover:text-red-800 mt-1"
                onClick={() => {
                  if (connected && publicKey) {
                    // Relancer le chargement des bénéficiaires
                    setIsLoading(true);
                    setLoadError(null);
                    getBeneficiaries(publicKey)
                      .then(data => {
                        const standardBeneficiaries = data.filter(b => b.relation !== 'ngo' as BeneficiaryRelation);
                        const ngoBeneficiaries = data.filter(b => b.relation === 'ngo' as BeneficiaryRelation);
                        setAvailableBeneficiaries(standardBeneficiaries);
                        setAvailableNGOs(ngoBeneficiaries);
                      })
                      .catch(error => {
                        console.error('Erreur lors du rechargement:', error);
                        setLoadError('Impossible de charger vos bénéficiaires. Veuillez réessayer.');
                      })
                      .finally(() => setIsLoading(false));
                  }
                }}
              >
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Liste des bénéficiaires sélectionnés */}
      {beneficiaryAllocations.length > 0 && (
        <div
          className="p-4 rounded-lg mb-6 space-y-2"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <p
            className="text-sm mb-3 font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Selected Beneficiaries
          </p>
          <div className="space-y-2">
            {beneficiaryAllocations.map((allocation) => (
              <div
                key={allocation.beneficiary.id}
                className="flex justify-between items-center p-2 rounded"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      backgroundColor:
                        allocation.beneficiary.relationColor || "#6B7280",
                    }}
                  >
                    {allocation.beneficiary.name
                      ? allocation.beneficiary.name.charAt(0).toUpperCase()
                      : allocation.beneficiary.address.charAt(5).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {allocation.beneficiary.name || "Unnamed Beneficiary"}
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatAddress(allocation.beneficiary.address)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleBeneficiaryRemove(allocation.beneficiary.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <BeneficiaryTabs
        currentMode={mode}
        onModeChange={handleModeChange}
      />

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        {mode === "select" ? (
          <BeneficiaryList
            beneficiaries={filteredBeneficiaries}
            selectedBeneficiaryIds={selectedBeneficiaryIds}
            onSelect={handleBeneficiarySelect}
            formatAddress={formatAddress}
          />
        ) : mode === "enter" ? (
          <AddressInput
            value={manualAddress}
            onChange={handleManualAddressChange}
            isRegistered={isAddressRegistered}
          />
        ) : (
          <NGOList
            ngos={availableNGOs}
            selectedBeneficiaryIds={selectedBeneficiaryIds}
            onSelect={handleBeneficiarySelect}
            formatAddress={formatAddress}
          />
        )}
      </AnimatePresence>

      {/* Boutons de navigation */}
      <NavigationButtons
        onContinue={onContinue}
        onPrevious={onPrevious}
        isContinueDisabled={beneficiaryAllocations.length === 0}
      />
    </div>
  );
};

export default MultiBeneficiarySelector;
