import type { TPaginationDto } from "@/core/types/common.types";
import type { TBenefieciary } from "@/features/beneficiaries/types/beneficiary.types";

export const DisclosureStatus = {
  active: "active",
  canceled: "canceled",
  finished: "finished",
} as const;

export interface Prioriy {
  id: string;
  name: string;
  color: string;
}

export type TDisclosureStatus = keyof typeof DisclosureStatus;

export type TDisclosureEmployee =
  | {
      employeeId: string;
      employee: {
        id: string;
        name: string;
      };
    }
  | {
      employeeId: null;
      employee: null;
    };

export type TDisclosureArea =
  | {
      areaId: string;
      area: {
        id: string;
        name: string;
      };
    }
  | {
      areaId: null;
      area: null;
    };

export type TDisclosure = {
  id: string;
  status: TDisclosureStatus;
  priortyId: string;
  patientId: string;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string | null;
  patient: TBenefieciary;
  prioriy: Prioriy;
} & TDisclosureEmployee &
  TDisclosureArea;

export type TSearchDislosureDto = Partial<
  TPaginationDto & {
    patientId?: string;
    status?: TDisclosureStatus[];
    employeeIds?: string[];
    ratingIds?: string[];
    createdAtStart?: string;
    createdAtEnd?: string;
  }
>;

export type TAddDisclosureDto = {
  status?: TDisclosureStatus;
  employeeId?: string | null;
  patientId: string;
  priortyId: string;
};

export type TUpdateDisclosureDto = TAddDisclosureDto & { id: string };

export type TDisclosureRating = {
  id: string;
  disclosureId: string;
  isCustom: boolean;
  customRating: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
} & (
  | {
      ratingId: string;
      rating: {
        id: string;
        name: string;
        description: string;
        code: string;
      };
    }
  | { ratingId: null; rating: null }
);

export type TDisclosureVisit = {
  id: string;
  disclosureId: string;
  result: "not_completed" | "cant_be_completed" | "completed";
  reason: string;
  note: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
};

export type TGetDisclosureRatingsDto = TPaginationDto & {
  isCustom?: boolean;
  disclosureId: string;
};

export type TGetDisclosureVisitsDto = TPaginationDto & {
  disclosureId: string;
  result?: TDisclosureVisit["result"];
};
