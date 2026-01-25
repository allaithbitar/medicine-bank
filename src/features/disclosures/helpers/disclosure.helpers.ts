import type { TDisclosureFiltersForm } from '../components/disclosure-filters.component';
import type { TGetDisclosuresDto } from '../types/disclosure.types';

export const defaultDisclosureFilterValues = {
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

  return result;
};
