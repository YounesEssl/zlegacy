import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  Beneficiary,
  BeneficiaryAllocation,
  TransactionMode,
  FormStep,
  CurrencyUnit,
  CryptoBalance,
  CryptoAsset,
  AssetAllocation,
  Credential,
  CredentialAllocation,
  Executor,
} from "./types";
import { useCryptoPrice } from "../../hooks/useCryptoPrice";

// Import Will type from wills feature
import type { Will } from "../wills/types";

// Demo data for testing edit mode
const demoWills: Will[] = [
  {
    id: "1",
    title: "Primary Will",
    createdAt: "2025-04-12T10:30:00Z",
    updatedAt: "2025-05-01T14:22:00Z",
    beneficiaries: [
      {
        id: "1",
        name: "Sophie Martin",
        address: "aleo1abc...def1",
        allocation: 60,
        relation: "spouse",
        relationColor: "#4f46e5",
      },
      {
        id: "2",
        name: "Lucas Martin",
        address: "aleo1ghi...jkl2",
        allocation: 40,
        relation: "child",
        relationColor: "#0ea5e9",
      },
    ],
    verificationMethod: "email",
    transactionMode: "private" as TransactionMode,
    testatorAddress: "aleo1xyz...789",
    note: "This is my primary will that includes all my digital assets and accounts.",
    verificationDate: "2025-05-01T14:22:00Z",
  },
  {
    id: "2",
    title: "Crypto Assets Will",
    createdAt: "2025-04-20T09:15:00Z",
    updatedAt: "2025-04-20T09:15:00Z",
    beneficiaries: [
      {
        id: "3",
        name: "Marc Dubois",
        address: "aleo1mno...pqr3",
        allocation: 100,
        relation: "family",
        relationColor: "#22c55e",
      },
    ],
    verificationMethod: "biometric",
    transactionMode: "public" as TransactionMode,
    testatorAddress: "aleo1xyz...789",
    note: "Will dedicated specifically to my cryptocurrency assets.",
  },
  {
    id: "3",
    title: "Secondary Will",
    createdAt: "2025-03-05T16:40:00Z",
    updatedAt: "2025-04-10T11:20:00Z",
    beneficiaries: [
      {
        id: "4",
        name: "Julie White",
        address: "aleo1stu...vwx4",
        allocation: 50,
        relation: "family",
        relationColor: "#22c55e",
      },
      {
        id: "5",
        name: "Thomas Black",
        address: "aleo1yza...bcd5",
        allocation: 50,
        relation: "friend",
        relationColor: "#f59e0b",
      },
    ],
    verificationMethod: "phone",
    transactionMode: "private" as TransactionMode,
    testatorAddress: "aleo1xyz...789",
    note: "Draft secondary will for non-financial digital assets.",
  },
];

interface WillContextType {
  // Selected beneficiaries with allocations
  beneficiaryAllocations: BeneficiaryAllocation[];
  addBeneficiary: (beneficiary: Beneficiary) => void;
  removeBeneficiary: (beneficiaryId: string) => void;
  updateAllocation: (beneficiaryId: string, allocation: number) => void;
  resetAllocationsToEqual: () => void;

  // Total allocation (should equal 100%)
  totalAllocation: number;
  isAllocationValid: boolean;

  // Asset-specific allocations
  assetAllocations: AssetAllocation[];
  setAssetAllocations: (allocations: AssetAllocation[]) => void;
  updateAssetAllocation: (
    assetSymbol: string,
    beneficiaryId: string,
    percentage: number,
    isPortfolioAllocation?: boolean
  ) => void;

  // Credential allocations
  credentialAllocations: CredentialAllocation[];
  setCredentialAllocations: (allocations: CredentialAllocation[]) => void;
  allocateCredential: (credentialId: string, beneficiaryId: string) => void;
  removeCredentialAllocation: (credentialId: string) => void;
  credentials: Credential[];
  setCredentials: (credentials: Credential[]) => void;

  // Executor selection
  executor: Executor | null;
  setExecutor: (executor: Executor | null) => void;

