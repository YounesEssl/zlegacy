/**
 * API service for user-related operations
 */

export interface UserData {
  walletAddress: string;
  firstName?: string;
  lastName?: string;
}

export interface UserResponse {
  message: string;
  user: {
    id: string;
    walletAddress: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
    updatedAt: string;
  };
  profileComplete: boolean;
}

/**
 * Connect wallet and create/login user
 * @param userData User data with wallet address and optional profile information
 * @returns Response with user information
 */
export const connectWallet = async (userData: UserData): Promise<UserResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/users/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to connect wallet');
    }

    return await response.json();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

/**
 * Update user information
 * @param walletAddress string User's wallet address
 * @param userData Partial<UserData> Updated user data
 * @returns Response with updated user information
 */
export const updateUser = async (walletAddress: string, userData: Partial<UserData>): Promise<UserResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/users/${walletAddress}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
