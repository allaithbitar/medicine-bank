import type {
  TFormValue,
  TMedicine,
} from "@/features/banks/types/medicines.types";

export type TAddBeneficiaryDto = {
  name: string;
  nationalNumber: string;
  areaId?: string | null | undefined;
  address?: string;
  about?: string;
  phoneNumbers: string[];
};

export type TUpdateBeneficiaryDto = TAddBeneficiaryDto & { id: string };

export type TGetBeneficiariesDto = {
  query?: string | undefined;
  pageSize?: number | undefined;
  pageNumber?: number | undefined;
  areaIds?: string[];
};

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
