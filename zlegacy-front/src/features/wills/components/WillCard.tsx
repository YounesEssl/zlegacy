import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRightIcon,
  UserGroupIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import type { Will } from '../types';
import { useNavigate } from 'react-router-dom';

interface WillCardProps {
  will: Will;
}

const WillCard: React.FC<WillCardProps> = ({ will }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const getAccentColor = () => {
    return 'var(--accent-primary)';
  };
  
  const getTransactionModeIcon = () => {
    if (will.transactionMode === 'private') {
      return <LockClosedIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
    }
    return <LockOpenIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
  };
  
  const getTransactionModeText = () => {
    return will.transactionMode === 'private' ? 'Private' : 'Public';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const handleViewDetails = () => {
    navigate(`/wills/${will.id}`);
  };

  const handleEditWill = () => {
    navigate(`/wills/edit/${will.id}`);
  };

  return (
    <motion.div
      className="rounded-xl border overflow-hidden relative"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? 
          '0 10px 25px -5px rgba(var(--shadow-rgb), 0.2), 0 8px 10px -6px rgba(var(--shadow-rgb), 0.1)' : 
          '0 1px 3px 0 rgba(var(--shadow-rgb), 0.1), 0 1px 2px -1px rgba(var(--shadow-rgb), 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Accent color bar at the top */}
      <div 
        className="h-1.5 w-full" 
        style={{ backgroundColor: getAccentColor() }}
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1" 
                style={{ color: 'var(--text-primary)' }}
            >
              {will.title}
            </h3>
            <div className="flex items-center space-x-1">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Last updated {formatDate(will.updatedAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.span 
              className="text-xs px-2 py-1 rounded-full flex items-center"
              style={{ 
                backgroundColor: `${getAccentColor()}20`, /* 20 = 12% opacity in hex */
                color: getAccentColor()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Will</span>
            </motion.span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div 
            className="flex items-center space-x-2 p-2 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
            whileHover={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.05)' }}
          >
            <UserGroupIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {will.beneficiaries.length} beneficiar{will.beneficiaries.length !== 1 ? 'ies' : 'y'}
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2 p-2 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
            whileHover={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.05)' }}
          >
            {getTransactionModeIcon()}
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {getTransactionModeText()}
            </span>
          </motion.div>
        </div>

        {will.note && (
          <motion.div 
            className="p-3 rounded-lg mb-4"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)',
              borderLeft: `3px solid ${getAccentColor()}` 
            }}
          >
            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
              {will.note}
            </p>
          </motion.div>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <motion.button
            initial={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'rgb(79, 70, 229)' }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgb(79, 70, 229)', color: 'rgb(255, 255, 255)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditWill}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300"
            style={{ 
              border: '1px solid rgba(79, 70, 229, 0.3)'
            }}
          >
            <span className="text-sm font-medium">Edit</span>
            <PencilIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            initial={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: 'rgb(59, 130, 246)' }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgb(59, 130, 246)', color: 'rgb(255, 255, 255)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewDetails}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300"
            style={{ 
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            <span className="text-sm font-medium">View details</span>
            <ChevronRightIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WillCard;
