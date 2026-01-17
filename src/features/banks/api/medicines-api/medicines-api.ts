import { rootApi } from '@/core/api/root.api';
import type { ApiResponse, TPaginatedResponse } from '@/core/types/common.types';
import type {
  TAddMedicinePayload,
  TGetMedicinesParams,
  TMedicine,
  TUpdateMedicinePayload,
} from '../../types/medicines.types';

export const medicinesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicines: builder.query<TPaginatedResponse<TMedicine>, TGetMedicinesParams | undefined>({
      query: (params) => ({
        url: '/medicines',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TMedicine>>) => res.data,
      providesTags: [{ type: 'Medicines', id: 'LIST' }],
    }),
    getMedicineById: builder.query<TMedicine, { id: string }>({
      query: ({ id }) => ({
        url: `/medicines/${id}`,
        method: 'GET',
      }),
      providesTags: ['Medicine'],
      transformResponse: (res: ApiResponse<TMedicine>) => res.data,
    }),

    addMedicine: builder.mutation<TMedicine, TAddMedicinePayload>({
      query: (data) => ({
        url: '/medicines',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Medicines', id: 'LIST' }, 'Medicine'],
    }),

    updateMedicine: builder.mutation<void, TUpdateMedicinePayload>({
      query: (data) => ({
        url: `/medicines`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Medicines', id: 'LIST' }, 'Medicine'],
    }),
  }),
});

export default medicinesApi;
