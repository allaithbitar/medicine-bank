export type TAddBeneficiaryDto = {
  name: string;
  nationalNumber: string;
  areaId?: string | null | undefined;
  address?: string;
  about?: string;
  phoneNumbers: string[];
};

export type TUpdateBeneficiaryDto = TAddBeneficiaryDto & { id: string };

export type TSearchBeneficiariesDto = {
  query?: string | undefined;
  pageSize?: number | undefined;
  pageNumber?: number | undefined;
  areaId?: string | null | undefined;
};

type TArea = {
  id: string;
  name: string;
  cityId: string;
};

export interface TBeneficiaryPhone {
  id: string;
  patientId: string;
  phone: string;
}

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