  // Transaction mode (private or public)
  transactionMode: TransactionMode;
  setTransactionMode: (mode: TransactionMode) => void;

  // Currency display preferences
  currencyUnit: CurrencyUnit;
  setCurrencyUnit: (unit: CurrencyUnit) => void;
  cryptoBalance: CryptoBalance;
  setCryptoBalance: (balance: CryptoBalance) => void;

  // Personal note
  note: string;
  setNote: (note: string) => void;

  // Form navigation
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;

  // Testator address
  testatorAddress: string;

  // Edit mode
  isEditMode: boolean;
  willIdToEdit: string | null;
  originalWill: any | null;
}

interface WillProviderProps {
  children: ReactNode;
  testatorAddress: string;
  willIdToEdit?: string | null;
}

const WillContext = createContext<WillContextType | undefined>(undefined);

export const WillProvider: React.FC<WillProviderProps> = ({
  children,
  testatorAddress,
  willIdToEdit,
}) => {
  // State for edit mode
  const isEditMode = !!willIdToEdit;
  const [originalWill, setOriginalWill] = useState<Will | null>(null);

  // State for beneficiaries and their allocations
  const [beneficiaryAllocations, setBeneficiaryAllocations] = useState<
    BeneficiaryAllocation[]
  >([]);

  // Form step state
  const [currentStep, setCurrentStep] = useState<FormStep>("beneficiaries");

  // Executor selection
  const [executor, setExecutor] = useState<Executor | null>(null);

  // Transaction mode state
  const [transactionMode, setTransactionMode] =
    useState<TransactionMode>("private");

  // Currency display state
  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>("percentage");

  // Initial state for assets (ALEO, ETH, USDT, etc.)
  const initialAssets: CryptoAsset[] = [
    {
      symbol: "ALEO",
      balance: 2584.75,
      usdValue: 25847.5, // Valeur initiale estimée ($10 par ALEO)
    },
    {
      symbol: "ETH",
      balance: 1.28,
      usdValue: 3456, // Valeur initiale estimée ($2700 par ETH)
    },
    {
      symbol: "USDT",
      balance: 5000,
      usdValue: 5000, // Valeur 1:1 avec USD
    },
    {
      symbol: "BTC",
      balance: 0.12,
      usdValue: 7200, // Valeur initiale estimée ($60000 par BTC)
    },
  ];

  // Get real-time prices with CoinGecko
  const { prices, loading } = useCryptoPrice([
    "aleo",
    "ethereum",
    "tether",
    "bitcoin",
  ]);

  // Update USD values of assets when prices are loaded
  useEffect(() => {
    if (prices && !loading) {
      const updatedAssets = initialAssets.map((asset) => {
        let coinId;
        switch (asset.symbol) {
          case "ALEO":
            coinId = "aleo";
            break;
          case "ETH":
            coinId = "ethereum";
            break;
          case "USDT":
            coinId = "tether";
            break;
          case "BTC":
            coinId = "bitcoin";
            break;
          default:
            coinId = asset.symbol.toLowerCase();
        }

        const usdPrice = prices[coinId]?.usd || 0;
        return {
          ...asset,
          usdValue: asset.balance * usdPrice,
        };
      });

      // Mettre à jour cryptoBalance avec les dernières valeurs
      setCryptoBalance({
        symbol: "ALEO", // Devise principale
        balance: updatedAssets[0].balance, // Solde ALEO
        usdValue: updatedAssets[0].usdValue, // Valeur USD de l'ALEO
        assets: updatedAssets, // Tous les actifs
      });
    }
  }, [prices, loading]);

  // État pour cryptoBalance (initialisé avec valeurs par défaut et mis à jour par useEffect)
  const [cryptoBalance, setCryptoBalance] = useState<CryptoBalance>({
    symbol: "ALEO",
    balance: 2584.75,
    usdValue: 25847.5, // Valeur initiale estimée ($10 par ALEO)
    assets: initialAssets,
  });

  // Asset-specific allocations state
  const [assetAllocations, setAssetAllocations] = useState<AssetAllocation[]>(
    []
  );

  // Credentials state
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credentialAllocations, setCredentialAllocations] = useState<
    CredentialAllocation[]
  >([]);

  // Update a specific asset allocation
  const updateAssetAllocation = (
    assetSymbol: string,
    beneficiaryId: string,
    percentage: number,
    isPortfolioAllocation: boolean = false
  ) => {
    // Trouver l'actif correspondant pour calculer le montant en fonction du pourcentage
    const asset = cryptoBalance?.assets?.find((a) => a.symbol === assetSymbol);

    if (!asset) {
      console.warn(`Asset ${assetSymbol} not found in crypto balance`);
      return; // Ne pas poursuivre si l'actif n'existe pas
    }

    // Calculer le montant basé sur le pourcentage
    const amount = (percentage / 100) * asset.balance;

    console.log(
      `Updating allocation for ${assetSymbol} to beneficiary ${beneficiaryId}: ` +
      `${percentage}% (${amount.toFixed(8)} ${assetSymbol}) - ` +
      `Portfolio allocation: ${isPortfolioAllocation ? 'yes' : 'no'}`
    );

    setAssetAllocations((prev) => {
      // Find existing allocation
      const existingIndex = prev.findIndex(
        (a) =>
          a.assetSymbol === assetSymbol && a.beneficiaryId === beneficiaryId
      );

      const newAllocations = [...prev];

      if (existingIndex >= 0) {
        // Update existing allocation
        newAllocations[existingIndex] = {
          ...newAllocations[existingIndex],
          amount,
          percentage,
        };
      } else {
        // Add new allocation
        newAllocations.push({
          assetSymbol,
          beneficiaryId,
          amount,
          percentage,
        });
      }

      return newAllocations;
    });
  };

  // Personal note state
  const [note, setNote] = useState<string>("");

  // Effect to load the will data to edit
  useEffect(() => {
    if (willIdToEdit) {
      // In production mode, we would make an API call here
      // For now, we simulate with a delay
      const loadWillData = async () => {
        try {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Find the corresponding will in the demo data
          const willData = demoWills.find((w) => w.id === willIdToEdit);

          if (willData) {
            setOriginalWill(willData);

            // Initialize form data with existing will
            setNote(willData.note || "");
            setTransactionMode(willData.transactionMode || "private");

            // Convert beneficiaries to BeneficiaryAllocation format
            // Adapt properties to match expected type
            const allocations = willData.beneficiaries.map((b) => ({
              beneficiary: {
                id: b.id,
                name: b.name,
                address: b.address,
                relation: b.relation,
                relationColor: b.relationColor,
              } as Beneficiary,
              allocation:
                b.allocation || Math.floor(100 / willData.beneficiaries.length),
            }));

            // Adjust to ensure total is 100%
            if (allocations.length > 0) {
              const totalAlloc = allocations.reduce(
                (sum, item) => sum + item.allocation,
                0
              );
              if (totalAlloc !== 100) {
                allocations[0].allocation += 100 - totalAlloc;
              }
            }

            setBeneficiaryAllocations(allocations);
          }
        } catch (error) {
          console.error("Error loading will to edit:", error);
        }
      };

      loadWillData();
    }
  }, [willIdToEdit, setNote, setTransactionMode, setBeneficiaryAllocations]);

  // Calculate total allocation
  const totalAllocation = beneficiaryAllocations.reduce(
    (sum, item) => sum + item.allocation,
    0
  );

  // Check if allocation is valid (less than or equal to 100%)
  const isAllocationValid = totalAllocation <= 100;

  // Add a beneficiary
  const addBeneficiary = (beneficiary: Beneficiary) => {
    // Check if beneficiary already exists
    if (
      beneficiaryAllocations.some(
        (item) => item.beneficiary.id === beneficiary.id
      )
    ) {
      return;
    }

    // Calculate initial allocation
    const initialAllocation = beneficiaryAllocations.length === 0 ? 100 : 0;

    setBeneficiaryAllocations([
      ...beneficiaryAllocations,
      { beneficiary, allocation: initialAllocation },
    ]);
  };

  // Remove a beneficiary
  const removeBeneficiary = (beneficiaryId: string) => {
    const newAllocations = beneficiaryAllocations.filter(
      (item) => item.beneficiary.id !== beneficiaryId
    );

    // Redistribute allocation if any beneficiaries remain
    if (newAllocations.length > 0) {
      const removedAllocation =
        beneficiaryAllocations.find(
          (item) => item.beneficiary.id === beneficiaryId
        )?.allocation || 0;

      const redistributeAmount = removedAllocation / newAllocations.length;

      const redistributedAllocations = newAllocations.map((item) => ({
        ...item,
        allocation: Math.round(item.allocation + redistributeAmount),
      }));

      // Adjust to ensure total is 100%
      if (redistributedAllocations.length > 0) {
        const newTotal = redistributedAllocations.reduce(
          (sum, item) => sum + item.allocation,
          0
        );

        if (newTotal !== 100 && redistributedAllocations.length > 0) {
          redistributedAllocations[0].allocation += 100 - newTotal;
        }
      }

      setBeneficiaryAllocations(redistributedAllocations);
    } else {
      setBeneficiaryAllocations([]);
    }
  };

  // Update allocation for a beneficiary without adjusting others
  const updateAllocation = (beneficiaryId: string, newAllocation: number) => {
    // Ensure newAllocation is between 0 and 100
    const validAllocation = Math.max(0, Math.min(100, newAllocation));

    // Update only the target beneficiary's allocation
    const updatedAllocations = beneficiaryAllocations.map((item) =>
      item.beneficiary.id === beneficiaryId
        ? { ...item, allocation: validAllocation }
        : item
    );

    setBeneficiaryAllocations(updatedAllocations);
  };

  // Reset allocations to divide equally among all beneficiaries
  const resetAllocationsToEqual = () => {
    if (beneficiaryAllocations.length === 0) return;

    const equalShare = Math.floor(100 / beneficiaryAllocations.length);
    const remainder = 100 - equalShare * beneficiaryAllocations.length;

    const updatedAllocations = beneficiaryAllocations.map((item, index) => ({
      ...item,
      allocation: equalShare + (index === 0 ? remainder : 0),
    }));

    setBeneficiaryAllocations(updatedAllocations);
  };

  // Allocate a credential to a beneficiary
  const allocateCredential = (credentialId: string, beneficiaryId: string) => {
    // Check if this exact allocation already exists
    const existingAllocation = credentialAllocations.find(
      (alloc) =>
        alloc.credentialId === credentialId &&
        alloc.beneficiaryId === beneficiaryId
    );

    // If it already exists, do nothing
    if (existingAllocation) return;

    // Add the new allocation (allowing the same credential to be allocated to multiple beneficiaries)
    setCredentialAllocations([
      ...credentialAllocations,
      { credentialId, beneficiaryId },
    ]);
  };

  // Remove a credential allocation
  const removeCredentialAllocation = (credentialId: string) => {
    setCredentialAllocations(
      credentialAllocations.filter(
        (alloc) => alloc.credentialId !== credentialId
      )
    );
  };

  return (
    <WillContext.Provider
      value={{
        beneficiaryAllocations,
        addBeneficiary,
        removeBeneficiary,
        updateAllocation,
        resetAllocationsToEqual,
        totalAllocation,
        isAllocationValid,
        assetAllocations,
        setAssetAllocations,
        updateAssetAllocation,
        credentials,
        setCredentials,
        credentialAllocations,
        setCredentialAllocations,
        allocateCredential,
        removeCredentialAllocation,
        executor,
        setExecutor,
        transactionMode,
        setTransactionMode,
        currencyUnit,
        setCurrencyUnit,
        cryptoBalance,
        setCryptoBalance,
        note,
        setNote,
        currentStep,
        setCurrentStep,
        testatorAddress,
        isEditMode,
        willIdToEdit: willIdToEdit || null,
        originalWill,
      }}
    >
      {children}
    </WillContext.Provider>
  );
};

export const useWill = (): WillContextType => {
  const context = useContext(WillContext);
  if (context === undefined) {
    throw new Error("useWill must be used within a WillProvider");
  }
  return context;
};
