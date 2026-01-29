import type { TAutocompleteItem } from '@/core/types/common.types';
import type { TGender, TGetBeneficiariesDto } from '../types/beneficiary.types';

export type TBeneficiaryFiltersForm = {
  areas: TAutocompleteItem[];
  name: string;
  nationalNumber: string;
  gender: { id: TGender; label: string } | null;
  phone: string;
  job: string;
  address: string;
  about: string;
  birthDate: string;
};

export const defaultBeneficiaryFilterValues: TBeneficiaryFiltersForm = {
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

export const normalizeStateValuesToDto = (values: TBeneficiaryFiltersForm) => {
  const result: Omit<TGetBeneficiariesDto, 'pageSize' | 'pageNumber'> = {
    areaIds: values.areas.map((a) => a.id),
    about: values.about,
    address: values.address,
    birthDate: values.birthDate.split('T')[0] ?? '',
    job: values.job,
    name: values.name,
    nationalNumber: values.nationalNumber,
    phone: values.phone,
    ...(values.gender && { gender: values.gender.id }),
  };

  return result;
};
