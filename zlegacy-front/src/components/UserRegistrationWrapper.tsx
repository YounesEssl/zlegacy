import React from 'react';
import { useWalletCustom } from '../contexts/wallet';
import UserRegistrationModal from './UserRegistrationModal';

interface UserRegistrationWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that handles user registration flow when a wallet is connected
 * It displays the registration modal when needed and passes the registration data
 * to the backend
 */
const UserRegistrationWrapper: React.FC<UserRegistrationWrapperProps> = ({ children }) => {
  const { 
    userState, 
    registerUser, 
    closeRegistrationModal,
    publicKey,
    walletConnected
  } = useWalletCustom();

  const handleSubmit = async (firstName: string, lastName: string) => {
    const success = await registerUser(firstName, lastName);
    if (success) {
      closeRegistrationModal();
    }
  };

  return (
    <>
      {children}
      
      {/* Only show the modal if wallet is connected and modal should be open */}
      {walletConnected && publicKey && userState.isRegistrationModalOpen && (
        <UserRegistrationModal
          isOpen={userState.isRegistrationModalOpen}
          onClose={closeRegistrationModal}
          onSubmit={handleSubmit}
          walletAddress={publicKey}
        />
      )}
    </>
  );
};

export default UserRegistrationWrapper;
