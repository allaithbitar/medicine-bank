import type { TAutocompleteItem } from '@/core/types/common.types';
import type {
  TDisclosure,
  TDisclosureStatus,
  TDisclosureType,
  TDisclosureVisitResult,
  TGetDisclosuresDto,
} from '../types/disclosure.types';
import type { TRating } from '@/features/ratings/types/rating.types';
import type { TPriorityDegree } from '@/features/priority-degres/types/priority-degree.types';
import { differenceInDays } from 'date-fns';

export type TDisclosureFiltersForm = {
  type: { id: TDisclosureType; label: string }[];
  status: { id: TDisclosureStatus; label: string }[];
  scouts: TAutocompleteItem[];
  priorityDegrees: TPriorityDegree[];
  ratings: TRating[];
  visitResult: { id: NonNullable<TDisclosureVisitResult>; label: string }[];
  isCustomRating: boolean;
  beneficiary: TAutocompleteItem | null;
  appointmentDate: string;
  isAppointmentCompleted: string;
  isReceived: string;
  undelivered: boolean;
  unvisited: boolean;
  areaIds: TAutocompleteItem[];
  isLate: boolean;
} & Pick<TGetDisclosuresDto, 'createdAtStart' | 'createdAtEnd'>;

export const defaultDisclosureFilterValues: TDisclosureFiltersForm = {
  status: [],
  type: [],
  createdAtStart: '',
  createdAtEnd: '',
  scouts: [],
  priorityDegrees: [],
  ratings: [],
  visitResult: [],
  beneficiary: null,
  isCustomRating: false,
  isAppointmentCompleted: '',
  isReceived: '',
  appointmentDate: '',
  undelivered: false,
  unvisited: false,
  areaIds: [],
  isLate: false,
};

export const parseStringBooleanValue = (value: 'true' | 'false' | string) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

export const noramlizeStateValuesToDto = (values: TDisclosureFiltersForm) => {
  const result: Omit<TGetDisclosuresDto, 'pageSize' | 'pageNumber'> = {
    scoutIds: values.scouts.map((e) => e.id),
    priorityIds: values.priorityDegrees.map((pd) => pd.id),
    ratingIds: values.ratings.map((r) => r.id),
    status: values.status.map((s) => s.id),
    type: values.type.map((s) => s.id),
    visitResult: values.visitResult.map((s) => s.id),
    areaIds: values.areaIds.map((a) => a.id),
  };
  if (values.beneficiary) {
    result.patientId = values.beneficiary.id;
  }

  if (values.createdAtStart) {
    result.createdAtStart = values.createdAtStart;
  }

  if (values.createdAtEnd) {
    result.createdAtEnd = values.createdAtEnd;
  }
  result.undelivered = values.undelivered;

  if (result.appointmentDate) result.appointmentDate = values.appointmentDate;

  if (parseStringBooleanValue(values.isAppointmentCompleted) !== null)
    result.isAppointmentCompleted = parseStringBooleanValue(values.isAppointmentCompleted) as boolean;

  if (parseStringBooleanValue(values.isReceived) !== null)
    result.isReceived = parseStringBooleanValue(values.isReceived) as boolean;

  if (values.isCustomRating) result.isCustomRating = values.isCustomRating;

  if (values.unvisited) result.unvisited = values.unvisited;
  if (values.isLate) result.isLate = values.isLate;

  return result;
};

export const getDisclosureLateDaysCount = (disclosure: TDisclosure) => {
  if (!disclosure.priority.durationInDays || !!disclosure.visitResult) return { isLate: false, lateDaysCount: 0 };
  const currentDate = new Date();
  const diff = differenceInDays(currentDate, disclosure.createdAt);
  const lateDaysCount = disclosure.priority.durationInDays - diff;
  return { isLate: lateDaysCount < 0, lateDaysCount: Math.abs(lateDaysCount) };
};
