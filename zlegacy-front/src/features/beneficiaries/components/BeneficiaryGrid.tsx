import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BeneficiaryCard from '../BeneficiaryCard';
import type { Beneficiary } from '../types';

interface BeneficiaryGridProps {
  beneficiaries: Beneficiary[];
  onSelect: (beneficiary: Beneficiary) => void;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (id: string) => void;
}

/**
 * Composant qui affiche la grille des cartes de bénéficiaires
 */
const BeneficiaryGrid: React.FC<BeneficiaryGridProps> = ({
  beneficiaries,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {beneficiaries.map((beneficiary) => (
          <motion.div
            key={beneficiary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <BeneficiaryCard
              beneficiary={beneficiary}
              isSelected={false}
              onSelect={() => onSelect(beneficiary)}
              onEdit={() => onEdit(beneficiary)}
              onDelete={() => onDelete(beneficiary.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BeneficiaryGrid;
