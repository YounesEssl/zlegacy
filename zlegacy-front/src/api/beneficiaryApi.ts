import axios from "axios";
import type {
  Beneficiary,
  NewBeneficiaryFormData,
} from "../features/beneficiaries/types";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export interface BeneficiaryResponse {
  message: string;
  beneficiary: Beneficiary;
}

export interface BeneficiariesListResponse {
  beneficiaries: Beneficiary[];
}

export const getBeneficiaries = async (
  walletAddress: string
): Promise<Beneficiary[]> => {
  try {
    const response = await axios.get<BeneficiariesListResponse>(
      `${API_URL}/beneficiaries/list/${walletAddress}`
    );
    return response.data.beneficiaries;
  } catch (error) {
    console.error("Erreur lors de la récupération des bénéficiaires:", error);
    throw error;
  }
};

export const getBeneficiaryById = async (
  walletAddress: string,
  beneficiaryId: string
): Promise<Beneficiary> => {
  try {
    const response = await axios.get<{ beneficiary: Beneficiary }>(
      `${API_URL}/beneficiaries/detail/${walletAddress}/${beneficiaryId}`
    );
    return response.data.beneficiary;
  } catch (error) {
    console.error("Erreur lors de la récupération du bénéficiaire:", error);
    throw error;
  }
};

export const createBeneficiary = async (
  walletAddress: string,
  beneficiaryData: NewBeneficiaryFormData
): Promise<Beneficiary> => {
  try {
    const response = await axios.post<BeneficiaryResponse>(
      `${API_URL}/beneficiaries/create/${walletAddress}`,
      {
        name: beneficiaryData.name,
        address: beneficiaryData.address,
        email: beneficiaryData.email,
        phone: beneficiaryData.phone,
        notes: beneficiaryData.notes,
      }
    );
    return response.data.beneficiary;
  } catch (error) {
    console.error("Erreur lors de la création du bénéficiaire:", error);
    throw error;
  }
};

export const updateBeneficiary = async (
  walletAddress: string,
  beneficiaryId: string,
  beneficiaryData: Partial<Beneficiary>
): Promise<Beneficiary> => {
  try {
    const response = await axios.put<BeneficiaryResponse>(
      `${API_URL}/beneficiaries/update/${walletAddress}/${beneficiaryId}`,
      beneficiaryData
    );
    return response.data.beneficiary;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du bénéficiaire:", error);
    throw error;
  }
};

export const deleteBeneficiary = async (
  walletAddress: string,
  beneficiaryId: string
): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/beneficiaries/delete/${walletAddress}/${beneficiaryId}`
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du bénéficiaire:", error);
    throw error;
  }
};
