import axios from "axios";
import type { Will } from "../features/wills/types";
import type { BeneficiaryAllocation } from "../features/wills-form/types";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const createWill = async (
  walletAddress: string,
  will: {
    title: string;
    beneficiaryAllocations: BeneficiaryAllocation[];
    note?: string;
    transactionMode: string;
  }
) => {
  try {
    console.log("Création du testament:", will);
    const response = await axios.post(
      `${API_URL}/wills/create/${walletAddress}`,
      will,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du testament:", error);
    throw error;
  }
};

export const getWills = async (walletAddress: string): Promise<Will[]> => {
  try {
    const response = await axios.get(`${API_URL}/wills/${walletAddress}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des testaments:", error);
    throw error;
  }
};

export const getWill = async (
  willId: string,
  walletAddress: string
): Promise<Will> => {
  try {
    const response = await axios.get(
      `${API_URL}/wills/${walletAddress}/${willId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du testament ${willId}:`,
      error
    );
    throw error;
  }
};

export const updateWill = async (
  willId: string,
  walletAddress: string,
  will: {
    title?: string;
    beneficiaryAllocations?: BeneficiaryAllocation[];
    note?: string;
    transactionMode?: string;
  }
) => {
  try {
    const response = await axios.put(
      `${API_URL}/wills/${walletAddress}/${willId}`,
      will,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du testament ${willId}:`,
      error
    );
    throw error;
  }
};

export const deleteWill = async (willId: string, walletAddress: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/wills/${walletAddress}/${willId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du testament ${willId}:`,
      error
    );
    throw error;
  }
};
