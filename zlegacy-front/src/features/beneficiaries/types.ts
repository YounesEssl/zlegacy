export type BeneficiaryRelation = 'family' | 'friend' | 'business' | 'child' | 'spouse' | 'other';

export interface Beneficiary {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  allocation?: number;
  wills?: number;
  relation?: BeneficiaryRelation;
  relationColor?: string;
}

export interface NewBeneficiaryFormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  notes: string;
  isAddressValid: boolean;
}
