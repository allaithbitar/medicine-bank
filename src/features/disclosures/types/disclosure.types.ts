import type { TActioner, TCreatedBy, TPaginationDto, TUpdatedBy } from '@/core/types/common.types';
import type { TAppointment } from '@/features/appointments/types/appointment.type';
import type { TBenefieciary } from '@/features/beneficiaries/types/beneficiary.types';
import type { TPriorityDegree } from '@/features/priority-degres/types/priority-degree.types';
import type { TRating } from '@/features/ratings/types/rating.types';
import type { THouseHoldAssetCondition, THouseOwnership } from '@/libs/kysely/schema';

export const DisclosureType = {
  new: 'new',
  help: 'help',
  return: 'return',
} as const;

export const DisclosureStatus = {
  active: 'active',
  suspended: 'suspended',
  archived: 'archived',
} as const;

export const DisclosureVisitResult = {
  not_completed: 'not_completed',
  cant_be_completed: 'cant_be_completed',
  completed: 'completed',
} as const;

export type TDisclosureStatus = keyof typeof DisclosureStatus;

export type TDisclosureType = keyof typeof DisclosureType;

export type TDisclosureVisitResult = keyof typeof DisclosureVisitResult | null;

export type TDisclosureScout =
  | {
      scoutId: string;
      scout: TActioner;
    }
  | {
      scoutId: null;
      scout: null;
    };

export type TDisclosureDetails = {
  disclosureId: string;
  diseasesOrSurgeries: string | null;
  jobOrSchool: string | null;
  electricity: string | null;
  expenses: string | null;
  houseOwnership: THouseOwnership | null;
  houseOwnershipNote: string | null;
  houseCondition: THouseHoldAssetCondition | null;
  houseConditionNote: string | null;
  pros: string | null;
  cons: string | null;
  other: string | null;
  createdAt: string;
  createdBy: TActioner | null;
  updatedAt: string | null;
  updatedBy: TActioner | null;
};

export type TAddDisclosureDetailsDto = {
  disclosureId: string;
  diseasesOrSurgeries?: string | null;
  jobOrSchool?: string | null;
  electricity?: string | null;
  expenses?: string | null;
  houseOwnership?: THouseOwnership | null;
  houseOwnershipNote?: string | null;
  houseCondition?: THouseHoldAssetCondition | null;
  houseConditionNote?: string | null;
  pros?: string | null;
  cons?: string | null;
  other?: string | null;
};

export type TUpdateDisclosureDetailsDto = TAddDisclosureDetailsDto;

export type TDisclosure = {
  id: string;
  status: TDisclosureStatus;
  initialNote: string | null;
  priorityId: string;
  patientId: string;
  createdAt: string;
  updatedAt: string | null;
  patient: TBenefieciary;
  priority: TPriorityDegree;
  isReceived: boolean;
} & TDisclosureScout &
  TCreatedBy &
  TUpdatedBy &
  TVisit &
  TAppointment &
  TDisclosureRating;

export type TGetDisclosuresDto = Partial<
  TPaginationDto & {
    isReceived: boolean;
    archiveNumber: number;
    visitResult: TDisclosureVisitResult[];
    isCustomRating: boolean;
    appointmentDate: string;
    isAppointmentCompleted: boolean;
    scoutIds: string[];
    patientId: string;
    priorityIds: string[];
    ratingIds: string[];
    createdAtStart: string;
    createdAtEnd: string;
    status: TDisclosureStatus[];
    type: TDisclosureType[];
    undelivered: boolean;
    unvisited: boolean;
    areaIds: string[];
    isLate: boolean;
  }
>;

export type TAddDisclosureDto = {
  status?: TDisclosureStatus;
  scoutId?: string | null;
  patientId: string;
  priorityId: string;
  details?: object | null;
  initialNote?: string | null;
};

export type TUpdateDisclosureDto = Partial<Omit<TDisclosure, 'scout'>> & {
  id: string;
};

export type TDisclosureRating = {
  ratingNote: string | null;
} & (
  | {
      ratingId: string;
      rating: TRating;
      isCustomRating: false;
      customRating: null;
      ratingNote?: string | null;
    }
  | {
      ratingId: null;
      rating: null;
      isCustomRating: true;
      customRating: string;
      ratingNote?: string | null;
    }
);

export type TUpdateDisclosureVisitAndRatingDto = Pick<
  TUpdateDisclosureDto,
  'ratingNote' | 'ratingId' | 'customRating' | 'isCustomRating' | 'visitNote' | 'visitResult' | 'visitReason' | 'id'
>;

// export type TAddDisclosureRatingDto = Pick<
//   TDisclosureRating,
//   "disclosureId"
// > & {
//   isCustom: boolean;
//   note: string | null;
//   ratingId: string | null;
//   customRating: string | null;
// };

// export type TUpdateDisclosureRatingDto = TAddDisclosureRatingDto &
//   Pick<TDisclosureRating, "id">;
export type TVisit = {
  visitNote: string | null;
  visitReason: string | null;
  visitResult: TDisclosureVisitResult;
};
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
  result?: TDisclosureVisit['result'];
};

export type TAddDisclosureVisitDto = Pick<TDisclosureVisit, 'disclosureId' | 'result' | 'reason' | 'note'>;

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
  consultationStatus: 'pending' | 'completed';
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
  consultationStatus?: 'pending' | 'completed';
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

export type TAppointmentsResponse = Record<string, { id: string; isAppointmentCompleted: boolean }[]>;
