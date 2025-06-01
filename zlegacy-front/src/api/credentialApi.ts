import axios from "axios";
import type {
  Credential,
  NewCredentialFormData,
} from "../features/credentials";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

interface CredentialsListResponse {
  credentials: Credential[];
}

interface CredentialResponse {
  credential: Credential;
}

interface DecryptedFieldResponse {
  [key: string]: string;
}

export const getCredentials = async (
  walletAddress: string
): Promise<Credential[]> => {
  try {
    const response = await axios.get<CredentialsListResponse>(
      `${API_URL}/credentials/list/${walletAddress}`
    );
    return response.data.credentials;
  } catch (error) {
    console.error("Erreur lors de la récupération des credentials:", error);
    throw error;
  }
};

export const getCredentialById = async (
  walletAddress: string,
  credentialId: string
): Promise<Credential> => {
  try {
    const response = await axios.get<CredentialResponse>(
      `${API_URL}/credentials/detail/${walletAddress}/${credentialId}`
    );
    return response.data.credential;
  } catch (error) {
    console.error("Erreur lors de la récupération du credential:", error);
    throw error;
  }
};

export const createCredential = async (
  walletAddress: string,
  credentialData: NewCredentialFormData
): Promise<Credential> => {
  try {
    console.log("Données envoyées à l'API de création de credential:", {
      endpoint: `${API_URL}/credentials/create/${walletAddress}`,
      data: JSON.stringify(credentialData),
      type: credentialData.type,
      typeOf: typeof credentialData.type,
      name: credentialData.name,
      hasPassword: !!credentialData.password,
    });

    const response = await axios.post<CredentialResponse>(
      `${API_URL}/credentials/create/${walletAddress}`,
      credentialData
    );
    return response.data.credential;
  } catch (error: any) {
    console.error("Erreur lors de la création du credential:", error);
    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    }
    throw error;
  }
};

export const updateCredential = async (
  walletAddress: string,
  credentialId: string,
  credentialData: Partial<Credential>
): Promise<Credential> => {
  try {
    const response = await axios.put<CredentialResponse>(
      `${API_URL}/credentials/update/${walletAddress}/${credentialId}`,
      credentialData
    );
    return response.data.credential;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du credential:", error);
    throw error;
  }
};

export const getDecryptedField = async (
  walletAddress: string,
  credentialId: string,
  fieldName: "password" | "seedPhrase" | "privateKey"
): Promise<string> => {
  try {
    const response = await axios.post<DecryptedFieldResponse>(
      `${API_URL}/credentials/decrypt/${walletAddress}/${credentialId}`,
      { fieldName }
    );
    return response.data[fieldName];
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du champ ${fieldName}:`,
      error
    );
    throw error;
  }
};

export const deleteCredential = async (
  walletAddress: string,
  credentialId: string
): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/credentials/delete/${walletAddress}/${credentialId}`
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du credential:", error);
    throw error;
  }
};
