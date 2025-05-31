import React from 'react';
import { motion } from 'framer-motion';
import {
  DocumentPlusIcon,
  UsersIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ElementType;
  actionText?: string;
  actionIcon?: React.ElementType;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  actionIcon: ActionIcon,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
      style={{ 
        backgroundColor: 'var(--bg-tertiary)', 
        borderColor: 'var(--border-color)',
        border: '1px solid'
      }}
    >
      <div 
        className="p-4 rounded-full mb-4"
        style={{ backgroundColor: 'var(--accent-primary-transparent)' }}
      >
        <Icon className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      
      {actionText && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all"
          style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          onClick={onAction}
        >
          {ActionIcon && <ActionIcon className="w-5 h-5" />}
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export const EmptyWills: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyState
      title="No will(s) Created"
      description="You haven't created any wills yet. Start by creating your first will to protect your digital assets."
      icon={DocumentTextIcon}
      actionText="Create will"
      actionIcon={DocumentPlusIcon}
      onAction={() => navigate('/create')}
    />
  );
};

export const EmptyBeneficiaries: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyState
      title="No Beneficiaries"
      description="You haven't added any beneficiaries yet. Add beneficiaries to distribute your digital assets."
      icon={UsersIcon}
      actionText="Manage Beneficiaries"
      actionIcon={UsersIcon}
      onAction={() => navigate('/beneficiaries')}
    />
  );
};

export const EmptyActivities: React.FC = () => {
  return (
    <EmptyState
      title="No Recent Activity"
      description="No activity has been recorded yet. Activities will appear here when you start using the application."
      icon={ArrowPathIcon}
    />
  );
};

export const EmptySecurityStatus: React.FC = () => {
  return (
    <EmptyState
      title="Security Status"
      description="Security verification will be available once you've created your first will."
      icon={ShieldExclamationIcon}
    />
  );
};

export const EmptyAllocation: React.FC = () => {
  return (
    <EmptyState
      title="No Allocations"
      description="No asset allocations have been defined. Allocations will appear here when you configure your wills."
      icon={CheckBadgeIcon}
    />
  );
};
