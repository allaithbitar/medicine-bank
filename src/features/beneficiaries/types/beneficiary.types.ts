import type { TFormValue, TMedicine } from '@/features/banks/types/medicines.types';
import { type TPaginationDto } from '../../../core/types/common.types';

export type TAddBeneficiaryDto = {
  name: string;
  phoneNumbers: string[];
} & Partial<{
  nationalNumber: string | null;
  areaId: string | null;
  address: string | null;
  about: string | null;
  birthDate: string | null;
  job: string | null;
  gender: string | null;
}>;

export type TUpdateBeneficiaryDto = TAddBeneficiaryDto & { id: string };

export type TGetBeneficiariesDto = TPaginationDto &
  Partial<
    Omit<TAddBeneficiaryDto, 'areaId' | 'phoneNumbers'> & {
      phone: string;
      areaIds: string[];
    }
  >;

type TArea = {
  id: string;
  name: string;
  cityId: string;
};

export type TBeneficiaryPhone = {
  id: string;
  patientId: string;
  phone: string;
};

export type TBeneficiaryArea =
  | {
      areaId: string;
      area: TArea;
    }
  | { areaId: null; area: null };

export type TBenefieciary = {
  id: string;
  name: string;
  nationalNumber: string;
  address: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  phones: TBeneficiaryPhone[];
  birthDate: string;
  job: string;
  gender: 'male' | 'female' | null;
} & TBeneficiaryArea;

export type TBeneficiaryMedicine = {
  id: string;
  patientId: string;
  medicineId: string;
  medicine: TMedicine;
  dosePerIntake: number;
  intakeFrequency: string;
  note?: string | null;
};

export type TGetBeneficiaryMedicinesParams = {
  patientId?: string;
  form?: TFormValue;
  name?: string;
};

export type TAddBeneficiaryMedicinePayload = {
  patientId: string;
  medicineId: string;
  dosePerIntake: number;
  intakeFrequency: string;
  note?: string | null;
};

export type TUpdateBeneficiaryMedicinePayload = {
  id: string;
} & TAddBeneficiaryMedicinePayload;

export const Genders = { male: 'male', female: 'female' } as const;

export type TGender = keyof typeof Genders;

export const ALLOWED_KINSHIP = ['partner', 'child', 'parent', 'brother', 'grandparent', 'grandchild'] as const;
export type TKinship = (typeof ALLOWED_KINSHIP)[number];

export type TFamilyMember = {
  id: string;
  name: string;
  birthDate: string;
  gender: TGender;
  kinshep: TKinship;
  jobOrSchool?: string | null;
  note?: string | null;
  patientId: string;
};

export type TGetFamilyMembersParams = {
  patientId?: string;
  name?: string | null;
};

export type TAddFamilyMemberPayload = Omit<TFamilyMember, 'id'>;

export type TUpdateFamilyMemberPayload = TFamilyMember;

export type TValidateNationalNumberPayload = {
  nationalNumber: string;
};

export type TValidatePhoneNumbersPayload = {
  phoneNumbers: string[];
};
