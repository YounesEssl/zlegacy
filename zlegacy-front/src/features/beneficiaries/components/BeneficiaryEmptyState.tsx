import React from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';

interface BeneficiaryEmptyStateProps {
  isConnected: boolean;
  onAddBeneficiary: () => void;
}

/**
 * Affiche un état vide lorsqu'il n'y a pas de bénéficiaires
 */
const BeneficiaryEmptyState: React.FC<BeneficiaryEmptyStateProps> = ({
  isConnected,
  onAddBeneficiary,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {isConnected ? (
        // État vide pour les utilisateurs connectés
        <>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <UserPlusIcon className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
          </div>
          <p
            className="text-lg font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            No beneficiaries yet
          </p>
          <p
            className="text-sm max-w-md mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Start by adding your first beneficiary to create your digital will.
          </p>
          <Button
            onClick={onAddBeneficiary}
            variant="primary"
            className="mt-2"
          >
            Add Beneficiary
          </Button>
        </>
      ) : (
        // État vide pour les utilisateurs non connectés (mode démo)
        <>
          <svg
            className="w-16 h-16 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            style={{ color: 'var(--text-muted)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
          <p
            className="text-lg font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            You haven't added any beneficiaries yet.
          </p>
          <p
            className="text-sm mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Add your first beneficiary to start creating your will.
          </p>
          <Button
            onClick={onAddBeneficiary}
            leftIcon={<UserPlusIcon className="w-4 h-4" />}
            className="w-auto px-6 mt-2"
            variant="primary"
          >
            Add your first beneficiary
          </Button>
        </>
      )}
    </div>
  );
};

export default BeneficiaryEmptyState;
