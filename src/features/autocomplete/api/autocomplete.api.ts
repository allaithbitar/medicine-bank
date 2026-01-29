import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TAutocompleteItem, TPaginatedResponse, TPaginationDto } from '@/core/types/common.types';
import type { TMedicine } from '@/features/banks/types/medicines.types';
import type { TMedicinesAutocompleteItem } from '../types/autcomplete.types';

export type TAutocompleteDto<T extends object = object> = {
  query?: string;
  columns?: Record<keyof T, boolean>;
} & TPaginationDto;

const autocompleteApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    patientsAutocomplete: builder.query<TPaginatedResponse<TAutocompleteItem>, TAutocompleteDto>({
      query: (data) => ({
        url: 'autocomplete/patients',
        body: data,
        method: 'POST',
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>) => res.data,
      providesTags: ['Beneficiaries_Autocomplete'],
    }),
    employeesAutocomplete: builder.query<TPaginatedResponse<TAutocompleteItem>, TAutocompleteDto & { role?: string[] }>(
      {
        query: (data) => ({
          url: 'autocomplete/employees',
          body: data,
          method: 'POST',
        }),
        transformResponse: (res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>) => res.data,
        providesTags: ['Employees_Autocomplete'],
      }
    ),
    citiesAutocomplete: builder.query<TPaginatedResponse<TAutocompleteItem>, TAutocompleteDto>({
      query: (data) => ({
        url: 'autocomplete/cities',
        body: data,
        method: 'POST',
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>) => res.data,
      providesTags: ['Cities_Autocomplete'],
    }),
    areasAutocomplete: builder.query<TPaginatedResponse<TAutocompleteItem>, TAutocompleteDto & { cityId?: string }>({
      query: (data) => ({
        url: 'autocomplete/areas',
        body: data,
        method: 'POST',
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TAutocompleteItem>>) => res.data,
      providesTags: ['Areas_Autocomplete'],
    }),
    medicinesAutocomplete: builder.query<TPaginatedResponse<TMedicinesAutocompleteItem>, TAutocompleteDto<TMedicine>>({
      query: (data) => ({
        url: 'autocomplete/medicines',
        body: { ...data, columns: { doseVariants: true } },
        method: 'POST',
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TMedicinesAutocompleteItem>>) => res.data,
      providesTags: ['Medicines_Autocomplete'],
    }),
  }),
});

export default autocompleteApi;
