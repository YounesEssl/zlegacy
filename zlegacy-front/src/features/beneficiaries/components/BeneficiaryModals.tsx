import React from 'react';
import AddBeneficiaryForm from '../AddBeneficiaryForm';
import EditBeneficiaryForm from '../EditBeneficiaryForm';
import BeneficiaryDetails from '../BeneficiaryDetails';
import type { Beneficiary, NewBeneficiaryFormData } from '../types';
import { AnimatePresence } from 'framer-motion';

interface BeneficiaryModalsProps {
  // États
  isAddingBeneficiary: boolean;
  isEditingBeneficiary: boolean;
  selectedBeneficiary: Beneficiary | null;
  beneficiaryToEdit: Beneficiary | null;
  newBeneficiary: NewBeneficiaryFormData;
  
  // Actions
  onCloseAddForm: () => void;
  onCloseEditForm: () => void;
  onCloseDetails: () => void;
  onNewBeneficiaryChange: (field: string, value: string | number) => void;
  onAddressChange: (address: string, isValid: boolean) => void;
  onAddBeneficiary: () => void;
  onSaveBeneficiary: (beneficiary: Beneficiary) => void;
}

/**
 * Composant regroupant tous les modals pour les bénéficiaires
 */
const BeneficiaryModals: React.FC<BeneficiaryModalsProps> = ({
  isAddingBeneficiary,
  isEditingBeneficiary,
  selectedBeneficiary,
  beneficiaryToEdit,
  newBeneficiary,
  onCloseAddForm,
  onCloseEditForm,
  onCloseDetails,
  onNewBeneficiaryChange,
  onAddressChange,
  onAddBeneficiary,
  onSaveBeneficiary,
}) => {
  return (
    <>
      {/* Détails du bénéficiaire sélectionné */}
      <AnimatePresence>
        {selectedBeneficiary && (
          <BeneficiaryDetails
            beneficiary={selectedBeneficiary}
            onClose={onCloseDetails}
          />
        )}
      </AnimatePresence>

      {/* Modal d'ajout de bénéficiaire */}
      {isAddingBeneficiary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          onClick={onCloseAddForm}
        >
          {/* Conteneur du formulaire */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-[500px]"
          >
            <AddBeneficiaryForm
              formData={newBeneficiary}
              onClose={onCloseAddForm}
              onChange={onNewBeneficiaryChange}
              onAddressChange={onAddressChange}
              onSubmit={onAddBeneficiary}
            />
          </div>
        </div>
      )}

      {/* Modal d'édition de bénéficiaire */}
      {isEditingBeneficiary && beneficiaryToEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          onClick={onCloseEditForm}
        >
          {/* Conteneur du formulaire */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-[500px]"
          >
            <EditBeneficiaryForm
              beneficiary={beneficiaryToEdit}
              onClose={onCloseEditForm}
              onSave={onSaveBeneficiary}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BeneficiaryModals;
