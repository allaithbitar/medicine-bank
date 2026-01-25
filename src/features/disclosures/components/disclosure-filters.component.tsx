import { Stack } from '@mui/material';

import { useCallback, useImperativeHandle, useState, type Ref } from 'react';
import type {
  TDisclosureStatus,
  TDisclosureType,
  TDisclosureVisitResult,
  TGetDisclosuresDto,
} from '../types/disclosure.types';
import DisclosureStatusAutocomplete from './disclosure-status-autocomplete';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import STRINGS from '@/core/constants/strings.constant';
import FieldSet from '@/core/components/common/fieldset/fieldset.component';
import EmployeesAutocomplete from '@/features/employees/components/employees-autocomplete.component';
import PriorityDegreesAutocomplete from '@/features/priority-degres/components/priority-degees-autocomplete.component';
import type { TPriorityDegree } from '@/features/priority-degres/types/priority-degree.types';
import type { TRating } from '@/features/ratings/types/rating.types';
import RatingsAutocomplete from '@/features/ratings/components/ratings-autocomplete.component';
import BeneficiariesAutocomplete from '@/features/beneficiaries/components/beneficiaries-autocomplete.component';
import FormCheckbxInput from '@/core/components/common/inputs/form-checkbox-input.component';
import DisclosureTypeAutocomplete from './disclosure-type-autocomplete.component';
import FormSelectInput from '@/core/components/common/inputs/form-select-input.component';
import type { TAutocompleteItem } from '@/core/types/common.types';
import DisclosureVisitResultAutocomplete from './disclosure-visit-result-autocomplete.component';
import { defaultDisclosureFilterValues } from '../helpers/disclosure.helpers';

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
} & Pick<TGetDisclosuresDto, 'createdAtStart' | 'createdAtEnd'>;

export type TDisclosureFiltesHandlers = {
  getValues: () => TDisclosureFiltersForm;
  reset: () => void;
};

type TProps = {
  ref: Ref<TDisclosureFiltesHandlers>;
  value: TDisclosureFiltersForm;
};

const DisclosureFilters = ({ ref, value }: TProps) => {
  const [filters, setFilters] = useState<TDisclosureFiltersForm>(value || defaultDisclosureFilterValues);

  const handleSubmit = useCallback(() => {
    return filters;
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters(defaultDisclosureFilterValues);
  }, [setFilters]);

  useImperativeHandle(
    ref,
    () => ({
      getValues() {
        return handleSubmit();
      },
      reset() {
        return handleReset();
      },
    }),
    [handleSubmit, handleReset]
  );

  return (
    <Stack gap={2}>
      <DisclosureTypeAutocomplete
        multiple
        value={filters.type}
        onChange={(type) => setFilters((prev) => ({ ...prev, type }))}
      />

      <DisclosureStatusAutocomplete
        multiple
        value={filters.status}
        onChange={(status) => setFilters((prev) => ({ ...prev, status }))}
      />

      <BeneficiariesAutocomplete
        multiple={false}
        value={filters.beneficiary}
        onChange={(beneficiary) => setFilters((prev) => ({ ...prev, beneficiary }))}
      />
      <FormCheckbxInput
        label={STRINGS.undelivered}
        value={filters.undelivered}
        onChange={(undelivered) => setFilters((prev) => ({ ...prev, undelivered }))}
      />

      <EmployeesAutocomplete
        disabled={filters.undelivered}
        roles={['scout']}
        label={STRINGS.the_scout}
        multiple
        value={filters.scouts}
        onChange={(employees) => setFilters((prev) => ({ ...prev, scouts: employees }))}
      />

      <PriorityDegreesAutocomplete
        multiple
        value={filters.priorityDegrees}
        onChange={(priorityDegrees) => setFilters((prev) => ({ ...prev, priorityDegrees }))}
      />
      <FormCheckbxInput
        label={STRINGS.hasnt_been_visited_yet}
        value={filters.unvisited}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            unvisited: value,
            ...(value && { visitResult: [], ratings: [] }),
          }));
        }}
      />

      <DisclosureVisitResultAutocomplete
        multiple
        disabled={filters.unvisited}
        value={filters.visitResult}
        onChange={(visitResult) => setFilters((prev) => ({ ...prev, visitResult }))}
      />
      <FormCheckbxInput
        label={STRINGS.custom_rating}
        value={filters.isCustomRating}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            isCustomRating: value,
            ...(value && { ratings: [] }),
          }));
        }}
      />
      <RatingsAutocomplete
        disabled={filters.isCustomRating}
        multiple
        value={filters.ratings}
        onChange={(ratings) => setFilters((prev) => ({ ...prev, ratings }))}
      />

      <FieldSet label={STRINGS.created_at}>
        <Stack gap={1}>
          <FormDateInput
            label={STRINGS.from_date}
            value={filters.createdAtStart}
            onChange={(createdAtStart) => setFilters((prev) => ({ ...prev, createdAtStart }))}
          />
          <FormDateInput
            label={STRINGS.to_date}
            value={filters.createdAtEnd}
            onChange={(createdAtEnd) => setFilters((prev) => ({ ...prev, createdAtEnd }))}
          />
        </Stack>
      </FieldSet>

      <FormDateInput
        label={STRINGS.appointment_date}
        value={filters.appointmentDate}
        onChange={(appointmentDate) => setFilters((prev) => ({ ...prev, appointmentDate }))}
      />

      <FormSelectInput
        label={STRINGS.disclosure_appointment_status}
        value={filters.isAppointmentCompleted}
        getOptionLabel={(option) => option.label}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            isAppointmentCompleted: value,
          }));
        }}
        options={[
          { id: 'true', label: STRINGS.appointment_completed },
          { id: 'false', label: STRINGS.appointment_not_completed },
        ]}
      />

      {/* <FormCheckbxInput */}
      {/*   label="is_received" */}
      {/*   value={filters.isReceived} */}
      {/*   onChange={(value) => { */}
      {/*     setFilters((prev) => ({ */}
      {/*       ...prev, */}
      {/*       isReceived: value, */}
      {/*     })); */}
      {/*   }} */}
      {/* /> */}

      <FormSelectInput
        label={STRINGS.disclosure_is_received_status}
        value={filters.isReceived}
        getOptionLabel={(option) => option.label}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            isReceived: value,
          }));
        }}
        options={[
          { id: 'true', label: STRINGS.is_received },
          { id: 'false', label: STRINGS.hasnt_been_received_yet },
        ]}
      />
    </Stack>
  );
};

export default DisclosureFilters;
