import type {
  TActioner,
  TCreatedBy,
  TPaginationDto,
  TUpdatedBy,
} from "@/core/types/common.types";
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

export type TDisclosureScout =
  | {
      scoutId: string;
      scout: TActioner;
    }
  | {
      scoutId: null;
      scout: null;
    };

export type TDisclosure = {
  id: string;
  status: TDisclosureStatus;
  priorityId: string;
  patientId: string;
  createdAt: string;
  updatedAt: string | null;
  patient: TBenefieciary;
  priority: TPriorityDegree;
  note: string | null;
} & TDisclosureScout &
  TCreatedBy &
  TUpdatedBy;

export type TGetDisclosuresDto = Partial<
  TPaginationDto & {
    patientId?: string;
    status?: TDisclosureStatus[];
    scoutIds?: string[];
    ratingIds?: string[];
    priorityIds?: string[];
    createdAtStart?: string;
    createdAtEnd?: string;
    undelivered?: boolean;
  }
>;

export type TAddDisclosureDto = {
  status?: TDisclosureStatus;
  scoutId?: string | null;
  patientId: string;
  priorityId: string;
};

export type TUpdateDisclosureDto = TAddDisclosureDto & { id: string };

export type TDisclosureRating = {
  id: string;
  disclosureId: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
} & TCreatedBy &
  TUpdatedBy &
  (
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
} & TCreatedBy &
  TUpdatedBy;

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

export type TDisclosureNote = {
  id: string;
  disclosureId: string;
  noteText: string;
  noteAudio: string;
  type: string;
} & TCreatedBy;

export type TGetDisclosureNotesParams = {
  disclosureId: string;
};

export type TAddDisclosureNotePayload = FormData;

export type TUpdateDisclosureNotePayload = FormData;

export type TDisclosureAdviserConsultation = {
  id: string;
  consultationStatus: "pending" | "completed";
  disclosureRatingId: string;
  disclosureId: string;
  disclosureRating: TDisclosureRating;
  consultedBy: null;
  consultationNote: string;
  consultationAudio: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: TUpdatedBy;
  disclosure: TDisclosure;
} & TCreatedBy;

export type TAddDisclosureAdviserConsultationPayload = FormData;

export type TGetDisclosureAdviserConsultationParams = {
  disclosureId?: string;
  createdBy?: string;
};

export type TAuditLogItem = {
  id: string;
  table: string | null;
  column: string | null;
  action_type: string;
  old_value: any;
  new_value: any;
  record_id: string | null;
  created_at: string;
  created_by?: string | null;
};

export type TAuditGroup = {
  createdAt: string;
  logs: TAuditLogItem[];
};

export type TAuditDetailsRow = {
  id: string;
  table: string | null;
  column: string | null;
  action: string;
  oldValue: any;
  newValue: any;
  recordId: string | null;
  createdAt: string;
  createdBy?: string | null;
  newRecordValue?: any | null;
  oldRecordValue?: any | null;
};

export type TGetDisclosureAppointmentsDto = {
  fromDate: string;
  toDate: string;
  uncompletedOnly?: boolean;
  employeeId?: string;
};

export type TGetDateAppointmentsDto = TPaginationDto & {
  date: string;
  uncompletedOnly?: boolean;
  employeeId?: string;
};

export type TAppointmentsResponse = Record<
  string,
  { id: string; isAppointmentCompleted: boolean }[]
>;
