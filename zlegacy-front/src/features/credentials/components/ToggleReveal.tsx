import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ToggleRevealProps {
  initialVisible?: boolean;
  onToggle?: (visible: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ToggleReveal: React.FC<ToggleRevealProps> = ({
  initialVisible = false,
  onToggle,
  size = 'md',
}) => {
  const [visible, setVisible] = useState(initialVisible);
  const { theme } = useTheme();
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const handleToggle = () => {
    const newState = !visible;
    setVisible(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <motion.button
      type="button"
      className="rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      whileHover={{ 
        scale: 1.1,
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' 
      }}
      title={visible ? "Hide password" : "Show password"}
      aria-label={visible ? "Hide password" : "Show password"}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {visible ? (
          <Eye size={iconSizes[size]} className="text-muted-foreground" />
        ) : (
          <EyeOff size={iconSizes[size]} className="text-muted-foreground" />
        )}
      </motion.div>
    </motion.button>
  );
};
