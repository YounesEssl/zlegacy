export { default as BeneficiariesList } from "./BeneficiariesList";
export { default as BeneficiaryCard } from "./BeneficiaryCard";
export { default as BeneficiaryDetails } from "./BeneficiaryDetails";
export { default as AddBeneficiaryForm } from "./AddBeneficiaryForm";
export { default as EditBeneficiaryForm } from "./EditBeneficiaryForm";

// Nouveaux composants
export { default as BeneficiarySearch } from "./components/BeneficiarySearch";
export { default as BeneficiaryGrid } from "./components/BeneficiaryGrid";
export { default as BeneficiaryEmptyState } from "./components/BeneficiaryEmptyState";
export { default as BeneficiaryModals } from "./components/BeneficiaryModals";

// Hook personnalisé
export { useBeneficiaries } from "./hooks/useBeneficiaries";

export type { Beneficiary, NewBeneficiaryFormData } from "./types";
