import { Stack } from '@mui/material';
import { useCallback, useImperativeHandle, useState, type Ref } from 'react';
import STRINGS from '@/core/constants/strings.constant';
import type { TGender, TGetBeneficiariesDto } from '@/features/beneficiaries/types/beneficiary.types';
import AreasAutocomplete from '@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import BeneficiaryGenderAutocomplete from './beneficiary-gender-autocomplete.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import { addTimeZoneOffestToIsoDate } from '@/core/helpers/helpers';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import type { TAutocompleteItem } from '@/core/types/common.types';

export type TBeneficiariesFiltersHandlers = {
  getValues: () => Omit<TGetBeneficiariesDto, 'pageSize' | 'pageNumber'>;
  reset: () => Omit<TGetBeneficiariesDto, 'pageSize' | 'pageNumber'>;
};

type TProps = {
  ref: Ref<TBeneficiariesFiltersHandlers>;
};

const defaultState = {
  areas: [],
  name: '',
  about: '',
  address: '',
  birthDate: '',
  gender: null,
  job: '',
  phone: '',
  nationalNumber: '',
};

const BeneficiariesFilters = ({ ref }: TProps) => {
  const [filters, setFilters] = useState<{
    areas: TAutocompleteItem[];
    name: string;
    nationalNumber: string;
    gender: { id: TGender; label: string } | null;
    phone: string;
    job: string;
    address: string;
    about: string;
    birthDate: string;
  }>(defaultState);

  const handleSubmit = useCallback(() => {
    const result: Omit<TGetBeneficiariesDto, 'pageSize' | 'pageNumber'> = {
      areaIds: filters.areas.map((a) => a.id),
      about: filters.about,
      address: filters.address,
      birthDate: filters.birthDate.split('T')[0] ?? '',
      job: filters.job,
      name: filters.name,
      nationalNumber: filters.nationalNumber,
      phone: filters.phone,
      ...(filters.gender && { gender: filters.gender.id }),
    };

    return result;
  }, [filters]);

  const handleReset = useCallback(() => {
    return defaultState;
  }, []);

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
    [handleReset, handleSubmit]
  );

  return (
    <Stack gap={2}>
      <FormTextFieldInput
        label={STRINGS.name}
        value={filters.name}
        onChange={(name) => setFilters((prev) => ({ ...prev, name }))}
      />
      <FormTextFieldInput
        label={STRINGS.national_number}
        value={filters.nationalNumber}
        onChange={(nationalNumber) => setFilters((prev) => ({ ...prev, nationalNumber }))}
      />

      <FormTextFieldInput
        label={STRINGS.phone_number}
        value={filters.phone}
        onChange={(phone) => setFilters((prev) => ({ ...prev, phone }))}
      />

      <BeneficiaryGenderAutocomplete
        multiple={false}
        value={filters.gender}
        onChange={(gender) => setFilters((prev) => ({ ...prev, gender }))}
      />

      <AreasAutocomplete
        multiple
        value={filters.areas}
        onChange={(areas) => setFilters((prev) => ({ ...prev, areas }))}
      />

      <FormDateInput
        label={STRINGS.birth_date}
        value={filters.birthDate}
        onChange={(birthDate) =>
          setFilters((prev) => ({
            ...prev,
            birthDate: birthDate ? addTimeZoneOffestToIsoDate(birthDate).toISOString() : '',
          }))
        }
      />

      <FormTextFieldInput
        label={STRINGS.job_or_school}
        value={filters.job}
        onChange={(job) => setFilters((prev) => ({ ...prev, job }))}
      />
      <FormTextFieldInput
        label={STRINGS.patient_address}
        value={filters.address}
        onChange={(address) => setFilters((prev) => ({ ...prev, address }))}
      />

      <FormTextAreaInput
        label={STRINGS.patient_about}
        value={filters.about}
        onChange={(about) => setFilters((prev) => ({ ...prev, about }))}
      />

      {/*  <FieldSet label={STRINGS.created_at}>
        <Stack gap={1}>
          <FormDateInput
            label={STRINGS.from_date}
            value={filters.createdAtStart}
            onChange={(createdAtStart) =>
              setFilters((prev) => ({ ...prev, createdAtStart }))
            }
          />
          <FormDateInput
            label={STRINGS.to_date}
            value={filters.createdAtEnd}
            onChange={(createdAtEnd) =>
              setFilters((prev) => ({ ...prev, createdAtEnd }))
            }
          />
        </Stack>
      </FieldSet> */}
    </Stack>
  );
};

export default BeneficiariesFilters;
