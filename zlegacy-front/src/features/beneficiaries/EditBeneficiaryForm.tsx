import React, { useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import type { Beneficiary, BeneficiaryRelation } from "./types";

interface EditBeneficiaryFormProps {
  beneficiary: Beneficiary;
  onClose: () => void;
  onSave: (updatedBeneficiary: Beneficiary) => void;
}

// Définition des couleurs et libellés pour chaque relation
const relationOptions: {
  value: BeneficiaryRelation;
  label: string;
  color: string;
}[] = [
  { value: "family", label: "Family", color: "#4F46E5" }, // Indigo
  { value: "spouse", label: "Spouse", color: "#EC4899" }, // Pink
  { value: "child", label: "Child", color: "#10B981" },  // Emerald
  { value: "friend", label: "Friend", color: "#F59E0B" }, // Amber
  { value: "business", label: "Business", color: "#0EA5E9" }, // Sky
  { value: "other", label: "Other", color: "#6B7280" }, // Gray
];

const EditBeneficiaryForm: React.FC<EditBeneficiaryFormProps> = ({
  beneficiary,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Beneficiary>({
    ...beneficiary,
    relation: beneficiary.relation || "other",
    relationColor: beneficiary.relationColor || relationOptions.find(opt => opt.value === (beneficiary.relation || "other"))?.color || "#6B7280"
  });

  const handleChange = (field: keyof Beneficiary, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRelationChange = (relation: BeneficiaryRelation) => {
    // Mettre à jour la relation et changer automatiquement la couleur associée
    const relationOption = relationOptions.find(opt => opt.value === relation);
    setFormData({
      ...formData,
      relation,
      relationColor: relationOption?.color || "#6B7280"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex justify-between items-center border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Edit Beneficiary
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name */}
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
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-3 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
            required
          />
        </div>

        {/* Address (non modifiable) */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Aleo Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            className="w-full p-3 rounded-lg border font-mono text-sm opacity-75"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
            disabled
          />
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            The address cannot be changed
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>
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
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>
        </div>

        {/* Relation */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Relationship
          </label>
          <div className="grid grid-cols-3 gap-3">
            {relationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`px-4 py-2 rounded-lg border flex items-center justify-center text-sm transition-colors ${
                  formData.relation === option.value
                    ? "border-transparent"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                style={{
                  backgroundColor:
                    formData.relation === option.value
                      ? `${option.color}20` // Couleur avec 20% d'opacité
                      : "var(--bg-tertiary)",
                  color:
                    formData.relation === option.value
                      ? option.color
                      : "var(--text-secondary)",
                  borderColor:
                    formData.relation === option.value
                      ? option.color
                      : "var(--border-color)",
                }}
                onClick={() => handleRelationChange(option.value)}
              >
                {formData.relation === option.value && (
                  <CheckIcon className="w-4 h-4 mr-2" />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>

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
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="w-full p-3 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditBeneficiaryForm;
