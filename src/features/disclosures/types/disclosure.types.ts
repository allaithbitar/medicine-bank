import type { TPaginationDto } from "@/core/types/common.types";
import type { TBenefieciary } from "@/features/beneficiaries/types/beneficiary.types";
import type { TPriorityDegree } from "@/features/priority-degres/types/priority-degree.types";
import type { TRating } from "@/features/ratings/types/rating.types";

export const DisclosureStatus = {
  active: "active",
  canceled: "canceled",
  finished: "finished",
} as const;

export const DisclosureVisitResult = {
  not_completed: "not_completed",
  cant_be_completed: "cant_be_completed",
  completed: "completed",
} as const;

export type TDisclosureStatus = keyof typeof DisclosureStatus;

export type TDisclosureVisitResult = keyof typeof DisclosureVisitResult;

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
  priorityId: string;
  patientId: string;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string | null;
  patient: TBenefieciary;
  priority: TPriorityDegree;
} & TDisclosureEmployee &
  TDisclosureArea;

export type TGetDisclosuresDto = Partial<
  TPaginationDto & {
    patientId?: string;
    status?: TDisclosureStatus[];
    employeeIds?: string[];
    ratingIds?: string[];
    priorityIds?: string[];
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
  note: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
} & (
  | {
      ratingId: string;
      rating: TRating;
      isCustom: false;
      customRating: null;
    }
  | {
      ratingId: null;
      rating: null;
      isCustom: true;
      customRating: string;
    }
);

export type TAddDisclosureRatingDto = Pick<
  TDisclosureRating,
  "disclosureId"
> & {
  isCustom: boolean;
  note: string | null;
  ratingId: string | null;
  customRating: string | null;
};

export type TUpdateDisclosureRatingDto = TAddDisclosureRatingDto &
  Pick<TDisclosureRating, "id">;

export type TDisclosureVisit = {
  id: string;
  disclosureId: string;
  result: TDisclosureVisitResult;
  reason: string | null;
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

export type TAddDisclosureVisitDto = Pick<
  TDisclosureVisit,
  "disclosureId" | "result" | "reason" | "note"
>;

export type TUpdateDisclosureVisitDto = TAddDisclosureVisitDto & { id: string };
