import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import BeneficiaryInput from "../wills-form/BeneficiaryInput";
import type { NewBeneficiaryFormData } from "./types";

interface AddBeneficiaryFormProps {
  formData: NewBeneficiaryFormData;
  onClose: () => void;
  onChange: (field: string, value: string | number) => void;
  onAddressChange: (address: string, isValid: boolean) => void;
  onSubmit: () => void;
}

const AddBeneficiaryForm: React.FC<AddBeneficiaryFormProps> = ({
  formData,
  onClose,
  onChange,
  onAddressChange,
  onSubmit,
}) => {
  // Référence pour détecter les clics à l'extérieur
  const formRef = useRef<HTMLDivElement>(null);
  
  // Ajouter un gestionnaire d'événements pour la touche Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Ajouter l'écouteur d'événements
    window.addEventListener('keydown', handleEscapeKey);
    
    // Nettoyer l'écouteur à la destruction du composant
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);
  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex justify-between items-center border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Add a Beneficiary
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu du formulaire */}
      <div className="px-5 py-4 space-y-4">
        <div className="space-y-4">
          <div className="mb-4">
            {/* Nom */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full p-2.5 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                placeholder="Enter beneficiary name"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Aleo Address
              </label>
              <BeneficiaryInput
                value={formData.address}
                onChange={onAddressChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                className="w-full p-2.5 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                placeholder="Enter email address"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className="w-full p-2.5 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* La partie relationship a été retirée */}

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              placeholder="Add notes about this beneficiary"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 p-5 border-t" style={{ borderColor: "var(--border-color)" }}>
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={
            !formData.name || !formData.address || !formData.isAddressValid
          }
          leftIcon={<CheckIcon className="w-4 h-4" />}
        >
          Add Beneficiary
        </Button>
      </div>
    </motion.div>
  );
};

export default AddBeneficiaryForm;
